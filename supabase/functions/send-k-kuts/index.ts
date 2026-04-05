// Edge Function: send-k-kuts
// Dispatches both K-KUT and K-kut signed URLs via ALL available channels:
//   1. Signed URL payload (always returned)
//   2. Email via magic_link function
//   3. Webhook POST to any HTTPS endpoint
//   4. Realtime broadcast to private MSP topic
//   5. SMS/A2P via notify function
//   6. Telegram via notify function
// Endpoint: POST /functions/v1/send-k-kuts
// Body:
//   k_kut_id: string         - K-KUT asset ID (variant='K-KUT')
//   k_kut_lower_id: string   - K-kut asset ID (variant='K-kut')
//   pix_pck_id?: string      - Alternative: resolve by PIX-PCK + tag
//   tag?: 'Verse'|'BR'|'Ch' - Required if using pix_pck_id
//   targets: {
//     email?: string           - send magic link + payload
//     to_phone?: string        - send A2P SMS
//     webhook_urls?: string[]  - POST signed URLs to each
//     realtime_topics?: string[] - broadcast to MSP topics
//     telegram_chat_id?: string
//   }
//   expires_in?: number       - Signed URL TTL in seconds (default 300)
// File: supabase/functions/send-k-kuts/index.ts

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight } from "../_shared/responses.ts";

