'use client';

import { useState, useRef, useEffect, useCallback , type ChangeEvent } from 'react';
import { Play, Pause } from 'lucide-react';

interface MakeupTrack {
  title: string;
  artist: string;
  src: string;
  badge: string;
}

const MAKEUP_TRACKS: MakeupTrack[] = [
  {
    title: 'Come Back Come Back',
    artist: 'NATU',
    src: '/demo1.mp3',
    badge: 'Rock Anthem',
  },
  {
    title: 'FLY Again',
    artist: 'KLEIGH',
    src: '/assets/fly-again.mp3',
    badge: 'Feel-Good',
  },
  {
    title: 'I Need an Angel',
    artist: 'KLEIGH',
    src: '/pix/i-need-an-angel.mp3',
    badge: 'Soulful',
  },
];

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TrackCard({ track, index }: { track: MakeupTrack; index: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleStopAll = (e: CustomEvent) => {
      if (e.detail?.source === `makeup-${index}`) return;
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

    const handleFPPlay = () => {
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
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

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onErr = () => {
      setError('Track unavailable');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onErr);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onErr);
    };
  }, []);

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
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: `makeup-${index}` } }));
    }
    setIsPlaying((p) => !p);
  }, [isPlaying, index]);

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  return (
    <div className="bg-[#1a0f00] border border-[#D4A017]/30 rounded-xl p-5 hover:border-[#D4A017]/60 transition-all hover:scale-[1.02] active:scale-95">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-[#D4A017]/60 tracking-wider uppercase">{track.badge}</span>
        {error && <span className="text-red-400 text-[10px]">{error}</span>}
      </div>
      <h3 className="font-bold text-white text-lg mb-1">{track.title}</h3>
      <p className="text-[#D4A017] text-sm font-semibold mb-4">{track.artist}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#D4A017] text-black hover:bg-[#D4A017]/80 transition-colors"
          aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 rounded-full appearance-none cursor-pointer bg-neutral-700"
            aria-label="Seek"
          />
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={track.src} preload="none" />
    </div>
  );
}

export default function MakeupTracks() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-2">
        <span className="text-pink-400">❤️</span> Makeup Tracks
      </h2>
      <p className="text-neutral-400 text-sm mb-8">
        Fresh singles perfect for your Valentine. Preview and fall in love.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MAKEUP_TRACKS.map((track, i) => (
          <TrackCard key={track.title} track={track} index={i} />
        ))}
      </div>
    </section>
  );
}
