import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getFallbackKut } from '@/lib/kkutFallbackStore'

// GET /api/k/resolve/[code]
// Returns the destination path for a K-KUT short code.
// Public — the code itself is the access token.

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  if (!code || !/^[a-z0-9]{4,10}$/i.test(code)) {
    return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('k_kut_codes')
    .select('destination, item_type, item_id')
    .eq('code', code)
    .single()

  if (error || !data) {
    if (process.env.NODE_ENV !== 'production') {
      const fallback = getFallbackKut(code)
      if (fallback) {
        return NextResponse.json({
          destination: fallback.destination,
          item_type: fallback.item_type,
          item_id: fallback.item_id,
          source: 'fallback-store',
        })
      }
    }
    return NextResponse.json({ error: 'Code not found' }, { status: 404 })
  }

  return NextResponse.json({
    destination: data.destination,
    item_type:   data.item_type,
    item_id:     data.item_id,
  })
}
