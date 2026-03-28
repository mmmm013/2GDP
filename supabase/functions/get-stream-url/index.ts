// Edge Function: get-stream-url
// Returns a short-lived signed URL for a K-KUT, K-kut, or full track.
// Resolves the correct storage path from the DB then generates a signed URL.
// Endpoint: POST /functions/v1/get-stream-url
// Body: { k_kut_id?: string, track_id?: string | number, bucket?: string }
//   - k_kut_id: UUID of a K-KUT row (preferred for excerpt playback)
//   - track_id: UUID or numeric ID of a tracks row (full track)
//   - bucket: override bucket name (default: 'audio-stream')
// Returns: { url: string, expires_in: 300, meta: { title, artist, kk_type?, start_ms?, end_ms?, ... } }
// File: supabase/functions/get-stream-url/index.ts
import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight } from "../_shared/responses.ts";

const DEFAULT_BUCKET = "audio-stream";
const SIGNED_URL_EXPIRY = 300; // 5 minutes - enough for streaming, short enough for security

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return bad("Method not allowed", 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body?.k_kut_id && !body?.track_id) {
      return bad("k_kut_id or track_id is required");
    }

    const bucket: string = body.bucket ?? DEFAULT_BUCKET;
    let filePath: string | null = null;
    let meta: Record<string, unknown> = {};

    // ---- Resolve via K-KUT ----
    if (body.k_kut_id) {
      // Try sb.k_kuts first (patent-protected excerpt table)
      const { data: kkut, error: kkErr } = await supabaseAdmin
        .from("k_kuts")
        .select("id, title, artist, kk_type, file_path, track_id, is_exact_excerpt, start_ms, end_ms")
        .eq("id", body.k_kut_id)
        .single();

      if (kkErr || !kkut) {
        // Fallback: try gpm_kkuts table
        const { data: gkk, error: gkkErr } = await supabaseAdmin
          .from("gpm_kkuts")
          .select("id, title, artist, kk_type, file_path")
          .eq("id", body.k_kut_id)
          .single();

        if (gkkErr || !gkk) return bad("K-KUT not found", 404);
        filePath = gkk.file_path;
        meta = { title: gkk.title, artist: gkk.artist, kk_type: gkk.kk_type, source: "gpm_kkuts" };
      } else {
        filePath = kkut.file_path;
        meta = {
          title: kkut.title,
          artist: kkut.artist,
          kk_type: kkut.kk_type,
          is_exact_excerpt: kkut.is_exact_excerpt,
          track_id: kkut.track_id,
          // CRITICAL: excerpt boundaries - frontend MUST enforce these
          start_ms: kkut.start_ms ?? null,
          end_ms: kkut.end_ms ?? null,
          source: "k_kuts",
        };
      }
    }

    // ---- Resolve via full track ----
    if (!filePath && body.track_id) {
      const { data: track, error: trackErr } = await supabaseAdmin
        .from("tracks")
        .select("id, title, artist, file_path, is_public")
        .or(`id.eq.${body.track_id},track_id.eq.${body.track_id}`)
        .single();

      if (trackErr || !track) return bad("Track not found", 404);
      filePath = track.file_path;
      meta = { title: track.title, artist: track.artist, is_public: track.is_public, source: "tracks" };
    }

    if (!filePath) return bad("No file_path resolved for this asset", 404);

    // ---- Generate signed URL ----
    const { data: signedData, error: signErr } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

    if (signErr || !signedData?.signedUrl) {
      console.error("[get-stream-url] Signed URL error:", signErr);
      return bad(`Failed to generate signed URL: ${signErr?.message ?? "unknown"}`, 500);
    }

    // ---- Increment play count (fire and forget) ----
    if (body.track_id) {
      supabaseAdmin
        .rpc("increment_play_count", { track_id: body.track_id })
        .then(() => {})
        .catch(() => {});
    }

    return ok({
      url: signedData.signedUrl,
      expires_in: SIGNED_URL_EXPIRY,
      bucket,
      file_path: filePath,
      meta,
    });
  } catch (e) {
    console.error("[get-stream-url] Unexpected error:", e);
    return bad(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
