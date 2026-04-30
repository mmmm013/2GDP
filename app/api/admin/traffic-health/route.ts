import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// GET /api/admin/traffic-health
//
// Returns lightweight traffic counters for fast visibility.
//
// Auth: Bearer token matching ADMIN_SECRET (fallback: CRON_SECRET).
//
// Response 200:
//   {
//     ok: true,
//     generated_at: string,
//     event: string,
//     window_counts: {
//       last_24h: number,
//       last_7d: number,
//     }
//   }
//
// Query params:
//   event=<event_name>   // optional, defaults to page_view
// ---------------------------------------------------------------------------

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET ?? process.env.CRON_SECRET
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && !secret) return false
  if (!secret) return true

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

function toIso(hoursAgo: number): string {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getServiceClient()
    const url = new URL(request.url)
    const event = (url.searchParams.get('event') || 'page_view').trim()

    const [last24h, last7d] = await Promise.all([
      supabase
        .from('audio_telemetry_events')
        .select('*', { count: 'exact', head: true })
        .eq('event', event)
        .gte('created_at', toIso(24)),
      supabase
        .from('audio_telemetry_events')
        .select('*', { count: 'exact', head: true })
        .eq('event', event)
        .gte('created_at', toIso(24 * 7)),
    ])

    const firstError = last24h.error ?? last7d.error
    if (firstError) {
      if (firstError.code === '42P01') {
        return NextResponse.json({
          ok: true,
          generated_at: new Date().toISOString(),
          schema_pending: true,
          message: 'audio_telemetry_events table not found. Run migrations to enable traffic counters.',
          event,
          window_counts: { last_24h: 0, last_7d: 0 },
        })
      }

      throw firstError
    }

    return NextResponse.json({
      ok: true,
      generated_at: new Date().toISOString(),
      event,
      window_counts: {
        last_24h: last24h.count ?? 0,
        last_7d: last7d.count ?? 0,
      },
    })
  } catch (err) {
    console.error('[traffic-health] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
