'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function MusicSystem({ tracks = [] }: { tracks?: any[] }) {
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [boundaries, setBoundaries] = useState({ start: 0, end: null as number | null });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Set boundaries for excerpts
    const startMs = track.start_ms ?? 0;
    const endMs = track.end_ms ?? null;
    setBoundaries({ start: startMs / 1000, end: endMs ? endMs / 1000 : null });

    if (audioRef.current) {
      audioRef.current.src = track.audio_url;
      audioRef.current.currentTime = startMs / 1000;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // ENFORCE EXCERPT BOUNDARIES
      if (boundaries.end !== null && audio.currentTime >= boundaries.end) {
        audio.pause();
        audio.currentTime = boundaries.start;
        setIsPlaying(false);
      }
      if (audio.currentTime < boundaries.start) {
        audio.currentTime = boundaries.start;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [boundaries]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = async () => {
    if (!currentTrack?.audio_url) {
      alert("SYSTEM ERROR: No K-KUT selected.");
      return;
    }
    await navigator.clipboard.writeText(currentTrack.audio_url);
    alert("SECURED: Link for K-KUT copied to clipboard.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-black text-white rounded-lg shadow-lg border border-[#C8A882] font-mono">
      <h2 className="text-xl font-bold text-[#C8A882] mb-4 uppercase tracking-tighter">GPM FLAGSHIP - K-KUT SYSTEM</h2>
      
      <div className="mb-6 p-4 bg-zinc-900 rounded border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold uppercase truncate max-w-md">
              {currentTrack ? currentTrack.title : "SELECT A K-KUT"}
            </h3>
            <p className="text-[#C8A882] text-xs font-medium uppercase">
              {currentTrack ? currentTrack.artist || 'G Putnam Music' : "System Ready"}
            </p>
          </div>
          <button 
            onClick={handleShare}
            disabled={!currentTrack}
            className="px-4 py-2 bg-[#D2B48C] text-black text-xs font-bold rounded hover:bg-[#C8A882] disabled:opacity-50 transition uppercase"
          >
            Share K-KUT
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-full py-3 bg-[#C8A882] text-black font-bold rounded hover:bg-[#D2B48C] disabled:opacity-50 transition uppercase tracking-widest"
          >
            {isPlaying ? "PAUSE K-KUT" : "PLAY K-KUT"}
          </button>
        </div>
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
        {tracks.length === 0 ? (
          <p className="text-zinc-500 text-center py-4 text-xs">No K-KUTs loaded.</p>
        ) : (
          tracks.map((track, idx) => (
            <button
              key={idx}
              onClick={() => playTrack(track)}
              className={`w-full text-left p-3 rounded transition flex justify-between items-center text-xs ${
                currentTrack?.audio_url === track.audio_url 
                ? 'bg-[#C8A882] text-black font-bold' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
              }`}
            >
              <span className="uppercase truncate flex-1 mr-4">{track.title}</span>
              <span className="opacity-60">{track.artist || 'GPM'}</span>
            </button>
          ))
        )}
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
    </div>
  );
}
