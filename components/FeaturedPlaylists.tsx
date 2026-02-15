'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';

/**
 * FEATURED PLAYLISTS - BIC Audio Media Players
 * CONTINUOUS STREAMING: Plays ALL tracks across ALL FPs without stopping
 * CROSS-FP: When one FP ends, continues to next FP seamlessly
 * NO REPEAT: 2-hour track history prevents repeats
 * USER PREF: Ask user if they want Repeats or NO Repeat
 * MOBILE: Touch-friendly, auto-trigger capable
 * SINGLE-SONG: Only ONE audio plays at a time across entire site
 * PACK ALL BOXES: All 7 playlists shown in a scrollable grid
 */

interface Track {
  title: string;
  vocalist: string;
  src: string;
}

interface Playlist {
  name: string;
  tracks: Track[];
}

const PLAYLISTS: Playlist[] = [
  {
    name: "Grandpa's Story",
    tracks: [
      { title: 'Reflections', vocalist: 'Kleigh', src: '/pix/kleigh--reflections.mp3' },
      { title: 'I Need an Angel', vocalist: 'G Putnam Music', src: '/pix/i-need-an-angel.mp3' },
      { title: 'Bought Into Your Game', vocalist: 'Kleigh', src: '/pix/bought-into-your-game.mp3' },
    ],
  },
  {
    name: 'Kleigh Spotlight',
    tracks: [
      { title: 'Breathing Serenity', vocalist: 'Kleigh', src: '/pix/kleigh--breathing-serenity.mp3' },
      { title: 'Nighttime', vocalist: 'G Putnam Music', src: '/pix/nighttime.mp3' },
      { title: 'Down (Stripped)', vocalist: 'Kleigh', src: '/pix/kleigh--down-(stripped)-with-reverb--69bpm-fmaj.mp3' },
    ],
  },
  {
    name: 'Who is G Putnam Music',
    tracks: [
      { title: 'I Was Made to Be Awesome', vocalist: 'G Putnam Music', src: '/pix/i-was-made-to-be-awesome.mp3' },
      { title: 'Perfect Day', vocalist: 'G Putnam Music', src: '/pix/perfect-day.mp3' },
      { title: 'Why Does Life Gotta Be This Hard', vocalist: 'G Putnam Music', src: '/pix/why-does-life-gotta-be-this-hard.mp3' },
    ],
  },
  {
    name: 'The First Note',
    tracks: [
      { title: 'Dance Party', vocalist: 'G Putnam Music', src: '/pix/dance-party.mp3' },
      { title: 'Going Outside', vocalist: 'G Putnam Music', src: '/pix/going-outside.mp3' },
      { title: 'I Am a Fighter', vocalist: 'G Putnam Music', src: '/pix/i-am-a-fighter--el-mix-instro.mp3' },
    ],
  },
  {
    name: 'The SHIPS Engine',
    tracks: [
      { title: 'I Live Free', vocalist: 'G Putnam Music', src: '/pix/i-live-free--instro.mp3' },
      { title: "We'll Be Free", vocalist: 'G Putnam Music', src: "/pix/we'll-be-free.mp3" },
      { title: "Fool's Game", vocalist: 'G Putnam Music', src: '/pix/fools-game-(master-2).mp3' },
    ],
  },
  {
    name: 'Scherer Jazz Sessions',
    tracks: [
      { title: 'Jump', vocalist: 'Michael Scherer', src: '/pix/jump.mp3' },
      { title: 'New Orleans Piano Trio', vocalist: 'Michael Scherer', src: '/pix/new-orleans-piano-trio-1.mp3' },
      { title: 'Score 3: The End', vocalist: 'Michael Scherer', src: '/pix/score-3--the-end.mp3' },
    ],
  },
  {
    name: "Valentine's Day",
    tracks: [
      { title: 'A Calm Evening', vocalist: 'Kleigh', src: '/pix/kleigh--a-calm-evening.mp3' },
      { title: 'Wanna Know You', vocalist: 'G Putnam Music', src: '/pix/wanna-know-you.mp3' },
      { title: 'Waterfall', vocalist: 'Kleigh', src: '/pix/kleigh--waterfall.mp3' },
      { title: 'A Love Like That', vocalist: 'G Putnam Music', src: '/pix/a-love-like-that.mp3' },
      { title: 'Forever & A Day', vocalist: 'G Putnam Music', src: '/pix/forever-and-a-day.mp3' },
      { title: 'Be Mine Tonight', vocalist: 'KLEIGH', src: '/pix/be-mine-tonight.mp3' },
    ],
  },
];

