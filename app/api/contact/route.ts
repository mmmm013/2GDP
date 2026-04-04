/**
 * POST /api/contact
 *
 * Saves a contact form submission to the `contact_inquiries` Supabase table.
 *
 * Body (JSON):
 *   name     string  required
 *   email    string  required
 *   subject  string  required
 *   message  string  required
 *
 * Rate-limit: 3 submissions per IP per 15-minute window (in-memory).
 *
 * Supabase migration required:
 *   create table contact_inquiries (
 *     id          uuid primary key default gen_random_uuid(),
 *     name        text not null,
 *     email       text not null,
 *     subject     text not null,
 *     message     text not null,
 *     submitted_at timestamptz default now()
 *   );
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Rate limiter
// ---------------------------------------------------------------------------
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT     = 3

interface RateEntry { count: number; windowStart: number }
const rateMap = new Map<string, RateEntry>()

function isRateLimited(ip: string): boolean {
  const now   = Date.now()
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

  const name    = typeof body.name    === 'string' ? body.name.trim()    : null
  const email   = typeof body.email   === 'string' ? body.email.trim().toLowerCase() : null
  const subject = typeof body.subject === 'string' ? body.subject.trim() : null
  const message = typeof body.message === 'string' ? body.message.trim() : null

  if (!name)                          return NextResponse.json({ error: 'Name is required' },    { status: 400 })
  if (!email || !isValidEmail(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  if (!subject)                       return NextResponse.json({ error: 'Subject is required' },  { status: 400 })
  if (!message || message.length < 10) return NextResponse.json({ error: 'Message is required (min 10 chars)' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('contact_inquiries')
    .insert({ name, email, subject, message })

  if (error) {
    console.error('[/api/contact] insert error', error)
    return NextResponse.json({ error: 'Failed to save your message. Please email us directly.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
