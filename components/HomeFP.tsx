'use client';

/**
 * HomeFP — GPM Featured Playlist (Home Page)
 *
 * Rules (locked by design spec):
 *  • Fetches GENERAL random GPM tracks from Supabase `tracks` table
 *  • Excludes: instrumental (INSTRO / INSTRUMENTAL in title), kids content,
 *              SYBC Band, Wounded & Willing (artists completely independent)
 *  • Shuffles into a 2-hour no-repeat queue (tracks played in last 2 hrs are skipped)
 *  • Auto-starts on mount — plays non-stop until user interacts (pause / skip)
 *  • Amber brand — #C8A882 / #D4A017 / #2A1506 / #1a1207
 *  • Single audio source — dispatches stop-all-audio before playing
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Radio } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface FPTrack {
  id: number | string;
  title: string;
  artist: string;
  url: string;
}

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

// Supabase storage base for resolving relative audio paths
const STORAGE_BASE =
  'https://lbzpfqarraegkghxwbah.supabase.co/storage/v1/object/public/tracks/';

// Excluded artists (case-insensitive match)
const EXCLUDED_ARTISTS = ['sybc', 'wounded', 'willing'];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function resolveUrl(raw: string): string {
  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  const filename = raw.split('/').pop()?.split('?')[0] ?? raw;
  return STORAGE_BASE + filename;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function isExcluded(track: FPTrack): boolean {
  const titleUp = (track.title ?? '').toUpperCase();
  const artistLo = (track.artist ?? '').toLowerCase();

  // No instrumentals
  if (titleUp.includes('INSTRO') || titleUp.includes('INSTRUMENTAL')) return true;

  // No kids
  if (titleUp.includes('KIDS') || titleUp.includes('KID TRACK')) return true;

  // No SYBC Band, Wounded & Willing
  for (const ex of EXCLUDED_ARTISTS) {
    if (artistLo.includes(ex)) return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function HomeFP() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tracks, setTracks] = useState<FPTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  // 2-hour no-repeat: map of track id → played-at timestamp
  const playedAtRef = useRef<Map<string, number>>(new Map());

  // ---------------------------------------------------------------------------
  // FETCH TRACKS
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function load() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setIsLoading(false);
        setError('Stream unavailable');
        return;
      }

      const sb = createClient(url, key);

      // Query a broad set — we'll filter client-side so we get enough tracks
      // for a 2+ hour session.  Limit 200 to keep payload manageable.
      const { data, error: dbErr } = await sb
        .from('tracks')
        .select('id, title, artist, url')
        .not('url', 'is', null)
        .neq('url', '')
        .limit(200);

      if (dbErr || !data || data.length === 0) {
        // Fallback: try gpm_tracks table (used by FPPixBar)
        const { data: alt } = await sb
          .from('gpm_tracks')
          .select('id, title, artist, audio_url')
          .not('audio_url', 'is', null)
          .neq('audio_url', '')
          .limit(200);

        if (alt && alt.length > 0) {
          const mapped: FPTrack[] = alt.map((r: Record<string, unknown>) => ({
            id: r.id as number,
            title: (r.title as string) ?? 'Unknown',
            artist: (r.artist as string) ?? 'G Putnam Music',
            url: resolveUrl((r.audio_url as string) ?? ''),
          }));
          const filtered = shuffleArray(mapped.filter((t) => !isExcluded(t) && t.url));
          setTracks(filtered);
        }
        setIsLoading(false);
        return;
      }

      const mapped: FPTrack[] = (data as Record<string, unknown>[]).map((r) => ({
        id: r.id as number,
        title: (r.title as string) ?? 'Unknown',
        artist: (r.artist as string) ?? 'G Putnam Music',
        url: resolveUrl((r.url as string) ?? ''),
      }));

      const filtered = shuffleArray(mapped.filter((t) => !isExcluded(t) && t.url));
      setTracks(filtered);
      setIsLoading(false);
    }

    load();
  }, []);

  // ---------------------------------------------------------------------------
  // AUTO-START once tracks are loaded
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isLoading && tracks.length > 0 && !isPlaying) {
      // Attempt autoplay — browser may block it
      const audio = audioRef.current;
      if (audio) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {
            // Browser blocked autoplay — show play button
            setAutoplayBlocked(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tracks.length]);

  // ---------------------------------------------------------------------------
  // NO-REPEAT QUEUE HELPER
  // ---------------------------------------------------------------------------

  const getNextIndex = useCallback(
    (from: number): number => {
      if (tracks.length === 0) return 0;
      const now = Date.now();

      // Clean stale history
      for (const [id, ts] of playedAtRef.current.entries()) {
        if (now - ts > TWO_HOURS_MS) playedAtRef.current.delete(id);
      }

      for (let i = 1; i <= tracks.length; i++) {
        const candidate = (from + i) % tracks.length;
        const id = String(tracks[candidate].id);
        if (!playedAtRef.current.has(id)) return candidate;
      }

      // All played in last 2 hours — reset and start over
      playedAtRef.current.clear();
      return (from + 1) % tracks.length;
    },
    [tracks]
  );

  // ---------------------------------------------------------------------------
  // AUDIO EVENT WIRING
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      if (tracks[queueIndex]) {
        playedAtRef.current.set(String(tracks[queueIndex].id), Date.now());
      }
      setQueueIndex((prev) => getNextIndex(prev));
    };
    const onError = () => {
      setError('Track unavailable — skipping…');
      setTimeout(() => {
        setQueueIndex((prev) => getNextIndex(prev));
        setError('');
      }, 800);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [queueIndex, tracks, getNextIndex]);

  // Play / pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, queueIndex]);

  // Stop other site players when this one starts
  useEffect(() => {
    if (isPlaying) {
      window.dispatchEvent(
        new CustomEvent('stop-all-audio', { detail: { source: 'home-fp' } })
      );
    }
  }, [isPlaying]);

  // Listen for other players taking over
  useEffect(() => {
    const stop = (e: CustomEvent) => {
      if (e.detail?.source === 'home-fp') return;
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('stop-all-audio', stop as EventListener);
    return () => window.removeEventListener('stop-all-audio', stop as EventListener);
  }, [isPlaying]);

  // ---------------------------------------------------------------------------
  // CONTROLS
  // ---------------------------------------------------------------------------

  const startOrToggle = useCallback(() => {
    setAutoplayBlocked(false);
    setIsPlaying((prev) => !prev);
  }, []);

  const skipNext = useCallback(() => {
    if (tracks[queueIndex]) {
      playedAtRef.current.set(String(tracks[queueIndex].id), Date.now());
    }
    setQueueIndex((prev) => getNextIndex(prev));
    setIsPlaying(true);
  }, [queueIndex, tracks, getNextIndex]);

  const skipPrev = useCallback(() => {
    setQueueIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
    setIsPlaying(true);
  }, [tracks.length]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  // ---------------------------------------------------------------------------
  // CURRENT TRACK
  // ---------------------------------------------------------------------------

  const current = tracks[queueIndex];

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="w-full py-10 px-4 flex items-center justify-center gap-3 text-[#C8A882]/60">
        <Radio size={18} className="animate-pulse" />
        <span className="text-sm tracking-widest uppercase">Loading GPM Stream…</span>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <div className="w-full py-6 px-4 md:py-8 md:px-6">
      <div className="max-w-md mx-auto md:max-w-none">

        {/* Stream identity */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A882]/70 font-bold">
            GPM Live Stream · 2-Hour No Repeat · All Original
          </span>
        </div>

        {/* Now-playing card */}
        <div className="bg-[#1a1207] rounded-2xl border border-[#5C3A1E]/40 overflow-hidden shadow-xl">

          {/* Track info */}
          <div className="px-6 pt-6 pb-4">
            {autoplayBlocked && (
              <p className="text-[#D4A017]/70 text-xs mb-3 tracking-wide">
                Tap play to start your non-stop GPM stream ↓
              </p>
            )}
            {error && (
              <p className="text-amber-400/70 text-xs mb-2">{error}</p>
            )}
            <p className="text-[10px] text-[#C8A882]/50 uppercase tracking-widest mb-1">
              {isPlaying ? 'Now Streaming' : 'Ready'}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight truncate">
              {current.title}
            </h2>
            <p className="text-[#C8A882]/70 text-sm mt-0.5 truncate">{current.artist}</p>
          </div>

          {/* Seek bar */}
          <div className="px-6 pb-2">
            <div className="flex items-center gap-2 text-xs text-[#C8A882]/40">
              <span className="w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 cursor-pointer accent-[#D4A017]"
                aria-label="Seek"
                style={{
                  background: `linear-gradient(to right, #D4A017 ${duration ? (currentTime / duration) * 100 : 0}%, #3a2510 0%)`,
                }}
              />
              <span className="w-8 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 pb-6 pt-2 flex items-center justify-between">
            <button
              onClick={skipPrev}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C8A882]/60 hover:text-[#C8A882] transition-colors"
              aria-label="Previous track"
            >
              <SkipBack size={20} />
            </button>

            {/* Main play/pause */}
            <button
              onClick={startOrToggle}
              className="w-14 h-14 rounded-full bg-[#D4A017] hover:bg-[#E8C030] active:scale-95 flex items-center justify-center shadow-lg transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={24} className="text-[#1a1207]" />
                : <Play size={24} className="text-[#1a1207] ml-0.5" />
              }
            </button>

            <button
              onClick={skipNext}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C8A882]/60 hover:text-[#C8A882] transition-colors"
              aria-label="Next track"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>

        {/* Footer meta */}
        <p className="text-center text-[10px] text-[#C8A882]/30 mt-4 tracking-wide">
          {tracks.length} tracks · 2-hr no-repeat · Completely independent from SYBC Band, Wounded & Willing
        </p>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={current?.url ?? ''}
        preload="auto"
      />
    </div>
  );
}
