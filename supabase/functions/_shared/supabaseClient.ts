// Shared Supabase admin client for Edge Functions
// File: supabase/functions/_shared/supabaseClient.ts
import { createClient } from "npm:@supabase/supabase-js@2.45.2";

if (!Deno.env.get("SUPABASE_URL")) throw new Error("SUPABASE_URL is required");
if (!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");

export const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

/** Create an anon client for user-context operations */
export const supabaseAnon = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  { auth: { persistSession: false } }
);
