"use client";

import { useState, useRef } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

export default function ManagerIntro() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setError('');
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
        setError('Playback unavailable right now.');
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 font-sans">
      {/* Hidden Audio Element - pointing to gpm_intro.m4a */}
      <audio 
        ref={audioRef} 
        src="/audio/gpm_intro.m4a" 
        onEnded={() => setIsPlaying(false)}
      />

      {/* The Player Card */}
      <div className="bg-[#271c19] border border-[#FFD54F]/30 rounded-xl p-4 flex items-center gap-4 shadow-lg hover:border-[#FFD54F] transition-all group">
        
        {/* Play Button */}
        <button 
          onClick={togglePlay}
          className="h-12 w-12 bg-[#FFD54F] rounded-full flex items-center justify-center text-[#3E2723] hover:scale-110 transition-transform shadow-md shrink-0"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1"/>}
        </button>

        {/* Text Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#FFD54F] text-[10px] font-bold uppercase tracking-widest border border-[#FFD54F]/50 px-2 rounded-full flex items-center gap-1">
              <Mic size={10} /> Manager's Log
            </span>
          </div>
          <p className="text-[#D7CCC8] text-sm leading-tight italic">
            "You've stumbled onto something rare..."
          </p>
          <p className="text-xs text-white/40 mt-1 font-mono">
            Greg Putnam • 0:40 • The Untapped Story
          </p>
          {error && <p className="text-xs text-red-300 mt-1">{error}</p>}
        </div>

        {/* Animation */}
        {isPlaying && (
          <div className="flex gap-1 h-8 items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 bg-[#FFD54F] animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
