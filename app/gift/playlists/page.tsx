'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// /gift/playlists?playlist={playlistId}
// Destination after a K-KUT or mKUT FP (Featured Playlist) open.

export default function GiftPlaylistsPage() {
  const searchParams = useSearchParams()
  const playlistId = searchParams.get('playlist') ?? ''

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />

      <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-teal-500/20 text-teal-400 border border-teal-500/30 mb-4">
            K-KUT · Featured Playlist
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">The Playlist</h1>
          <p className="mt-3 text-white/50 max-w-sm mx-auto text-sm">
            Someone shared a curated GPM playlist K-KUT with you.
          </p>
          {playlistId && (
            <p className="mt-2 text-[10px] font-mono text-white/25 tracking-widest uppercase">
              Playlist ID: {playlistId}
            </p>
          )}
        </div>

        {/* Playlist card placeholder */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-teal-500/25">
            ▤
          </div>
          <p className="text-white/60 text-sm">
            This featured playlist K-KUT is loading. Once activated, the full curated tracklist from G Putnam Music will be available here.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/kupid"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
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