// Build flat list of ALL tracks across ALL playlists for continuous streaming
const ALL_TRACKS = PLAYLISTS.flatMap((p, pi) =>
  p.tracks.map((t, ti) => ({ ...t, playlistIndex: pi, trackIndex: ti, playlistName: p.name }))
);

// 2-HOUR NO REPEAT: Track history with timestamps
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlaylistPlayer({
  playlist,
  index,
  isActivePlaylist,
  activeTrackInPlaylist,
  onSelectTrack,
  isStreamPlaying,
}: {
  playlist: Playlist;
  index: number;
  isActivePlaylist: boolean;
  activeTrackInPlaylist: number;
  onSelectTrack: (playlistIdx: number, trackIdx: number) => void;
  isStreamPlaying: boolean;
}) {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 flex flex-col gap-3 min-w-[280px] border border-neutral-800">
      {/* Playlist Name */}
      <div className="flex items-center justify-between">
        <h3 className={`font-bold text-sm truncate ${isActivePlaylist && isStreamPlaying ? 'text-[#D4A017]' : 'text-white'}`}>
          {playlist.name}
        </h3>
        {isActivePlaylist && isStreamPlaying && (
          <span className="text-[10px] bg-[#D4A017]/20 text-[#D4A017] px-2 py-0.5 rounded-full animate-pulse">
            NOW PLAYING
          </span>
        )}
      </div>

      {/* Track List */}
      <div className="flex flex-col gap-1">
        {playlist.tracks.map((t, i) => (
          <button
            key={i}
            onClick={() => onSelectTrack(index, i)}
            className={`text-left px-2 py-1.5 rounded text-xs transition-colors min-h-[44px] flex items-center ${
              isActivePlaylist && i === activeTrackInPlaylist
                ? 'bg-[#D4A017]/20 text-[#D4A017]'
                : 'text-neutral-400 hover:bg-white/5'
            }`}
            aria-label={`Play ${t.title}`}
          >
            <span className="truncate">
              {i + 1}. {t.title}
            </span>
            <span className="ml-auto text-[10px] opacity-60 shrink-0 pl-2">
              - {t.vocalist}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedPlaylists() {
  // CONTINUOUS STREAM STATE
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [globalTrackIndex, setGlobalTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  // USER PREFERENCE: Repeats or NO Repeat
  const [noRepeat, setNoRepeat] = useState(true);
  // 2-HOUR NO REPEAT: Track src + timestamp history
  const playedHistoryRef = useRef<Map<string, number>>(new Map());

  // Current track from flat list
  const currentFlatTrack = ALL_TRACKS[globalTrackIndex];

  // Clean expired entries from history (older than 2 hours)
  const cleanHistory = useCallback(() => {
    const now = Date.now();
    const hist = playedHistoryRef.current;
    for (const [src, ts] of hist.entries()) {
      if (now - ts > TWO_HOURS_MS) hist.delete(src);
    }
  }, []);

  // Find next track that hasn't been played in 2 hours
  const getNextTrackIndex = useCallback((fromIndex: number): number => {
    cleanHistory();
    const total = ALL_TRACKS.length;
    if (!noRepeat) {
      return (fromIndex + 1) % total;
    }
    for (let i = 1; i <= total; i++) {
      const candidate = (fromIndex + i) % total;
      const src = ALL_TRACKS[candidate].src;
      if (!playedHistoryRef.current.has(src)) return candidate;
    }
    playedHistoryRef.current.clear();
    return (fromIndex + 1) % total;
  }, [noRepeat, cleanHistory]);

  // Record track as played
  const recordPlayed = useCallback((src: string) => {
    playedHistoryRef.current.set(src, Date.now());
  }, []);

  // SINGLE-SONG: Listen for stop-all-audio from other players
  useEffect(() => {
    const handleStopAll = (e: CustomEvent) => {
      if (e.detail?.source === 'fp-stream') return;
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    const handleGlobalPlay = () => {
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('stop-all-audio', handleStopAll as EventListener);
    window.addEventListener('play-track', handleGlobalPlay);
    return () => {
      window.removeEventListener('stop-all-audio', handleStopAll as EventListener);
      window.removeEventListener('play-track', handleGlobalPlay);
    };
  }, [isPlaying]);

  // AUDIO ENGINE: Handle track loading, playback, ended => next track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      recordPlayed(ALL_TRACKS[globalTrackIndex].src);
      const nextIdx = getNextTrackIndex(globalTrackIndex);
      setGlobalTrackIndex(nextIdx);
    };
    const handleError = () => {
      setError('Track unavailable - skipping...');
      setTimeout(() => {
        const nextIdx = getNextTrackIndex(globalTrackIndex);
        setGlobalTrackIndex(nextIdx);
        setError('');
      }, 1000);
    };
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [globalTrackIndex, getNextTrackIndex, recordPlayed]);

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentFlatTrack) return;
    if (isPlaying) {
      setError('');
      audio.play().catch(() => {
        setIsPlaying(false);
        setError('Tap play to start streaming');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, globalTrackIndex, currentFlatTrack]);

  // GPM BOT AUTO-TRIGGER: Dispatch fp-stream-ready on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('fp-stream-ready', { detail: { totalTracks: ALL_TRACKS.length } }));
  }, []);

  // PLAY CONTROLS
  const startStream = useCallback((playlistIdx?: number, trackIdx?: number) => {
    window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'fp-stream' } }));
    window.dispatchEvent(new CustomEvent('fp-play', { detail: { index: -1 } }));
    if (playlistIdx !== undefined && trackIdx !== undefined) {
      const gIdx = ALL_TRACKS.findIndex(
        (t) => t.playlistIndex === playlistIdx && t.trackIndex === trackIdx
      );
      if (gIdx >= 0) setGlobalTrackIndex(gIdx);
    }
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'fp-stream' } }));
      window.dispatchEvent(new CustomEvent('fp-play', { detail: { index: -1 } }));
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const skipNext = useCallback(() => {
    recordPlayed(ALL_TRACKS[globalTrackIndex].src);
    const nextIdx = getNextTrackIndex(globalTrackIndex);
    setGlobalTrackIndex(nextIdx);
    if (!isPlaying) setIsPlaying(true);
  }, [globalTrackIndex, isPlaying, getNextTrackIndex, recordPlayed]);

  const skipPrev = useCallback(() => {
    const prevIdx = globalTrackIndex > 0 ? globalTrackIndex - 1 : ALL_TRACKS.length - 1;
    setGlobalTrackIndex(prevIdx);
    if (!isPlaying) setIsPlaying(true);
  }, [globalTrackIndex, isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const onSelectTrack = useCallback((playlistIdx: number, trackIdx: number) => {
    startStream(playlistIdx, trackIdx);
  }, [startStream]);

  const totalTracks = ALL_TRACKS.length;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-2">Featured Playlists</h2>
      <p className="text-neutral-400 text-sm mb-4">
        Stream the freshest tracks from the GPM catalog.
      </p>

      {/* STREAM CONTROL BAR */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 mb-6">
        {currentFlatTrack && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                {isPlaying ? 'Now Streaming' : 'Up Next'} - {currentFlatTrack.playlistName}
              </span>
              <span className="text-[10px] text-neutral-600">
                Track {globalTrackIndex + 1} of {totalTracks}
              </span>
            </div>
            <div className="text-white font-bold text-sm">
              {currentFlatTrack.title}
              <span className="text-neutral-400 font-normal ml-2">- {currentFlatTrack.vocalist}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-xs mb-2">{error}</div>
        )}

        {/* Transport Controls */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={skipPrev} className="text-neutral-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Previous track">
            <SkipBack size={18} />
          </button>
          <button onClick={togglePlay} className="bg-[#D4A017] text-black rounded-full p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-[#E8B828] transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={skipNext} className="text-neutral-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Next track">
            <SkipForward size={18} />
          </button>

          <button
            onClick={() => setNoRepeat((prev) => !prev)}
            className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors min-h-[44px] ${
              noRepeat
                ? 'bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/40'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}
            aria-label={noRepeat ? 'No Repeat mode on' : 'Repeats allowed'}
          >
            {noRepeat ? <Shuffle size={14} /> : <Repeat size={14} />}
            {noRepeat ? 'NO REPEAT' : 'REPEATS ON'}
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-neutral-700"
            aria-label="Seek"
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between mt-2 text-[10px] text-neutral-500">
          <span>
            {noRepeat
              ? `${totalTracks} tracks - 2hr no-repeat mode`
              : `${totalTracks} tracks - repeats allowed`}
          </span>
          <span>Continuous streaming across all playlists</span>
        </div>
      </div>

      {/* PACK ALL BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PLAYLISTS.map((playlist, idx) => (
          <PlaylistPlayer
            key={idx}
            playlist={playlist}
            index={idx}
            isActivePlaylist={currentFlatTrack?.playlistIndex === idx}
            activeTrackInPlaylist={currentFlatTrack?.playlistIndex === idx ? currentFlatTrack.trackIndex : -1}
            onSelectTrack={onSelectTrack}
            isStreamPlaying={isPlaying}
          />
        ))}
      </div>

      {/* Hidden audio - MOBILE: preload none for Safari */}
      <audio
        ref={audioRef}
        src={currentFlatTrack?.src || ''}
        preload="none"
      />
    </section>
  );
}
