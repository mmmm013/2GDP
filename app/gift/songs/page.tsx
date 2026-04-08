'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
  duration?: number | null
}

function KutPlayer({ audioUrl, title, artist }: { audioUrl: string; title: string; artist: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd  = () => { setPlaying(false); setCurrentTime(0) }
    const onErr  = () => { setError('Audio unavailable — check back soon'); setPlaying(false) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onErr)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onErr)
    }
  }, [audioUrl])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => setError('Tap play to start')) }
  }

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  return (
    <div className="mt-6 rounded-2xl border border-amber-500/30 bg-black/40 p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-1">
        {playing ? '▶ NOW PLAYING' : 'K-KUT · SWEET SPOT'}
      </p>
      <p className="text-white font-bold text-lg truncate">{title}</p>
      <p className="text-amber-400/80 text-sm mb-4 truncate">{artist}</p>

      {error ? (
        <p className="text-red-400/80 text-sm">{error}</p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={toggle}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all active:scale-95"
              style={{ background: '#D4A017', color: '#1a1207' }}
              aria-label={playing ? 'Pause' : 'Play K-KUT'}
            >
              {playing ? '⏸' : '▶'}
            </button>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={e => {
                  const t = parseFloat(e.target.value)
                  if (audioRef.current) audioRef.current.currentTime = t
                  setCurrentTime(t)
                }}
                className="w-full h-1 rounded-full appearance-none cursor-pointer accent-amber-400"
                aria-label="Seek"
              />
              <div className="flex justify-between text-[10px] text-white/30 mt-1">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  )
}

function GiftSongsContent() {
  const searchParams = useSearchParams()
  const trackId = searchParams.get('track') ?? ''
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(!!trackId)

  useEffect(() => {
    if (!trackId) return
    supabase
      .from('gpm_tracks')
      .select('id, title, artist, url, file_path, image, duration')
      .eq('id', trackId)
      .single()
      .then(({ data }) => {
        setTrack(data ?? null)
        setLoading(false)
      })
  }, [trackId])

  const audioUrl = track ? resolveAudioUrl(track.url || track.file_path || '') : ''

  return (
    <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
          K-KUT · Song
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#C8A882]">Your Sound</h1>
        <p className="mt-3 text-white/50 max-w-sm mx-auto text-sm">
          Someone sent you a K-KUT — a curated Sweet Spot from a G Putnam Music track.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        {loading ? (
          <p className="text-white/40 text-sm py-8 animate-pulse">Loading track…</p>
        ) : track ? (
          <>
            {track.image ? (
              <img src={track.image} alt={track.title} className="w-24 h-24 mx-auto rounded-full object-cover mb-5 shadow-lg shadow-amber-500/20" />
            ) : (
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-amber-500/25">♪</div>
            )}
            <h2 className="text-2xl font-bold text-white mb-1">{track.title}</h2>
            <p className="text-amber-400 font-medium mb-2">{track.artist}</p>
            {audioUrl ? (
              <KutPlayer audioUrl={audioUrl} title={track.title} artist={track.artist} />
            ) : (
              <p className="text-white/40 text-sm mt-4">Audio coming soon — check back shortly.</p>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-amber-500/25">♪</div>
            <p className="text-white/60 text-sm mb-6">
              Track not found. The K-KUT link may have expired or the track is not yet available.
            </p>
          </>
        )}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/kupid" className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity">
          Get Your Own K-KUT
        </Link>
        <Link href="/kleigh" className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors">
          Live Audio Vault
        </Link>
      </div>
    </section>
  )
}

export default function GiftSongsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />
      <Suspense fallback={<div className="pt-24 text-center text-white/40 text-sm">Loading…</div>}>
        <GiftSongsContent />
      </Suspense>
      <Footer />
    </main>
  )
}
