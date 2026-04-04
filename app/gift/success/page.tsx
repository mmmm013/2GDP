'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type SessionData = {
  tier: string
  donorName: string | null
  donorEmail: string | null
  grandPrizeEligible: boolean
}

function GiftSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    fetch(`/api/gift/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSession(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [sessionId])

  const tierLabel = session?.tier
    ? session.tier.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Gift'

  async function handleShare() {
    const shareText = session?.donorName
      ? `${session.donorName} just gifted a ${tierLabel} through G Putnam Music — a new way to share music personally. 🎵`
      : `Just gifted a ${tierLabel} through G Putnam Music — a new way to share music personally. 🎵`
    const shareUrl = 'https://gputnammusic.com/kupid'

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'G Putnam Music Gift', text: shareText, url: shareUrl })
        setShared(true)
      } catch {
        // user cancelled share — not an error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        setShared(true)
      } catch {
        // clipboard not available
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
      }
    }
  }

  return (
    <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto text-center">

      {loading ? (
        <div className="flex justify-center gap-3 mt-12">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-amber-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Success icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/30 mb-6">
            ♪
          </div>

          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-green-500/20 text-green-400 border border-green-500/30 mb-4">
            Payment Confirmed
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-[#C8A882]">
            {session?.donorName ? `Thank you, ${session.donorName}.` : 'Thank you!'}
          </h1>

          <p className="text-lg text-white/60 mb-2">
            Your <strong className="text-white">{tierLabel}</strong> gift has been received.
          </p>

          {session?.grandPrizeEligible && (
            <p className="mt-2 text-sm text-amber-400/80">
              ★ You&apos;re entered in the Grand Prize draw.
            </p>
          )}

          {session?.donorEmail && (
            <p className="mt-4 text-sm text-white/40">
              A confirmation will be sent to{' '}
              <span className="text-white/60">{session.donorEmail}</span>.
            </p>
          )}

          {/* ── Share CTA ──────────────────────────────────────────────── */}
          <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm font-semibold text-amber-300 mb-2">
              🎵 Tell someone about it
            </p>
            <p className="text-xs text-white/50 mb-4">
              You just gifted music in a brand-new way. Share the experience.
            </p>
            <button
              onClick={handleShare}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {shared ? '✓ Shared!' : '📤 Share This Gift'}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/kupid"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Explore K-KUTs Lockets
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

export default function GiftSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />
      <Suspense fallback={
        <div className="flex justify-center gap-3 mt-24">
          {[0,1,2].map(i => (
            <span key={i} className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      }>
        <GiftSuccessContent />
      </Suspense>
      <Footer />
    </main>
  )
}
