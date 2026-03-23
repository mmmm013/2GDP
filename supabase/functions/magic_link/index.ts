// Edge Function: magic_link
// Sends a Supabase magic link (OTP email) to a user
// Endpoint: POST /functions/v1/magic_link
// Body: { email: string, redirect_to?: string, k_kut_slug?: string }
// File: supabase/functions/magic_link/index.ts

import { bad, ok, preflight } from "../_shared/responses.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return bad("Method not allowed", 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body?.email) return bad("email is required");

    const email: string = body.email.toLowerCase().trim();
    const kKutSlug: string | undefined = body.k_kut_slug;

    // Build redirect URL - optionally deep-links to a K-KUT
    const baseRedirect = body.redirect_to ?? "https://gputnammusic.com";
    const redirectTo = kKutSlug
      ? `${baseRedirect}/k-kuts/${kKutSlug}`
      : baseRedirect;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Send magic link via Supabase Auth REST API
    const res = await fetch(`${supabaseUrl}/auth/v1/magiclink`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        redirect_to: redirectTo,
        create_user: true,   // auto-create user if not exists
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[magic_link] Auth error:", errText);
      return bad(`Auth service error: ${errText}`, res.status);
    }

    console.log(`[magic_link] Sent to ${email} -> ${redirectTo}`);
    return ok({ message: "Magic link sent", redirect_to: redirectTo });

  } catch (e) {
    console.error("[magic_link] Unexpected error:", e);
    return bad(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
