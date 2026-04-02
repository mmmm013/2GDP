'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// /gift/behind?track={itemId}
// Destination after a K-KUT or mKUT BTI (Behind The Music / Story) open.

export default function GiftBehindPage() {
  const searchParams = useSearchParams()
  const trackId = searchParams.get('track') ?? ''

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />

      <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-4">
            K-KUT · Behind The Music
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">The Story</h1>
          <p className="mt-3 text-white/50 max-w-sm mx-auto text-sm">
            Someone shared a K-KUT story with you — an intimate look behind the music.
          </p>
          {trackId && (
            <p className="mt-2 text-[10px] font-mono text-white/25 tracking-widest uppercase">
              Story ID: {trackId}
            </p>
          )}
        </div>

        {/* Story card placeholder */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-purple-500/25">
            ◎
          </div>
          <p className="text-white/60 text-sm">
            The behind-the-music story for this K-KUT is loading. Once activated, this space reveals the creative context, studio notes, and personal reflections from the artist.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/kupid"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Get Your Own K-KUT
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            Home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
