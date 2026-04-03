'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// /gift/claim/[sessionId]
// Linked in SMS notifications sent by the Stripe webhook.
// Shows the buyer's confirmed gift record and next steps.

type ClaimData = {
  tier: string
  donorName: string | null
  donorEmail: string | null
  status: string
  grandPrizeEligible: boolean
}

export default function GiftClaimPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [data, setData]     = useState<ClaimData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    fetch(`/api/gift/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then(async r => {
        const body = await r.json()
        if (!r.ok) throw new Error(body?.error ?? `Error ${r.status}`)
        return body
      })
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [sessionId])

  const tierLabel = data?.tier
    ? data.tier.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Gift'

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />

      <section className="pt-24 pb-16 px-4 max-w-xl mx-auto text-center">

        {loading && (
          <div className="flex justify-center gap-3 mt-12">
            {[0,1,2].map(i => (
              <span key={i} className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}

        {!loading && error && (
          <>
            <p className="text-red-400/80 text-sm mt-8">{error}</p>
            <Link href="/" className="mt-6 inline-block text-amber-400 text-sm hover:underline">Back to Home</Link>
          </>
        )}

        {!loading && data && (
          <>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/30 mb-6">
              ♪
            </div>

            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-green-500/20 text-green-400 border border-green-500/30 mb-4">
              Gift Claim
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#C8A882]">
              {data.donorName ? `${data.donorName}'s Gift` : 'Your Gift'}
            </h1>

            <p className="text-white/60 mb-2">
              <strong className="text-white">{tierLabel}</strong> · Status: <span className="text-green-400 capitalize">{data.status}</span>
            </p>

            {data.grandPrizeEligible && (
              <p className="mt-2 text-sm text-amber-400/80">★ Eligible for Grand Prize draw</p>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/kupid" className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity">
                Explore K-KUTs
              </Link>
              <Link href="/" className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors">
                Home
              </Link>
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  )
}
