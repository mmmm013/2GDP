// Edge Function: play-k-kut
// Returns a signed URL for K-KUT (uppercase variant) playback.
// Variant: 'K-KUT' - structural excerpt, Verse/BR/Ch only.
// Endpoint: POST /functions/v1/play-k-kut
// Body: { k_kut_id?: string, pix_pck_id?: string, tag?: 'Verse'|'BR'|'Ch' }
// Auth: Bearer JWT required (org-scoped via RLS)
// Returns: { signed_url, expires_in, meta }
// File: supabase/functions/play-k-kut/index.ts

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight, withRetry } from "../_shared/responses.ts";

const VARIANT = 'K-KUT';
const SIGNED_URL_EXPIRY = 3600; // 1 hour — reduced refresh frequency at scale
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

    // Validate tag if provided
    if (body.tag && !ALLOWED_TAGS.includes(body.tag)) {
      return bad(`tag must be one of: ${ALLOWED_TAGS.join(', ')}`);
    }

    let asset: Record<string, unknown> | null = null;

    // --- Lookup by k_kut_assets table (canonical) ---
    if (body.k_kut_id) {
      const { data, error } = await supabaseAdmin
        .from('k_kut_assets')
        .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms, status, is_free')
        .eq('id', body.k_kut_id)
        .eq('variant', VARIANT)
        .eq('status', 'active')
        .single();
      if (error || !data) return bad('K-KUT asset not found or not active', 404);
      asset = data;
    } else {
      // Lookup by pix_pck_id + structure_tag
      const { data, error } = await supabaseAdmin
        .from('k_kut_assets')
        .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms, status, is_free')
        .eq('pix_pck_id', body.pix_pck_id)
        .eq('structure_tag', body.tag)
        .eq('variant', VARIANT)
        .eq('status', 'active')
        .single();

      if (error || !data) return bad('K-KUT not found for pix_pck_id + tag', 404);
      asset = data;
    }

    // Generate signed URL (with retry on transient failures)
    const { data: signed, error: signErr } = await withRetry(
      () => supabaseAdmin.storage
        .from(asset.storage_bucket as string)
        .createSignedUrl(asset.storage_path as string, SIGNED_URL_EXPIRY)
    );

    if (signErr || !signed?.signedUrl) {
      console.error('[play-k-kut] Signed URL error:', signErr);
      return bad(`Failed to generate signed URL: ${signErr?.message ?? 'unknown'}`, 500);
    }

    // Audit log (fire and forget)
    supabaseAdmin.from('audit_log').insert({
      action: 'PLAY_K_KUT',
      table_name: 'k_kut_assets',
      row_pk: String(asset.id),
      diff: { variant: VARIANT, structure_tag: asset.structure_tag, pix_pck_id: asset.pix_pck_id },
    }).then(() => {}).catch(() => {});

    return ok({
      signed_url: signed.signedUrl,
      expires_in: SIGNED_URL_EXPIRY,
      // is_free: true means Failure=FREE — QC failed, served at no charge
      is_free: (asset as Record<string, unknown>).is_free ?? false,
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
    console.error('[play-k-kut] Unexpected error:', e);
    return bad(e instanceof Error ? e.message : 'Unknown error', 500);
  }
});