const DEFAULT_EXPIRY = 300;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
if (!SUPABASE_URL) throw new Error('SUPABASE_URL is required');
const SUPABASE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1`;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function resolveAsset(
  id: string | undefined,
  pix_pck_id: string | undefined,
  tag: string | undefined,
  variant: string,
  expiry: number
): Promise<{ url: string | null; meta: Record<string, unknown>; error?: string }> {
  let asset: Record<string, unknown> | null = null;

  if (id) {
    const { data, error } = await supabaseAdmin
      .from('k_kut_assets')
      .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms')
      .eq('id', id)
      .eq('variant', variant)
      .eq('status', 'active')
      .single();
    if (error || !data) return { url: null, meta: {}, error: `${variant} not found: ${id}` };
    asset = data;
  } else if (pix_pck_id && tag) {
    const { data, error } = await supabaseAdmin
      .from('k_kut_assets')
      .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms')
      .eq('pix_pck_id', pix_pck_id)
      .eq('structure_tag', tag)
      .eq('variant', variant)
      .eq('status', 'active')
      .single();
    if (error || !data) return { url: null, meta: {}, error: `${variant} not found for pix_pck_id=${pix_pck_id} tag=${tag}` };
    asset = data;
  } else {
    return { url: null, meta: {}, error: 'Provide id or (pix_pck_id + tag)' };
  }

  const { data: signed, error: signErr } = await supabaseAdmin.storage
    .from(asset.storage_bucket as string)
    .createSignedUrl(asset.storage_path as string, expiry);

  if (signErr || !signed?.signedUrl) {
    return { url: null, meta: asset, error: `Signed URL failed: ${signErr?.message}` };
  }

  return {
    url: signed.signedUrl,
    meta: {
      id: asset.id,
      variant,
      structure_tag: asset.structure_tag,
      pix_pck_id: asset.pix_pck_id,
      mime_type: asset.mime_type,
      duration_ms: asset.duration_ms,
      expires_in: expiry,
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return preflight();
  if (req.method !== 'POST') return bad('Method not allowed', 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body?.targets) return bad('targets object is required');
    if (!body.k_kut_id && !body.k_kut_lower_id && !body.pix_pck_id) {
      return bad('Provide k_kut_id and/or k_kut_lower_id OR pix_pck_id + tag');
    }

    const expiry: number = body.expires_in ?? DEFAULT_EXPIRY;
    const tag: string | undefined = body.tag;
    const pix_pck_id: string | undefined = body.pix_pck_id;

    // 1. Resolve both variants in parallel
    const [kkut, kkutLower] = await Promise.all([
      resolveAsset(body.k_kut_id, pix_pck_id, tag, 'K-KUT', expiry),
      resolveAsset(body.k_kut_lower_id, pix_pck_id, tag, 'K-kut', expiry),
    ]);

    const payload = {
      k_kut: { url: kkut.url, meta: kkut.meta, error: kkut.error ?? null },
      k_kut_lower: { url: kkutLower.url, meta: kkutLower.meta, error: kkutLower.error ?? null },
    };

    const dispatch: Record<string, unknown> = { payload };
    const targets = body.targets as {
      email?: string;
      to_phone?: string;
      webhook_urls?: string[];
      realtime_topics?: string[];
      telegram_chat_id?: string;
    };

    // 2. Email (magic link + payload in subject/body)
    if (targets.email) {
      try {
        const res = await fetch(`${SUPABASE_FUNCTION_URL}/magic_link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY },
          body: JSON.stringify({
            email: targets.email,
            redirect_to: kkut.url ?? kkutLower.url ?? 'https://gputnammusic.com',
          }),
        });
        dispatch['email'] = { ok: res.ok, status: res.status };
      } catch (e) {
        dispatch['email'] = { ok: false, error: e instanceof Error ? e.message : 'unknown' };
      }
    }

    // 3. SMS + Telegram via notify function
    if (targets.to_phone || targets.telegram_chat_id) {
      const msg = `K-KUT: ${kkut.url ?? 'unavailable'} | K-kut: ${kkutLower.url ?? 'unavailable'}`;
      try {
        const res = await fetch(`${SUPABASE_FUNCTION_URL}/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY },
          body: JSON.stringify({
            to_phone: targets.to_phone,
            telegram_chat_id: targets.telegram_chat_id,
            subject: 'Your K-KUTs are ready - G Putnam Music',
            message: msg,
          }),
        });
        const result = await res.json().catch(() => ({ status: res.status }));
        dispatch['notify'] = { ok: res.ok, ...result };
      } catch (e) {
        dispatch['notify'] = { ok: false, error: e instanceof Error ? e.message : 'unknown' };
      }
    }

    // 4. Webhooks
    if (targets.webhook_urls && targets.webhook_urls.length > 0) {
      const webhookResults = await Promise.allSettled(
        targets.webhook_urls.map(async (url: string) => {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          return { url, status: res.status, ok: res.ok };
        })
      );
      dispatch['webhooks'] = webhookResults.map(r =>
        r.status === 'fulfilled' ? r.value : { ok: false, error: String(r.reason) }
      );
    }

    // 5. Realtime broadcast (private MSP topics: msp:pix:{pix_pck_id}:k_kut)
    if (targets.realtime_topics && targets.realtime_topics.length > 0) {
      const rtResults: Record<string, unknown>[] = [];
      for (const topic of targets.realtime_topics) {
        try {
          const res = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/realtime/v1/api/broadcast`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
              },
              body: JSON.stringify({
                messages: [{
                  topic,
                  event: 'asset_ready',
                  payload,
                  private: true,
                }],
              }),
            }
          );
          rtResults.push({ topic, ok: res.ok, status: res.status });
        } catch (e) {
          rtResults.push({ topic, ok: false, error: e instanceof Error ? e.message : 'unknown' });
        }
      }
      dispatch['realtime'] = rtResults;
    }

    // 6. Audit both plays
    await supabaseAdmin.from('audit_log').insert([
      {
        action: 'SEND_K_KUT',
        table_name: 'k_kut_assets',
        row_pk: String(kkut.meta.id ?? 'unknown'),
        diff: { variant: 'K-KUT', targets: Object.keys(targets), channels: Object.keys(dispatch) },
      },
      {
        action: 'SEND_K_KUT_LOWER',
        table_name: 'k_kut_assets',
        row_pk: String(kkutLower.meta.id ?? 'unknown'),
        diff: { variant: 'K-kut', targets: Object.keys(targets), channels: Object.keys(dispatch) },
      },
    ]).then(() => {}).catch(() => {});

    return ok({ dispatched: dispatch });
  } catch (e) {
    console.error('[send-k-kuts] Unexpected error:', e);
    return bad(e instanceof Error ? e.message : 'Unknown error', 500);
  }
});
