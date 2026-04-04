'use client';

/**
 * HomeFP — GPM Featured Playlist (Home Page) + Active/Jogger Experience
 *
 * Rules (locked by design spec):
 *  • Fetches GENERAL random GPM tracks from Supabase `tracks` table
 *  • Excludes: instrumental (INSTRO / INSTRUMENTAL in title), kids content,
 *              SYBC Band, Wounded & Willing (artists completely independent)
 *  • Shuffles into a 2-hour no-repeat queue (tracks played in last 2 hrs are skipped)
 *  • Auto-starts on mount — plays non-stop until user interacts (pause / skip)
 *  • Amber brand — #C8A882 / #D4A017 / #2A1506 / #1a1207
 *  • Single audio source — dispatches stop-all-audio before playing
 *
 * Active/Jogger Experience additions:
 *  • Background video engine — location library (scene key + season)
 *  • Lyrics overlay — always-on toggleable (button + voice "lyrics on/off")
 *  • Avatar overlay — CSS silhouette, mood/BPM-derived, tap-to-cycle
 *  • User preference store (localStorage) + Founder defaults
 *  • Settings panel (⚙ icon) with "Reset to Founder Defaults"
 *  • Listens for 'start-t20-session' event fired by T20Grid
 *  • Shows "🎉 2hr set complete" toast then offers re-shuffle
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Radio, Mic, Settings, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { buildT20Queue, type QueueTrack } from '../lib/t20Queue';
import { resolveBgVideo, type SceneKey, type Season } from '../config/bgVideoLibrary';
import { getLyrics, getActiveLyricIndex } from '../config/lyrics';
import {
  loadPrefs,
  savePrefs,
  resetPrefs,
  nextAvatarMode,
  defaultAvatarForMood,
  type AvatarMode,
} from '../lib/userPrefs';
import { FOUNDER_DEFAULTS } from '../config/founderDefaults';

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
// AVATAR EMOJI MAP
// ---------------------------------------------------------------------------

const AVATAR_EMOJI: Record<AvatarMode, string> = {
  runner:         '🏃',
  biker:          '🚴',
  parachutist:    '🪂',
  'figure-skater':'⛸️',
  surfer:         '🏄',
  skier:          '⛷️',
  none:           '',
};

// ---------------------------------------------------------------------------
// SETTINGS PANEL COMPONENT
// ---------------------------------------------------------------------------

function SettingsPanel({
  onClose,
  onReset,
  prefs,
  onSave,
}: {
  onClose: () => void;
  onReset: () => void;
  prefs: { lyricsDefault: boolean; favAvatarMode: AvatarMode; seasonOverride: Season | null };
  onSave: (p: { lyricsDefault?: boolean; favAvatarMode?: AvatarMode; seasonOverride?: Season | null }) => void;
}) {
  const seasons: Array<Season | 'auto'> = ['auto', 'spring', 'summer', 'fall', 'winter'];
  const avatarModes: AvatarMode[] = ['runner', 'biker', 'parachutist', 'figure-skater', 'surfer', 'skier', 'none'];

  return (
    <div className="absolute inset-0 z-50 bg-[#1a1207]/95 rounded-2xl p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#C8A882] tracking-widest uppercase">⚙ Settings</h3>
        <button onClick={onClose} className="p-1 text-[#C8A882]/60 hover:text-[#C8A882]" aria-label="Close settings">
          <X size={16} />
        </button>
      </div>

      {/* Lyrics default */}
      <label className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#C8A882]/80">Show lyrics by default</span>
        <input
          type="checkbox"
          checked={prefs.lyricsDefault}
          onChange={(e) => onSave({ lyricsDefault: e.target.checked })}
          className="accent-[#D4A017] w-4 h-4"
        />
      </label>

      {/* Avatar mode */}
      <div className="mb-3">
        <p className="text-xs text-[#C8A882]/60 mb-1.5">Default avatar</p>
        <div className="flex flex-wrap gap-1.5">
          {avatarModes.map((m) => (
            <button
              key={m}
              onClick={() => onSave({ favAvatarMode: m })}
              className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                prefs.favAvatarMode === m
                  ? 'border-[#D4A017] bg-[#D4A017]/20 text-[#D4A017]'
                  : 'border-[#5C3A1E]/50 text-[#C8A882]/60 hover:border-[#C8A882]/40'
              }`}
            >
              {AVATAR_EMOJI[m] || '—'} {m}
            </button>
          ))}
        </div>
      </div>

      {/* Season override */}
      <div className="mb-4">
        <p className="text-xs text-[#C8A882]/60 mb-1.5">Season override</p>
        <div className="flex flex-wrap gap-1.5">
          {seasons.map((s) => (
            <button
              key={s}
              onClick={() => onSave({ seasonOverride: s === 'auto' ? null : (s as Season) })}
              className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                (s === 'auto' ? prefs.seasonOverride === null : prefs.seasonOverride === s)
                  ? 'border-[#D4A017] bg-[#D4A017]/20 text-[#D4A017]'
                  : 'border-[#5C3A1E]/50 text-[#C8A882]/60 hover:border-[#C8A882]/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reset to Founder Defaults */}
      <button
        onClick={onReset}
        className="w-full py-2 text-xs border border-[#5C3A1E]/60 text-[#C8A882]/50 rounded-lg hover:border-[#D4A017]/40 hover:text-[#C8A882]/80 transition-colors"
      >
        Reset to Founder Defaults
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function HomeFP() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const speechRef = useRef<SpeechRecognition | null>(null);

  const [tracks, setTracks] = useState<FPTrack[]>([]);
  const [queue, setQueue] = useState<QueueTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [setComplete, setSetComplete] = useState(false);

  // Active/Jogger Experience state
  const [lyricsVisible, setLyricsVisible] = useState(false);
  const [avatarMode, setAvatarMode] = useState<AvatarMode>('runner');
  const [bgVideo, setBgVideo] = useState<{ src: string; poster?: string; scene: string; season: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => loadPrefs());
  const [currentMood, setCurrentMood] = useState('uplifting');

  // 2-hour no-repeat: map of track id → played-at timestamp
  const playedAtRef = useRef<Map<string, number>>(new Map());

  // ---------------------------------------------------------------------------
  // FETCH TRACKS + BUILD T20 QUEUE
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

      const { data, error: dbErr } = await sb
        .from('tracks')
        .select('id, title, artist, url, mood, bpm, duration_seconds')
        .not('url', 'is', null)
        .neq('url', '')
        .limit(200);

      if (dbErr || !data || data.length === 0) {
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
          // Build initial queue
          const qt: QueueTrack[] = filtered.map((t) => ({ id: String(t.id), title: t.title, artist: t.artist, url: t.url }));
          setQueue(buildT20Queue(qt));
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

      // Build T20 queue from all fetched tracks
      const qt: QueueTrack[] = (data as Record<string, unknown>[])
        .filter((r) => r.url && !isExcluded({ id: r.id as number, title: (r.title as string) ?? '', artist: (r.artist as string) ?? '', url: (r.url as string) ?? '' }))
        .map((r) => ({
          id: String(r.id),
          title: (r.title as string) ?? 'Unknown',
          artist: (r.artist as string) ?? 'G Putnam Music',
          url: resolveUrl((r.url as string) ?? ''),
          durationSeconds: (r.duration_seconds as number) ?? undefined,
          mood: (r.mood as string) ?? undefined,
          bpm: (r.bpm as number) ?? undefined,
        }));
      setQueue(buildT20Queue(qt));
      setIsLoading(false);
    }

    load();
  }, []);

  // ---------------------------------------------------------------------------
  // INIT PREFS + LYRICS DEFAULT
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const p = loadPrefs();
    setPrefs(p);
    setLyricsVisible(p.lyricsDefault);
    setAvatarMode(p.favAvatarMode);
  }, []);

  // ---------------------------------------------------------------------------
  // BACKGROUND VIDEO — update when mood changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const bg = resolveBgVideo(currentMood, {
      sceneOverride: prefs.favLocations[0] as SceneKey | undefined,
      seasonOverride: prefs.seasonOverride ?? undefined,
      southernHemisphere: prefs.southernHemisphere,
    });
    setBgVideo(bg);
  }, [currentMood, prefs]);

  // ---------------------------------------------------------------------------
  // LISTEN FOR T20 MOOD CHANGE + START-T20-SESSION
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const onMood = (e: CustomEvent) => {
      if (e.detail?.mood) setCurrentMood((e.detail.mood as string).toLowerCase());
    };
    const onStartSession = (e: CustomEvent) => {
      // Re-shuffle queue when a T20 tile starts a session
      if (queue.length > 0) {
        const played = new Set<string>(Array.from(playedAtRef.current.keys()) as string[]);
        setQueue(buildT20Queue(queue, played));
        setQueueIndex(0);
        setIsPlaying(true);
        setSetComplete(false);
      }
      if (e.detail?.mood) setCurrentMood((e.detail.mood as string).toLowerCase());
    };

    window.addEventListener('t20-mood-change', onMood as EventListener);
    window.addEventListener('start-t20-session', onStartSession as EventListener);
    return () => {
      window.removeEventListener('t20-mood-change', onMood as EventListener);
      window.removeEventListener('start-t20-session', onStartSession as EventListener);
    };
  }, [queue]);

  // ---------------------------------------------------------------------------
  // VOICE COMMANDS — "lyrics on/off" (SpeechRecognition)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: typeof globalThis.SpeechRecognition; webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const sr = new SpeechRecognition();
    sr.continuous = true;
    sr.lang = 'en-US';
    sr.interimResults = false;

    sr.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        if (transcript.includes('lyrics on')) setLyricsVisible(true);
        if (transcript.includes('lyrics off')) setLyricsVisible(false);
        if (transcript.includes('avatar off')) setAvatarMode('none');
        if (transcript.includes('avatar on')) setAvatarMode(prefs.favAvatarMode !== 'none' ? prefs.favAvatarMode : 'runner');
      }
    };

    try { sr.start(); } catch { /* already started */ }
    speechRef.current = sr;

    return () => {
      try { sr.stop(); } catch { /* already stopped */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // AUTO-START once tracks are loaded
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isLoading && tracks.length > 0 && !isPlaying) {
      const audio = audioRef.current;
      if (audio) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {
            setAutoplayBlocked(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tracks.length]);

  // ---------------------------------------------------------------------------
  // NO-REPEAT QUEUE HELPER (legacy fallback when queue array is empty)
  // ---------------------------------------------------------------------------

  const getNextIndex = useCallback(
    (from: number): number => {
      if (tracks.length === 0) return 0;
      const now = Date.now();

      for (const [id, ts] of playedAtRef.current.entries()) {
        if (now - ts > TWO_HOURS_MS) playedAtRef.current.delete(id);
      }

      for (let i = 1; i <= tracks.length; i++) {
        const candidate = (from + i) % tracks.length;
        const id = String(tracks[candidate].id);
        if (!playedAtRef.current.has(id)) return candidate;
      }

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
      const activeList = queue.length > 0 ? queue : tracks;
      if (activeList[queueIndex]) {
        playedAtRef.current.set(String(activeList[queueIndex].id), Date.now());
      }
      const nextIdx = queueIndex + 1;
      if (queue.length > 0 && nextIdx >= queue.length) {
        // 2-hr set complete
        setSetComplete(true);
        setIsPlaying(false);
        return;
      }
      setQueueIndex((prev) => (queue.length > 0 ? Math.min(prev + 1, queue.length - 1) : getNextIndex(prev)));
    };
    const onError = () => {
      setError('Track unavailable — skipping…');
      setTimeout(() => {
        setQueueIndex((prev) => (queue.length > 0 ? Math.min(prev + 1, queue.length - 1) : getNextIndex(prev)));
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
  }, [queueIndex, tracks, queue, getNextIndex]);

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

  // Scroll active lyric into view
  useEffect(() => {
    if (!lyricsVisible) return;
    const container = lyricsContainerRef.current;
    if (!container) return;
    const active = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, lyricsVisible]);

  // ---------------------------------------------------------------------------
  // PREFERENCE HELPERS
  // ---------------------------------------------------------------------------

  const handlePrefSave = useCallback((partial: Partial<typeof prefs>) => {
    const updated = { ...prefs, ...partial };
    setPrefs(updated);
    savePrefs(partial);
    if (partial.favAvatarMode !== undefined) setAvatarMode(partial.favAvatarMode);
    if (partial.lyricsDefault !== undefined) setLyricsVisible(partial.lyricsDefault);
  }, [prefs]);

  const handleResetPrefs = useCallback(() => {
    resetPrefs();
    const defaults = { ...FOUNDER_DEFAULTS };
    setPrefs(defaults);
    setAvatarMode(defaults.favAvatarMode);
    setLyricsVisible(defaults.lyricsDefault);
    setSettingsOpen(false);
  }, []);

  const handleReShuffle = useCallback(() => {
    playedAtRef.current.clear();
    setQueue(buildT20Queue(queue.length > 0 ? queue : tracks.map((t) => ({ id: String(t.id), title: t.title, artist: t.artist, url: t.url }))));
    setQueueIndex(0);
    setIsPlaying(true);
    setSetComplete(false);
  }, [queue, tracks]);

  // ---------------------------------------------------------------------------
  // CONTROLS
  // ---------------------------------------------------------------------------

  const startOrToggle = useCallback(() => {
    setAutoplayBlocked(false);
    setIsPlaying((prev) => !prev);
  }, []);

  const skipNext = useCallback(() => {
    const activeList = queue.length > 0 ? queue : tracks;
    if (activeList[queueIndex]) {
      playedAtRef.current.set(String(activeList[queueIndex].id), Date.now());
    }
    setQueueIndex((prev) => (queue.length > 0 ? Math.min(prev + 1, queue.length - 1) : getNextIndex(prev)));
    setIsPlaying(true);
  }, [queueIndex, tracks, queue, getNextIndex]);

  const skipPrev = useCallback(() => {
    setQueueIndex((prev) => (prev > 0 ? prev - 1 : (queue.length > 0 ? queue.length : tracks.length) - 1));
    setIsPlaying(true);
  }, [tracks.length, queue.length]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  // ---------------------------------------------------------------------------
  // CURRENT TRACK (prefer T20 queue over raw tracks list)
  // ---------------------------------------------------------------------------

  const activeList = queue.length > 0 ? queue : tracks;
  const current = activeList[queueIndex] as (QueueTrack | FPTrack) | undefined;

  // Lyrics for current track
  const lyrics = current ? getLyrics(current.title) : [];
  const activeLyricIdx = getActiveLyricIndex(lyrics, currentTime);

  // Avatar derived from current track mood/bpm (QueueTrack only)
  const derivedAvatarMode: AvatarMode = (() => {
    if (avatarMode !== 'runner') return avatarMode; // user overrode
    const qt = current as QueueTrack | undefined;
    if (qt?.mood || qt?.bpm) return defaultAvatarForMood(qt.mood ?? currentMood, qt.bpm);
    return avatarMode;
  })();

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

  if (!isLoading && tracks.length === 0) {
    return (
      <div className="w-full py-10 px-4 flex flex-col items-center justify-center gap-4 text-center">
        <Radio size={32} className="text-[#D4A017]/40" />
        <div>
          <p className="text-sm font-bold text-[#C8A882]/70 uppercase tracking-widest">GPM Live Stream</p>
          <p className="text-xs text-[#C8A882]/40 mt-1">Catalog loading soon — check back shortly</p>
        </div>
        <a
          href="mailto:Gputnam@gputnammusic.com"
          className="text-[10px] uppercase tracking-widest text-[#D4A017]/60 border border-[#D4A017]/20 rounded-full px-4 py-1.5 hover:border-[#D4A017]/50 transition-colors"
        >
          Contact us
        </a>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="w-full py-6 px-4 md:py-8 md:px-6">
      <div className="max-w-md mx-auto md:max-w-none">

        {/* Stream identity + LIVE badge + toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A882]/70 font-bold">
              GPM · 2-Hour No Repeat · All Original
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-900/40 border border-red-500/40 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-300">LIVE</span>
              </span>
            )}
            {/* Settings button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 text-[#C8A882]/50 hover:text-[#C8A882] transition-colors"
              aria-label="Open settings"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* 🎉 Set complete toast */}
        {setComplete && (
          <div className="mb-4 p-3 bg-[#2a1f0f] border border-[#D4A017]/50 rounded-xl text-center">
            <p className="text-[#D4A017] font-bold text-sm">🎉 2-hr set complete!</p>
            <button
              onClick={handleReShuffle}
              className="mt-2 text-xs text-[#C8A882]/70 underline hover:text-[#C8A882] transition-colors"
            >
              Re-shuffle &amp; go again
            </button>
          </div>
        )}

        {/* Now-playing card (with bg video + overlays) */}
        <div className="bg-[#1a1207] rounded-2xl border border-[#5C3A1E]/40 overflow-hidden shadow-xl relative">

          {/* ── Background video ── */}
          {bgVideo?.src && (
            <video
              ref={videoRef}
              key={bgVideo.src}
              src={bgVideo.src}
              poster={bgVideo.poster}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              aria-hidden
            />
          )}
          {/* Gradient overlay so text stays readable over video */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1207]/95 via-[#1a1207]/60 to-[#1a1207]/20 pointer-events-none" />

          {/* ── Avatar overlay ── */}
          {derivedAvatarMode !== 'none' && (
            <button
              onClick={() => {
                const next = nextAvatarMode(derivedAvatarMode);
                setAvatarMode(next);
              }}
              className="absolute top-3 right-3 z-10 text-4xl opacity-30 hover:opacity-60 transition-opacity"
              aria-label="Cycle avatar mode"
              title={`Avatar: ${derivedAvatarMode} — tap to cycle`}
            >
              <span className="drop-shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                {AVATAR_EMOJI[derivedAvatarMode]}
              </span>
            </button>
          )}

          {/* ── Lyrics overlay ── */}
          {lyricsVisible && lyrics.length > 0 && (
            <div
              ref={lyricsContainerRef}
              className="absolute inset-x-0 top-0 h-32 overflow-y-auto z-10 px-6 pt-4 pb-2 pointer-events-none"
              aria-live="polite"
            >
              {lyrics.map((line, i) => (
                <p
                  key={i}
                  data-active={i === activeLyricIdx ? 'true' : 'false'}
                  className={`text-center text-sm leading-relaxed transition-all duration-300 ${
                    i === activeLyricIdx
                      ? 'text-white font-bold scale-105'
                      : i < (activeLyricIdx ?? -1)
                      ? 'text-[#C8A882]/30'
                      : 'text-[#C8A882]/50'
                  }`}
                >
                  {line.text}
                </p>
              ))}
            </div>
          )}

          {/* ── Track info ── */}
          <div className="relative z-10 px-6 pt-6 pb-4">
            {autoplayBlocked && (
              <button
                onClick={startOrToggle}
                className="w-full mb-4 py-3 px-4 rounded-xl border-2 border-[#D4A017] bg-[#D4A017]/10 hover:bg-[#D4A017]/20 transition-all animate-pulse group"
                aria-label="Start streaming"
              >
                <span className="flex items-center justify-center gap-2 text-[#D4A017] font-black text-sm tracking-widest uppercase">
                  <Play size={18} className="group-hover:scale-110 transition-transform" />
                  Tap to Start Your GPM Stream
                </span>
                <span className="block text-[10px] text-[#C8A882]/50 mt-0.5 tracking-wide">
                  Non-stop original music — no ads
                </span>
              </button>
            )}
            {error && <p className="text-amber-400/70 text-xs mb-2">{error}</p>}
            <p className="text-[10px] text-[#C8A882]/50 uppercase tracking-widest mb-1">
              {isPlaying ? 'Now Streaming' : 'Ready'}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight truncate">
              {current.title}
            </h2>
            <p className="text-[#C8A882]/70 text-sm mt-0.5 truncate">
              {'artist' in current ? current.artist : ''}
            </p>
          </div>

          {/* ── Seek bar ── */}
          <div className="relative z-10 px-6 pb-2">
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

          {/* ── Controls ── */}
          <div className="relative z-10 px-6 pb-5 pt-2 flex items-center justify-between">
            <button
              onClick={skipPrev}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C8A882]/60 hover:text-[#C8A882] transition-colors"
              aria-label="Previous track"
            >
              <SkipBack size={20} />
            </button>

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

          {/* ── Lyrics toggle button (bottom-center, 🎤) ── */}
          <div className="relative z-10 flex justify-center pb-4">
            <button
              onClick={() => setLyricsVisible((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest transition-colors ${
                lyricsVisible
                  ? 'border-[#D4A017] text-[#D4A017] bg-[#D4A017]/10'
                  : 'border-[#5C3A1E]/50 text-[#C8A882]/40 hover:border-[#C8A882]/40 hover:text-[#C8A882]/70'
              }`}
              aria-label={lyricsVisible ? 'Hide lyrics' : 'Show lyrics'}
            >
              <Mic size={11} />
              {lyricsVisible ? 'Lyrics On' : 'Lyrics Off'}
            </button>
          </div>

          {/* ── Settings panel (absolute overlay) ── */}
          {settingsOpen && (
            <SettingsPanel
              onClose={() => setSettingsOpen(false)}
              onReset={handleResetPrefs}
              prefs={prefs}
              onSave={handlePrefSave}
            />
          )}
        </div>

        {/* Footer meta */}
        <p className="text-center text-[10px] text-[#C8A882]/30 mt-4 tracking-wide">
          {queue.length > 0
            ? `Track ${queueIndex + 1} of ${queue.length} · 2-hr no-repeat queue`
            : `${tracks.length} tracks · 2-hr no-repeat`
          } · Independent from SYBC Band &amp; Wounded &amp; Willing
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
