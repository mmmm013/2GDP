import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

/**
 * Returns a Supabase client using the service role key (server-side only).
 * Returns null if SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL are not set.
 * The anon key is intentionally NOT used as a fallback here, because admin
 * operations (e.g. inserting into notify_signups) require elevated permissions.
 */
export function getSupabaseAdmin(): ReturnType<typeof createClient> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!_client) {
    _client = createClient(url, key);
  }
  return _client;
}
