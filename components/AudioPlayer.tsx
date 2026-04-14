'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Play, Pause, AlertCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';
import { safePlay } from '@/lib/audio/safePlay';
import { AUDIO_UI_MESSAGES } from '@/lib/audio/messages';

let pendingPlayTrack: CustomEvent | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener(
    'play-track',
    (e) => {
      pendingPlayTrack = e as CustomEvent;
    },
    { capture: true }
  );
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [track, setTrack] = useState({ title: 'PICK AN ACTIVITY', vocalist: 'Click any T20 box or GPM PIX to stream' });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boundaries, setBoundaries] = useState<{ start: number; end: number | null }>({ start: 0, end: null });

  const audioRef = useRef<HTMLAudioElement>(null);
  const activeTrackDataRef = useRef<any>(null);
  const urlRefreshAttemptedRef = useRef(false);

  const loadAndPlayTrack = async (trackData: any) => {
    setTrack({
      title: trackData.title,
      vocalist: trackData.vocalist,
    });

    const startMs = trackData.meta?.start_ms ?? trackData.start_ms ?? 0;
    const endMs = trackData.meta?.end_ms ?? trackData.end_ms ?? null;

    setBoundaries({
      start: startMs / 1000,
      end: endMs ? endMs / 1000 : null,
    });

    const source = trackData?.public_url || trackData?.url || trackData?.audio_url || '';
    if (!source) {
      setError(AUDIO_UI_MESSAGES.noSource);
      setIsBuffering(false);
      setIsPlaying(false);
      return;
    }

    activeTrackDataRef.current = trackData;
    urlRefreshAttemptedRef.current = false;

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = resolveAudioUrl(source);
    audio.load();
    audio.currentTime = startMs / 1000;

    setIsBuffering(true);
    const result = await safePlay(audio, 'AudioPlayer-loadAndPlay', { title: trackData.title });
    if (result.ok) {
      setIsPlaying(true);
      setError('');
    } else {
      setIsPlaying(false);
      if (result.error?.name === 'NotAllowedError') {
        setError(AUDIO_UI_MESSAGES.playbackBlocked);
      } else {
        setError(AUDIO_UI_MESSAGES.playbackError);
      }
    }
    setIsBuffering(false);
  };

  const handleAudioError = async () => {
    const trackData = activeTrackDataRef.current;
    if (!trackData?.refreshUrl || urlRefreshAttemptedRef.current) {
      setError(AUDIO_UI_MESSAGES.fileNotFound);
      setIsPlaying(false);
      setIsBuffering(false);
      return;
    }

    try {
      urlRefreshAttemptedRef.current = true;
      const res = await fetch(trackData.refreshUrl, { method: 'POST' });
      if (!res.ok) throw new Error(`Refresh ${res.status}`);
      const json = await res.json();
      const newUrl: string = json.url ?? json.signedUrl;
      if (!newUrl) throw new Error('No URL in refresh response');

      activeTrackDataRef.current = { ...trackData, url: newUrl };
      if (!audioRef.current) return;

      audioRef.current.src = newUrl;
      audioRef.current.load();
      audioRef.current.currentTime = boundaries.start;
      setIsBuffering(true);
      const result = await safePlay(audioRef.current, 'AudioPlayer-urlRefresh');
      if (result.ok) {
        setIsPlaying(true);
        setError('');
      } else if (result.error?.name === 'NotAllowedError') {
        setError(AUDIO_UI_MESSAGES.playbackBlocked);
      } else {
        setError(AUDIO_UI_MESSAGES.playbackError);
      }
    } catch {
      setError(AUDIO_UI_MESSAGES.fileNotFound);
      setIsPlaying(false);
    } finally {
      setIsBuffering(false);
    }
  };

  useEffect(() => {
    const handlePlayTrack = (event: any) => {
      const trackData = event.detail;
      if (trackData.playlist && Array.isArray(trackData.playlist)) {
        setQueue(trackData.playlist);
        setCurrentIndex(trackData.index || 0);
        loadAndPlayTrack(trackData.playlist[trackData.index || 0]);
      } else {
        setQueue([trackData]);
        setCurrentIndex(0);
        loadAndPlayTrack(trackData);
      }
    };

    window.addEventListener('play-track', handlePlayTrack);
    if (pendingPlayTrack) {
      handlePlayTrack(pendingPlayTrack);
      pendingPlayTrack = null;
    }

    return () => window.removeEventListener('play-track', handlePlayTrack);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (boundaries.end !== null && audio.currentTime >= boundaries.end) {
        audio.pause();
        audio.currentTime = boundaries.start;
        setIsPlaying(false);
        if (currentIndex < queue.length - 1) playNext();
      }
      if (audio.currentTime < boundaries.start) {
        audio.currentTime = boundaries.start;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentIndex < queue.length - 1) playNext();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleAudioError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [currentIndex, queue, boundaries]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    const result = await safePlay(audioRef.current, 'AudioPlayer-togglePlay');
    if (result.ok) {
      setIsPlaying(true);
      setError('');
    } else if (result.error?.name === 'NotAllowedError') {
      setError(AUDIO_UI_MESSAGES.playbackBlocked);
    } else {
      setError(AUDIO_UI_MESSAGES.playbackError);
    }
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      loadAndPlayTrack(queue[nextIndex]);
    }
  };

  const playPrevious = () => {
    const minRewind = boundaries.start + 3;
    if (currentTime > minRewind) {
      if (audioRef.current) audioRef.current.currentTime = boundaries.start;
    } else if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      loadAndPlayTrack(queue[prevIndex]);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    let next = parseFloat(e.target.value);
    if (next < boundaries.start) next = boundaries.start;
    if (boundaries.end !== null && next > boundaries.end) next = boundaries.end;

    setCurrentTime(next);
    if (audioRef.current) audioRef.current.currentTime = next;
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = parseFloat(e.target.value);
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
    setIsMuted(next === 0);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const relative = Math.max(0, seconds - boundaries.start);
    const mins = Math.floor(relative / 60);
    const secs = Math.floor(relative % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#2C241B] text-[#FDF6E3] p-4 border-t border-[#FDF6E3]/10 z-50 shadow-2xl font-mono">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={playPrevious} className="text-[#FFD54F] hover:bg-[#FFD54F]/10 p-1 rounded">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button onClick={togglePlay} className="w-10 h-10 bg-[#FFD54F] rounded-full flex items-center justify-center text-[#2C241B]">
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={playNext} className="text-[#FFD54F] hover:bg-[#FFD54F]/10 p-1 rounded">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex-1">
          <div className="text-xs font-bold text-[#FFD54F] uppercase truncate">{track.title}</div>
          {error && (
            <div className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[10px] opacity-70 w-8">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={boundaries.start}
              max={boundaries.end || duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-[#FDF6E3]/20 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-[10px] opacity-70 w-8">{formatTime(boundaries.end || duration)}</span>
          </div>
          {isBuffering && <div className="text-[10px] text-[#FFD54F] mt-1">Buffering...</div>}
        </div>

        <div className="hidden md:flex items-center gap-2 w-28">
          <button
            onClick={() => {
              if (!audioRef.current) return;
              if (isMuted) {
                audioRef.current.volume = volume || 1;
                setIsMuted(false);
              } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
              }
            }}
            className="text-[#FFD54F]"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="flex-1 h-1" />
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
