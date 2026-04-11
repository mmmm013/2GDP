// Edge Function: play-k-kut-lower
// Returns a signed URL for K-kut (mixed-case 'K-kut' variant) playback.
// Identical logic to play-k-kut but targets the K-kut variant.
// K-kuts are structural excerpts under GPM; parts no longer distinguishable
// as tied to a single song since all artists release under GPM.
// Endpoint: POST /functions/v1/play-k-kut-lower
// Body: { k_kut_id?: string, pix_pck_id?: string, tag?: 'Verse'|'BR'|'Ch' }
// Auth: Bearer JWT required (org-scoped via RLS)
// Returns: { signed_url, expires_in, meta }
// File: supabase/functions/play-k-kut-lower/index.ts

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight } from "../_shared/responses.ts";

const VARIANT = 'K-kut';  // lowercase 'k' - the K-kut variant
const SIGNED_URL_EXPIRY = 300;
// Canonical song-section taxonomy (matches lib/kkut-sections.ts SECTION_ORDER
// and the k_kut_assets_structure_tag_check DB constraint).
const ALLOWED_TAGS = ['Intro','V1','Pre1','Ch1','V2','Pre2','Ch2','BR','Ch3','Outro'] as const;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return preflight();
  if (req.method !== 'POST') return bad('Method not allowed', 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body?.k_kut_id && !(body?.pix_pck_id && body?.tag)) {
      return bad('Provide k_kut_id OR (pix_pck_id + tag)');
    }

    if (body.tag && !ALLOWED_TAGS.includes(body.tag)) {
      return bad(`tag must be one of: ${ALLOWED_TAGS.join(', ')}`);
    }

    let asset: Record<string, unknown> | null = null;

    if (body.k_kut_id) {
      const { data, error } = await supabaseAdmin
        .from('k_kut_assets')
        .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms, status')
        .eq('id', body.k_kut_id)
        .eq('variant', VARIANT)
        .eq('status', 'active')
        .single();
      if (error || !data) return bad('K-kut asset not found or not active', 404);
      asset = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('k_kut_assets')
        .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms, status')
        .eq('pix_pck_id', body.pix_pck_id)
        .eq('structure_tag', body.tag)
        .eq('variant', VARIANT)
        .eq('status', 'active')
        .single();

      if (error || !data) return bad('K-kut not found for pix_pck_id + tag', 404);
      asset = data;
    }

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(asset.storage_bucket as string)
      .createSignedUrl(asset.storage_path as string, SIGNED_URL_EXPIRY);

    if (signErr || !signed?.signedUrl) {
      console.error('[play-k-kut-lower] Signed URL error:', signErr);
      return bad(`Failed to generate signed URL: ${signErr?.message ?? 'unknown'}`, 500);
    }

    // Audit log (fire and forget)
    supabaseAdmin.from('audit_log').insert({
      action: 'PLAY_K_KUT_LOWER',
      table_name: 'k_kut_assets',
      row_pk: String(asset.id),
      diff: { variant: VARIANT, structure_tag: asset.structure_tag, pix_pck_id: asset.pix_pck_id },
    }).then(() => {}).catch(() => {});

    return ok({
      signed_url: signed.signedUrl,
      expires_in: SIGNED_URL_EXPIRY,
      meta: {
        id: asset.id,
        variant: VARIANT,
        structure_tag: asset.structure_tag,
        pix_pck_id: asset.pix_pck_id,
        mime_type: asset.mime_type,
        duration_ms: asset.duration_ms,
      },
    });
  } catch (e) {
    console.error('[play-k-kut-lower] Unexpected error:', e);
    return bad(e instanceof Error ? e.message : 'Unknown error', 500);
  }
});
