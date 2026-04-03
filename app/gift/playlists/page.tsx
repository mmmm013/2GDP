'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'

interface Playlist {
  id: string
  name: string
  description?: string
}

function GiftPlaylistsPageContent() {
  const searchParams = useSearchParams()
  const playlistId = searchParams.get('playlist') ?? ''
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(!!playlistId)

  useEffect(() => {
    if (!playlistId) return
    supabase
      .from('playlists')
      .select('id, name, description')
      .eq('id', playlistId)
      .single()
      .then(({ data }) => {
        setPlaylist(data ?? null)
        setLoading(false)
      })
  }, [playlistId])

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
        </div>

        {/* Playlist card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          {loading ? (
            <p className="text-white/40 text-sm py-8 animate-pulse">Loading playlist…</p>
          ) : playlist ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-teal-500/25">
                ▤
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{playlist.name}</h2>
              {playlist.description && (
                <p className="text-white/50 text-sm mb-4">{playlist.description}</p>
              )}
              <p className="text-white/40 text-sm">
                The full curated tracklist from G Putnam Music will be available here once activated.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-teal-500/25">
                ▤
              </div>
              <p className="text-white/60 text-sm">
                This featured playlist K-KUT is loading. Once activated, the full curated tracklist from G Putnam Music will be available here.
              </p>
            </>
          )}
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

export default function GiftPlaylistsPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-white/40 text-sm">Loading…</div>}>
      <GiftPlaylistsPageContent />
    </Suspense>
  )
}
