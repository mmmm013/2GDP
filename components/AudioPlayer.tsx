'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';

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

  // Listen for play-track events from FeaturedPlaylists and T20
  useEffect(() => {
    const handlePlayTrack = (event: any) => {
      const trackData = event.detail;
      console.log('[AUDIO PLAYER] Received play-track event:', trackData);
      
      // If it's a playlist, set the queue
      if (trackData.playlist && Array.isArray(trackData.playlist)) {
        setQueue(trackData.playlist);
        setCurrentIndex(trackData.index || 0);
        const track = trackData.playlist[trackData.index || 0];
        loadAndPlayTrack(track);
      } else {
        // Single track - add to queue
        setQueue([trackData]);
        setCurrentIndex(0);
        loadAndPlayTrack(trackData);
      }
    };

    window.addEventListener('play-track', handlePlayTrack);
    return () => {
      window.removeEventListener('play-track', handlePlayTrack);
    };
  }, []);

  const loadAndPlayTrack = (trackData: any) => {
    setTrack({
      title: trackData.title,
      vocalist: trackData.vocalist
    });

    // Handle excerpt boundaries for KKs and mKs
    const startMs = trackData.meta?.start_ms ?? trackData.start_ms ?? 0;
    const endMs = trackData.meta?.end_ms ?? trackData.end_ms ?? null;
    
    setBoundaries({ 
      start: startMs / 1000, 
      end: endMs ? endMs / 1000 : null 
    });

    const source = trackData?.public_url || trackData?.url || trackData?.audio_url || '';
    if (!source) {
      setError('No playable source found for this track.');
      setIsBuffering(false);
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = resolveAudioUrl(source);
      audioRef.current.load();
      
      // Set initial position to start boundary
      audioRef.current.currentTime = startMs / 1000;
      
      setIsBuffering(true);
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setError('');
            setIsBuffering(false);
          })
          .catch((err) => {
            console.error('[AUDIO PLAYER] Playback failed:', err);
            setError('Playback failed. Check permissions.');
            setIsBuffering(false);
          });
      }
    }
  };

  // Listen for audio metadata and time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // ENFORCE EXCERPT BOUNDARIES
      if (boundaries.end !== null && audio.currentTime >= boundaries.end) {
        audio.pause();
        audio.currentTime = boundaries.start;
        setIsPlaying(false);
        
        if (currentIndex < queue.length - 1) {
          playNext();
        }
      }
      
      if (audio.currentTime < boundaries.start) {
        audio.currentTime = boundaries.start;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentIndex < queue.length - 1) {
        playNext();
      }
    };

    const handleError = () => {
      setError('Track unavailable right now.');
      setIsBuffering(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentIndex, queue, boundaries]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
        setError('Playback blocked or unavailable.');
      });
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    let clampedTime = newTime;
    if (clampedTime < boundaries.start) clampedTime = boundaries.start;
    if (boundaries.end !== null && clampedTime > boundaries.end) clampedTime = boundaries.end;
    
    setCurrentTime(clampedTime);
    if (audioRef.current) audioRef.current.currentTime = clampedTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const relativeSeconds = Math.max(0, seconds - boundaries.start);
    const mins = Math.floor(relativeSeconds / 60);
    const secs = Math.floor(relativeSeconds % 60);
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
        </div>
      </div>
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
