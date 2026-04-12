'use client';
/**
 * HomeFP — GPM Featured Playlist (Home Page)
 *
 * Rules (locked by design spec):
 * • Fetches GENERAL random GPM tracks from Supabase `tracks` table
 * • Excludes: instrumental (INSTRO / INSTRUMENTAL in title), kids content,
 *   SYBC Band, Wounded & Willing (artists completely independent)
 * • Shuffles into a 2-hour no-repeat queue (tracks played in last 2 hrs are skipped)
 * • Auto-starts on mount — plays non-stop until user interacts (pause / skip)
 * • Amber brand — #C8A882 / #D4A017 / #2A1506 / #1a1207
 * • Single audio source — dispatches stop-all-audio before playing
 *
 * STREAMING MODEL:
 * • Primary: resolves playback URL via Edge Function get-stream-url (signed URL)
 * • Fallback: uses DB url field (immediate playback)
 * • Last Resort: Skip and show error message
 */
import { useState, useEffect, useRef, useCallback, type ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Radio } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
<<<<<<< HEAD
import { safePlay } from '@/lib/audio/safePlay';
import { AUDIO_UI_MESSAGES } from '@/lib/audio/messages';
=======
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';
>>>>>>> origin/copilot/fix-audio-playback-issues

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
interface FPTrack {
  id: number | string;
  title: string;
  artist: string;
  /** Stream URL used for playback. */
  url: string;
}

type RawTrack = {
  id: number | string;
  title?: string | null;
  artist?: string | null;
  file_path?: string | null;
  url?: string | null;
};

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const EXCLUDED_ARTISTS = ['sybc', 'wounded', 'willing'];
const STREAM_BUCKET = 'tracks';

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
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

function isExcluded(track: { title?: string | null; artist?: string | null }): boolean {
  const titleUp = (track.title ?? '').toUpperCase();
  const artistLo = (track.artist ?? '').toLowerCase();
  if (titleUp.includes('INSTRO') || titleUp.includes('INSTRUMENTAL')) return true;
  if (titleUp.includes('KIDS') || titleUp.includes('KID TRACK')) return true;
  for (const ex of EXCLUDED_ARTISTS) {
    if (artistLo.includes(ex)) return true;
  }
  return false;
}

async function resolveSignedStreamUrl(params: {
  trackId: string | number;
  supabaseUrl: string;
  supabaseAnonKey: string;
  bucket: string;
}): Promise<string> {
  const { trackId, supabaseUrl, supabaseAnonKey, bucket } = params;
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/get-stream-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ track_id: trackId, bucket }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.url) return json.url;
  } catch (err) {
    console.error('Signing error:', err);
  }
  return '';
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
  const playedAtRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    async function load() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
        setIsLoading(false);
        setError('Stream configuration missing');
        return;
      }
      const sb = createClient(supabaseUrl, anonKey);
      
      const { data, error: dbErr } = await sb
        .from('tracks')
        .select('id, title, artist, file_path, url')
        .limit(300);

      let raw: RawTrack[] = data || [];
      if (dbErr || raw.length === 0) {
        const { data: alt } = await sb
          .from('gpm_tracks')
          .select('id, title, artist, file_path, url')
          .limit(300);
        raw = alt || [];
      }

      const filteredRaw = shuffleArray(raw.filter((t) => !isExcluded(t)));
      
      const resolved = await Promise.all(
        filteredRaw.map(async (t) => {
          const title = t.title ?? 'Unknown';
          const artist = t.artist ?? 'G Putnam Music';
          
          // 1) Try Signed URL if file_path exists
          if (t.file_path) {
            const signed = await resolveSignedStreamUrl({
              trackId: t.id,
              supabaseUrl,
              supabaseAnonKey: anonKey,
              bucket: STREAM_BUCKET,
            });
            if (signed) return { id: t.id, title, artist, url: signed };
          }
          
          // 2) Fallback: resolve via canonical resolver (handles relative paths too)
          const resolved = resolveAudioUrl(t.url || t.file_path || '');
          if (resolved) return { id: t.id, title, artist, url: resolved };
          
          return null;
        })
      );

      const ready = resolved.filter(Boolean) as FPTrack[];
      setTracks(ready);
      setIsLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!isLoading && tracks.length > 0 && !isPlaying) {
      const audio = audioRef.current;
      if (audio) {
        safePlay(audio, 'HomeFP-autoplay', { track: tracks[queueIndex]?.title, url: tracks[queueIndex]?.url }).then((result) => {
          if (!result.ok) {
            setAutoplayBlocked(true);
            return;
          }
            setIsPlaying(true);
            setAutoplayBlocked(false);
<<<<<<< HEAD
          });
=======
          })
          .catch(() => setAutoplayBlocked(true));
