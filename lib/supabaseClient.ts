// Browser-safe anon client — safe to import in client components.
// For server-side admin operations, import from '@/lib/supabaseAdmin' instead.
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required'
    );
  }
  if (!_client) _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

// Lazy proxy — only initializes on first property access at request time
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
