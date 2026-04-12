'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl'
import {
  SECTION_LABELS,
  SECTION_BADGES,
  SectionTag,
} from '@/lib/kkut-sections'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Track {
  id: string
  title: string
  artist: string
  url?: string | null
  file_path?: string | null
  image?: string | null
}

interface SectionAudio {
  tag: SectionTag
  url: string     // signed or public URL for this section's audio
}

const EDGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

// ---------------------------------------------------------------------------
// Fetch a signed URL for one section via the play-m-kut edge function.
// Falls back to the k_kut_assets storage_path if the edge function fails.
// ---------------------------------------------------------------------------
async function fetchSectionUrl(pixPckId: string, tag: SectionTag): Promise<string> {
  if (EDGE_BASE) {
    try {
      const res = await fetch(`${EDGE_BASE}/functions/v1/play-m-kut`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pix_pck_id: pixPckId, tag }),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.signed_url) return json.signed_url
      }
    } catch {
      // fall through to storage_path lookup
    }
  }

  // Fallback: query k_kut_assets directly for the storage_path
  const { data } = await supabase
    .from('k_kut_assets')
    .select('storage_path')
    .eq('pix_pck_id', pixPckId)
    .eq('structure_tag', tag)
    .eq('status', 'active')
    .maybeSingle()

  if (data?.storage_path) return resolveAudioUrl(data.storage_path)
  return ''
}

// ---------------------------------------------------------------------------
// Section-based sequential player
// ---------------------------------------------------------------------------
function KutSectionPlayer({
  track,
  sections,
}: {
  track: Track
  sections: SectionAudio[]
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [idx, setIdx]           = useState(0)
  const [playing, setPlaying]   = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playError, setPlayError] = useState('')

  const current = sections[idx]

  // When section index changes, reset the audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current?.url) return
    audio.src = current.url
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    setPlayError('')
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, current?.url])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd  = () => {
      if (idx < sections.length - 1) {
        setIdx(i => i + 1)   // auto-advance to next section
      } else {
        setPlaying(false)    // all sections done
        setCurrentTime(0)
        setIdx(0)
      }
    }
    const onErr = () => { setPlayError('Audio unavailable for this section.'); setPlaying(false) }
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
  }, [idx, sections.length])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !current?.url) return
    if (playing) {
      audio.pause(); setPlaying(false)
    } else {
      setPlayError('')
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlayError('Tap play again to start'))
    }
  }, [playing, current?.url])

  const fmt = (s: number) =>
    !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div className="mt-6 rounded-2xl border border-amber-500/30 bg-black/40 p-5">
      {/* Section map */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {sections.map((s, i) => (
          <button
            key={s.tag}
            onClick={() => { setIdx(i); setPlaying(false) }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              i === idx
                ? 'bg-amber-500 text-black shadow-sm'
                : i < idx
                  ? 'bg-amber-900/40 text-amber-600/60'
                  : 'bg-white/10 text-white/40'
            }`}
            title={SECTION_LABELS[s.tag]}
          >
            {SECTION_BADGES[s.tag]}
          </button>
        ))}
      </div>

      {/* Now-playing label */}
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-bold mb-1">
        {playing ? `▶ ${SECTION_LABELS[current.tag]}` : `K-KUT · ${SECTION_LABELS[current.tag]}`}
        {sections.length > 1 && ` (${idx + 1} / ${sections.length})`}
      </p>
      <p className="text-white font-bold text-lg truncate">{track.title}</p>
      <p className="text-amber-400/80 text-sm mb-4 truncate">{track.artist}</p>

      {playError ? (
        <p className="text-red-400/80 text-sm mb-3">{playError}</p>
      ) : null}

      {current.url ? (
        <div className="flex items-center gap-3">
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
      ) : (
        <p className="text-white/40 text-sm">
          Section audio not yet available — check back shortly.
        </p>
      )}

      <audio ref={audioRef} preload="metadata" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Single-track fallback player (for old-format K-KUT links with no sections)
// ---------------------------------------------------------------------------
function KutFallbackPlayer({ audioUrl, title, artist }: { audioUrl: string; title: string; artist: string }) {
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

  const fmt = (s: number) =>
    !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

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
        <div className="flex items-center gap-3">
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
      )}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page content
// ---------------------------------------------------------------------------
function GiftSongsContent() {
  const searchParams = useSearchParams()
  const trackId   = searchParams.get('track')   ?? ''
  // Sections encoded as comma-separated tags: e.g. "V1,Ch1,V2,Ch2"
  const sectionsParam = searchParams.get('sections') ?? ''

  const [track, setTrack]   = useState<Track | null>(null)
  const [loading, setLoading] = useState(!!trackId)
  const [sectionAudios, setSectionAudios] = useState<SectionAudio[] | null>(null)
  const [sectionsLoading, setSectionsLoading] = useState(false)

  // Parse section tags from URL param
  const requestedSections = sectionsParam
    ? (sectionsParam.split(',').filter(Boolean) as SectionTag[])
    : []

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

  // If sections are requested, find the pix_pck_id for this track and fetch section URLs
  useEffect(() => {
    if (!trackId || requestedSections.length === 0) return
    setSectionsLoading(true)

    // Look up pix_pck for this track (via track_id column added in migration)
    supabase
      .from('pix_pck')
      .select('id')
      .eq('track_id', trackId)
      .eq('is_active', true)
      .maybeSingle()
      .then(async ({ data: pix }) => {
        if (!pix) {
          setSectionsLoading(false)
          return
        }
        const urls = await Promise.all(
          requestedSections.map(async (tag) => ({
            tag,
            url: await fetchSectionUrl(pix.id, tag),
          }))
        )
        setSectionAudios(urls)
        setSectionsLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, sectionsParam])

  const fallbackAudioUrl = track ? resolveAudioUrl(track.url || track.file_path || '') : ''

  return (
    <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
          K-KUT · Song
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#C8A882]">Your Sound</h1>
        <p className="mt-3 text-white/50 max-w-sm mx-auto text-sm">
          Someone sent you a K-KUT — a curated excerpt from a G Putnam Music track.
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

            {/* Section-based player (preferred) */}
            {requestedSections.length > 0 ? (
              sectionsLoading ? (
                <p className="text-white/40 text-sm mt-4 animate-pulse">Loading your K-KUT sections…</p>
              ) : sectionAudios && sectionAudios.length > 0 ? (
                <KutSectionPlayer track={track} sections={sectionAudios} />
              ) : fallbackAudioUrl ? (
                // Section files not yet uploaded — fall back to full track
                <KutFallbackPlayer audioUrl={fallbackAudioUrl} title={track.title} artist={track.artist} />
              ) : (
                <p className="text-white/40 text-sm mt-4">Section audio not yet available — check back shortly.</p>
              )
            ) : fallbackAudioUrl ? (
              // Old-format K-KUT (no sections in URL) — play full track
              <KutFallbackPlayer audioUrl={fallbackAudioUrl} title={track.title} artist={track.artist} />
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
