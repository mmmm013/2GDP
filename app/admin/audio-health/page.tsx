'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PipelineRow {
  pipeline: string
  total: number
  errors: number
  error_rate_pct: number
  p99_latency_ms: number
  avg_retry_count: number
  ctq_breach: boolean
}

interface HealthData {
  ok: boolean
  generated_at?: string
  window_hours?: number
  schema_pending?: boolean
  message?: string
  ctq?: { max_error_rate_pct: number; max_p99_latency_ms: number }
  pipelines?: PipelineRow[]
  dmaic_alert?: boolean
  error?: string
}

export default function AudioHealthPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/audio-health', {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''}` },
    })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => setData({ ok: false, error: String(e) }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-[#2d1b18] p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center py-6 border-b border-white/10 mb-8">
          <h1 className="text-xl font-bold text-white tracking-widest">
            GPM <span className="text-[#FFD54F]">AUDIO HEALTH</span>
            <span className="ml-3 text-xs text-white/40">DMAIC Control Phase</span>
          </h1>
          <Link href="/admin" className="text-xs text-[#FFD54F] hover:underline opacity-60 hover:opacity-100">
            ← Admin
          </Link>
        </div>

        {loading && (
          <p className="text-white/50 text-sm animate-pulse">Loading pipeline metrics…</p>
        )}

        {!loading && data && (
          <>
            {data.error && (
              <div className="bg-red-900/40 border border-red-500/50 rounded p-4 text-red-300 text-sm mb-6">
                Error: {data.error}
              </div>
            )}

            {data.schema_pending && (
              <div className="bg-yellow-900/40 border border-yellow-500/50 rounded p-4 text-yellow-300 text-sm mb-6">
                <strong>Schema pending:</strong> {data.message}
              </div>
            )}

            {data.dmaic_alert && (
              <div className="bg-red-800/60 border border-red-400 rounded p-4 text-red-200 text-sm mb-6 font-bold">
                ⚠ DMAIC ALERT — One or more pipelines are breaching CTQ thresholds. Review and raise a hotfix or backlog item.
              </div>
            )}

            {data.ctq && (
              <div className="text-xs text-white/40 mb-4">
                CTQ targets — error rate &lt; {data.ctq.max_error_rate_pct}% · p99 latency &lt; {data.ctq.max_p99_latency_ms}ms
                {data.window_hours && ` · window: last ${data.window_hours}h`}
                {data.generated_at && ` · generated ${new Date(data.generated_at).toLocaleString()}`}
              </div>
            )}

            {data.pipelines && data.pipelines.length === 0 && !data.schema_pending && (
              <p className="text-white/50 text-sm">No pipeline events in the last 24 hours.</p>
            )}

            {data.pipelines && data.pipelines.length > 0 && (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-[#FFD54F] text-xs border-b border-white/10">
                    <th className="text-left py-2 pr-4">Pipeline</th>
                    <th className="text-right py-2 px-4">Total</th>
                    <th className="text-right py-2 px-4">Errors</th>
                    <th className="text-right py-2 px-4">Error %</th>
                    <th className="text-right py-2 px-4">p99 ms</th>
                    <th className="text-right py-2 px-4">Avg Retries</th>
                    <th className="text-right py-2 pl-4">CTQ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pipelines.map((row) => (
                    <tr
                      key={row.pipeline}
                      className={`border-b border-white/5 ${row.ctq_breach ? 'text-red-300' : 'text-white/80'}`}
                    >
                      <td className="py-2 pr-4">{row.pipeline}</td>
                      <td className="text-right py-2 px-4">{row.total.toLocaleString()}</td>
                      <td className="text-right py-2 px-4">{row.errors.toLocaleString()}</td>
                      <td className="text-right py-2 px-4">{row.error_rate_pct.toFixed(3)}%</td>
                      <td className="text-right py-2 px-4">{row.p99_latency_ms}</td>
                      <td className="text-right py-2 px-4">{row.avg_retry_count.toFixed(2)}</td>
                      <td className="text-right py-2 pl-4">
                        {row.ctq_breach
                          ? <span className="text-red-400 font-bold">BREACH</span>
                          : <span className="text-green-400">OK</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-10 text-center text-white/20 text-xs">
              GPMC-BIZ-MSC · Six Sigma DMAIC Control Phase · monthly review cadence
            </div>
          </>
        )}
      </div>
    </main>
  )
}
