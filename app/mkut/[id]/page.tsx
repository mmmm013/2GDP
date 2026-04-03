'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

// mKUT prefab container — receives a canonical mKUT ID in the form:
//   mkut-{type}-{itemId}-{timestamp}  (e.g. mkut-sti-abc123-1712000000)
//
// This is a PREFAB SHELL. Content slots are populated from the public
// mKUT record. Audio is streamed via the play-m-kut edge function.
// The container itself is fixed; only the content slots change.

type MKutRecord = {
  id: string
  title: string
  artist: string
  structure_tag: 'Verse' | 'BR' | 'Ch'
  duration_ms: number | null
  theme: 'nature' | 'cosmos' | 'minimal'
  gift_note: string | null
  gifted_by: string | null
}

// Derive a display label from the canonical structure tag
const structureLabel = (tag: string) => {
  switch (tag) {
    case 'Verse': return 'Verse'
    case 'BR':    return 'Bridge'
    case 'Ch':    return 'Chorus'
    default:      return tag
  }
}

// Parse canonical mKUT ID: mkut-{type}-{pixPckId}-{structTag}-{base36ts}
// Returns { pix_pck_id, tag } for the edge function's (pix_pck_id + tag) path.
// Falls back to sending raw k_kut_id if the format is unrecognised (UUID path).
type ParsedMkutId =
  | { mode: 'pix'; pix_pck_id: string; tag: 'Verse' | 'BR' | 'Ch' }
  | { mode: 'raw'; k_kut_id: string }

const STRUCT_MAP: Record<string, 'Verse' | 'BR' | 'Ch'> = {
  verse: 'Verse',
  br:    'BR',
  ch:    'Ch',
}

function parseMkutId(id: string): ParsedMkutId {
  // canonical: mkut-{type}-{pixPckId}-{structTag}-{ts}
  const parts = id.split('-')
  if (parts.length >= 5 && parts[0] === 'mkut') {
    // parts[1] = type (sti/bti/fp), parts[2] = pixPckId, parts[3] = structTag, rest = ts
    const structRaw = parts[3].toLowerCase()
    const tag = STRUCT_MAP[structRaw]
    if (tag) {
      return { mode: 'pix', pix_pck_id: parts[2], tag }
    }
  }
  // Fallback: treat as UUID
  return { mode: 'raw', k_kut_id: id }
}

// Resolve edge base URL — NEXT_PUBLIC_ env vars are safe in the browser
const EDGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

