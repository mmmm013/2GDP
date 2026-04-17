'use client';

/**
 * KutAudioPlayer — persistent fixed-bottom audio player for the K-KUT site.
 *
 * Listens for `kkut-play` custom events dispatched by KutHorizontalScroll,
 * FrontPanel, or any other component on the page. Takes exclusive control of
 * audio playback (one track at a time) and emits `kkut-playing`, `kkut-paused`,
 * and `kkut-ended` events so other components can sync their visual state.
 *
 * Event shapes:
 *   kkut-play    → CustomEvent<KkutPlayDetail>  (inbound — starts playback)
 *   kkut-playing → CustomEvent<{ url: string }> (outbound — playback started)
 *   kkut-paused  → CustomEvent<{ url: string }> (outbound — playback paused / error)
 *   kkut-ended   → CustomEvent<{ url: string }> (outbound — track finished naturally)
 *
 * Design system: uses k-kut CSS variables (--bg, --surface-2, --border, etc.)
 * and per-invention accent colours (KK=amber, mK=brown/tan, KPD=rose).
 *
 * Mobile: preload="none" to avoid iOS Safari auto-preload issues; play() is
 * only called after explicit user gesture via kkut-play event or Play button.
 *
 * Accessibility: all interactive controls have aria-labels, role="region" on
 * wrapper, keyboard-operable seek/volume sliders.
 */

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import {
  Play, Pause, Volume2, VolumeX, AlertCircle,
} from 'lucide-react';

// ─── Public event detail type ────────────────────────────────────────────────
export interface KkutPlayDetail {
  /** Fully-resolved MP3 URL from Supabase */
  url: string;
  title: string;
  artist: string;
  type: 'K-KUT' | 'mK' | 'KPD';
  /** K-kUpId (KPD) only */
  romanceLevel?: string;
}

