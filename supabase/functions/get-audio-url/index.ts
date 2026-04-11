// Edge Function: get-audio-url
// Returns a short-lived signed URL for any file in a Supabase Storage bucket.
// PURPOSE: Bypasses the k_kut_assets DB table so files that already exist
//          in the AUDIO bucket can be played immediately, without waiting
//          for ingestion rows to exist.
//
// Endpoint: POST /functions/v1/get-audio-url
// Body:     { bucket?: string, path: string }
//   - bucket: storage bucket name (default: "AUDIO")
//   - path:   storage object path, e.g. "k-kut/love-renews-Ch1.mp3"
//             Naming convention:
//               KK  → k-kut/<slug>-<section>.mp3
//               mK  → mk/<slug>-<phrase>.mp3
//               KPD → kpd/<level>-<slug>.mp3
// Auth:     anon key (apikey + Authorization: Bearer <anon_key> headers)
// Returns:  { signed_url, expires_in, bucket, path }
// File: supabase/functions/get-audio-url/index.ts

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { bad, ok, preflight, withRetry } from "../_shared/responses.ts";

const DEFAULT_BUCKET  = "AUDIO";
const SIGNED_URL_EXPIRY = 3600; // 1 hour

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return bad("Method not allowed", 405);

  try {
    const body = await req.json().catch(() => null);

    if (!body?.path || typeof body.path !== "string") {
      return bad('Body must include { path: string }');
    }

    // Sanitise path — strip leading slash, collapse double slashes
    const rawPath: string = body.path.trim().replace(/^\/+/, "").replace(/\/+/g, "/");
    if (!rawPath) return bad("path must not be empty");

    // Only allow audio file extensions — block arbitrary bucket traversal
    if (!/\.(mp3|m4a|ogg|wav|aac|flac)$/i.test(rawPath)) {
      return bad("path must refer to an audio file (.mp3, .m4a, .ogg, .wav, .aac, .flac)");
    }

    const bucket: string = typeof body.bucket === "string" && body.bucket.trim()
      ? body.bucket.trim()
      : DEFAULT_BUCKET;

    // Generate signed URL (with retry on transient failures)
    const { data: signed, error: signErr } = await withRetry(
      () => supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(rawPath, SIGNED_URL_EXPIRY)
    );

    if (signErr || !signed?.signedUrl) {
      console.error("[get-audio-url] Signed URL error:", signErr);
      // Distinguish between "object not found" (404-like) and server error
      const msg = (signErr as { message?: string })?.message ?? "unknown";
      if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("does not exist")) {
        return bad(`Audio file not found: ${rawPath}`, 404);
      }
      return bad(`Failed to generate signed URL: ${msg}`, 500);
    }

    // Fire-and-forget audit log
    supabaseAdmin.from("audit_log").insert({
      action: "GET_AUDIO_URL",
      table_name: "storage",
      row_pk: `${bucket}/${rawPath}`,
      diff: { bucket, path: rawPath },
    }).then(() => {}).catch(() => {});

    return ok({
      signed_url:  signed.signedUrl,
      expires_in:  SIGNED_URL_EXPIRY,
      bucket,
      path: rawPath,
    });
  } catch (e) {
    console.error("[get-audio-url] Unexpected error:", e);
    return bad(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
