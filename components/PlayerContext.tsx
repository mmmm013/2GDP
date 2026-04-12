'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// --- TYPES ---
export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;      
  duration?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[]; 
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);

  // --- FETCH SONGS FROM 'tracks' TABLE ---
  useEffect(() => {
    const fetchMusic = async () => {
      console.log("🎵 Connecting to G Putnam Archives (tracks)...");
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // Check if environment variables are defined
      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase environment variables not configured. Music features will be limited.');
        return;
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseKey);

      // We use 'tracks' because your Supabase screenshot confirmed this name
      const { data, error } = await supabase
        .from('tracks') 
        .select('*');

      if (error) {
        console.error('❌ Error loading music:', error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Loaded ${data.length} tracks`);
        setQueue(data);
        setCurrentTrack(data[0]); // Load the first song
      } else {
        console.warn('⚠️ Connected to tracks table, but found 0 rows.');
      }
    };

    fetchMusic();
  }, []);

  // 1. Play a specific track 
  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (newQueue) {
      setQueue(newQueue);
    } else if (queue.length === 0) {
      setQueue([track]);
    }
  };

  // 2. Toggle Play/Pause
  const togglePlay = () => {
    if (!currentTrack) return; 
    setIsPlaying((prev) => !prev);
  };

  // 3. Next Track Logic
  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    
    if (currentIndex === -1 || currentIndex === queue.length - 1) {
      setCurrentTrack(queue[0]); 
    } else {
      setCurrentTrack(queue[currentIndex + 1]);
    }
    setIsPlaying(true); 
  };

  // 4. Previous Track Logic
  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);

    if (currentIndex <= 0) {
      setCurrentTrack(queue[queue.length - 1]); 
    } else {
      setCurrentTrack(queue[currentIndex - 1]);
    }
    setIsPlaying(true);
  };

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    queue,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack
  }), [currentTrack, isPlaying, queue]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}