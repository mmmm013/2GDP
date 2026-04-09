'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Heart, Plus, Lock, Clock, Mic } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';

// GPM CONFIG
const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// BUSINESS RULE: 3 HOURS 33 MINUTES
const ROTATION_MS = 12780000; 

// PLAY LIMIT (2 Plays per track per session)
const MAX_PLAYS = 2;

const FP_THEMES = [
  { id: 'FP1', title: 'Wounded & Willing', mood: 'healing' },
  { id: 'FP2', title: 'Midnight Jazz', mood: 'jazz' },
  { id: 'FP3', title: 'High Energy', mood: 'energy' },
  { id: 'FP4', title: 'Deep Focus', mood: 'focus' }
];

export default function Hero() {
  const [currentFP, setCurrentFP] = useState(FP_THEMES[0]);
  const [timeLeft, setTimeLeft] = useState('');
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [playCounts, setPlayCounts] = useState<{[key:string]: number}>({});
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. GLOBAL 3:33 CLOCK
  useEffect(() => {
    const updateRotation = () => {
      const now = Date.now();
      // Calculate which "3:33 Block" of history we are in
      const globalIndex = Math.floor(now / ROTATION_MS) % FP_THEMES.length;
      setCurrentFP(FP_THEMES[globalIndex]);

      // Calculate time remaining in this block
      const nextSwitch = (Math.floor(now / ROTATION_MS) + 1) * ROTATION_MS;
      const msRemaining = nextSwitch - now;
      const mins = Math.floor((msRemaining / (1000 * 60)) % 60);
      const hrs = Math.floor((msRemaining / (1000 * 60 * 60)));
      setTimeLeft(`${hrs}h ${mins}m`);
    };

    updateRotation(); // Initial check
    const timer = setInterval(updateRotation, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // 2. FETCH TRACKS FOR CURRENT FP
  useEffect(() => {
    async function fetchFPTracks() {
      const { data } = await supabase
        .from('tracks')
        .select('*')
        .ilike('tags', `%${currentFP.mood}%`)
        .limit(8);
      if (data) setPlaylist(data);
    }
    fetchFPTracks();
  }, [currentFP]);

  // 3. PLAY LOGIC WITH LIMITS
  const handlePlay = (index: number) => {
    const track = playlist[index];
    const currentCount = playCounts[track.id] || 0;

    if (currentCount >= MAX_PLAYS) {
      alert("You've played this Taste Treat twice! Add to URU or Join the Pride for unlimited plays.");
      return;
    }

    // Increment count if starting new track
    if (currentTrackIndex !== index || !isPlaying) {
      setPlayCounts(prev => ({...prev, [track.id]: currentCount + 1}));
    }

    setAudioError('');
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const addToURU = (track: any) => {
    // In a real app, this saves to local storage or DB
    alert(`"${track.title}" added to your URU Story! (Sponsor required to play full story)`);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setAudioError('');
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
          setAudioError('Playback blocked or unavailable. Tap play again.');
        });
      }
    }
  };

  const activeTrack = playlist[currentTrackIndex];

  return (
    <section className="relative min-h-[60vh] w-full flex flex-col items-center justify-center p-8 bg-[#FFF8E1]">
      
      {/* 3:33 TIMER BADGE */}
      <div className="absolute top-4 right-4 bg-[#3E2723] text-[#FFD54F] px-4 py-2 rounded-full font-mono text-xs font-bold flex items-center gap-2 shadow-lg">
        <Clock size={14} />
        <span>NEXT VIBE IN: {timeLeft}</span>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-[#FFD54F] text-[#3E2723] px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-4">
           Current Taste Treat
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#3E2723] mb-2">{currentFP.title}</h1>
        <p className="text-[#E65100] font-bold uppercase tracking-widest text-sm">GPM Featured Selection</p>
      </div>

      {/* PLAYER */}
      <div className="bg-white border-2 border-[#3E2723] p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(62,39,35,1)] w-full max-w-2xl">
        
        {activeTrack && (
           <div className="flex items-center justify-between mb-8 bg-[#FFECB3] p-4 rounded-xl border border-[#3E2723]/10">
              <div className="flex items-center gap-4">
                 <button onClick={togglePlay} className="w-12 h-12 bg-[#3E2723] text-[#FFD54F] rounded-full flex items-center justify-center hover:scale-110 transition">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                 </button>
                 <div>
                    <div className="font-black text-[#3E2723]">{activeTrack.title}</div>
                    <div className="text-xs font-bold text-[#E65100] uppercase">Now Playing</div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => addToURU(activeTrack)} className="p-2 hover:bg-[#3E2723]/10 rounded-full text-[#3E2723]" title="Add to URU">
                    <Plus size={20} />
                 </button>
                 <button className="p-2 hover:bg-[#3E2723]/10 rounded-full text-[#E91E63]" title="Favorite">
                    <Heart size={20} />
                 </button>
              </div>
           </div>
        )}

        <div className="space-y-2">
           {audioError && (
             <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
               {audioError}
             </div>
           )}
           {playlist.map((track, idx) => (
              <div key={track.id || idx} className={`flex items-center justify-between p-3 rounded-xl transition ${idx === currentTrackIndex ? 'bg-[#3E2723] text-[#FFD54F]' : 'hover:bg-[#FFF8E1] text-[#3E2723]'}`}>
                 <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => handlePlay(idx)}>
                    <div className="text-xs font-mono opacity-50">0{idx + 1}</div>
                    <div className="font-bold text-sm">{track.title}</div>
                 </div>
                 
                 {/* 2-PLAY LIMIT INDICATOR */}
                 <div className="flex items-center gap-2">
                    <div className="text-[10px] font-bold opacity-50 uppercase">
                       {(playCounts[track.id] || 0)} / {MAX_PLAYS} Plays
                    </div>
                    {playCounts[track.id] >= MAX_PLAYS && <Lock size={14} className="text-[#E65100]" />}
                 </div>
              </div>
           ))}
        </div>
      </div>

      {activeTrack && (
        <audio
          ref={audioRef}
          src={resolveAudioUrl(activeTrack.public_url || activeTrack.url || '') || undefined}
          onEnded={() => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)}
          onError={() => {
            setIsPlaying(false);
            setAudioError('Track unavailable right now. Try another selection.');
          }}
          autoPlay={isPlaying}
        />
      )}

    </section>
  );
}
