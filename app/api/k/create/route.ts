import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { upsertFallbackKut } from '@/lib/kkutFallbackStore'

// POST /api/k/create
// Body: {
//   code: string,
//   destination: string,
//   item_type: 'STI'|'BTI'|'FP',
//   item_id: string,
//   pix_pck_id?: string,   // section package UUID (K-KUT STI with sections)
//   sections?: string[],   // ordered array of SectionTag values (contiguous, original order)
// }
// Stores the K-KUT short-code → destination mapping.
// Returns the stored record (or the existing one on duplicate code).

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { code, destination, item_type, item_id, pix_pck_id, sections } = body as {
    code: string
    destination: string
    item_type: string
    item_id: string
    pix_pck_id?: string
    sections?: string[]
  }

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

  // Validate sections array if provided
  const VALID_SECTIONS = new Set(['Intro','V1','Pre1','Ch1','V2','Pre2','Ch2','BR','Ch3','Outro'])
  if (sections !== undefined) {
    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ error: 'sections must be a non-empty array when provided' }, { status: 400 })
    }
    for (const s of sections) {
      if (!VALID_SECTIONS.has(s)) {
        return NextResponse.json({ error: `"${s}" is not a valid section tag` }, { status: 400 })
      }
    }
  }

  const insertRow: Record<string, unknown> = { code, destination, item_type, item_id }
  if (pix_pck_id) insertRow.pix_pck_id = pix_pck_id
  if (sections)   insertRow.sections   = sections

  const { data, error } = await supabaseAdmin
    .from('k_kut_codes')
    .insert(insertRow)
    .select('code, destination, pix_pck_id, sections')
    .single()

  if (error) {
    // 23505 = unique_violation — code already taken, return existing record
    if (error.code === '23505') {
      const { data: existing } = await supabaseAdmin
        .from('k_kut_codes')
        .select('code, destination, pix_pck_id, sections')
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
      return NextResponse.json({ code: fallback.code, destination: fallback.destination, pix_pck_id: pix_pck_id ?? null, sections: sections ?? null, source: 'fallback-store' }, { status: 201 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
