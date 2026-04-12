// PUBLIC endpoint - no authorization header required
// Uses service role key internally for secure DB writes

Deno.serve(async (req: Request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow all origins for public endpoint
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers }
    );
  }

  try {
    const { email, reason } = await req.json().catch(() => ({}));

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "email is required" }),
        { status: 400, headers }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Call the RPC using service role key (bypasses RLS)
    const resp = await fetch(`${supabaseUrl}/rest/v1/rpc/g_marketing_optout_upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        p_email: email,
        p_reason: reason ?? null,
      }),
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "rpc_failed", detail: data }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, status: "opted_out" }),
      { status: 200, headers }
    );
  } catch (e) {
    const msg = (e as Error)?.message ?? String(e);
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      { status: 500, headers }
    );
  }
});
