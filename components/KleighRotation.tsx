"use client";

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

// --- CONFIGURATION START ---

// 1. HERO IMAGES ROTATION
// Add as many filenames as you want here. The system will cycle through them automatically.
const HERO_IMAGES = [
  "/gpm_qrcode.png",  // Image 1
  "/gpm_qrcode.png"   // Image 2 (Replace with real filename when ready)
];

// 2. THE 7 EXCLUSIVE KLEIGH PLAYLISTS
// Playlists are identified by title (ASCAP single source of truth)
const KLEIGH_PLAYLISTS = [
  { title: "KLEIGH: POP ANTHEMS" },
  { title: "KLEIGH: BALLADS" },
  { title: "KLEIGH: REMIXES" },
  { title: "KLEIGH: ACOUSTIC" },
  { title: "KLEIGH: INSTRUMENTAL" },
  { title: "KLEIGH: LIVE" },
  { title: "KLEIGH: UNRELEASED" }
];

// 3. THE INTERVAL: 3 Hours, 33 Minutes, 33 Seconds
const ROTATION_MS = (3 * 60 * 60 * 1000) + (33 * 60 * 1000) + (33 * 1000);

// --- CONFIGURATION END ---

export default function KleighRotation() {
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [timeUntilNext, setTimeUntilNext] = useState("");

  useEffect(() => {
    const calculateRotation = () => {
      const now = Date.now();
      
      // Calculate how many "shifts" have passed since 1970
      const totalIntervals = Math.floor(now / ROTATION_MS);
      
      // 1. PLAYLIST ROTATION (Cycles through 7)
      setPlaylistIndex(totalIntervals % KLEIGH_PLAYLISTS.length);

      // 2. IMAGE ROTATION (Cycles through however many images are in the list)
      // This allows you to add more images later without breaking the code.
      setImageIndex(totalIntervals % HERO_IMAGES.length);

      // 3. COUNTDOWN TIMER
      const nextSwitch = (totalIntervals + 1) * ROTATION_MS;
      const diff = nextSwitch - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNext(`${h}h ${m}m ${s}s`);
    };

    calculateRotation();
    const interval = setInterval(calculateRotation, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentPlaylist = KLEIGH_PLAYLISTS[playlistIndex];
  const currentImage = HERO_IMAGES[imageIndex];

  return (
    <section className="relative w-full min-h-screen flex flex-col bg-black text-white overflow-hidden">
      
      {/* 1. DYNAMIC HERO SECTION */}
      <div className="relative h-[55vh] w-full overflow-hidden">
        
        {/* Background Image Layer */}
        <div 
          key={imageIndex} // Key change forces a smooth fade animation when image switches
          className="absolute inset-0 bg-cover bg-center animate-fade-in scale-105"
          style={{ 
            backgroundImage: `url(${currentImage})`,
            transition: 'opacity 1s ease-in-out' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 mb-2 tracking-tighter drop-shadow-2xl">
            IT'S KLEIGH
          </h1>
          
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="inline-block border border-pink-500/30 px-6 py-2 rounded-full bg-black/60 backdrop-blur-md">
              <p className="text-xs md:text-sm text-pink-200 tracking-[0.3em] uppercase animate-pulse font-bold">
                NOW STREAMING: {currentPlaylist.title}
              </p>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
              NEXT SHIFT IN: {timeUntilNext}
            </p>
          </div>
        </div>
      </div>

      {/* 2. THE FEATURED PLAYLIST PLAYER */}
      <div className="flex-1 bg-neutral-900 relative -mt-24 rounded-t-[3rem] z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/5">
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
          
          <div className="w-full max-w-5xl">
            <div className="relative aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-black ring-1 ring-white/10 flex items-center justify-center">
              {/* GPMC internal player — playlist resolved by title, not a third-party ID */}
              <div className="text-center px-8">
                <p className="text-pink-400 text-lg font-bold tracking-widest uppercase mb-2">
                  {currentPlaylist.title}
                </p>
                <p className="text-neutral-500 text-xs tracking-widest">
                  GPMC Stream Engine — tap a track to begin
                </p>
              </div>
            </div>
          </div>

          {/* SPONSORSHIP CTA */}
          <div className="mt-12">
            <a 
              href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
              target="_blank"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-700 to-yellow-900 rounded-full text-white text-xs font-bold tracking-[0.2em] hover:brightness-110 transition shadow-lg border border-yellow-500/20"
            >
              <Zap size={16} className="text-yellow-400 group-hover:scale-110 transition-transform" />
              SPONSOR THE ART
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
