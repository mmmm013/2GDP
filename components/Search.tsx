'use client';

import { useState , type FormEvent } from 'react';
import { Search as SearchIcon, Music } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://eajxgrbxvkhfmmfiotpm.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setSearching(true);

    // GPM PROTOCOL: ACCESS ALL TRACKS
    // We search Title, Vocalist, Tags, and Moods across the ENTIRE GPMC.
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,tags.ilike.%${query}%`)
      .limit(20);

    if (data) setResults(data);
    setSearching(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GPM Catalog (Mood, Vocalist, Title)..."
          className="w-full bg-[#3E2723]/10 border-2 border-[#3E2723] rounded-full px-6 py-4 text-[#3E2723] placeholder-[#3E2723]/50 font-bold focus:outline-none focus:bg-[#FFF8E1] transition"
        />
        <button type="submit" className="absolute right-2 top-2 bg-[#3E2723] text-[#FFD54F] p-2 rounded-full hover:scale-110 transition">
          <SearchIcon size={24} />
        </button>
      </form>

      {/* RESULTS AREA */}
      <div className="mt-8 space-y-2">
        {results.map((track) => (
          <div key={track.id} className="bg-[#FFF8E1] border border-[#3E2723]/20 p-4 rounded-xl flex justify-between items-center hover:shadow-lg transition cursor-pointer">
             <div>
                <div className="font-black text-[#3E2723]">{track.title}</div>
                <div className="text-xs font-bold text-[#E65100] uppercase">{track.artist}</div>
             </div>
             <div className="text-xs font-mono opacity-50">{track.duration}s</div>
          </div>
        ))}
        {searching && <div className="text-center font-bold opacity-50">Scanning GPM Catalog...</div>}
      </div>
    </div>
  );
}
