'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

/**
 * FEATURED PLAYLISTS - BIC Audio Media Players
 * DEPENDABILITY: Rotation STOPS when audio is playing
 * QUALITY: Error handling on every audio operation
 * SATISFACTION: Playlist name shown, no interrupted playback
 * SINGLE-SONG: Listens for stop-all-audio, dispatches stop-all-audio + fp-play
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

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlaylistPlayer({ playlist, index, onPlayStateChange }: {
  playlist: Playlist;
  index: number;
  onPlayStateChange: (playing: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState('');

  const track = playlist.tracks[currentTrack];

  // Notify parent when play state changes (for rotation control)
  useEffect(() => {
    onPlayStateChange(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // SINGLE-SONG: Listen for stop-all-audio to pause this FP player
  useEffect(() => {
    const handleStopAll = (e: CustomEvent) => {
      // Don't stop ourselves if we dispatched it
      if (e.detail?.source === `fp-${index}`) return;
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    // Also stop when GlobalPlayer starts via play-track
    const handleGlobalPlay = () => {
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    // Also stop when another FP starts
    const handleFPPlay = (e: CustomEvent) => {
      if (e.detail?.index !== index) {
        const audio = audioRef.current;
        if (audio && isPlaying) {
          audio.pause();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('stop-all-audio', handleStopAll as EventListener);
    window.addEventListener('play-track', handleGlobalPlay);
    window.addEventListener('fp-play', handleFPPlay as EventListener);

    return () => {
      window.removeEventListener('stop-all-audio', handleStopAll as EventListener);
      window.removeEventListener('play-track', handleGlobalPlay);
      window.removeEventListener('fp-play', handleFPPlay as EventListener);
    };
  }, [isPlaying, index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrack < playlist.tracks.length - 1) {
        setCurrentTrack((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        setCurrentTrack(0);
      }
    };
    const handleError = () => {
      setError('Track unavailable');
      setIsPlaying(false);
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
  }, [currentTrack, playlist.tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      setError('');
      audio.play().catch(() => {
        setIsPlaying(false);
        setError('Playback failed');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      // SINGLE-SONG: Stop ALL other audio before this FP plays
      window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: `fp-${index}` } }));
      window.dispatchEvent(new CustomEvent('fp-play', { detail: { index } }));
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying, index]);

  const selectTrack = useCallback((idx: number) => {
    // SINGLE-SONG: Stop ALL other audio
    window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: `fp-${index}` } }));
    window.dispatchEvent(new CustomEvent('fp-play', { detail: { index } }));
    setCurrentTrack(idx);
    setIsPlaying(true);
  }, [index]);

  const skipNext = useCallback(() => {
    if (currentTrack < playlist.tracks.length - 1) {
      setCurrentTrack((prev) => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrack, playlist.tracks.length]);

  const skipPrev = useCallback(() => {
    if (currentTrack > 0) {
      setCurrentTrack((prev) => prev - 1);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="bg-[#1a0f00] border border-[#8B4513]/20 rounded-xl p-4 flex flex-col gap-3">
      {/* Playlist Name */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#D4A017] tracking-wide">{playlist.name}</span>
        {error && <span className="text-[10px] text-red-400">{error}</span>}
      </div>

      {/* Now Playing */}
      <div className="text-xs text-neutral-300 truncate">
        <span className="text-neutral-500">Now: </span>{track.title}
        <span className="text-neutral-600"> - {track.vocalist}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button onClick={skipPrev} className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" aria-label="Previous track">
          <SkipBack className="w-4 h-4 text-neutral-400" />
        </button>
        <button onClick={togglePlay} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[#D4A017] hover:bg-[#D4A017]/80 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause className="w-5 h-5 text-black" fill="black" /> : <Play className="w-5 h-5 text-black" fill="black" />}
        </button>
        <button onClick={skipNext} className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" aria-label="Next track">
          <SkipForward className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Seek Bar */}
      <div className="flex items-center gap-2 text-[10px] text-neutral-500">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-neutral-700"
          aria-label="Seek"
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-neutral-700"
          aria-label="Volume"
        />
      </div>

      {/* Track List */}
      <div className="flex flex-col gap-1">
        {playlist.tracks.map((t, i) => (
          <button
            key={i}
            onClick={() => selectTrack(i)}
            className={`text-left px-2 py-1.5 rounded text-xs transition-colors min-h-[44px] flex items-center ${
              i === currentTrack ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'text-neutral-400 hover:bg-white/5'
            }`}
            aria-label={`Play ${t.title}`}
          >
            <span className="truncate">{i + 1}. {t.title}</span>
            <span className="text-[10px] text-neutral-600 ml-auto flex-shrink-0 pl-2">- {t.vocalist}</span>
          </button>
        ))}
      </div>

      {/* Hidden audio - DEPENDABILITY: preload none */}
      <audio ref={audioRef} src={track.src} preload="none" />
    </div>
  );
}

export default function FeaturedPlaylists() {
  // DEPENDABILITY: Track if ANY FP is playing to stop rotation
  const [anyPlaying, setAnyPlaying] = useState(false);
  const playingRef = useRef<Set<number>>(new Set());

  const handlePlayStateChange = useCallback((index: number, playing: boolean) => {
    if (playing) {
      playingRef.current.add(index);
    } else {
      playingRef.current.delete(index);
    }
    setAnyPlaying(playingRef.current.size > 0);
  }, []);

  return (
    <section className="w-full px-4 py-8">
      <h2 className="text-xl font-bold text-[#D4A017] mb-2">Featured Playlists</h2>
      <p className="text-sm text-neutral-400 mb-6">Stream the freshest tracks from the GPM catalog.</p>

      {/* PACK ALL BOXES: Show all 7 playlists in responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PLAYLISTS.map((playlist, idx) => (
          <PlaylistPlayer
            key={idx}
            playlist={playlist}
            index={idx}
            onPlayStateChange={(playing) => handlePlayStateChange(idx, playing)}
          />
        ))}
      </div>
    </section>
  );
}
