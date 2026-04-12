'use client';

import React, { useState, useEffect, useRef } from 'react';
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';

// FIX: Explicitly typing props as 'any' to stop the TypeScript crash
export default function Player({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrev 
}: {
  currentTrack: any;
  isPlaying: any;
  onPlayPause: any;
  onNext: any;
  onPrev: any;
}) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle Play/Pause side effects
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn("Play interrupted:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-4 w-1/3">
          <div className="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center overflow-hidden">
             {/* If you have artwork, put it here. For now, a music note. */}
            <span className="text-xl">🎵</span>
          </div>
          <div className="truncate">
            <h3 className="text-white font-medium truncate">{currentTrack.title || 'Unknown Title'}</h3>
            <p className="text-sm text-neutral-400 truncate">{currentTrack.artist || 'G Putnam Music'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-6">
            <button onClick={onPrev} className="text-neutral-400 hover:text-white transition">⏮</button>
            <button 
              onClick={onPlayPause} 
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={onNext} className="text-neutral-400 hover:text-white transition">⏭</button>
          </div>
        </div>

        {/* Volume (Simple Static UI for now) */}
        <div className="hidden md:flex items-center justify-end w-1/3 space-x-2">
          <span className="text-xs text-neutral-500">VOL</span>
          <div className="w-24 h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-white" 
                style={{ width: `${volume}%` }} 
            />
          </div>
        </div>
      </div>
      
      {/* Hidden Audio Element handles the actual sound */}
      <audio
        ref={audioRef}
        src={resolveAudioUrl(currentTrack?.url || currentTrack?.public_url || '') || undefined}
        onEnded={onNext}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
      />
    </div>
  );
}