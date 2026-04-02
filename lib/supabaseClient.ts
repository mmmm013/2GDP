// Browser-safe anon client — safe to import in client components.
// For server-side admin operations, import from '@/lib/supabaseAdmin' instead.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);