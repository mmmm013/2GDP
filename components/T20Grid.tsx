'use client';

/**
 * T20Grid — GPM Top 20 Streaming Activities
 *
 * Design spec:
 *  • Amber brand (#D4A017 / #C8A882 / #2A1506 / #1a1207)
 *  • Desktop: 5-column grid — all 20 visible at once
 *  • Mobile: 3 tiles visible at a time; cycles through shuffled groups of 3
 *    every 60 s, ensuring all 20 are shown within a 20-minute window
 *  • Each tile dispatches 'play-track' event via mood-proxy when clicked,
 *    streaming GPM tracks matching that activity's mood tag
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// TOP 20 ACTIVITY DEFINITIONS
// ---------------------------------------------------------------------------

export interface Activity {
  id: string;
  emoji: string;
  label: string;
  mood: string;       // matches `mood` column in `tracks` table
  accent: string;     // Amber-palette accent color per tile
}

export const T20_ACTIVITIES: Activity[] = [
  { id: 'driving',      emoji: '🚗', label: 'Driving',         mood: 'driving',      accent: '#D4A017' },
  { id: 'workout',      emoji: '💪', label: 'Workout / Gym',   mood: 'energy',       accent: '#C04000' },
  { id: 'morning',      emoji: '☀️',  label: 'Morning Routine', mood: 'uplifting',    accent: '#E8B828' },
  { id: 'focus',        emoji: '💻', label: 'Work / Focus',    mood: 'focus',        accent: '#5C8A3C' },
  { id: 'road-trip',    emoji: '🛣️',  label: 'Road Trip',       mood: 'road trip',    accent: '#D4A017' },
  { id: 'running',      emoji: '🏃', label: 'Running',         mood: 'high energy',  accent: '#C04000' },
  { id: 'cooking',      emoji: '🍳', label: 'Cooking',         mood: 'happy',        accent: '#C8A882' },
  { id: 'dinner',       emoji: '🍽️', label: 'Dinner Time',     mood: 'dinner',       accent: '#8B6914' },
  { id: 'party',        emoji: '🎉', label: 'Party',           mood: 'party',        accent: '#9B2FA0' },
  { id: 'romance',      emoji: '❤️',  label: 'Date Night',      mood: 'romantic',     accent: '#C0392B' },
  { id: 'yoga',         emoji: '🧘', label: 'Yoga / Mindful',  mood: 'calm',         accent: '#5C8A3C' },
  { id: 'chill',        emoji: '🛋️', label: 'Chill / Relax',   mood: 'relaxing',     accent: '#3A7BBF' },
  { id: 'wind-down',    emoji: '🌙', label: 'Wind Down',       mood: 'melancholy',   accent: '#2C3E6B' },
  { id: 'study',        emoji: '📚', label: 'Studying',        mood: 'focus',        accent: '#5C8A3C' },
  { id: 'outdoor',      emoji: '🌲', label: 'Outdoors',        mood: 'adventurous',  accent: '#3A7A3A' },
  { id: 'beach',        emoji: '🏖️', label: 'Beach / Summer',  mood: 'summer',       accent: '#2A8FA0' },
  { id: 'gaming',       emoji: '🎮', label: 'Gaming',          mood: 'high energy',  accent: '#7B2FA0' },
  { id: 'coffee',       emoji: '☕', label: 'Coffee Shop',     mood: 'dreamy',       accent: '#8B6914' },
  { id: 'background',   emoji: '🎵', label: 'Background',      mood: 'background',   accent: '#C8A882' },
  { id: 'commute',      emoji: '🚇', label: 'Commute',         mood: 'uplifting',    accent: '#D4A017' },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Chunk array into groups of N */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

// ---------------------------------------------------------------------------
// SINGLE TILE
// ---------------------------------------------------------------------------

