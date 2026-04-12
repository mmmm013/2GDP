'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl'

interface Playlist {
  id: string
  name: string
  description?: string
}

interface PlaylistTrack {
  title: string
  artist?: string
  url?: string | null
  file_path?: string | null
}

function GiftPlaylistsPageContent() {
  const searchParams = useSearchParams()
  const playlistId = searchParams.get('playlist') ?? ''
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(!!playlistId)
  const [firstTrack, setFirstTrack] = useState<PlaylistTrack | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playlistId) return
    Promise.all([
      supabase.from('playlists').select('id, name, description').eq('id', playlistId).single(),
      // Try to get first track via playlist_tracks join, fall back gracefully
      supabase
        .from('playlist_tracks')
        .select('gpm_tracks(title, artist, url, file_path)')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: true })
        .limit(1),
    ]).then(([{ data: plData }, { data: ptData }]) => {
      setPlaylist(plData ?? null)
      if (ptData && ptData.length > 0) {
        const t = (ptData[0] as any)?.gpm_tracks
        if (t) setFirstTrack(t)
      }
      setLoading(false)
    })
  }, [playlistId])

  const audioUrl = firstTrack ? resolveAudioUrl(firstTrack.url || firstTrack.file_path || '') : ''

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}) }
  }

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
              {audioUrl && firstTrack ? (
                <div className="mt-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
                    Now previewing: {firstTrack.title}{firstTrack.artist ? ` · ${firstTrack.artist}` : ''}
                  </p>
                  <button
                    onClick={toggle}
                    className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl shadow-lg transition-all active:scale-95"
                    style={{ background: '#14b8a6', color: '#fff' }}
                    aria-label={playing ? 'Pause' : 'Play playlist preview'}
                  >
                    {playing ? '⏸' : '▶'}
                  </button>
                  <p className="text-white/30 text-[10px] mt-2 uppercase tracking-widest">
                    {playing ? 'Now Playing' : 'Tap to preview'}
                  </p>
                  <audio ref={audioRef} src={audioUrl} preload="metadata"
                    onEnded={() => setPlaying(false)} />
                </div>
              ) : (
                <p className="text-white/40 text-sm">
                  The full curated tracklist from G Putnam Music will be available here once activated.
                </p>
              )}
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
