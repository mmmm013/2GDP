'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Share2, Copy, Check, Music, Radio, Heart, Sparkles } from 'lucide-react';
import Header from '@/components/Header';

// Sample data - Replace with actual Supabase queries
const TRACKS = [
  { id: '1', title: 'Reflections', artist: 'Kleigh', type: 'STI' },
  { id: '2', title: 'Best Nights of Our Lives', artist: 'Kleigh', type: 'STI' },
  { id: '3', title: 'I Need an Angel', artist: 'G Putnam Music', type: 'STI' },
  { id: '4', title: 'Can You See It', artist: 'KLEIGH', type: 'STI' },
];

const BTI_STORIES = [
  { id: 'bti1', title: 'Can You See It - Behind The Music', artist: 'KLEIGH', type: 'BTI' },
  { id: 'bti2', title: 'Best Nights - Creation Story', artist: 'KLEIGH', type: 'BTI' },
  { id: 'bti3', title: 'Reflections - Studio Session', artist: 'KLEIGH', type: 'BTI' },
];

const FEATURED_PLAYLISTS = [
  { id: 'fp1', title: 'A Love Like This - Valentine\'s', type: 'FP', trackCount: 7 },
  { id: 'fp2', title: 'DISCO - Core Collection', type: 'FP', trackCount: 120 },
  { id: 'fp3', title: 'Melancholy Moods', type: 'FP', trackCount: 15 },
  { id: 'fp4', title: 'High Energy Beats', type: 'FP', trackCount: 22 },
];

export default function KUTCreatorPage() {
  const [selectedType, setSelectedType] = useState<'STI' | 'BTI' | 'FP'>('STI');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [generatedKUT, setGeneratedKUT] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateKUT = (id: string, type: string) => {
    setSelectedItem(id);
    // Generate short KUT URL
    const kutId = `${type.toLowerCase()}-${id}-${Date.now().toString(36)}`;
    const kutUrl = `https://kkupid.com/k/${kutId}`;
    setGeneratedKUT(kutUrl);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedKUT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCurrentItems = () => {
    switch (selectedType) {
      case 'STI':
        return TRACKS;
      case 'BTI':
        return BTI_STORIES;
      case 'FP':
        return FEATURED_PLAYLISTS;
      default:
        return [];
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#8B7355] via-[#6B5442] to-[#3E2723] text-[#F5E6D3]">
      <Header />
      
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C8A882]/20 border border-[#C8A882]/30 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="text-[#FFD700]" />
            <span className="text-xs font-black text-[#FFD700] tracking-[0.2em] uppercase">KUT Creator</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-[#FFD95A] mb-4 tracking-tight">
            Share Your Frequency
          </h1>
          <p className="text-lg text-[#F5E6D3]/80 max-w-2xl mx-auto">
            Create shareable K-KUTs (Kleigh Kustom Ultimate Tracks) - Direct links to music that matches your creative energy.
          </p>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setSelectedType('STI')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedType === 'STI'
                ? 'bg-[#C8A882]/20 border-[#FFD700] shadow-lg shadow-[#FFD700]/20'
                : 'bg-[#3E2723] border-[#C8A882]/30 hover:border-[#C8A882]/60'
            }`}
          >
            <Music className="mx-auto mb-2" size={32} />
            <h3 className="font-bold text-sm">Song Tracks</h3>
            <p className="text-xs text-[#F5E6D3]/60">STIs</p>
          </button>

          <button
            onClick={() => setSelectedType('BTI')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedType === 'BTI'
                ? 'bg-[#C8A882]/20 border-[#FFD700] shadow-lg shadow-[#FFD700]/20'
                : 'bg-[#3E2723] border-[#C8A882]/30 hover:border-[#C8A882]/60'
            }`}
          >
            <Heart className="mx-auto mb-2" size={32} />
            <h3 className="font-bold text-sm">Behind The Music</h3>
            <p className="text-xs text-[#F5E6D3]/60">BTIs</p>
          </button>

          <button
            onClick={() => setSelectedType('FP')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedType === 'FP'
                ? 'bg-[#C8A882]/20 border-[#FFD700] shadow-lg shadow-[#FFD700]/20'
                : 'bg-[#3E2723] border-[#C8A882]/30 hover:border-[#C8A882]/60'
            }`}
          >
            <Radio className="mx-auto mb-2" size={32} />
            <h3 className="font-bold text-sm">Featured Playlists</h3>
            <p className="text-xs text-[#F5E6D3]/60">FPs</p>
          </button>
        </div>

        {/* Items List */}
        <div className="bg-[#3E2723] rounded-2xl border-2 border-[#C8A882]/30 p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#FFD95A] mb-4">
            {selectedType === 'STI' && 'Select a Track'}
            {selectedType === 'BTI' && 'Select a Story'}
            {selectedType === 'FP' && 'Select a Playlist'}
          </h2>
          
          <div className="space-y-3">
            {getCurrentItems().map((item) => (
              <button
                key={item.id}
                onClick={() => generateKUT(item.id, item.type)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedItem === item.id
                    ? 'bg-[#C8A882]/20 border-2 border-[#FFD700]'
                    : 'bg-[#2a1f0f] border-2 border-[#C8A882]/10 hover:border-[#C8A882]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#F5E6D3]">{item.title}</h3>
                    <p className="text-sm text-[#F5E6D3]/60">
                      {item.type === 'FP' ? `${(item as any).trackCount} tracks` : (item as any).artist}
                    </p>
                  </div>
                  <div className="text-xs font-black text-[#C8A882] bg-[#C8A882]/20 px-3 py-1 rounded-full">
                    {item.type}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated KUT */}
        {generatedKUT && (
          <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#C8A882]/10 rounded-2xl border-2 border-[#FFD700] p-8">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="text-[#FFD700]" size={24} />
              <h2 className="text-2xl font-bold text-[#FFD700]">Your KUT is Ready!</h2>
            </div>
            
            <div className="bg-[#3E2723] rounded-xl p-4 mb-4 flex items-center justify-between">
              <code className="text-[#FFD95A] font-mono text-sm break-all">
                {generatedKUT}
              </code>
              <button
                onClick={copyToClipboard}
                className="ml-4 flex-shrink-0 bg-[#FFD700] text-[#3E2723] px-4 py-2 rounded-lg font-bold hover:bg-[#FFD700]/90 transition-all flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
            
            <p className="text-sm text-[#F5E6D3]/70">
              Share this link with anyone. When they open it, they'll be directed to your selected {selectedType === 'STI' ? 'track' : selectedType === 'BTI' ? 'story' : 'playlist'} on kkupid.com.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#F5E6D3]/50">
            KUTs are permanent shareable links. Each KUT connects to one item on the G Putnam Music platform.
          </p>
          <Link href="/kupid" className="inline-block mt-4 text-[#FFD700] hover:text-[#FFD700]/80 font-bold">
            ← Back to K-KUTs Lockets
          </Link>
        </div>
      </div>
    </main>
  );
}
