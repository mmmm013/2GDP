'use client';

import React, { useState } from 'react';

// 1. Define strict type to enforce the Primary Key
interface Track {
  track_id: string;
  title: string;
  stream_url: string;
  [key: string]: any; // Allow other properties
}

const VIBES = [
  { name: 'Melancholy', label: 'MELANCHOLY', color: 'border-blue-500 hover:shadow-blue-500/50' },
  { name: 'DREAMY', label: 'DREAMY', color: 'border-purple-500 hover:shadow-purple-500/50' },
  { name: 'Focus', label: 'FOCUS', color: 'border-teal-500 hover:shadow-teal-500/50' },
  // BRANDING COMPLIANT: Amber for Uplifting
  { name: 'Uplifting', label: 'UPLIFTING', color: 'border-amber-500 hover:shadow-amber-500/50' },
  { name: 'High Energy', label: 'HIGH ENERGY', color: 'border-red-500 hover:shadow-red-500/50' },
];

export default function MoodGrid() {
  const [loadingVibe, setLoadingVibe] = useState<string | null>(null);

  const fetchTracksByMood = async (selectedVibe: string) => {
    try {
      setLoadingVibe(selectedVibe);
      console.log(`Fetching tracks for vibe: ${selectedVibe}...`);

      const isPremium = false;
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

      if (!supabaseUrl || !anonKey) {
        console.error("CRITICAL: Missing Supabase Environment Variables");
        return;
      }

      const url = `${supabaseUrl}/functions/v1/mood-proxy/stream?mood=${encodeURIComponent(selectedVibe.toLowerCase())}&premium=${isPremium}&n=10`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`
        }
      });

      if (res.status === 429) {
        console.warn("Rate limit hit - please wait a moment.");
        return;
      }

      if (!res.ok) {
        throw new Error(`Supabase error: ${res.statusText}`);
      }

      const rawData = await res.json();
      
      if (rawData && Array.isArray(rawData) && rawData.length > 0) {
        
        // 2. SAFETY NORMALIZATION: Ensure 'track_id' exists for every item
        // This bridges the gap between CSV headers and Component props
        const validTracks: Track[] = rawData.map((t: any) => ({
          ...t,
          // Force the primary key to be populated, checking all likely variants
          track_id: t.track_id || t['track id'] || t.id || `gen-${Math.random()}`,
          // Ensure stream_url is accessible
          stream_url: t.stream_url || t.url || t.file_url
        }));

        console.log(`Fetched ${validTracks.length} valid tracks for ${selectedVibe}.`);
        // TODO: Integrate with player queue if needed 
      } else {
        console.warn("No tracks returned for this vibe.");
      }

    } catch (error) {
      console.error("Error fetching mood:", error);
    } finally {
      setLoadingVibe(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* BRANDING FIX: Amber Text */}
      <h2 className="text-2xl font-bold text-white mb-6">Select Your <span className="text-amber-500">Vibe</span></h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {VIBES.map((vibe) => (
          <div
            key={vibe.name}
            onClick={() => fetchTracksByMood(vibe.name)}
            className={`
              relative group cursor-pointer 
              flex flex-col items-center justify-center 
              h-32 md:h-40 rounded-xl border-2 
              /* BRANDING FIX: Changed bg-neutral-900 (Black) to bg-[#2a1b12] (Dark Brown) */
              bg-[#2a1b12] transition-all duration-300
              ${vibe.color}
              ${loadingVibe === vibe.name ? 'opacity-50 animate-pulse' : 'opacity-100'}
            `}
          >
            {/* Added relative z-10 to ensure text stays on top of hover effects */}
            <span className="relative z-10 mt-2 font-bold text-sm md:text-base tracking-wider text-white">
              {loadingVibe === vibe.name ? 'LOADING...' : vibe.label}
            </span>
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity bg-current`} />
          </div>
        ))}
      </div>
    </div>
  );
}
