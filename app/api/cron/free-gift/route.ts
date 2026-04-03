/**
 * /api/cron/free-gift
 *
 * Runs every hour via Vercel Cron. At each tick:
 *  1. Determines the current UTC hour and the owning region.
 *  2. Picks one eligible free-gift item (< $50, not historic).
 *  3. Inserts a row into `free_gift_issuances` for tracking.
 *  4. Returns the issuance record so Vercel logs capture it.
 *
 * Rules:
 *  - 3 US hours, 3 CA hours, 3 UK hours, 3 AUS hours, 3 CN hours per day.
 *  - Remaining 9 hours are GLOBAL (random from full eligible pool).
 *  - K-KUTs > mini-KUTs > K-kUpIds in priority for regional hours.
 *  - NEVER issue historic cost-items.
 *  - NEVER issue items costing ≥ $50.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import {
  getRegionForHour,
  pickFreeGift,
  type GiftRegion,
} from '@/lib/free-gift-catalog'

// ── Auth guard (same pattern as rotate-promotions) ──────────────────────────

function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd && !secret) return false
  if (!secret) return true
  return request.headers.get('authorization') === `Bearer ${secret}`
}

// ── Core issuance logic ──────────────────────────────────────────────────────

async function issueHourlyFreeGift() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const utcHour = new Date().getUTCHours()
  const region: GiftRegion = getRegionForHour(utcHour)
  const gift = pickFreeGift(region)

  const issuanceId = randomUUID()
  const issuedAt = new Date().toISOString()

  const record = {
    id: issuanceId,
    issued_at: issuedAt,
    utc_hour: utcHour,
    region,
    gift_title: gift.title,   // ASCAP title — single source of truth
    gift_type: gift.type,
    gift_cost_cents: gift.costCents,
    delivery_url: gift.deliveryUrl,
    description: gift.description,
    responses: 0,
  }

  const { error } = await supabase
    .from('free_gift_issuances')
    .insert(record)

  if (error) {
    console.error('[free-gift] insert error', error)
    // Don't throw — return what we picked so logs still capture it
  }

  return record
}

// ── Route handlers ───────────────────────────────────────────────────────────

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await issueHourlyFreeGift()
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await issueHourlyFreeGift()
  return NextResponse.json(result)
}