export default function MKutPlayer() {
  const routeParams = useParams<{ id: string }>()
  const id = routeParams?.id ?? ''
  const [mkut, setMkut]           = useState<MKutRecord | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [status, setStatus]       = useState<string>('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid mKUT id.')
      setLoading(false)
      return
    }

    if (!EDGE_BASE) {
      setError('Player configuration missing.')
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const parsed = parseMkutId(id)
    const edgeBody = parsed.mode === 'pix'
      ? { pix_pck_id: parsed.pix_pck_id, tag: parsed.tag }
      : { k_kut_id: parsed.k_kut_id }

    fetch(`${EDGE_BASE}/functions/v1/play-m-kut`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edgeBody),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error ?? `HTTP ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        // signed_url is at root; meta fields are nested under data.meta
        const meta = data.meta ?? {}
        setStreamUrl(data.signed_url ?? null)
        setMkut({
          id,
          title:         data.title         ?? meta.title        ?? 'Untitled',
          artist:        data.artist        ?? meta.artist       ?? 'G Putnam Music',
          structure_tag: data.structure_tag ?? meta.structure_tag ?? 'Verse',
          duration_ms:   data.duration_ms   ?? meta.duration_ms  ?? null,
          theme:         data.theme         ?? 'nature',
          gift_note:     data.gift_note     ?? null,
          gifted_by:     data.gifted_by     ?? null,
        })
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration)
      }
    }
    const onEnded  = () => { setIsPlaying(false); setProgress(1) }
    const onPlay   = () => setIsPlaying(true)
    const onPause  = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended',  onEnded)
    audio.addEventListener('play',   onPlay)
    audio.addEventListener('pause',  onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended',  onEnded)
      audio.removeEventListener('play',   onPlay)
      audio.removeEventListener('pause',  onPause)
    }
  }, [streamUrl])

  // ---------------------------------------------------------------------------
  // Controls
  // ---------------------------------------------------------------------------
  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || !streamUrl) return

    if (isPlaying) {
      audio.pause()
    } else {
      setStatus('')
      try {
        await audio.play()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Playback blocked'
        setStatus(msg.includes('user') ? 'Tap play again to start.' : msg)
        setIsPlaying(false)
      }
    }
  }

  const replay = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const share = async () => {
    const url = `${window.location.origin}/mkut/${id}`
    if (navigator.share) {
      await navigator.share({ title: mkut?.title ?? 'mKUT', url }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url).catch(() => {})
      setStatus('Link copied!')
      setTimeout(() => setStatus(''), 2000)
    }
  }

  // ---------------------------------------------------------------------------
  // Render states
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="mkut-page min-h-screen flex items-center justify-center">
        <div className="mkut-loader">
          <span className="dot dot-a" />
          <span className="dot dot-b" />
          <span className="dot dot-c" />
        </div>
        <style jsx>{loaderStyles}</style>
        <style jsx>{pageStyles}</style>
      </div>
    )
  }

  if (error || !mkut) {
    return (
      <div className="mkut-page min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#4a8060] text-sm font-semibold uppercase tracking-widest">mKUT</p>
          <p className="mt-3 text-[#2a4a38]/70 text-sm">{error ?? 'This mKUT could not be found.'}</p>
        </div>
        <style jsx>{pageStyles}</style>
      </div>
    )
  }

  const durationSec = mkut.duration_ms ? Math.round(mkut.duration_ms / 1000) : null

  return (
    <div className="mkut-page min-h-screen flex items-center justify-center px-4 py-12">
      {/* Audio element — hidden */}
      {streamUrl && (
        <audio
          ref={audioRef}
          src={streamUrl}
          preload="metadata"
        />
      )}

      <div className="mkut-capsule max-w-sm w-full">
        {/* Header badge */}
        <div className="flex items-center justify-between mb-5">
          <span className="badge-mkut">mKUT</span>
          <span className="badge-structure">{structureLabel(mkut.structure_tag)}</span>
        </div>

        {/* Ambient visual — prefab nature/cosmos orbs */}
        <div className="ambient" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
          <span className="leaf leaf-a" />
          <span className="leaf leaf-b" />
        </div>

        {/* Track info */}
        <div className="track-info mt-4">
          <h1 className="track-title">{mkut.title}</h1>
          <p className="track-artist">{mkut.artist}</p>
          {durationSec && (
            <p className="track-duration">{durationSec}s excerpt</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="progress-wrap mt-5" aria-hidden="true">
          <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>

        {/* Controls */}
        <div className="controls mt-5">
          <button
            className="ctrl-btn ctrl-replay"
            onClick={replay}
            aria-label="Replay from start"
            title="Replay"
          >
            ↺
          </button>

          <button
            className={`ctrl-btn ctrl-play ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            className="ctrl-btn ctrl-share"
            onClick={share}
            aria-label="Share this mKUT"
            title="Share"
          >
            ↗
          </button>
        </div>

        {/* Status message */}
        {status && (
          <p className="status-msg">{status}</p>
        )}

        {/* Gift note — only shown if present */}
        {mkut.gift_note && (
          <div className="gift-note">
            {mkut.gifted_by && (
              <p className="gift-from">From {mkut.gifted_by}</p>
            )}
            <p className="gift-text">&ldquo;{mkut.gift_note}&rdquo;</p>
          </div>
        )}

        {/* GPM wordmark */}
        <p className="gpm-mark">G Putnam Music</p>
      </div>

      <style jsx>{pageStyles}</style>
      <style jsx>{capsuleStyles}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Styles — split for readability
// ---------------------------------------------------------------------------

const pageStyles = `
  .mkut-page {
    background:
      radial-gradient(1100px 480px at 55% -8%, rgba(73, 175, 120, 0.16), transparent 58%),
      linear-gradient(155deg, #eaf8f2 0%, #dff0e8 45%, #f3ede3 100%);
  }
`

const loaderStyles = `
  .mkut-loader {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #4a8060;
    animation: pulse 1.2s ease-in-out infinite;
  }
  .dot-b { animation-delay: 0.2s; }
  .dot-c { animation-delay: 0.4s; }
  @keyframes pulse {
    0%, 100% { opacity: 0.35; transform: scale(0.85); }
    50%       { opacity: 1;    transform: scale(1.1); }
  }
`

const capsuleStyles = `
  .mkut-capsule {
    background: rgba(255, 255, 255, 0.76);
    border: 1px solid rgba(50, 120, 80, 0.18);
    border-radius: 24px;
    padding: 28px 24px 24px;
    box-shadow: 0 20px 52px rgba(15, 60, 35, 0.14);
    backdrop-filter: blur(6px);
    position: relative;
    overflow: hidden;
  }
  .badge-mkut {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #2a6e48;
    background: rgba(50, 140, 80, 0.1);
    border: 1px solid rgba(50, 140, 80, 0.22);
    border-radius: 999px;
    padding: 3px 10px;
  }
  .badge-structure {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #5a7463;
  }

  /* Ambient orbs */
  .ambient {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .orb {
    position: absolute;
    border-radius: 999px;
    animation: drift 3s ease-in-out infinite;
  }
  .orb-a {
    width: 80px; height: 80px;
    right: -20px; top: -20px;
    background: radial-gradient(circle, rgba(80, 180, 120, 0.22), transparent 70%);
    animation-delay: 0s;
  }
  .orb-b {
    width: 60px; height: 60px;
    left: -10px; bottom: 30px;
    background: radial-gradient(circle, rgba(100, 160, 220, 0.18), transparent 70%);
    animation-delay: 0.8s;
  }
  .orb-c {
    width: 40px; height: 40px;
    right: 20%; top: 40%;
    background: radial-gradient(circle, rgba(200, 168, 130, 0.14), transparent 70%);
    animation-delay: 1.4s;
  }
  .leaf {
    position: absolute;
    width: 10px; height: 18px;
    border-radius: 10px 10px 2px 10px;
    background: linear-gradient(180deg, rgba(100, 185, 130, 0.3), rgba(50, 120, 75, 0.2));
    transform-origin: bottom center;
    animation: sway 2.4s ease-in-out infinite;
  }
  .leaf-a { left: 12%; bottom: 18px; animation-delay: 0s; }
  .leaf-b { right: 14%; bottom: 14px; animation-delay: 0.5s; }

  @keyframes drift {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-6deg); }
    50%       { transform: rotate(8deg); }
  }

  /* Track info */
  .track-info { position: relative; z-index: 1; }
  .track-title {
    font-size: 1.35rem;
    font-weight: 900;
    color: #1a3a28;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
  .track-artist {
    margin-top: 3px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #3a6a50;
  }
  .track-duration {
    margin-top: 2px;
    font-size: 0.72rem;
    color: #7a9a85;
    letter-spacing: 0.08em;
  }

  /* Progress bar */
  .progress-wrap {
    height: 3px;
    background: rgba(50, 120, 80, 0.14);
    border-radius: 999px;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3a9e65, #74c497);
    border-radius: 999px;
    transition: width 0.25s linear;
  }

  /* Controls */
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    position: relative;
    z-index: 1;
  }
  .ctrl-btn {
    border: none;
    cursor: pointer;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s, box-shadow 0.15s;
    font-size: 1.1rem;
  }
  .ctrl-btn:active { transform: scale(0.92); }
  .ctrl-replay, .ctrl-share {
    width: 38px; height: 38px;
    background: rgba(50, 140, 80, 0.1);
    color: #2a6e48;
    border: 1px solid rgba(50, 140, 80, 0.2);
    font-size: 1rem;
  }
  .ctrl-play {
    width: 52px; height: 52px;
    background: linear-gradient(145deg, #3a9e65, #2a7a4e);
    color: #fff;
    font-size: 1.25rem;
    box-shadow: 0 6px 18px rgba(40, 120, 70, 0.3);
  }
  .ctrl-play.playing {
    background: linear-gradient(145deg, #2a7a4e, #1c5c38);
  }

  /* Status */
  .status-msg {
    margin-top: 10px;
    text-align: center;
    font-size: 0.7rem;
    color: #b08020;
    letter-spacing: 0.06em;
    position: relative;
    z-index: 1;
  }

  /* Gift note */
  .gift-note {
    margin-top: 18px;
    padding: 12px 14px;
    border-left: 2px solid rgba(50, 120, 80, 0.3);
    background: rgba(50, 120, 80, 0.05);
    border-radius: 0 10px 10px 0;
    position: relative;
    z-index: 1;
  }
  .gift-from {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #3a6a50;
    margin-bottom: 4px;
  }
  .gift-text {
    font-size: 0.82rem;
    color: #2a4a38;
    font-style: italic;
    line-height: 1.5;
  }

  /* GPM wordmark */
  .gpm-mark {
    margin-top: 20px;
    text-align: center;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #7a9a85;
    position: relative;
    z-index: 1;
  }
`
