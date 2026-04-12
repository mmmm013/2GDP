// Edge Function: notify
// Unified notification fan-out: tries A2P SMS first, falls back to email, mirrors to Telegram.
// Endpoint: POST /functions/v1/notify
// Body: { to_email?: string, to_phone?: string, subject: string, message: string, telegram_chat_id?: string, k_kut_slug?: string }
// Env secrets required: SUPABASE_URL, SUPABASE_ANON_KEY
//   A2P (optional): A2P_API_URL, A2P_API_KEY, A2P_FROM_NUMBER
//   Telegram (optional): TELEGRAM_BOT_TOKEN
// File: supabase/functions/notify/index.ts

import { bad, ok, preflight } from "../_shared/responses.ts";

interface NotifyPayload {
  to_email?: string;
  to_phone?: string;
  subject: string;
  message: string;
  telegram_chat_id?: string;
  k_kut_slug?: string;
}

// ---- A2P SMS (provider-agnostic REST) ----
async function sendSms(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const apiUrl = Deno.env.get("A2P_API_URL");
  const apiKey = Deno.env.get("A2P_API_KEY");
  const fromNumber = Deno.env.get("A2P_FROM_NUMBER");
  if (!apiUrl || !apiKey || !fromNumber) return { ok: false, error: "A2P not configured" };
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ to, from: fromNumber, body }),
    });
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, error: `A2P error ${res.status}: ${t}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "A2P unknown error" };
  }
}

// ---- Email via Supabase Auth SMTP ----
async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string
): Promise<{ ok: boolean; error?: string }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return { ok: false, error: "Supabase env not configured" };
  // Use Supabase transactional email endpoint (requires SMTP configured in dashboard)
  const url = `${supabaseUrl}/functions/v1/magic_link`; // reuse magic_link OR use your SMTP relay
  // For transactional (non-auth) emails, use a direct SMTP relay via A2P_API_URL or Resend/SendGrid
  // Fallback: send magic link as a notification
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey },
    body: JSON.stringify({ email: to, redirect_to: "https://gputnammusic.com" }),
  });
  if (!res.ok) {
    const t = await res.text();
    return { ok: false, error: `Email error ${res.status}: ${t}` };
  }
  return { ok: true };
}

// ---- Telegram Bot ----
async function sendTelegram(
  chatId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  if (!token) return { ok: false, error: "Telegram not configured" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, error: `Telegram error ${res.status}: ${t}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Telegram unknown error" };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return bad("Method not allowed", 405);

  try {
    const body: NotifyPayload = await req.json().catch(() => null);
    if (!body?.subject || !body?.message) return bad("subject and message are required");
    if (!body.to_email && !body.to_phone && !body.telegram_chat_id) {
      return bad("At least one of to_email, to_phone, or telegram_chat_id is required");
    }

    const results: Record<string, { ok: boolean; error?: string }> = {};

    // 1. Try A2P SMS
    if (body.to_phone) {
      results.sms = await sendSms(body.to_phone, `${body.subject}\n${body.message}`);
      console.log(`[notify] SMS to ${body.to_phone}:`, results.sms);
    }

    // 2. Email (always if provided, regardless of SMS result)
    if (body.to_email) {
      results.email = await sendEmail(body.to_email, body.subject, body.message);
      console.log(`[notify] Email to ${body.to_email}:`, results.email);
    }

    // 3. Telegram mirror
    const tgChatId = body.telegram_chat_id ?? Deno.env.get("TELEGRAM_CHAT_ID");
    if (tgChatId) {
      const tgText = `<b>${body.subject}</b>\n${body.message}`;
      results.telegram = await sendTelegram(tgChatId, tgText);
      console.log(`[notify] Telegram to ${tgChatId}:`, results.telegram);
    }

    const anySuccess = Object.values(results).some((r) => r.ok);
    if (!anySuccess) {
      return bad(`All notification channels failed: ${JSON.stringify(results)}`, 500);
    }

    return ok({ dispatched: results });
  } catch (e) {
    console.error("[notify] Unexpected error:", e);
    return bad(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
