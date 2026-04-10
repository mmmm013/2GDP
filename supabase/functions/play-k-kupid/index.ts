// Edge Function: play-k-kupid
// Returns a signed URL for K-kUpId (KPD) audio playback.
// K-kUpId shares the exact-excerpt audio strategy of K-KUT, curated for
// 5 romance levels: Interest → Date → Love → Sex → Forever.
// Tries variant='K-kUpId' first, then falls back to 'K-KUT'.
// Endpoint: POST /functions/v1/play-k-kupid
// Body: { k_kut_id?: string, pix_pck_id?: string, tag?: SectionTag, romance_level?: string }
// Auth: Bearer JWT required (org-scoped via RLS)
// Returns: { signed_url, expires_in, romance_level, meta }
// File: supabase/functions/play-k-kupid/index.ts

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight, withRetry } from "../_shared/responses.ts";

const SIGNED_URL_EXPIRY = 3600; // 1 hour
// Canonical song-section taxonomy (matches lib/kkut-sections.ts SECTION_ORDER
// and the k_kut_assets_structure_tag_check DB constraint).
const ALLOWED_TAGS = ['Intro','V1','Pre1','Ch1','V2','Pre2','Ch2','BR','Ch3','Outro'] as const;
// K-kUpId variant first, fall back to K-KUT (same audio assets, romance-level overlay)
const VARIANT_PRIORITY = ['K-kUpId', 'K-KUT'] as const;
// Valid romance levels for K-kUpId experiences
const ROMANCE_LEVELS = ['Interest', 'Date', 'Love', 'Sex', 'Forever'] as const;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return preflight();
  if (req.method !== 'POST') return bad('Method not allowed', 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body?.k_kut_id && !(body?.pix_pck_id && body?.tag)) {
      return bad('Provide k_kut_id OR (pix_pck_id + tag)');
    }

    // Validate tag if provided
    if (body.tag && !(ALLOWED_TAGS as readonly string[]).includes(body.tag)) {
      return bad(`tag must be one of: ${ALLOWED_TAGS.join(', ')}`);
    }

    // Validate romance_level if provided (optional metadata)
    if (body.romance_level && !(ROMANCE_LEVELS as readonly string[]).includes(body.romance_level)) {
      return bad(`romance_level must be one of: ${ROMANCE_LEVELS.join(', ')}`);
    }

    let asset: Record<string, unknown> | null = null;

    if (body.k_kut_id) {
      // Direct lookup by asset ID — try K-kUpId variant, then K-KUT
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
      if (!asset) return bad('K-kUpId asset not found or not active', 404);
    } else {
      // Lookup by pix_pck_id + structure_tag — try K-kUpId variant, then K-KUT
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
      if (!asset) return bad('K-kUpId asset not found for pix_pck_id + tag', 404);
    }

    // Generate signed URL (with retry on transient failures)
    const { data: signed, error: signErr } = await withRetry(
      () => supabaseAdmin.storage
        .from(asset.storage_bucket as string)
        .createSignedUrl(asset.storage_path as string, SIGNED_URL_EXPIRY)
    );

    if (signErr || !signed?.signedUrl) {
      console.error('[play-k-kupid] Signed URL error:', signErr);
      return bad(`Failed to generate signed URL: ${signErr?.message ?? 'unknown'}`, 500);
    }

    // Audit log (fire and forget)
    supabaseAdmin.from('audit_log').insert({
      action: 'PLAY_K_KUPID',
      table_name: 'k_kut_assets',
      row_pk: String(asset.id),
      diff: {
        variant: asset.variant,
        structure_tag: asset.structure_tag,
        pix_pck_id: asset.pix_pck_id,
        romance_level: body.romance_level ?? null,
      },
    }).then(() => {}).catch(() => {});

    return ok({
      signed_url: signed.signedUrl,
      expires_in: SIGNED_URL_EXPIRY,
      romance_level: body.romance_level ?? null,
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
    console.error('[play-k-kupid] Unexpected error:', e);
    return bad(e instanceof Error ? e.message : 'Unknown error', 500);
  }
});
