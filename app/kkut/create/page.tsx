'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Share2, Copy, Check, Music, Radio, Heart, Sparkles, Zap } from 'lucide-react';
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
  { id: 'fp1', title: "A Love Like This - Valentine's", type: 'FP', trackCount: 7 },
  { id: 'fp2', title: 'DISCO - Core Collection', type: 'FP', trackCount: 120 },
  { id: 'fp3', title: 'Melancholy Moods', type: 'FP', trackCount: 15 },
  { id: 'fp4', title: 'High Energy Beats', type: 'FP', trackCount: 22 },
];

// Generate short 6-character KUT code
const generateShortCode = (): string => {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export default function KKKCreatorPage() {
  const [selectedType, setSelectedType] = useState<'STI' | 'BTI' | 'FP'>('STI');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [generatedKUT, setGeneratedKUT] = useState<string>('');
  const [shortCode, setShortCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateKUT = (id: string, type: string) => {
    setSelectedItem(id);
    // Generate SHORT 6-char KUT code for easy sharing
    const code = generateShortCode();
    setShortCode(code);
    const kutUrl = `kkupid.com/k/${code}`;
    setGeneratedKUT(kutUrl);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`https://${generatedKUT}`);
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
        {/* KKK Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#C8A882]/20 border border-[#FFD700]/40 px-6 py-3 rounded-full mb-6 shadow-lg shadow-[#FFD700]/10">
            <Zap size={18} className="text-[#FFD700] animate-pulse" />
            <span className="text-sm font-black text-[#FFD700] tracking-[0.3em] uppercase">KKK</span>
            <Sparkles size={18} className="text-[#FFD700] animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD95A] via-[#FFD700] to-[#FFA500] mb-4 tracking-tight">
            K-KUT-Kreator
          </h1>
          <p className="text-lg text-[#F5E6D3]/80 max-w-2xl mx-auto mb-2">
            Create sleek, shareable K-KUTs with <span className="text-[#FFD700] font-bold">6-character codes</span>
          </p>
          <p className="text-sm text-[#F5E6D3]/50">
            Short links. Big impact. Easy to share.
          </p>
        </div>

        {/* Type Selector - Sleek Pills */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedType('STI')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              selectedType === 'STI'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#3E2723] shadow-lg shadow-[#FFD700]/30 scale-105'
                : 'bg-[#3E2723] border border-[#C8A882]/30 text-[#F5E6D3] hover:border-[#FFD700]/50'
            }`}
          >
            <Music size={18} />
            <span>Songs</span>
          </button>
          <button
            onClick={() => setSelectedType('BTI')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              selectedType === 'BTI'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#3E2723] shadow-lg shadow-[#FFD700]/30 scale-105'
                : 'bg-[#3E2723] border border-[#C8A882]/30 text-[#F5E6D3] hover:border-[#FFD700]/50'
            }`}
          >
            <Heart size={18} />
            <span>Stories</span>
          </button>
          <button
            onClick={() => setSelectedType('FP')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              selectedType === 'FP'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#3E2723] shadow-lg shadow-[#FFD700]/30 scale-105'
                : 'bg-[#3E2723] border border-[#C8A882]/30 text-[#F5E6D3] hover:border-[#FFD700]/50'
            }`}
          >
            <Radio size={18} />
            <span>Playlists</span>
          </button>
        </div>

        {/* Items List - Compact Cards */}
        <div className="bg-[#3E2723]/80 backdrop-blur rounded-2xl border border-[#C8A882]/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-[#FFD95A] mb-4 flex items-center gap-2">
            {selectedType === 'STI' && <><Music size={20} /> Select a Track</>}
            {selectedType === 'BTI' && <><Heart size={20} /> Select a Story</>}
            {selectedType === 'FP' && <><Radio size={20} /> Select a Playlist</>}
          </h2>
          
          <div className="grid gap-2">
            {getCurrentItems().map((item) => (
              <button
                key={item.id}
                onClick={() => generateKUT(item.id, item.type)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  selectedItem === item.id
                    ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#C8A882]/10 border-2 border-[#FFD700] shadow-lg shadow-[#FFD700]/10'
                    : 'bg-[#2a1f0f]/50 border border-[#C8A882]/10 hover:border-[#FFD700]/30 hover:bg-[#2a1f0f]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#F5E6D3]">{item.title}</h3>
                    <p className="text-sm text-[#F5E6D3]/50">
                      {item.type === 'FP' ? `${(item as any).trackCount} tracks` : (item as any).artist}
                    </p>
                  </div>
                  <div className={`text-xs font-black px-3 py-1 rounded-full ${
                    selectedItem === item.id
                      ? 'bg-[#FFD700] text-[#3E2723]'
                      : 'bg-[#C8A882]/20 text-[#C8A882]'
                  }`}>
                    {item.type}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated KUT - Clean Display */}
        {generatedKUT && (
          <div className="bg-gradient-to-br from-[#FFD700]/5 via-[#C8A882]/5 to-[#FFD700]/5 rounded-2xl border-2 border-[#FFD700] p-8 shadow-2xl shadow-[#FFD700]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                <Share2 className="text-[#3E2723]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#FFD700]">Your K-KUT is Ready!</h2>
                <p className="text-sm text-[#F5E6D3]/60">6-character code for easy sharing</p>
              </div>
            </div>
            
            {/* Short Code Display */}
            <div className="bg-[#3E2723] rounded-xl p-6 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-[#F5E6D3]/40 uppercase tracking-wider mb-2">Your K-KUT Link</p>
                  <code className="text-2xl font-mono font-bold text-[#FFD95A] tracking-wider">
                    {generatedKUT}
                  </code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`ml-4 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#3E2723] hover:shadow-lg hover:shadow-[#FFD700]/30'
                  }`}
                >
                  {copied ? (
                    <><Check size={18} /> Copied!</>
                  ) : (
                    <><Copy size={18} /> Copy</>  
                  )}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-[#F5E6D3]/60 text-center">
              Share this short link anywhere. Recipients will be directed to your selected content on kkupid.com.
            </p>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#F5E6D3]/40 mb-4">
            K-KUTs are permanent 6-character links. Each connects to one item on the G Putnam Music platform.
          </p>
          <Link href="/kupid" className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFD700]/80 font-bold transition-colors">
            <span>←</span> Back to K-KUTs Lockets
          </Link>
        </div>
      </div>
    </main>
  );
}
