// Edge Function: get-stream-url
// Returns a short-lived signed URL for a K-KUT, k-kut, or full track.
// Resolves the correct storage path from the DB then generates a signed URL.
// Endpoint: POST /functions/v1/get-stream-url
// Body: { k_kut_id?: string, track_id?: string | number, bucket?: string }
//   - k_kut_id: UUID of a K-KUT row (preferred for excerpt playback)
//   - track_id: UUID or numeric ID of a tracks row (full track)
//   - bucket: override bucket name (default: 'tracks')
// Returns: { url: string, expires_in: 300, meta: { title, artist, kk_type?, start_ms?, end_ms?, ... } }
// File: supabase/functions/get-stream-url/index.ts
import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight } from "../_shared/responses.ts";

const DEFAULT_BUCKET = "tracks"; // UPDATED: Corrected from 'audio-stream' to 'tracks'
const SIGNED_URL_EXPIRY = 300; // 5 minutes — enough for streaming, short enough for security

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
    let dbUrl: string | null = null; // Fallback URL from DB
    let meta: Record<string, unknown> = {};

    // ----- Resolve via K-KUT -----
    if (body.k_kut_id) {
      // Try sb.k_kuts first (patent-protected excerpt table)
      const { data: kkut, error: kkErr } = await supabaseAdmin
        .from("k_kuts")
        .select("id, title, artist, kk_type, file_path, track_id, is_exact_excerpt, start_ms, end_ms, url")
        .eq("id", body.k_kut_id)
        .single();

      if (kkErr || !kkut) {
        // Fallback: try gpm_kkuts table
        const { data: gkk, error: gkkErr } = await supabaseAdmin
          .from("gpm_kkuts")
          .select("id, title, artist, kk_type, file_path, url")
          .eq("id", body.k_kut_id)
          .single();

        if (gkkErr || !gkk) return bad("K-KUT not found", 404);
        filePath = gkk.file_path;
        dbUrl = gkk.url;
        meta = { title: gkk.title, artist: gkk.artist, kk_type: gkk.kk_type, source: "gpm_kkuts" };
      } else {
        filePath = kkut.file_path;
        dbUrl = kkut.url;
        meta = {
          title: kkut.title,
          artist: kkut.artist,
          kk_type: kkut.kk_type,
          is_exact_excerpt: kkut.is_exact_excerpt,
          track_id: kkut.track_id,
          start_ms: kkut.start_ms ?? null,
          end_ms: kkut.end_ms ?? null,
          source: "k_kuts",
        };
      }
    }

    // ----- Resolve via full track -----
    if (!filePath && body.track_id) {
      const { data: track, error: trackErr } = await supabaseAdmin
        .from("tracks")
        .select("id, title, artist, file_path, url")
        .eq("id", body.track_id)
        .single();

      if (trackErr || !track) {
         // Fallback: try gpm_tracks table
         const { data: gtrack } = await supabaseAdmin
           .from("gpm_tracks")
           .select("id, title, artist, file_path, url")
           .eq("id", body.track_id)
           .single();
         
         if (gtrack) {
           filePath = gtrack.file_path;
           dbUrl = gtrack.url;
           meta = { title: gtrack.title, artist: gtrack.artist, source: "gpm_tracks" };
         } else {
           return bad("Track not found", 404);
         }
      } else {
        filePath = track.file_path;
        dbUrl = track.url;
        meta = { title: track.title, artist: track.artist, source: "tracks" };
      }
    }

    // ----- Final Resolution: Signed URL or DB Fallback -----
    let finalUrl: string | null = null;

    if (filePath) {
      const { data, error: signErr } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

      if (!signErr && data?.signedUrl) {
        finalUrl = data.signedUrl;
      }
    }

    // BIC Fallback: If signing failed or no file_path, use the direct DB link
    if (!finalUrl && dbUrl && /^https?:\/\//i.test(dbUrl)) {
      finalUrl = dbUrl;
    }

    if (!finalUrl) {
      return bad("Audio source unavailable (no file_path or url)");
    }

    return ok({ url: finalUrl, expires_in: SIGNED_URL_EXPIRY, meta });

  } catch (err) {
    console.error("Critical error in get-stream-url:", err);
    return bad("Internal server error", 500);
  }
});
