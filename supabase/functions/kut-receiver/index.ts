// supabase/functions/kut-receiver/index.ts
// KUT Receiver API — open/event/respond flows with token-hash validation, idempotency, rate limiting

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import {
  handleCors,
  jsonOk,
  jsonError,
  type ErrorCode,
} from "../_shared/http.ts";
import { sha256Hex, deriveIpHash, newRequestId } from "../_shared/crypto.ts";
import {
  validateOpenPayload,
  validateEventPayload,
  validateRespondPayload,
} from "../_shared/validation.ts";
import { checkRoute, type RateLimitRoute } from "../_shared/rate_limit.ts";

Deno.serve(async (req) => {
  // CORS preflight
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  const requestId = newRequestId();
  const start = Date.now();
  const url = new URL(req.url);
  const method = req.method;
  const pathname = url.pathname;

  try {
    // Route parsing: /kut-receiver/<route>
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length < 2 || parts[0] !== "kut-receiver") {
      return jsonError("NOT_FOUND", "Route not found", requestId);
    }

    const route = parts[1];

    if (method !== "POST") {
      return jsonError("BAD_REQUEST", "Only POST allowed", requestId);
    }

    // Parse JSON
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonError("BAD_REQUEST", "Invalid JSON payload", requestId);
    }

    // Route switch
    switch (route) {
      case "open":
        return await handleOpen(body, req, requestId);
      case "event":
        return await handleEvent(body, req, requestId);
      case "respond":
        return await handleRespond(body, req, requestId);
      default:
        return jsonError("NOT_FOUND", `Unknown route: ${route}`, requestId);
    }
  } catch (err) {
    console.error("[kut-receiver] Unhandled error:", err, { requestId });
    return jsonError(
      "INTERNAL_ERROR",
      "Internal server error",
      requestId
    );
  } finally {
    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        requestId,
        method,
        pathname,
        duration_ms: duration,
      })
    );
  }
});

