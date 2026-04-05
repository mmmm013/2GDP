// Edge Function: play-m-kut
// Returns a signed URL for mKUT (mini-KUT) playback.
// mKUT accepts a pix_pck_id + structure tag and resolves the best available
// K-KUT or K-kut asset for that excerpt. Both variants are attempted so that
// the mini-player always finds audio when the asset exists.
// Endpoint: POST /functions/v1/play-m-kut
// Body: { k_kut_id?: string, pix_pck_id?: string, tag?: 'Verse'|'BR'|'Ch' }
// Auth: none required (public prefab player)
// Returns: { signed_url, expires_in, structure_tag, duration_ms, mime_type,
//            title, artist, theme, gift_note, gifted_by, meta }
// File: supabase/functions/play-m-kut/index.ts

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight } from "../_shared/responses.ts";

const SIGNED_URL_EXPIRY = 300; // 5 minutes
const ALLOWED_TAGS = ['Verse', 'BR', 'Ch'] as const;
// Try K-KUT first (canonical), then K-kut
const VARIANT_PRIORITY = ['K-KUT', 'K-kut'] as const;

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
      // Direct lookup by asset ID — try both variants
      for (const variant of VARIANT_PRIORITY) {
        const { data } = await supabaseAdmin
          .from('k_kut_assets')
          .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms, variant, status')
          .eq('id', body.k_kut_id)
          .eq('variant', variant)
          .eq('status', 'active')
          .single();
        if (data) { asset = data; break; }
      }
      if (!asset) return bad('mKUT asset not found or not active', 404);
    } else {
      // Lookup by pix_pck_id + structure_tag — try both variants
      for (const variant of VARIANT_PRIORITY) {
        const { data } = await supabaseAdmin
          .from('k_kut_assets')
          .select('id, pix_pck_id, structure_tag, storage_bucket, storage_path, mime_type, duration_ms, variant, status')
          .eq('pix_pck_id', body.pix_pck_id)
          .eq('structure_tag', body.tag)
          .eq('variant', variant)
          .eq('status', 'active')
          .single();
        if (data) { asset = data; break; }
      }
      if (!asset) return bad('mKUT not found for pix_pck_id + tag', 404);
    }

    // Generate signed URL
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(asset.storage_bucket as string)
      .createSignedUrl(asset.storage_path as string, SIGNED_URL_EXPIRY);

    if (signErr || !signed?.signedUrl) {
      console.error('[play-m-kut] Signed URL error:', signErr);
      return bad(`Failed to generate signed URL: ${signErr?.message ?? 'unknown'}`, 500);
    }

    // Audit log (fire and forget)
    supabaseAdmin.from('audit_log').insert({
      action: 'PLAY_M_KUT',
      table_name: 'k_kut_assets',
      row_pk: String(asset.id),
      diff: { variant: asset.variant, structure_tag: asset.structure_tag, pix_pck_id: asset.pix_pck_id },
    }).then(() => {}).catch(() => {});

    return ok({
      signed_url: signed.signedUrl,
      expires_in: SIGNED_URL_EXPIRY,
      structure_tag: asset.structure_tag,
      duration_ms: asset.duration_ms ?? null,
      mime_type: asset.mime_type ?? null,
      // title/artist are not stored on k_kut_assets; the player has defaults.
      // Populated here when a richer join becomes available (4PE ingestion).
      title: null,
      artist: null,
      theme: 'nature',
      gift_note: null,
      gifted_by: null,
      meta: {
        id: asset.id,
        variant: asset.variant,
        structure_tag: asset.structure_tag,
        pix_pck_id: asset.pix_pck_id,
        mime_type: asset.mime_type,
        duration_ms: asset.duration_ms,
      },
    });
  } catch (e) {
    console.error('[play-m-kut] Unexpected error:', e);
    return bad(e instanceof Error ? e.message : 'Unknown error', 500);
  }
});
