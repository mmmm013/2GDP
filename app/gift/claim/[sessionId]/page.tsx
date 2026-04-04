'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// /gift/claim/[sessionId]
// Linked in SMS notifications sent by the Stripe webhook.
// Shows the buyer's confirmed gift record and next steps.
// Also captures the recipient's email for list-building and
// prompts K-kUpId recipients to create their own.

type ClaimData = {
  tier: string
  donorName: string | null
  donorEmail: string | null
  status: string
  grandPrizeEligible: boolean
}

export default function GiftClaimPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [data, setData]       = useState<ClaimData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  // Email capture state
  const [email, setEmail]           = useState('')
  const [emailSent, setEmailSent]   = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailBusy, setEmailBusy]   = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

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

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || emailBusy) return
    setEmailBusy(true)
    setEmailError(null)
    try {
      const res = await fetch('/api/free-gift/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issuanceId: sessionId, email: email.trim(), sessionId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? 'Failed to save email')
      setEmailSent(true)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setEmailBusy(false)
    }
  }

  const tierLabel = data?.tier
    ? data.tier.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Gift'

  const isKupid = data?.tier?.toLowerCase().includes('kupid')

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
              <strong className="text-white">{tierLabel}</strong> · Status:{' '}
              <span className="text-green-400 capitalize">{data.status}</span>
            </p>

            {data.grandPrizeEligible && (
              <p className="mt-2 text-sm text-amber-400/80">★ Eligible for Grand Prize draw</p>
            )}

            {/* ── Email Capture ─────────────────────────────────────────── */}
            {!emailSent ? (
              <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-left">
                <p className="text-sm font-semibold text-amber-300 mb-1">
                  🎁 Stay in the loop
                </p>
                <p className="text-xs text-white/50 mb-3">
                  Get notified of free hourly gifts and new GPM drops. No spam — ever.
                </p>
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/60"
                  />
                  <button
                    type="submit"
                    disabled={emailBusy}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {emailBusy ? '…' : 'Yes!'}
                  </button>
                </form>
                {emailError && (
                  <p className="mt-2 text-xs text-red-400">{emailError}</p>
                )}
              </div>
            ) : (
              <p className="mt-8 text-sm text-green-400/80">
                ✓ You&apos;re on the list. Watch for your next free GPM gift.
              </p>
            )}

            {/* ── K-kUpId recipient onboarding ──────────────────────────── */}
            {isKupid && (
              <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/5 p-5 text-left">
                <p className="text-sm font-semibold text-violet-300 mb-1">
                  💜 You received a K-kUpId!
                </p>
                <p className="text-xs text-white/50 mb-3">
                  A K-kUpId is a personal music capsule — a new way to share feelings through
                  sound. Want to send one to someone <em>you</em> love?
                </p>
                <Link
                  href="/kupid"
                  className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Create Your Own K-kUpId →
                </Link>
              </div>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/kupid"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Explore K-KUTs
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors"
              >
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
