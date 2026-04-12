import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// GET /api/admin/audio-health
//
// Returns a daily-rollup health snapshot for the audio pipeline DMAIC dashboard.
// Reads structured log events from the `audio_pipeline_logs` table (if present).
// Falls back to a schema-stub response if the table does not exist yet.
//
// Auth: Bearer token matching ADMIN_SECRET (falls back to CRON_SECRET).
//
// Response 200:
//   {
//     ok: true,
//     generated_at: string,        // ISO timestamp
//     pipelines: [
//       {
//         pipeline: string,
//         total: number,
//         errors: number,
//         error_rate_pct: number,  // errors/total * 100, CTQ target < 0.1%
//         p99_latency_ms: number,  // 99th percentile latency
//         avg_retry_count: number,
//         ctq_breach: boolean,     // true if error_rate > 0.1% or p99 > 800ms
//       }
//     ],
//     dmaic_alert: boolean,        // true if any pipeline breaches CTQ
//   }
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
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key)
}

const CTQ_ERROR_RATE_PCT = 0.1   // > 0.1% triggers DMAIC alert
const CTQ_P99_LATENCY_MS = 800   // > 800ms triggers DMAIC alert

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getServiceClient()

    // Query the last 24 hours of pipeline logs.
    // Table schema (create via migration if not yet present):
    //   audio_pipeline_logs(id, pipeline, track_id, latency_ms, status, retry_count, created_at)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: logs, error } = await supabase
      .from('audio_pipeline_logs')
      .select('pipeline, latency_ms, status, retry_count')
      .gte('created_at', since)

    if (error) {
      // Table may not exist yet — return a stub indicating schema is pending.
      if (error.code === '42P01') {
        return NextResponse.json({
          ok: true,
          generated_at: new Date().toISOString(),
          schema_pending: true,
          message: 'audio_pipeline_logs table not yet created — run migration to enable health dashboard',
          pipelines: [],
          dmaic_alert: false,
        })
      }
      throw error
    }

    // Aggregate by pipeline
    const byPipeline: Record<string, { latencies: number[]; errors: number; retries: number[] }> = {}
    for (const row of logs ?? []) {
      if (!byPipeline[row.pipeline]) {
        byPipeline[row.pipeline] = { latencies: [], errors: 0, retries: [] }
      }
      byPipeline[row.pipeline].latencies.push(row.latency_ms ?? 0)
      byPipeline[row.pipeline].retries.push(row.retry_count ?? 0)
      if (row.status === 'error') byPipeline[row.pipeline].errors++
    }

    const pipelines = Object.entries(byPipeline).map(([pipeline, stats]) => {
      const total = stats.latencies.length
      const sorted = [...stats.latencies].sort((a, b) => a - b)
      const p99idx = Math.max(0, Math.ceil(sorted.length * 0.99) - 1)
      const p99_latency_ms = sorted[p99idx] ?? 0
      const error_rate_pct = total > 0 ? (stats.errors / total) * 100 : 0
      const avg_retry_count = total > 0
        ? stats.retries.reduce((s, v) => s + v, 0) / total
        : 0
      const ctq_breach = error_rate_pct > CTQ_ERROR_RATE_PCT || p99_latency_ms > CTQ_P99_LATENCY_MS
      return { pipeline, total, errors: stats.errors, error_rate_pct, p99_latency_ms, avg_retry_count, ctq_breach }
    })

    const dmaic_alert = pipelines.some((p) => p.ctq_breach)

    return NextResponse.json({
      ok: true,
      generated_at: new Date().toISOString(),
      window_hours: 24,
      ctq: { max_error_rate_pct: CTQ_ERROR_RATE_PCT, max_p99_latency_ms: CTQ_P99_LATENCY_MS },
      pipelines,
      dmaic_alert,
    })
  } catch (err) {
    console.error('[audio-health] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