function ActivityTile({
  activity,
  isActive,
  isFlashing,
  onClick,
}: {
  activity: Activity;
  isActive: boolean;
  isFlashing: boolean;
  onClick: (a: Activity) => void;
}) {
  return (
    <button
      onClick={() => onClick(activity)}
      className={`
        group relative flex flex-col items-center justify-center gap-1.5
        rounded-xl border transition-all duration-200
        min-h-[80px] md:min-h-[96px] px-2 py-3 w-full
        active:scale-95
        ${isFlashing ? 'scale-105 brightness-150 duration-75' : ''}
        ${isActive
          ? 'bg-[#2a1f0f] border-[#D4A017] shadow-[0_0_18px_rgba(212,160,23,0.6)]'
          : 'bg-[#1a1207] border-[#5C3A1E]/40 hover:border-[#C8A882]/60 hover:bg-[#221508]'
        }
      `}
      aria-label={`Stream ${activity.label}`}
      style={isFlashing ? { boxShadow: `0 0 32px ${activity.accent}99` } : undefined}
    >
      {/* Color accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl transition-opacity duration-200"
        style={{
          background: activity.accent,
          opacity: isActive ? 1 : 0.35,
        }}
      />

      <span className={`text-xl md:text-2xl leading-none transition-transform duration-75 ${isFlashing ? 'scale-125' : ''}`} role="img" aria-hidden>
        {activity.emoji}
      </span>
      <span
        className={`text-[10px] md:text-xs font-bold uppercase tracking-wider leading-tight text-center transition-colors ${
          isActive ? 'text-[#D4A017]' : 'text-[#C8A882]/70 group-hover:text-[#C8A882]'
        }`}
      >
        {activity.label}
      </span>

      {isActive && (
        <span className="absolute bottom-1.5 inline-flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[#D4A017] animate-pulse"
              style={{
                height: `${6 + i * 3}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function T20Grid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flashingId, setFlashingId] = useState<string | null>(null);

  // Mobile carousel state
  // We work with shuffled groups of 3; cycle advances every 60s
  const [mobileGroups, setMobileGroups] = useState<Activity[][]>(() =>
    chunkArray(shuffleArray(T20_ACTIVITIES), 3)
  );
  const [groupIndex, setGroupIndex] = useState(0);
  const groupCount = mobileGroups.length; // ~7 groups to cover all 20

  // Re-shuffle groups every time we complete a full cycle (all 20 shown)
  const cycleRef = useRef(0);

  useEffect(() => {
    // 60s per group × 7 groups ≈ 7 min per pass; user sees all 20 well within 20 min
    const interval = setInterval(() => {
      setGroupIndex((prev) => {
        const next = (prev + 1) % groupCount;
        if (next === 0) {
          // Completed a full cycle — reshuffle for variety
          setMobileGroups(chunkArray(shuffleArray(T20_ACTIVITIES), 3));
          cycleRef.current += 1;
        }
        return next;
      });
    }, 60_000); // 60 seconds per group

    return () => clearInterval(interval);
  }, [groupCount]);

  // Supabase client for mood queries
  const sbRef = useRef<ReturnType<typeof createClient> | null>(null);
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) sbRef.current = createClient(url, key);
  }, []);

  const handleTileClick = useCallback(async (activity: Activity) => {
    // Trigger flash animation
    setFlashingId(activity.id);
    setTimeout(() => setFlashingId(null), 400);

    setActiveId(activity.id);

    // Notify MC-BOT of mood shift via custom event
    window.dispatchEvent(new CustomEvent('t20-mood-change', { detail: { mood: activity.label, emoji: activity.emoji } }));

    const sb = sbRef.current;
    if (!sb) return;

    try {
      type TrackRow = { id: string; title: string; artist: string; url: string };
      // Fetch tracks matching this mood
      let { data: tracks } = await sb
        .from('tracks')
        .select('id, title, artist, url')
        .ilike('mood', `%${activity.mood}%`)
        .not('url', 'is', null)
        .neq('url', '')
        .limit(30) as { data: TrackRow[] | null; error: unknown };

      if (!tracks || tracks.length === 0) {
        // Fallback: any track
        const { data: fallback } = await sb
          .from('tracks')
          .select('id, title, artist, url')
          .not('url', 'is', null)
          .neq('url', '')
          .limit(10) as { data: TrackRow[] | null; error: unknown };
        tracks = fallback ?? [];
      }

      if (tracks && tracks.length > 0) {
        const pick = tracks[Math.floor(Math.random() * tracks.length)];

        // Resolve storage URL if relative
        const rawUrl = (pick.url as string) ?? '';
        const resolvedUrl = rawUrl.startsWith('http')
          ? rawUrl
          : `https://lbzpfqarraegkghxwbah.supabase.co/storage/v1/object/public/tracks/${rawUrl.split('/').pop()}`;

        window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 't20' } }));
        window.dispatchEvent(
          new CustomEvent('play-track', {
            detail: {
              url: resolvedUrl,
              title: (pick.title as string) ?? activity.label,
              vocalist: (pick.artist as string) ?? 'G Putnam Music',
              moodTheme: { primary: activity.accent },
            },
          })
        );
      }
    } catch (err) {
      console.error('T20Grid: failed to load tracks for activity', activity.id, err);
    }
  }, []);

  // Which tiles are visible on mobile right now
  const mobileTiles = mobileGroups[groupIndex] ?? [];

  return (
    <section className="w-full bg-[#110d06] border-t border-[#5C3A1E]/20 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A882]/50 mb-0.5">GPM — gtmplt Amber</p>
            <h2 className="text-sm md:text-base font-bold text-[#C8A882] tracking-wide">
              Top 20 Streaming Activities
            </h2>
          </div>
          {/* Mobile group indicator */}
          <div className="md:hidden flex items-center gap-1">
            {mobileGroups.map((_, i) => (
              <button
                key={i}
                onClick={() => setGroupIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === groupIndex ? 'bg-[#D4A017] w-3' : 'bg-[#5C3A1E]/60'
                }`}
                aria-label={`Show group ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── DESKTOP: all 20 in 5-column grid ── */}
        <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-10 gap-2">
          {T20_ACTIVITIES.map((activity) => (
            <ActivityTile
              key={activity.id}
              activity={activity}
              isActive={activeId === activity.id}
              isFlashing={flashingId === activity.id}
              onClick={handleTileClick}
            />
          ))}
        </div>

        {/* ── MOBILE: 3-tile carousel ── */}
        <div className="md:hidden grid grid-cols-3 gap-2">
          {mobileTiles.map((activity) => (
            <ActivityTile
              key={activity.id}
              activity={activity}
              isActive={activeId === activity.id}
              isFlashing={flashingId === activity.id}
              onClick={handleTileClick}
            />
          ))}
        </div>

        {/* Mobile caption */}
        <p className="md:hidden text-center text-[9px] text-[#C8A882]/30 mt-3 tracking-wide">
          Tap any activity · Rotates every 60 s · All 20 shown per cycle
        </p>
      </div>
    </section>
  );
}