// ─── Per-invention colour tokens ─────────────────────────────────────────────
const COLORS: Record<KkutPlayDetail['type'], { bar: string; badge: string; glow: string }> = {
  'K-KUT': {
    bar:   '#FBBF24',
    badge: 'border-amber-400/50 text-amber-300 bg-amber-400/8',
    glow:  'rgba(251,191,36,0.15)',
  },
  'mK': {
    bar:   '#8B5E3C',
    badge: 'border-[#8B5E3C]/60 text-[#C8A882] bg-[#8B5E3C]/8',
    glow:  'rgba(139,94,60,0.15)',
  },
  'KPD': {
    bar:   '#FB7185',
    badge: 'border-rose-400/50 text-rose-300 bg-rose-400/8',
    glow:  'rgba(251,113,133,0.15)',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function KutAudioPlayer() {
  const [track, setTrack]           = useState<KkutPlayDetail | null>(null);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [volume, setVolume]         = useState(0.8);
  const [isMuted, setIsMuted]       = useState(false);
  const [error, setError]           = useState('');

  const audioRef     = useRef<HTMLAudioElement>(null);
  const seekingRef   = useRef(false);
  // Track which URL is "ours" so stale event callbacks don't clobber new tracks
  const activeUrlRef = useRef('');
  // Stable refs for values needed inside long-lived event listeners
  const volumeRef    = useRef(0.8);
  const isMutedRef   = useRef(false);
  const isPlayingRef = useRef(false);

  // ── Dispatch outbound event helpers ──────────────────────────────────────
  const emit = (name: string, url: string) =>
    window.dispatchEvent(new CustomEvent(name, { detail: { url } }));

  // ── Load and play a new track ─────────────────────────────────────────────
  const loadAndPlay = (detail: KkutPlayDetail) => {
    const audio = audioRef.current;
    if (!audio) return;

    activeUrlRef.current = detail.url;
    setTrack(detail);
    setError('');
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    isPlayingRef.current = false;

    audio.pause();
    audio.src = detail.url;
    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    audio.load();

    // play() may be blocked on first gesture; caller always uses kkut-play
    // after a real user interaction, so NotAllowedError is only edge-case.
    const playUrl = detail.url;
    audio
      .play()
      .then(() => {
        if (activeUrlRef.current !== playUrl) return; // superseded
        setIsPlaying(true);
        setIsLoading(false);
        emit('kkut-playing', playUrl);
      })
      .catch((err: Error) => {
        if (activeUrlRef.current !== playUrl) return;
        setIsLoading(false);
        setIsPlaying(false);
        setError(
          err?.name === 'NotAllowedError'
            ? 'Tap ▶ to play — browser requires a user tap first'
            : 'Audio unavailable. Check connection and try again.',
        );
        emit('kkut-paused', playUrl);
      });
  };

  // ── Listen for inbound kkut-play and kkut-pause-request events ────────────
  useEffect(() => {
    const onKkutPlay = (e: Event) => {
      loadAndPlay((e as CustomEvent<KkutPlayDetail>).detail);
    };
    const onKkutPauseRequest = () => {
      const audio = audioRef.current;
      // Use the ref so this handler stays stable without re-registering
      if (audio && isPlayingRef.current) audio.pause();
    };
    window.addEventListener('kkut-play',          onKkutPlay);
    window.addEventListener('kkut-pause-request', onKkutPauseRequest);
    return () => {
      window.removeEventListener('kkut-play',          onKkutPlay);
      window.removeEventListener('kkut-pause-request', onKkutPauseRequest);
    };
    // loadAndPlay reads volume/isMuted via refs (volumeRef/isMutedRef), so
    // this effect is stable and never needs to re-register its listeners.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Wire audio element events ─────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay     = () => setIsLoading(false);
    const onTimeUpdate  = () => {
      if (!seekingRef.current) setCurrentTime(audio.currentTime);
    };
    const onDuration    = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onPlay        = () => { setIsPlaying(true);  isPlayingRef.current = true; };
    const onPause       = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (activeUrlRef.current) emit('kkut-paused', activeUrlRef.current);
    };
    const onEnded       = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentTime(0);
      const url = activeUrlRef.current;
      if (url) emit('kkut-ended', url);
    };
    const onError       = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError('Audio unavailable — check connection or try another track.');
      if (activeUrlRef.current) emit('kkut-paused', activeUrlRef.current);
    };

    audio.addEventListener('canplay',        onCanPlay);
    audio.addEventListener('timeupdate',     onTimeUpdate);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('ended',          onEnded);
    audio.addEventListener('error',          onError);

    return () => {
      audio.removeEventListener('canplay',        onCanPlay);
      audio.removeEventListener('timeupdate',     onTimeUpdate);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.removeEventListener('ended',          onEnded);
      audio.removeEventListener('error',          onError);
      // Cleanup on unmount — release media resources
      audio.pause();
      audio.src = '';
    };
  }, []); // wire once; callbacks use refs for current values

  // ── Volume sync — keep ref in sync too ───────────────────────────────────
  useEffect(() => {
    volumeRef.current  = volume;
    isMutedRef.current = isMuted;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Manual play/pause toggle ──────────────────────────────────────────────
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    setError('');

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .then(() => emit('kkut-playing', track.url))
        .catch((err: Error) => {
          setError(
            err?.name === 'NotAllowedError'
              ? 'Browser requires a tap first — please try again.'
              : 'Audio unavailable.',
          );
        });
    }
  };

  // ── Seek ──────────────────────────────────────────────────────────────────
  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const val = parseFloat(e.target.value);
    seekingRef.current = true;
    setCurrentTime(val);
    audio.currentTime = val;
    // Release seekingRef after browser has settled currentTime
    requestAnimationFrame(() => { seekingRef.current = false; });
  };

  // ── Volume ────────────────────────────────────────────────────────────────
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => setIsMuted((m) => !m);

  // ── Nothing to show until a track has been requested ─────────────────────
  if (!track) return null;

  const c       = COLORS[track.type];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayVol = isMuted ? 0 : volume;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 select-none"
      style={{
        background: `linear-gradient(to top, var(--bg,#030712) 70%, transparent)`,
        borderTop: '1px solid var(--border,#1a2332)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: `0 -4px 40px ${c.glow}`,
      }}
      role="region"
      aria-label="K-KUT Audio Player"
    >
      {/* ── Thin progress rail ── */}
      <div className="h-0.5 w-full bg-white/5" aria-hidden="true">
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            backgroundColor: c.bar,
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* ── Main controls row ── */}
      <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-2.5">

        {/* Invention badge — hidden on very small screens */}
        <span
          className={`hidden sm:block text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-widest flex-shrink-0 ${c.badge}`}
        >
          {track.type === 'K-KUT' ? 'KK' : track.type}
        </span>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-bold leading-tight truncate"
            style={{ color: c.bar }}
          >
            {track.title}
          </p>
          <p className="text-[10px] text-[var(--text-muted,#64748b)] leading-tight truncate">
            {track.artist}
            {track.romanceLevel ? ` · ${track.romanceLevel}` : ''}
          </p>
        </div>

        {/* Time display — desktop only */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0 font-mono">
          <span className="text-[10px] text-[var(--text-muted,#64748b)] w-8 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <span className="text-[10px] text-[var(--text-subtle,#374151)]">/</span>
          <span className="text-[10px] text-[var(--text-muted,#64748b)] w-8 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Seek slider — desktop */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration}
          className="hidden sm:block flex-1 max-w-[180px] h-1 cursor-pointer appearance-none rounded-full"
          style={{ accentColor: c.bar }}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />

        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: c.bar, color: 'var(--bg,#030712)' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          aria-pressed={isPlaying}
        >
          {isLoading ? (
            <span
              className="block w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin"
              aria-hidden="true"
            />
          ) : isPlaying ? (
            <Pause size={16} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={16} fill="currentColor" className="ml-0.5" aria-hidden="true" />
          )}
        </button>

        {/* Volume — desktop only */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={toggleMute}
            className="p-1 rounded text-[var(--text-muted,#64748b)] hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            aria-pressed={isMuted}
          >
            {isMuted || displayVol === 0
              ? <VolumeX size={14} aria-hidden="true" />
              : <Volume2 size={14} aria-hidden="true" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={displayVol}
            onChange={handleVolumeChange}
            className="w-16 h-1 cursor-pointer appearance-none rounded-full"
            style={{ accentColor: c.bar }}
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={displayVol}
          />
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div
          className="flex items-center justify-center gap-1.5 px-4 pb-2 text-[10px] text-amber-400"
          role="alert"
        >
          <AlertCircle size={10} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Mobile seek row ── */}
      <div className="flex sm:hidden items-center gap-2 px-4 pb-2">
        <span className="text-[10px] text-[var(--text-muted,#64748b)] w-7 tabular-nums font-mono">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration}
          className="flex-1 h-1 cursor-pointer appearance-none rounded-full"
          style={{ accentColor: c.bar }}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
        <span className="text-[10px] text-[var(--text-muted,#64748b)] w-7 tabular-nums font-mono text-right">
          {formatTime(duration)}
        </span>
      </div>

      {/* Hidden audio element — preload="none" for iOS Safari */}
      <audio ref={audioRef} preload="none" aria-hidden="true" />
    </div>
  );
}
