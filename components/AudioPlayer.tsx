'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

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

    if (audioRef.current) {
      audioRef.current.src = trackData.url;
      audioRef.current.load();
      setIsBuffering(true);

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setError('');
            setIsBuffering(false);
            console.log('[AUDIO PLAYER] Now playing:', trackData.title);
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
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next track
      if (currentIndex < queue.length - 1) {
        playNext();
      }
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleError = () => {
      setError('Stream error. Retrying...');
      setIsBuffering(false);
      // Auto-retry after 2 seconds
      setTimeout(() => {
        if (audio.src) {
          audio.load();
          audio.play().catch(console.error);
        }
      }, 2000);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [currentIndex, queue]);

  // Preload next track
  useEffect(() => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextTrack = queue[currentIndex + 1];
      if (nextTrack && nextTrack.url) {
        const preloadAudio = new Audio();
        preloadAudio.src = nextTrack.url;
        preloadAudio.preload = 'metadata';
      }
    }
  }, [currentIndex, queue]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setError('');

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error('Playback failed:', err);
            setIsPlaying(false);
            setError('Select a track from Featured Playlists or T20.');
          });
      }
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
    if (currentTime > 3) {
      // If more than 3 seconds in, restart current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else if (currentIndex > 0) {
      // Go to previous track
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      loadAndPlayTrack(queue[prevIndex]);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#2C241B] text-[#FDF6E3] p-4 border-t border-[#FDF6E3]/10 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Error Popup */}
        {error && (
          <div className="mb-2 bg-red-600 text-white text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 w-fit">
            <AlertCircle size={12} /> {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Transport Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={playPrevious}
              disabled={currentIndex === 0 && currentTime < 3}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#FFD54F] hover:bg-[#FFD54F]/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-[#FFD54F] rounded-full flex items-center justify-center text-[#2C241B] hover:scale-105 transition shadow-lg relative"
            >
              {isBuffering ? (
                <div className="w-5 h-5 border-2 border-[#2C241B] border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause fill="currentColor" />
              ) : (
                <Play fill="currentColor" className="ml-1" />
              )}
            </button>

            <button
              onClick={playNext}
              disabled={currentIndex >= queue.length - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#FFD54F] hover:bg-[#FFD54F]/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>

          {/* Track Info */}
          <div className="overflow-hidden min-w-[150px]">
            <div className="font-bold text-sm text-[#FFD54F] truncate">{track.title}</div>
            <div className="text-xs opacity-50 uppercase tracking-widest truncate">{track.vocalist}</div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs opacity-70 shrink-0 w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-[#FDF6E3]/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFD54F] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-xs opacity-70 shrink-0 w-10">{formatTime(duration)}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleMute}
              className="text-[#FFD54F] hover:bg-[#FFD54F]/10 p-1 rounded transition"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-[#FDF6E3]/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFD54F] [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
