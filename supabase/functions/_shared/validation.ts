// supabase/functions/_shared/validation.ts
// Strict payload validation for kut-receiver routes

export type OpenPayload = {
  token: string;
  session_id: string;
  ua?: string;
};

export type EventPayload = {
  token: string;
  event_type: string;
  session_id: string;
  meta?: Record<string, unknown>;
  idempotency_key?: string;
};

export type RespondPayload = {
  token: string;
  session_id: string;
  message?: string;
  meta?: Record<string, unknown>;
};

export const ALLOWED_EVENT_TYPES = new Set([
  "opened",
  "played",
  "completed_play",
  "saved",
  "responded",
  "converted_to_sender",
]);

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export function validateOpenPayload(
  body: unknown
): ValidationResult<OpenPayload> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  if (typeof b.token !== "string" || !b.token.trim()) {
    return { ok: false, message: "token is required (string)" };
  }
  if (typeof b.session_id !== "string" || !b.session_id.trim()) {
    return { ok: false, message: "session_id is required (string)" };
  }
  return {
    ok: true,
    data: {
      token: b.token.trim(),
      session_id: b.session_id.trim(),
      ua: typeof b.ua === "string" ? b.ua : undefined,
    },
  };
}

export function validateEventPayload(
  body: unknown
): ValidationResult<EventPayload> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  if (typeof b.token !== "string" || !b.token.trim()) {
    return { ok: false, message: "token is required (string)" };
  }
  if (typeof b.session_id !== "string" || !b.session_id.trim()) {
    return { ok: false, message: "session_id is required (string)" };
  }
  if (typeof b.event_type !== "string" || !ALLOWED_EVENT_TYPES.has(b.event_type)) {
    return {
      ok: false,
      message: `event_type must be one of: ${[...ALLOWED_EVENT_TYPES].join(", ")}`,
    };
  }
  const meta =
    b.meta && typeof b.meta === "object" && !Array.isArray(b.meta)
      ? (b.meta as Record<string, unknown>)
      : undefined;
  return {
    ok: true,
    data: {
      token: b.token.trim(),
      session_id: b.session_id.trim(),
      event_type: b.event_type,
      meta,
      idempotency_key:
        typeof b.idempotency_key === "string" ? b.idempotency_key : undefined,
    },
  };
}

export function validateRespondPayload(
  body: unknown
): ValidationResult<RespondPayload> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  if (typeof b.token !== "string" || !b.token.trim()) {
    return { ok: false, message: "token is required (string)" };
  }
  if (typeof b.session_id !== "string" || !b.session_id.trim()) {
    return { ok: false, message: "session_id is required (string)" };
  }
  const meta =
    b.meta && typeof b.meta === "object" && !Array.isArray(b.meta)
      ? (b.meta as Record<string, unknown>)
      : undefined;
  return {
    ok: true,
    data: {
      token: b.token.trim(),
      session_id: b.session_id.trim(),
      message: typeof b.message === "string" ? b.message.slice(0, 500) : undefined,
      meta,
    },
  };
}
