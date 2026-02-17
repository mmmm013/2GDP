'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat } from 'lucide-react';

/**
 * HEROES FEATURED PLAYER - FP for Heroes Page
 * AUTO-PLAY: Starts after 3 seconds on page
 * SINGLE-SONG: Only ONE audio plays at a time (GPMD rule)
 * VISIBLE: ~20 PIX with full controls - play/stop, volume, skip, repeat
 * CROSS-PAGE: Stops if GlobalPlayer or other FP plays
 */

interface Track {
  title: string;
  vocalist: string;
  src: string;
}

const HEROES_PIX: Track[] = [
  { title: 'Reflections', vocalist: 'Kleigh', src: '/pix/kleigh--reflections.mp3' },
  { title: 'I Need an Angel', vocalist: 'G Putnam Music', src: '/pix/i-need-an-angel.mp3' },
  { title: 'Bought Into Your Game', vocalist: 'Kleigh', src: '/pix/bought-into-your-game.mp3' },
  { title: 'Breathing Serenity', vocalist: 'Kleigh', src: '/pix/kleigh--breathing-serenity.mp3' },
  { title: 'Nighttime', vocalist: 'G Putnam Music', src: '/pix/nighttime.mp3' },
  { title: 'Down (Stripped)', vocalist: 'Kleigh', src: '/pix/kleigh--down-(stripped)-with-reverb--69bpm-fmaj.mp3' },
  { title: 'I Was Made to Be Awesome', vocalist: 'G Putnam Music', src: '/pix/i-was-made-to-be-awesome.mp3' },
  { title: 'Perfect Day', vocalist: 'G Putnam Music', src: '/pix/perfect-day.mp3' },
  { title: 'Why Does Life Gotta Be This Hard', vocalist: 'G Putnam Music', src: '/pix/why-does-life-gotta-be-this-hard.mp3' },
  { title: 'Dance Party', vocalist: 'G Putnam Music', src: '/pix/dance-party.mp3' },
  { title: 'Going Outside', vocalist: 'G Putnam Music', src: '/pix/going-outside.mp3' },
  { title: 'I Am a Fighter', vocalist: 'G Putnam Music', src: '/pix/i-am-a-fighter--el-mix-instro.mp3' },
  { title: 'I Live Free', vocalist: 'G Putnam Music', src: '/pix/i-live-free--instro.mp3' },
  { title: "We'll Be Free", vocalist: 'G Putnam Music', src: "/pix/we'll-be-free.mp3" },
  { title: "Fool's Game", vocalist: 'G Putnam Music', src: '/pix/fools-game-(master-2).mp3' },
  { title: 'Jump', vocalist: 'Michael Scherer', src: '/pix/jump.mp3' },
  { title: 'New Orleans Piano Trio', vocalist: 'Michael Scherer', src: '/pix/new-orleans-piano-trio-1.mp3' },
  { title: 'A Calm Evening', vocalist: 'Kleigh', src: '/pix/kleigh--a-calm-evening.mp3' },
  { title: 'Wanna Know You', vocalist: 'G Putnam Music', src: '/pix/wanna-know-you.mp3' },
  { title: 'Waterfall', vocalist: 'Kleigh', src: '/pix/kleigh--waterfall.mp3' },
];

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function HeroesFeaturedPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false);

  const currentTrack = HEROES_PIX[currentIndex];

  // AUTO-PLAY: Start after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!autoPlayTriggered) {
        setAutoPlayTriggered(true);
        // GPMD RULE: Stop all other audio before playing
        window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'heroes-fp' } }));
        setIsPlaying(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [autoPlayTriggered]);

  // SINGLE-SONG: Listen for stop-all-audio from other players
  useEffect(() => {
    const handleStopAll = (e: CustomEvent) => {
      if (e.detail?.source === 'heroes-fp') return; // Don't stop ourselves
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('stop-all-audio', handleStopAll as EventListener);
    return () => {
      window.removeEventListener('stop-all-audio', handleStopAll as EventListener);
    };
  }, [isPlaying]);

  // Audio engine: handle track loading and events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        const nextIdx = (currentIndex + 1) % HEROES_PIX.length;
        setCurrentIndex(nextIdx);
      }
    };
    const handleError = () => {
      const nextIdx = (currentIndex + 1) % HEROES_PIX.length;
      setCurrentIndex(nextIdx);
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
  }, [currentIndex, currentTrack, repeat]);

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.volume = isMuted ? 0 : volume;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex, volume, isMuted, currentTrack]);

  // Controls
  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'heroes-fp' } }));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const skipNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % HEROES_PIX.length;
    setCurrentIndex(nextIdx);
  }, [currentIndex]);

  const skipPrev = useCallback(() => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : HEROES_PIX.length - 1;
    setCurrentIndex(prevIdx);
  }, [currentIndex]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) setIsMuted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6" role="region" aria-label="Heroes Featured Player">
      <div className="bg-[#2a1f0f] border-2 border-[#C8A882]/30 rounded-xl p-4">
        {/* Now Playing */}
        {currentTrack && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#C8A882]/70">
                {isPlaying ? 'NOW STREAMING' : 'PAUSED'} - Heroes FP
              </span>
              <span className="text-[10px] text-[#C8A882]/50">
                Track {currentIndex + 1} of {HEROES_PIX.length}
              </span>
            </div>
            <div className="text-white font-bold text-base">
              {currentTrack.title}
              <span className="text-[#C8A882]/80 font-normal ml-2 text-sm">- {currentTrack.vocalist}</span>
            </div>
          </div>
        )}

        {/* Transport Controls */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={skipPrev}
            className="text-[#C8A882] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Previous track"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="bg-[#C8A882] text-black rounded-full p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-[#D4A017] transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
          </button>
          <button
            onClick={skipNext}
            className="text-[#C8A882] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Next track"
          >
            <SkipForward size={18} />
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#C8A882] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #C8A882 ${(isMuted ? 0 : volume) * 100}%, #555 ${(isMuted ? 0 : volume) * 100}%)`
              }}
              aria-label="Volume"
            />
          </div>

          {/* Repeat Button */}
          <button
            onClick={() => setRepeat(!repeat)}
            className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors rounded ${
              repeat ? 'bg-[#C8A882]/20 text-[#C8A882]' : 'text-[#C8A882]/40 hover:text-[#C8A882]'
            }`}
            aria-label={repeat ? 'Repeat on' : 'Repeat off'}
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-2 text-xs text-[#C8A882]/60">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C8A882 ${(currentTime / (duration || 1)) * 100}%, #555 ${(currentTime / (duration || 1)) * 100}%)`
            }}
            aria-label="Seek"
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentTrack?.src || ''} preload="none" />
    </div>
  );
}
