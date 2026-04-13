'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';

/**
 * T20Grid — GPM Top 20 Streaming Activities
 * BIC (Best-In-Class) AUDIO PIPELINE:
 * 1. Corrected column name to 'url'
 * 2. Fallback logic: resolves playable src via storage or direct link
 * 3. SINGLE-SONG: Dispatches stop-all-audio
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

export interface Activity {
  id: string;
  emoji: string;
  label: string;
  mood: string; // matches 'mood' column in 'tracks' table
  accent: string; // Amber-palette accent color per tile
}

export const T20_ACTIVITIES: Activity[] = [
  { id: 'driving', emoji: '🚗', label: 'Driving', mood: 'driving', accent: '#D4A017' },
  { id: 'workout', emoji: '💪', label: 'Workout / Gym', mood: 'energy', accent: '#C04000' },
  { id: 'morning', emoji: '☀️', label: 'Morning Routine', mood: 'uplifting', accent: '#E8B828' },
  { id: 'focus', emoji: '💻', label: 'Work / Focus', mood: 'focus', accent: '#5C8A3C' },
  { id: 'road-trip', emoji: '🛣️', label: 'Road Trip', mood: 'road trip', accent: '#D4A017' },
  { id: 'running', emoji: '🏃‍♂️', label: 'Running', mood: 'high energy', accent: '#C04000' },
  { id: 'cooking', emoji: '🍳', label: 'Cooking', mood: 'happy', accent: '#C8A882' },
  { id: 'dinner', emoji: '🍽️', label: 'Dinner Time', mood: 'dinner', accent: '#8B6914' },
  { id: 'party', emoji: '🥳', label: 'Party', mood: 'party', accent: '#9B2FA0' },
  { id: 'romance', emoji: '❤️', label: 'Date Night', mood: 'romantic', accent: '#C0392B' },
  { id: 'yoga', emoji: '🧘', label: 'Yoga / Mindful', mood: 'calm', accent: '#5C8A3C' },
  { id: 'chill', emoji: '🛋️', label: 'Chill / Relax', mood: 'relaxing', accent: '#3A7BBF' },
  { id: 'wind-down', emoji: '🌙', label: 'Wind Down', mood: 'melancholy', accent: '#2C3E68' },
  { id: 'study', emoji: '📚', label: 'Studying', mood: 'focus', accent: '#8B6914' },
  { id: 'outdoor', emoji: '🌲', label: 'Outdoors', mood: 'adventurous', accent: '#3A7A3A' },
  { id: 'beach', emoji: '🏖️', label: 'Beach / Summer', mood: 'summer', accent: '#2A8FA0' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming', mood: 'high energy', accent: '#7B2FA0' },
  { id: 'coffee', emoji: '☕', label: 'Coffee Shop', mood: 'dreamy', accent: '#8B6914' },
  { id: 'background', emoji: '🎵', label: 'Background', mood: 'background', accent: '#C8A882' },
  { id: 'commute', emoji: '🚍', label: 'Commute', mood: 'uplifting', accent: '#D4A017' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export default function T20Grid() {
  const [activeIndices, setActiveIndices] = useState<number[]>([0, 1, 2]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setActiveIndices((prev) => {
        const nextStart = (prev[0] + 3) % T20_ACTIVITIES.length;
        return [nextStart, (nextStart + 1) % T20_ACTIVITIES.length, (nextStart + 2) % T20_ACTIVITIES.length];
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const handleActivityClick = async (activity: Activity) => {
    if (!supabase) return;
    try {
      // BIC UPDATE: Harmonized query for 'url' and 'file_path'
      const { data: tracks } = await supabase
        .from('tracks')
        .select('id, title, artist, url, file_path')
        .ilike('mood', `%${activity.mood}%`)
        .limit(10);

      const list = tracks || [];
      if (list.length > 0) {
        // eslint-disable-next-line react-hooks/rules-of-hooks -- Math.random is in an event handler, not a hook
        const track = list[Math.floor(Math.random() * list.length)];
        
        // Resolve final playable URL via canonical resolver
        const finalUrl = resolveAudioUrl(track.url || track.file_path || '');

        if (finalUrl) {
          window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 't20' } }));
          window.dispatchEvent(new CustomEvent('play-track', {
            detail: {
              url: finalUrl,
              title: track.title || 'Unknown Track',
              vocalist: track.artist || 'G Putnam Music',
              moodTheme: { primary: activity.accent }
            }
          }));
        }
      }
    } catch (err) {
      console.error('T20Grid error:', err);
    }
  };

  const mobileActivities = activeIndices.map(i => T20_ACTIVITIES[i]);

  return (
    <div className="w-full py-4">
      <div className="flex items-center gap-2 mb-4 px-4">
        <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
        <h3 className="text-[10px] font-bold text-[#D4A017] tracking-[0.3em] uppercase">T20 Activity Streams</h3>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 px-2">
        {(isMobile ? mobileActivities : T20_ACTIVITIES).map((activity) => (
          <button
            key={activity.id}
            onClick={() => handleActivityClick(activity)}
            className="flex flex-col items-center justify-center p-3 aspect-square rounded-2xl bg-[#1a1207] border border-[#5C3A1E]/30 hover:border-[#D4A017]/60 hover:bg-[#D4A017]/10 transition-all group active:scale-95"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{activity.emoji}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C8A882]/80 group-hover:text-white text-center leading-tight">
              {activity.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
