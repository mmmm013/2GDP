// PUBLIC endpoint - no authorization header required
// Searches marketing tracks by tags

Deno.serve(async (req: Request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow all origins for public endpoint
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers }
    );
  }

  try {
    const url = new URL(req.url);
    const tagsParam = url.searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Call the search RPC using anon key (public read)
    const resp = await fetch(`${supabaseUrl}/rest/v1/rpc/search_marketing_tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ tags }),
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "rpc_failed", detail: data }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ items: data || [] }),
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
