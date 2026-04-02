'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// /gift/songs?track={itemId}
// Destination after a K-KUT or mKUT STI (Song Track Item) open.
// Renders a track spotlight that will resolve the itemId to a
// gpm_tracks record once GTM queries are wired; for now it provides
// a branded landing with the correct K-KUT gift-experience framing.

export default function GiftSongsPage() {
  const searchParams = useSearchParams()
  const trackId = searchParams.get('track') ?? ''

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />

      <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {/* Badge */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
            K-KUT · Song
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#C8A882]">Your Sound</h1>
          <p className="mt-3 text-white/50 max-w-sm mx-auto text-sm">
            Someone sent you a K-KUT — a curated Sweet Spot from a G Putnam Music track.
          </p>
          {trackId && (
            <p className="mt-2 text-[10px] font-mono text-white/25 tracking-widest uppercase">
              Track ID: {trackId}
            </p>
          )}
        </div>

        {/* Player placeholder — wire to gpm_tracks once connected */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-amber-500/25">
            ♪
          </div>
          <p className="text-white/60 text-sm mb-6">
            Your K-KUT is loading its Sweet Spot. The excerpt will play here once the track is activated.
          </p>
          <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/kupid"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Get Your Own K-KUT
          </Link>
          <Link
            href="/kleigh"
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            Live Audio Vault
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
