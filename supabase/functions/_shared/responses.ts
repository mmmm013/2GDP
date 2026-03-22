// Shared response helpers for Edge Functions
// File: supabase/functions/_shared/responses.ts

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "https://gputnammusic.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      ...CORS_HEADERS,
    },
  });

export const bad = (message: string, status = 400): Response =>
  json({ ok: false, error: message }, status);

export const ok = (data: Record<string, unknown> = {}): Response =>
  json({ ok: true, ...data });

/** Handle CORS preflight */
export const preflight = (): Response =>
  new Response(null, { status: 204, headers: CORS_HEADERS });
