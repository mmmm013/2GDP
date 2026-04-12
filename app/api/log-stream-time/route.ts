import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// POST /api/log-stream-time
//
// Requires: authenticated Supabase user session (cookie-based).
// Unauthenticated requests receive HTTP 401.
//
// Body (JSON):
//   seconds        number   required  >0, integer
//   pixPckId       string   optional  k_kuts_master.id  (PIX-PCK path)
//   parentVtId     string   optional  k_kuts_master.id  (legacy fallback)
//   productId      string   optional  product identifier for audit
//   ascapWorkId    string   optional  ASCAP work ID
//   source         string   optional  e.g. 'kleigh-player'
//   idempotencyKey string   optional  caller-supplied UUID v4; auto-generated if omitted
// ---------------------------------------------------------------------------

// UUID v4 pattern used for idempotency key validation
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  // ── 1. Parse & validate payload ──────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const seconds = body.seconds
  const pixPckId = typeof body.pixPckId === 'string' && body.pixPckId.trim() !== ''
    ? body.pixPckId.trim()
    : null
  const parentVtId = typeof body.parentVtId === 'string' && body.parentVtId.trim() !== ''
    ? body.parentVtId.trim()
    : null
  const productId = typeof body.productId === 'string' ? body.productId.trim() : null
  const ascapWorkId = typeof body.ascapWorkId === 'string' ? body.ascapWorkId.trim() : null
  const source = typeof body.source === 'string' ? body.source.trim() : 'unknown'

  // Validate caller-supplied idempotency key; fall back to a fresh UUID.
  // TODO: consider scoping idempotency to (user_id, idempotency_key) once
  //       a unique constraint on that pair is added to ascap_events.
  const rawKey = typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : ''
  const isValidKey = rawKey !== '' && UUID_V4_PATTERN.test(rawKey)
  if (rawKey !== '' && !isValidKey) {
    console.warn('[log-stream-time] Invalid idempotency key provided, generating new UUID')
  }
  const idempotencyKey = isValidKey ? rawKey : randomUUID()

  if (typeof seconds !== 'number' || !Number.isInteger(seconds) || seconds <= 0) {
    return NextResponse.json(
      { error: 'seconds must be a positive integer' },
      { status: 400 }
    )
  }

  if (!pixPckId && !parentVtId) {
    return NextResponse.json(
      { error: 'pixPckId or parentVtId is required' },
      { status: 400 }
    )
  }

  // ── 2. Supabase SSR client — reads auth session from request cookies ──────
  const supabase = await createClient()

  // ── 3. Enforce authentication ─────────────────────────────────────────────
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 4. Idempotency guard ─────────────────────────────────────────────────
  // ascap_events.id is UUID; we insert with a deterministic id derived from
  // the idempotency key so a duplicate POST is silently ignored.
  const eventId = idempotencyKey

  // ── 5. Audit insert into ascap_events ────────────────────────────────────
  const { error: eventError } = await supabase
    .from('ascap_events')
    .insert({
      id: eventId,
      user_id: user.id,
      product_id: productId,
      parent_vt_id: parentVtId ?? pixPckId,
      ascap_work_id: ascapWorkId,
      seconds,
      source,
      occurred_at: new Date().toISOString(),
      pix_pck_id: pixPckId,
      metadata: {
        raw_body: body,
      },
    })

  // A unique-violation (23505) means the idempotency key was already used.
  if (eventError) {
    if ((eventError as { code?: string }).code === '23505') {
      return NextResponse.json(
        { ok: true, duplicate: true, message: 'Already processed' },
        { status: 200 }
      )
    }
    console.error('[log-stream-time] ascap_events insert error', eventError.message)
    return NextResponse.json({ error: 'Audit log failed' }, { status: 500 })
  }

  // ── 6. PIX-PCK accumulation path (primary) ───────────────────────────────
  if (pixPckId) {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'accumulate_play_seconds_pix',
      {
        p_pix_pck_id: pixPckId,
        p_ascap_work_id: ascapWorkId ?? null,
        p_seconds: seconds,
      }
    )

    if (rpcError) {
      console.error('[log-stream-time] accumulate_play_seconds_pix error', rpcError.message)
      return NextResponse.json(
        { error: 'Accumulation failed (PIX-PCK path)' },
        { status: 500 }
      )
    }

    const result = Array.isArray(rpcData) ? rpcData[0] : rpcData
    return NextResponse.json({
      ok: true,
      path: 'pix_pck',
      pix_pck_id: pixPckId,
      total_ascap_performances: result?.total_ascap_performances ?? null,
      accumulated_seconds: result?.accumulated_seconds ?? null,
    })
  }

  // ── 7. Legacy fallback: ascap_accumulator_ledger by parent_vt_id ─────────
  const { data: ledger, error: ledgerError } = await supabase
    .from('ascap_accumulator_ledger')
    .upsert(
      {
        parent_vt_id: parentVtId!,
        ascap_work_id: ascapWorkId,
        accumulated_seconds: seconds,          // will be merged by trigger/constraint
        last_updated: new Date().toISOString(),
      },
      {
        onConflict: 'parent_vt_id',
        ignoreDuplicates: false,
      }
    )
    .select('total_ascap_performances, accumulated_seconds')
    .single()

  if (ledgerError) {
    console.error('[log-stream-time] ascap_accumulator_ledger upsert error', ledgerError.message)
    return NextResponse.json(
      { error: 'Accumulation failed (legacy ledger path)' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    path: 'legacy_ledger',
    parent_vt_id: parentVtId,
    total_ascap_performances: ledger?.total_ascap_performances ?? null,
    accumulated_seconds: ledger?.accumulated_seconds ?? null,
  })
}
