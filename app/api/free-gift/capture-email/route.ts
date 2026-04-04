/**
 * POST /api/free-gift/capture-email
 *
 * Records an email address submitted by a user after claiming a free gift.
 * Inserts into `free_gift_leads` for future marketing/reengagement.
 *
 * Body (JSON):
 *   issuanceId   string  required  UUID of the free_gift_issuances row
 *   email        string  required  User's email address
 *   sessionId    string  optional  Caller-supplied session ID
 *
 * Rate-limit: 5 requests per IP per 15-minute window (in-memory, resets on cold start).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// ---------------------------------------------------------------------------
// Simple in-process IP rate limiter
// ---------------------------------------------------------------------------
const RATE_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT     = 5               // max requests per window per IP

interface RateEntry { count: number; windowStart: number }
const rateMap = new Map<string, RateEntry>()

function isRateLimited(ip: string): boolean {
  const now  = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, windowStart: now })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
// ---------------------------------------------------------------------------

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const issuanceId = typeof body.issuanceId === 'string' ? body.issuanceId.trim() : null
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : null
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : null

  if (!issuanceId) {
    return NextResponse.json({ error: 'issuanceId is required' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('free_gift_leads')
    .insert({
      id: randomUUID(),
      issuance_id: issuanceId,
      email,
      session_id: sessionId,
      captured_at: new Date().toISOString(),
    })

  if (error) {
    // 23505 = unique_violation — email already captured for this issuance
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, duplicate: true })
    }
    console.error('[free-gift/capture-email] insert error', error)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
