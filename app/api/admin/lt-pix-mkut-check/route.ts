import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// GET /api/admin/lt-pix-mkut-check
//
// Verifies that every LT-PIX (pix_pck where pck_type = 'LT') has at least
// 40 active mini-KUT assets in k_kut_assets.
//
// Auth: Bearer token matching CRON_SECRET (same guard used by cron routes).
//       In non-production environments without CRON_SECRET the check is
//       skipped so the endpoint can be exercised locally.
//
// Response 200:
//   {
//     checked_at: string,           // ISO timestamp
//     total_lt_pix: number,
//     passing: number,              // count where meets_minimum = true
//     failing: number,              // count where meets_minimum = false
//     results: Array<{
//       pix_pck_id:      string,
//       title:           string,
//       org_id:          string,
//       active_mkut_cnt: number,
//       meets_minimum:   boolean,
//     }>,
//   }
// ---------------------------------------------------------------------------

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && !secret) {
    // Mis-configured production — deny all rather than expose the endpoint.
    return false
  }

  if (!secret) {
    // Non-production with no secret — allow for local dev / CI.
    return true
  }

  return request.headers.get('authorization') === `Bearer ${secret}`
}

function getServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
  }
  return createClient(url, key)
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getServiceClient()

    const { data, error } = await supabase
      .from('v_lt_pix_mkut_coverage')
      .select('pix_pck_id, title, org_id, active_mkut_cnt, meets_minimum')
      .order('meets_minimum', { ascending: true })   // failing first
      .order('active_mkut_cnt', { ascending: true })

    if (error) {
      console.error('[lt-pix-mkut-check] Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to query coverage view', detail: error.message },
        { status: 500 }
      )
    }

    const results = data ?? []
    const passing = results.filter((r) => r.meets_minimum).length
    const failing = results.length - passing

    return NextResponse.json(
      {
        checked_at: new Date().toISOString(),
        total_lt_pix: results.length,
        passing,
        failing,
        results,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[lt-pix-mkut-check] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
