'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Heart, Star, BookOpen, Sun, Moon, Music } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';

export default function Singalongs() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [loading, setLoading] = useState(false);
   const [audioError, setAudioError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // THE LOGIC: Fetch from SHARED CATALOG, but Filter for THIS BRAND
  async function playMood(moodTag: string) {
    if (activeMood === moodTag && isPlaying) {
      // Pause if clicking same mood
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setLoading(true);
    setActiveMood(moodTag);
   setAudioError('');
    
      // FETCH FROM MASTER GPM VAULT
      const { data: supaData, error } = await supabase
         .from('tracks')
         .select('*')
         .ilike('tags', `%${moodTag}%`) // Filter by the mood
         .limit(1); // Grab one to start (Radio Mode)

      // ALSO MERGE IN LOCAL AWESOME SQUAD TRACKS (public/handoff/awesome-squad.json)
      let localData: any[] = []
      try {
         const res = await fetch('/handoff/awesome-squad.json')
         if (res.ok) localData = await res.json()
      } catch (e) {
         console.warn('No local Awesome Squad data', e)
      }

      const merged = [] as any[]
      if (supaData && supaData.length > 0) merged.push(...supaData)
      // append all local items (dedupe by public_url/name)
      for (const it of localData) {
         // normalize to match supabase track shape used elsewhere
         const t = {
            id: it.id,
            name: it.title,
            artist: it.artist,
            public_url: it.public_url,
            tags: (it.tags || []).join(','),
            _local: true
         }
         // avoid duplicates by public_url
         if (!merged.find(m => m.public_url === t.public_url)) merged.push(t)
      }

      if (merged.length > 0) {
         const track = merged[0]
         setCurrentTrack(track)
         setIsPlaying(true)
         setLoading(false)
      } else {
         console.log('No tracks found for this mood in GPM Catalog or local Awesome Squad list');
         setLoading(false);
      }
  }

  // CLEANER FOR DISPLAY
  const cleanTitle = (text: string) => {
    if (!text) return 'Select a Vibe...';
    return text.replace(/^\d+\s*-\s*/, '')
               .replace(/g\s*putnam\s*music\s*-\s*/i, '')
               .replace(/\.mp3|\.wav/gi, '')
               .replace(/_/g, ' ');
  };

  return (
    // BRANDING: BLUE IDENTITY (#F0F8FF)
    <main className="min-h-screen bg-[#F0F8FF] text-[#3E2723] font-sans selection:bg-[#FF7043] selection:text-white pb-32">
      
      {/* SHARED AUDIO ENGINE */}
      <audio 
        ref={audioRef} 
            src={resolveAudioUrl(currentTrack?.public_url || currentTrack?.url || '') || undefined} 
        autoPlay 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)} // Future: Auto-play next
            onError={() => {
               setIsPlaying(false);
               setAudioError('Track unavailable right now. Please try another vibe.');
            }}
      />

      {/* TOP NAV: GPM AUTHORITY */}
      <nav className="p-6 flex justify-between items-center bg-white shadow-sm border-b-4 border-[#FF7043] sticky top-0 z-50">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#3E2723] rounded-lg flex items-center justify-center border-2 border-[#F5DEB3] shadow-md">
               <span className="text-[#FFCA28] font-black text-xs tracking-tighter leading-none text-center">GPM<br/>LLC</span>
            </div>
            <div className="leading-tight">
               <h1 className="font-black text-xl tracking-tight text-[#3E2723]">The Singalongs</h1>
               <p className="text-xs font-bold text-[#FF7043] uppercase tracking-widest">By G Putnam Music</p>
            </div>
         </div>
         <button className="bg-[#FF7043] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition flex items-center gap-2">
            <Star size={18} fill="currentColor" /> Get Access
         </button>
      </nav>

      {/* HERO */}
      <div className="container mx-auto mt-16 px-4 text-center">
         <div className="inline-block bg-[#E1F5FE] text-[#0288D1] px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest mb-6 border border-[#B3E5FC]">
            Pediatric & Classroom Approved
         </div>
         <h1 className="text-5xl md:text-7xl font-black text-[#0277BD] mb-6 drop-shadow-sm tracking-tight leading-tight">
            Songs that <span className="text-[#FF7043] underline decoration-[#FFCCBC]">Heal & Teach.</span>
         </h1>

         {/* ACTIVE PLAYER STATUS (Only shows when playing) */}
         <div className={`transition-all duration-500 ${currentTrack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-[#3E2723] text-[#F5DEB3] inline-block px-8 py-4 rounded-2xl shadow-2xl mb-12 flex items-center gap-4">
                <div className="animate-pulse w-3 h-3 bg-[#FF7043] rounded-full"></div>
                <div className="text-left">
                    <div className="text-xs font-bold opacity-50 uppercase tracking-widest">Now Playing From GPM Vault</div>
                    <div className="text-xl font-black">{cleanTitle(currentTrack?.name || currentTrack?.title)}</div>
                </div>
            </div>
                  {audioError && (
                     <div className="mb-8 text-sm font-bold text-red-700 bg-red-100 border border-red-200 rounded-xl px-4 py-2 inline-block">
                        {audioError}
                     </div>
                  )}
         </div>

         {/* THE "SQUISHY" BUTTON GRID */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-24">
            
            {/* 1. CALMING */}
            <button onClick={() => playMood('ambient')} className={`group bg-white border-b-8 border-[#4FC3F7] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition flex flex-col items-center gap-4 ${activeMood === 'ambient' && isPlaying ? 'border-none translate-y-2 bg-[#E1F5FE]' : ''}`}>
               <div className="w-20 h-20 bg-[#E1F5FE] rounded-full flex items-center justify-center">
                 {activeMood === 'ambient' && isPlaying ? <Pause size={40} className="text-[#0288D1]" /> : <Moon size={40} className="text-[#0288D1]" />}
               </div>
               <span className="font-black text-xl uppercase tracking-wide text-[#3E2723]">Calming</span>
            </button>

            {/* 2. ACTIVITY */}
            <button onClick={() => playMood('energy')} className={`group bg-white border-b-8 border-[#FFD54F] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition flex flex-col items-center gap-4 ${activeMood === 'energy' && isPlaying ? 'border-none translate-y-2 bg-[#FFF8E1]' : ''}`}>
               <div className="w-20 h-20 bg-[#FFF8E1] rounded-full flex items-center justify-center">
                 {activeMood === 'energy' && isPlaying ? <Pause size={40} className="text-[#FF8F00]" /> : <Sun size={40} className="text-[#FF8F00]" />}
               </div>
               <span className="font-black text-xl uppercase tracking-wide text-[#3E2723]">Activity</span>
            </button>

            {/* 3. FOCUS */}
            <button onClick={() => playMood('focus')} className={`group bg-white border-b-8 border-[#AED581] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition flex flex-col items-center gap-4 ${activeMood === 'focus' && isPlaying ? 'border-none translate-y-2 bg-[#F1F8E9]' : ''}`}>
               <div className="w-20 h-20 bg-[#F1F8E9] rounded-full flex items-center justify-center">
                 {activeMood === 'focus' && isPlaying ? <Pause size={40} className="text-[#558B2F]" /> : <BookOpen size={40} className="text-[#558B2F]" />}
               </div>
               <span className="font-black text-xl uppercase tracking-wide text-[#3E2723]">Focus</span>
            </button>

            {/* 4. SLEEP */}
            <button onClick={() => playMood('sleep')} className={`group bg-white border-b-8 border-[#BA68C8] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition flex flex-col items-center gap-4 ${activeMood === 'sleep' && isPlaying ? 'border-none translate-y-2 bg-[#F3E5F5]' : ''}`}>
               <div className="w-20 h-20 bg-[#F3E5F5] rounded-full flex items-center justify-center">
                 {activeMood === 'sleep' && isPlaying ? <Pause size={40} className="text-[#7B1FA2]" /> : <Star size={40} className="text-[#7B1FA2]" />}
               </div>
               <span className="font-black text-xl uppercase tracking-wide text-[#3E2723]">Sleep</span>
            </button>

         </div>
      </div>
    </main>
  );
}
