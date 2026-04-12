'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl'

interface Track {
  id: string
  title: string
  artist: string
  url?: string | null
  file_path?: string | null
  image?: string | null
}

function GiftBehindPageContent() {
  const searchParams = useSearchParams()
  const trackId = searchParams.get('track') ?? ''
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(!!trackId)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!trackId) return
    supabase
      .from('gpm_tracks')
      .select('id, title, artist, url, file_path, image')
      .eq('id', trackId)
      .single()
      .then(({ data }) => {
        setTrack(data ?? null)
        setLoading(false)
      })
  }, [trackId])

  const audioUrl = track ? resolveAudioUrl(track.url || track.file_path || '') : ''

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
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-4">
            K-KUT · Behind The Music
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">The Story</h1>
          <p className="mt-3 text-white/50 max-w-sm mx-auto text-sm">
            Someone shared a K-KUT story with you — an intimate look behind the music.
          </p>
        </div>

        {/* Story card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          {loading ? (
            <p className="text-white/40 text-sm py-8 animate-pulse">Loading story…</p>
          ) : track ? (
            <>
              {track.image ? (
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-20 h-20 mx-auto rounded-full object-cover mb-5 shadow-lg shadow-purple-500/20"
                />
              ) : (
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-purple-500/25">
                  ◎
                </div>
              )}
              <h2 className="text-2xl font-bold text-white mb-1">{track.title}</h2>
              <p className="text-purple-400 font-medium mb-4">{track.artist}</p>
              <p className="text-white/50 text-sm mb-4">
                Hear the track while you explore the story behind it.
              </p>
              {audioUrl && (
                <div className="mt-2">
                  <button
                    onClick={toggle}
                    className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl shadow-lg transition-all active:scale-95"
                    style={{ background: '#7c3aed', color: '#fff' }}
                    aria-label={playing ? 'Pause' : 'Play track'}
                  >
                    {playing ? '⏸' : '▶'}
                  </button>
                  <p className="text-white/30 text-[10px] mt-2 uppercase tracking-widest">
                    {playing ? 'Now Playing' : 'Tap to play'}
                  </p>
                  <audio ref={audioRef} src={audioUrl} preload="metadata"
                    onEnded={() => setPlaying(false)} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-purple-500/25">
                ◎
              </div>
              <p className="text-white/60 text-sm">
                The behind-the-music story for this K-KUT is loading. Once activated, this space reveals the creative context, studio notes, and personal reflections from the artist.
              </p>
            </>
          )}
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

export default function GiftBehindPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-white/40 text-sm">Loading…</div>}>
      <GiftBehindPageContent />
    </Suspense>
  )
}
