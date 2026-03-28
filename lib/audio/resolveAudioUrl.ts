/**
 * resolveAudioUrl — Single source of truth for all GPM audio URLs.
 *
 * Rules (in priority order):
 *  1. Absolute http(s) URL  → return as-is.
 *  2. Already contains Supabase storage path → return as-is.
 *  3. Anything else (filename / track key / legacy /pix/... path) →
 *     extract the basename and resolve into the canonical Supabase
 *     `tracks` bucket defined by NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL.
 *
 * Environment variable (set in Vercel + .env.local):
 *   NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL=
 *     https://<project-ref>.supabase.co/storage/v1/object/public/tracks/
 */

const TRACKS_BASE_URL: string =
  (process.env.NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL ?? '').replace(/\/?$/, '/') ||
  // Fallback uses the project ref already wired into GlobalPlayer so the
  // resolver degrades gracefully when the env var is not yet configured.
  'https://lbzpfqarraegkghxwbah.supabase.co/storage/v1/object/public/tracks/';

export function resolveAudioUrl(input: string): string {
  if (!input) return '';

  // Strip query-string / hash before inspecting the path
  const [bare] = input.split(/[?#]/);

  // Rule 1 – already an absolute URL
  if (/^https?:\/\//i.test(bare)) {
    return input; // preserve original query/hash if present
  }

  // Rule 2 – already a Supabase storage public URL (relative form)
  if (bare.includes('/storage/v1/object/public/')) {
    return input;
  }

  // Rule 3 – extract basename and resolve into tracks bucket
  const filename = bare.split('/').filter(Boolean).pop() || bare;
  return TRACKS_BASE_URL + encodeURIComponent(filename);
}