// ========== /open handler ==========
async function handleOpen(
  body: unknown,
  req: Request,
  requestId: string
): Promise<Response> {
  const valid = validateOpenPayload(body);
  if (!valid.ok) {
    return jsonError("BAD_REQUEST", valid.message, requestId);
  }
  const { token, session_id, ua } = valid.data;

  const tokenHash = await sha256Hex(token);
  const ipHash = await deriveIpHash(req);

  // Validate token + expiry
  const sendResult = await validateSendToken(tokenHash, requestId);
  if (!sendResult.ok) return sendResult.response;
  const { send } = sendResult;

  // Rate limit
  const rlKey = `${tokenHash}:${ipHash}`;
  const rlCheck = checkRoute("open" as RateLimitRoute, rlKey);
  if (!rlCheck.allowed) {
    return jsonError(
      "RATE_LIMITED",
      `Try again in ${Math.ceil(rlCheck.retryAfterMs / 1000)}s",
      requestId
    );
  }

  // Update opened_at + last_seen_at
  const { data: updatedSend, error: updateErr } = await supabaseAdmin
    .from("k_kut_sends")
    .update({
      receiver_opened_at: supabaseAdmin.raw("coalesce(receiver_opened_at, now())"),
      receiver_last_seen_at: supabaseAdmin.raw("now()"),
    })
    .eq("id", send.id)
    .select("receiver_opened_at")
    .single();

  if (updateErr) {
    console.error("[open] Update error:", updateErr, { requestId });
    return jsonError("INTERNAL_ERROR", "Failed to mark opened", requestId);
  }

  const alreadyOpened = !!send.receiver_opened_at;

  // Insert "opened" event (dedupe by session + event_type)
  if (!alreadyOpened) {
    await insertEvent({
      send_id: send.id,
      event_type: "opened",
      session_id,
      ip_hash: ipHash,
      meta: ua ? { ua } : null,
    });
  }

  return jsonOk({
    ok: true,
    send_id: send.id,
    opened: true,
    already_opened: alreadyOpened,
  });
}

// ========== /event handler ==========
async function handleEvent(
  body: unknown,
  req: Request,
  requestId: string
): Promise<Response> {
  const valid = validateEventPayload(body);
  if (!valid.ok) {
    return jsonError("BAD_REQUEST", valid.message, requestId);
  }
  const { token, event_type, session_id, meta, idempotency_key } = valid.data;

  const tokenHash = await sha256Hex(token);
  const ipHash = await deriveIpHash(req);

  // Validate token + expiry
  const sendResult = await validateSendToken(tokenHash, requestId);
  if (!sendResult.ok) return sendResult.response;
  const { send } = sendResult;

  // Rate limit
  const rlKey = `${tokenHash}:${ipHash}`;
  const rlCheck = checkRoute("event" as RateLimitRoute, rlKey);
  if (!rlCheck.allowed) {
    return jsonError(
      "RATE_LIMITED",
      `Try again in ${Math.ceil(rlCheck.retryAfterMs / 1000)}s`,
      requestId
    );
  }

  // Idempotency check
  if (idempotency_key) {
    const { data: existing } = await supabaseAdmin
      .from("k_kut_receiver_events")
      .select("id")
      .eq("send_id", send.id)
      .eq("event_type", event_type)
      .eq("session_id", session_id)
      .contains("meta", { idempotency_key })
      .maybeSingle();

    if (existing) {
      return jsonOk({ ok: true, send_id: send.id, inserted: false });
    }
  }

  // Insert event
  const inserted = await insertEvent({
    send_id: send.id,
    event_type,
    session_id,
    ip_hash: ipHash,
    meta: meta ? { ...meta, idempotency_key } : (idempotency_key ? { idempotency_key } : null),
  });

  if (!inserted) {
    return jsonError("INTERNAL_ERROR", "Failed to insert event", requestId);
  }

  // Update last_seen_at
  await supabaseAdmin
    .from("k_kut_sends")
    .update({ receiver_last_seen_at: supabaseAdmin.raw("now()") })
    .eq("id", send.id);

  return jsonOk({ ok: true, send_id: send.id, inserted: true });
}

// ========== /respond handler ==========
async function handleRespond(
  body: unknown,
  req: Request,
  requestId: string
): Promise<Response> {
  const valid = validateRespondPayload(body);
  if (!valid.ok) {
    return jsonError("BAD_REQUEST", valid.message, requestId);
  }
  const { token, session_id, message, meta } = valid.data;

  const tokenHash = await sha256Hex(token);
  const ipHash = await deriveIpHash(req);

  // Validate token + expiry
  const sendResult = await validateSendToken(tokenHash, requestId);
  if (!sendResult.ok) return sendResult.response;
  const { send } = sendResult;

  // Rate limit
  const rlKey = `${tokenHash}:${ipHash}`;
  const rlCheck = checkRoute("respond" as RateLimitRoute, rlKey);
  if (!rlCheck.allowed) {
    return jsonError(
      "RATE_LIMITED",
      `Try again in ${Math.ceil(rlCheck.retryAfterMs / 1000)}s`,
      requestId
    );
  }

  // Insert "responded" event with optional message in meta
  const eventMeta = { ...meta };
  if (message) eventMeta.message = message;

  const inserted = await insertEvent({
    send_id: send.id,
    event_type: "responded",
    session_id,
    ip_hash: ipHash,
    meta: Object.keys(eventMeta).length > 0 ? eventMeta : null,
  });

  if (!inserted) {
    return jsonError("INTERNAL_ERROR", "Failed to record response", requestId);
  }

  // Update last_seen_at
  await supabaseAdmin
    .from("k_kut_sends")
    .update({ receiver_last_seen_at: supabaseAdmin.raw("now()") })
    .eq("id", send.id);

  return jsonOk({ ok: true, send_id: send.id, recorded: true });
}

// ========== Helpers ==========

type ValidateSendResult =
  | { ok: true; send: { id: string; receiver_opened_at: string | null } }
  | { ok: false; response: Response };

async function validateSendToken(
  tokenHash: string,
  requestId: string
): Promise<ValidateSendResult> {
  const { data: send, error } = await supabaseAdmin
    .from("k_kut_sends")
    .select("id, receiver_opened_at, receiver_token_expires_at")
    .eq("receiver_token_hash", tokenHash)
    .maybeSingle();

  if (error || !send) {
    return {
      ok: false,
      response: jsonError("INVALID_TOKEN", "Token not found", requestId),
    };
  }

  // Check expiry
  if (send.receiver_token_expires_at) {
    const expiry = new Date(send.receiver_token_expires_at).getTime();
    if (Date.now() >= expiry) {
      return {
        ok: false,
        response: jsonError("TOKEN_EXPIRED", "Receiver link expired", requestId),
      };
    }
  }

  return { ok: true, send };
}

type EventInsert = {
  send_id: string;
  event_type: string;
  session_id: string;
  ip_hash: string;
  meta: Record<string, unknown> | null;
};

async function insertEvent(event: EventInsert): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("k_kut_receiver_events")
    .insert({
      send_id: event.send_id,
      event_type: event.event_type,
      session_id: event.session_id,
      ip_hash: event.ip_hash,
      meta: event.meta,
    });

  if (error) {
    console.error("[insertEvent] Error:", error);
    return false;
  }
  return true;
}
