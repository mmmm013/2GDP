// supabase/functions/_shared/http.ts
// Standard JSON response helpers + error envelope for kut-receiver

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function jsonOk(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

export type ErrorCode =
  | "BAD_REQUEST"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

const STATUS_MAP: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  INVALID_TOKEN: 401,
  TOKEN_EXPIRED: 410,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export function jsonError(
  code: ErrorCode,
  message: string,
  requestId: string
): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      error: { code, message, request_id: requestId },
    }),
    {
      status: STATUS_MAP[code],
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    }
  );
}

export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  return null;
}
