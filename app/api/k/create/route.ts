import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { upsertFallbackKut } from '@/lib/kkutFallbackStore'

// POST /api/k/create
// Body: { code: string, destination: string, item_type: 'STI'|'BTI'|'FP', item_id: string }
// Stores the K-KUT short-code → destination mapping.
// Returns the stored record (or the existing one on duplicate code).

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { code, destination, item_type, item_id } = body

  if (!code || !destination || !item_type || !item_id) {
    return NextResponse.json({ error: 'Missing required fields: code, destination, item_type, item_id' }, { status: 400 })
  }

  if (!/^[a-z0-9]{4,10}$/i.test(code)) {
    return NextResponse.json({ error: 'code must be 4-10 alphanumeric characters' }, { status: 400 })
  }

  const validTypes = ['STI', 'BTI', 'FP']
  if (!validTypes.includes(item_type)) {
    return NextResponse.json({ error: `item_type must be one of ${validTypes.join(', ')}` }, { status: 400 })
  }

  // Only allow relative destination paths (reject external URLs to prevent open-redirect abuse)
  if (!destination.startsWith('/')) {
    return NextResponse.json({ error: 'destination must be a relative path starting with /' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('k_kut_codes')
    .insert({ code, destination, item_type, item_id })
    .select('code, destination')
    .single()

  if (error) {
    // 23505 = unique_violation — code already taken, return existing record
    if (error.code === '23505') {
      const { data: existing } = await supabaseAdmin
        .from('k_kut_codes')
        .select('code, destination')
        .eq('code', code)
        .single()
      return NextResponse.json(existing ?? { code, destination }, { status: 200 })
    }

    // Dev-only escape hatch: allow local testing if Supabase is unreachable.
    if (process.env.NODE_ENV !== 'production') {
      const fallback = upsertFallbackKut({
        code,
        destination,
        item_type: item_type as 'STI' | 'BTI' | 'FP',
        item_id,
      })
      return NextResponse.json({ code: fallback.code, destination: fallback.destination, source: 'fallback-store' }, { status: 201 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
