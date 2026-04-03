/**
 * POST /api/free-gift/respond
 *
 * Called when a user engages with a free-gift issuance (taps, claims, or
 * reacts to it). Increments the response counter on `free_gift_issuances`
 * and inserts a detailed row into `free_gift_responses` for full tracking.
 *
 * Body (JSON):
 *   issuanceId   string  required  UUID of the free_gift_issuances row
 *   action       string  required  'claim' | 'tap' | 'share' | 'skip'
 *   userRegion   string  optional  ISO country / region code (e.g. 'US')
 *   sessionId    string  optional  caller-supplied session ID
 *   message      string  optional  free-form user message / reaction
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const ALLOWED_ACTIONS = ['claim', 'tap', 'share', 'skip'] as const
type ResponseAction = (typeof ALLOWED_ACTIONS)[number]

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const issuanceId = typeof body.issuanceId === 'string' ? body.issuanceId.trim() : null
  const action = typeof body.action === 'string' ? body.action.trim() : null
  const userRegion = typeof body.userRegion === 'string' ? body.userRegion.trim() : null
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : null
  const message = typeof body.message === 'string' ? body.message.trim() : null

  if (!issuanceId) {
    return NextResponse.json({ error: 'issuanceId is required' }, { status: 400 })
  }
  if (!action || !(ALLOWED_ACTIONS as readonly string[]).includes(action)) {
    return NextResponse.json(
      { error: `action must be one of: ${ALLOWED_ACTIONS.join(', ')}` },
      { status: 400 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const responseId = randomUUID()
  const respondedAt = new Date().toISOString()

  // 1. Insert detailed response row
  const { error: insertError } = await supabase
    .from('free_gift_responses')
    .insert({
      id: responseId,
      issuance_id: issuanceId,
      responded_at: respondedAt,
      action: action as ResponseAction,
      user_region: userRegion,
      session_id: sessionId,
      message,
    })

  if (insertError) {
    console.error('[free-gift/respond] insert error', insertError)
    return NextResponse.json({ error: 'Failed to record response' }, { status: 500 })
  }

  // 2. Increment the response counter on the parent issuance
  const { error: rpcError } = await supabase.rpc('increment_free_gift_responses', {
    p_issuance_id: issuanceId,
  })

  if (rpcError) {
    // Non-fatal: response row is already written, just log the counter failure
    console.error('[free-gift/respond] counter increment error', rpcError)
  }

  return NextResponse.json({
    responseId,
    issuanceId,
    action,
    respondedAt,
  })
}
