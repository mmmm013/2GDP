'use client';
import { useState, useRef, useEffect, useCallback , type ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat } from 'lucide-react';
import { gpmET } from '@/lib/gpm-et';

/**
 * HEROES FEATURED PLAYER - FP for Heroes Page
 * AUTO-PLAY: Starts after 3 seconds on page
 * SINGLE-SONG: Only ONE audio plays at a time (GPMD rule)
 * VISIBLE: ~20 PIX with full controls - play/stop, volume, skip, repeat
 * CROSS-PAGE: Stops if GlobalPlayer or other FP plays
 * GPM ET: Tracks play, pause, skip, duration, autoPlay, repeat events
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
  const playStartRef = useRef<number>(0);

  const currentTrack = HEROES_PIX[currentIndex];

  // AUTO-PLAY: Start after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!autoPlayTriggered) {
        setAutoPlayTriggered(true);
        // GPMD RULE: Stop all other audio before playing
        window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'heroes-fp' } }));
        setIsPlaying(true);
        // GPM ET: track auto-play
        playStartRef.current = Date.now();
        gpmET.autoPlay({
          title: currentTrack.title,
          vocalist: currentTrack.vocalist,
          source: 'FeaturedPlayer',
        });
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
      // GPM ET: track duration on end
      if (playStartRef.current > 0) {
        const elapsed = (Date.now() - playStartRef.current) / 1000;
        gpmET.duration({
          title: currentTrack.title,
          vocalist: currentTrack.vocalist,
          source: 'FeaturedPlayer',
          seconds: elapsed,
        });
        playStartRef.current = 0;
      }
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
        playStartRef.current = Date.now();
      } else {
        const nextIdx = (currentIndex + 1) % HEROES_PIX.length;
        setCurrentIndex(nextIdx);
      }
    };
    const handleError = () => {
      gpmET.error({
        title: currentTrack.title,
        vocalist: currentTrack.vocalist,
        source: 'FeaturedPlayer',
        errorMsg: 'Track load error',
      });
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
      playStartRef.current = Date.now();
      gpmET.play({
        title: currentTrack.title,
        vocalist: currentTrack.vocalist,
        source: 'FeaturedPlayer',
      });
    } else {
      gpmET.pause({
        title: currentTrack.title,
        vocalist: currentTrack.vocalist,
        source: 'FeaturedPlayer',
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  const skipNext = useCallback(() => {
    gpmET.skip({
      title: currentTrack.title,
      vocalist: currentTrack.vocalist,
      source: 'FeaturedPlayer',
      direction: 'next',
    });
    const nextIdx = (currentIndex + 1) % HEROES_PIX.length;
    setCurrentIndex(nextIdx);
    playStartRef.current = Date.now();
  }, [currentIndex, currentTrack]);

  const skipPrev = useCallback(() => {
    gpmET.skip({
      title: currentTrack.title,
      vocalist: currentTrack.vocalist,
      source: 'FeaturedPlayer',
      direction: 'prev',
    });
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : HEROES_PIX.length - 1;
    setCurrentIndex(prevIdx);
    playStartRef.current = Date.now();
  }, [currentIndex, currentTrack]);

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) setIsMuted(false);
  };

  return (
    <div className="w-full space-y-2">
      {/* Now Playing */}
      {currentTrack && (
        <div className="text-center">
          <p className="text-[10px] text-[#C8A882]/60 tracking-widest">
            {isPlaying ? 'NOW STREAMING' : 'PAUSED'} - Heroes FP
            &nbsp;&nbsp;Track {currentIndex + 1} of {HEROES_PIX.length}
          </p>
          <p className="text-sm text-white font-semibold truncate">
            {currentTrack.title}
            <span className="text-neutral-400 font-normal"> - </span>
            <span className="text-[#C8A882]">{currentTrack.vocalist}</span>
          </p>
        </div>
      )}

      {/* Transport Controls */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={skipPrev} className="text-[#C8A882] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" aria-label="Previous track">
          <SkipBack className="w-5 h-5" />
        </button>

        <button onClick={togglePlay} className="bg-[#C8A882] text-black rounded-full p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-[#d4b896] transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause className="w-5 h-5" fill="black" /> : <Play className="w-5 h-5" fill="black" />}
        </button>

        <button onClick={skipNext} className="text-[#C8A882] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" aria-label="Next track">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#C8A882] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range" min="0" max="1" step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #C8A882 ${(isMuted ? 0 : volume) * 100}%, #555 ${(isMuted ? 0 : volume) * 100}%)` }}
          aria-label="Volume"
        />

        {/* Repeat Button */}
        <button
          onClick={() => {
            gpmET.repeat({
              title: currentTrack.title,
              vocalist: currentTrack.vocalist,
              source: 'FeaturedPlayer',
              enabled: !repeat,
            });
            setRepeat(!repeat);
          }}
          className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors rounded ${
            repeat ? 'bg-[#C8A882]/20 text-[#C8A882]' : 'text-[#C8A882]/40 hover:text-[#C8A882]'
          }`}
          aria-label={repeat ? 'Repeat on' : 'Repeat off'}
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Seek Bar */}
      <div className="flex items-center gap-2 px-2">
        <span className="text-[10px] text-neutral-500 w-8 text-right">{formatTime(currentTime)}</span>
        <input
          type="range" min="0" max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #C8A882 ${(currentTime / (duration || 1)) * 100}%, #555 ${(currentTime / (duration || 1)) * 100}%)` }}
          aria-label="Seek"
        />
        <span className="text-[10px] text-neutral-500 w-8">{formatTime(duration)}</span>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentTrack?.src} preload="auto" />
    </div>
  );
}