>>>>>>> origin/copilot/fix-audio-playback-issues
      }
    }
  }, [isLoading, tracks.length]);

  const getNextIndex = useCallback((from: number): number => {
    if (tracks.length === 0) return 0;
    const now = Date.now();
    for (const [id, ts] of playedAtRef.current.entries()) {
      if (now - ts > TWO_HOURS_MS) playedAtRef.current.delete(id);
    }
    for (let i = 1; i <= tracks.length; i++) {
      const candidate = (from + i) % tracks.length;
      if (!playedAtRef.current.has(String(tracks[candidate].id))) return candidate;
    }
    playedAtRef.current.clear();
    return (from + 1) % tracks.length;
  }, [tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      if (tracks[queueIndex]) playedAtRef.current.set(String(tracks[queueIndex].id), Date.now());
      setQueueIndex((prev) => getNextIndex(prev));
    };
    const onError = () => {
      setError('Track unavailable — skipping…');
      setTimeout(() => {
        setQueueIndex((prev) => getNextIndex(prev));
        setError('');
      }, 1000);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
<<<<<<< HEAD
    if (isPlaying) {
      safePlay(audio, 'HomeFP-toggle', { track: tracks[queueIndex]?.title, url: tracks[queueIndex]?.url }).then((result) => {
        if (!result.ok) {
          setIsPlaying(false);
          setError(AUDIO_UI_MESSAGES.playbackBlocked);
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, queueIndex, tracks]);
=======
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying, queueIndex]);
>>>>>>> origin/copilot/fix-audio-playback-issues

  useEffect(() => {
    if (isPlaying) {
      window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'home-fp' } }));
    }
  }, [isPlaying]);

  useEffect(() => {
    const stop = (e: CustomEvent) => {
      if (e.detail?.source !== 'home-fp' && isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('stop-all-audio', stop as EventListener);
    return () => window.removeEventListener('stop-all-audio', stop as EventListener);
  }, [isPlaying]);

  const startOrToggle = useCallback(() => {
    setAutoplayBlocked(false);
    setIsPlaying((prev) => !prev);
  }, []);

  const skipNext = useCallback(() => {
    if (tracks[queueIndex]) playedAtRef.current.set(String(tracks[queueIndex].id), Date.now());
    setQueueIndex((prev) => getNextIndex(prev));
    setIsPlaying(true);
  }, [queueIndex, tracks, getNextIndex]);

  const skipPrev = useCallback(() => {
    setQueueIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
    setIsPlaying(true);
  }, [tracks.length]);

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const t = parseFloat(e.target.value);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const current = tracks[queueIndex];

  if (isLoading) {
    return (
      <div className="w-full py-10 px-4 flex items-center justify-center gap-3 text-[#C8A882]/60">
        <Radio size={18} className="animate-pulse" />
        <span className="text-sm tracking-widest uppercase">Loading GPM Stream…</span>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="w-full py-10 px-4 flex flex-col items-center justify-center gap-4 text-center">
        <Radio size={32} className="text-[#D4A017]/40" />
        <p className="text-sm font-bold text-[#C8A882]/70 uppercase tracking-widest">GPM Live Stream</p>
        <p className="text-xs text-[#C8A882]/40">Catalog loading soon</p>
      </div>
    );
  }

  return (
    <div className="w-full py-6 px-4 md:py-8 md:px-6">
      <div className="max-w-md mx-auto md:max-w-none">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A882]/70 font-bold">GPM · 2-Hour No Repeat · All Original</span>
          </div>
          {isPlaying && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-900/40 border border-red-500/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-300">LIVE</span>
            </span>
          )}
        </div>
        <div className="bg-[#1a1207] rounded-2xl border border-[#5C3A1E]/40 overflow-hidden shadow-xl">
          <div className="px-6 pt-6 pb-4">
            {autoplayBlocked && (
              <button onClick={startOrToggle} className="w-full mb-4 py-3 px-4 rounded-xl border-2 border-[#D4A017] bg-[#D4A017]/10 hover:bg-[#D4A017]/20 transition-all animate-pulse group">
                <span className="flex items-center justify-center gap-2 text-[#D4A017] font-black text-sm tracking-widest uppercase">
                  <Play size={18} /> Tap to Start Stream
                </span>
              </button>
            )}
            {error && <p className="text-amber-400/70 text-xs mb-2">{error}</p>}
            <p className="text-[10px] text-[#C8A882]/50 uppercase tracking-widest mb-1">{isPlaying ? 'Now Streaming' : 'Ready'}</p>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight truncate">{current?.title}</h2>
            <p className="text-[#C8A882]/70 text-sm mt-0.5 truncate">{current?.artist}</p>
          </div>
          <div className="px-6 pb-2">
            <div className="flex items-center gap-2 text-xs text-[#C8A882]/40">
              <span className="w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
              <input type="range" min={0} max={duration || 0} value={currentTime} onChange={handleSeek} className="flex-1 h-1 cursor-pointer accent-[#D4A017]" />
              <span className="w-8 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="px-6 pb-6 pt-2 flex items-center justify-between">
            <button onClick={skipPrev} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C8A882]/60 hover:text-[#C8A882] transition-colors"><SkipBack size={20} /></button>
            <button onClick={startOrToggle} className="w-14 h-14 rounded-full bg-[#D4A017] hover:bg-[#E8C030] active:scale-95 flex items-center justify-center shadow-lg transition-all">
              {isPlaying ? <Pause size={24} className="text-[#1a1207]" /> : <Play size={24} className="text-[#1a1207] ml-0.5" />}
            </button>
            <button onClick={skipNext} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C8A882]/60 hover:text-[#C8A882] transition-colors"><SkipForward size={20} /></button>
          </div>
        </div>
        <p className="text-center text-[10px] text-[#C8A882]/30 mt-4 tracking-wide">{tracks.length} tracks · 2-hr no-repeat</p>
      </div>
      <audio ref={audioRef} src={current?.url ?? ''} preload="auto" />
    </div>
  );
}
