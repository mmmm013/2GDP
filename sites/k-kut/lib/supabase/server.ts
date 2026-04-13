/**
 * Server-side Supabase client for the k-kut site.
 * Uses NEXT_PUBLIC_ env vars only — no service-role key required.
 * Suitable for server components and route handlers.
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.');
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.');

  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}
