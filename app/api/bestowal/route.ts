/**
 * POST /api/bestowal
 *
 * 4PE Bestowal Engine — triggers an event-based K-KUT / mini-KUT delivery.
 *
 * Body:
 *   trigger        string    Required. Script key, e.g. "VALENTINES_KK"
 *   to_phone?      string    E.164 phone number for A2P SMS (via send-k-kuts)
 *   email?         string    Email address for magic-link delivery
 *   webhook_url?   string    Optional HTTPS webhook to receive payload
 *   dry_run?       boolean   If true, returns payload without firing SMS/email
 *
 * Returns:
 *   { ok, trigger, asset_id, asset_url, sms_body, dispatched, dry_run }
 *
 * Security:
 *   - Requires BESTOWAL_API_KEY bearer token in Authorization header, or
 *     CRON_SECRET when called from the Vercel cron.
 *   - All bestowals are written to the bestowal_log table for audit / profit tracking.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBestowalScript, listBestowalTriggers } from '@/lib/bestowals'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization') ?? ''
  const apiKey = process.env.BESTOWAL_API_KEY
  const cronSecret = process.env.CRON_SECRET

  if (apiKey && authHeader === `Bearer ${apiKey}`) return true
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true

  // Allow unauthenticated access only in non-production (local dev / CI)
  if (process.env.NODE_ENV !== 'production') return true

  return false
}

// ---------------------------------------------------------------------------
// Dispatch via send-k-kuts Edge Function
// ---------------------------------------------------------------------------

interface DispatchResult {
  sms?: string
  email?: string
  webhook?: string
  error?: string
}

async function dispatchBestowal(
  assetId: string,
  smsBody: string,
  opts: {
    to_phone?: string
    email?: string
    webhook_url?: string
  }
): Promise<DispatchResult> {
  const supabaseFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseFunctionUrl || !serviceKey) {
    return { error: 'Supabase env vars not configured' }
  }

  const targets: Record<string, unknown> = {}
  if (opts.to_phone) targets['to_phone'] = opts.to_phone
  if (opts.email) targets['email'] = opts.email
  if (opts.webhook_url) targets['webhook_urls'] = [opts.webhook_url]

  if (Object.keys(targets).length === 0) {
    // No dispatch channels — dry run or catalog lookup only
    return {}
  }

  const body = {
    k_kut_id: assetId,
    targets,
    // Override SMS body with the 4PE bestowal script text
    sms_override: smsBody,
  }

  try {
    const res = await fetch(`${supabaseFunctionUrl}/functions/v1/send-k-kuts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify(body),
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { error: json?.error ?? `send-k-kuts returned ${res.status}` }
    }

    const result: DispatchResult = {}
    if (opts.to_phone) result.sms = 'queued'
    if (opts.email) result.email = 'queued'
    if (opts.webhook_url) result.webhook = 'queued'
    return result
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'dispatch failed' }
  }
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

async function logBestowal(entry: {
  trigger: string
  asset_id: string
  to_phone?: string
  email?: string
  dry_run: boolean
  dispatched: DispatchResult
}): Promise<void> {
  try {
    await supabaseAdmin.from('bestowal_log').insert({
      trigger: entry.trigger,
      asset_id: entry.asset_id,
      to_phone: entry.to_phone ?? null,
      email: entry.email ?? null,
      dry_run: entry.dry_run,
      dispatch_result: entry.dispatched,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Non-fatal — log failure should not block the bestowal response
    console.error('bestowal_log write failed', entry.trigger)
  }
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

export async function GET() {
  return NextResponse.json({
    service: '4PE Bestowal Engine',
    version: '2026-04-02',
    available_triggers: listBestowalTriggers(),
    usage: {
      method: 'POST',
      body: {
        trigger: 'string (required)',
        to_phone: 'string (E.164, optional)',
        email: 'string (optional)',
        webhook_url: 'string (https, optional)',
        dry_run: 'boolean (optional, default false)',
      },
    },
  })
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const trigger = typeof body.trigger === 'string' ? body.trigger.trim().toUpperCase() : ''
  if (!trigger) {
    return NextResponse.json(
      { error: 'trigger is required', available_triggers: listBestowalTriggers() },
      { status: 400 }
    )
  }

  const script = getBestowalScript(trigger)
  if (!script) {
    return NextResponse.json(
      { error: `Unknown trigger "${trigger}"`, available_triggers: listBestowalTriggers() },
      { status: 404 }
    )
  }

  const to_phone = typeof body.to_phone === 'string' ? body.to_phone : undefined
  const email = typeof body.email === 'string' ? body.email : undefined
  const webhook_url = typeof body.webhook_url === 'string' ? body.webhook_url : undefined
  const dry_run = body.dry_run === true

  let dispatched: DispatchResult = {}

  if (!dry_run) {
    dispatched = await dispatchBestowal(script.asset_id, script.sms_body, {
      to_phone,
      email,
      webhook_url,
    })
  }

  await logBestowal({ trigger, asset_id: script.asset_id, to_phone, email, dry_run, dispatched })

  return NextResponse.json({
    ok: true,
    trigger: script.trigger,
    event: script.event,
    asset_tier: script.asset_tier,
    asset_id: script.asset_id,
    asset_url: script.asset_url,
    vocalist: script.vocalist,
    composer: script.composer,
    pillars: script.pillars,
    sponsors: script.sponsors,
    sms_body: script.sms_body,
    script: script.script,
    dispatched,
    dry_run,
    methodology: script.methodology,
    mechanism: script.mechanism,
  })
}
