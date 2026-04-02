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

// Generate short 6-character K-KUT share code
const generateShortCode = (): string => {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// Generate canonical mKUT ID: mkut-{type}-{pixPckId}-{structTag}-{base36ts}
// Embeds pix_pck_id + structure_tag so the player can call the edge function
// without a secondary lookup.
const generateMkutId = (type: string, pixPckId: string, structTag: string): string => {
  const ts = Date.now().toString(36);
  return `mkut-${type.toLowerCase()}-${pixPckId}-${structTag.toLowerCase()}-${ts}`;
};

export default function KKKCreatorPage() {
  const [selectedType, setSelectedType] = useState<'STI' | 'BTI' | 'FP'>('STI');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [generatedKUT, setGeneratedKUT] = useState<string>('');
  const [shortCode, setShortCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [kutMode, setKutMode] = useState<'kkut' | 'mkut'>('kkut');
  const [mkutId, setMkutId] = useState<string>('');
  const [structTag, setStructTag] = useState<'Verse' | 'BR' | 'Ch'>('Verse');

  // Build the relative destination path for a given type + itemId.
  const buildDestination = (type: string, itemId: string): string => {
    switch (type) {
      case 'STI': return `/gift/songs?track=${encodeURIComponent(itemId)}`;
      case 'BTI': return `/gift/behind?track=${encodeURIComponent(itemId)}`;
      case 'FP':  return `/gift/playlists?playlist=${encodeURIComponent(itemId)}`;
      default:    return '/kupid';
    }
  };

  const generateKUT = async (id: string, type: string) => {
    setSelectedItem(id);
    if (kutMode === 'mkut') {
      // Canonical mKUT format: mkut-{type}-{pixPckId}-{structTag}-{base36ts}
      const mId = generateMkutId(type, id, structTag);
      setMkutId(mId);
      setGeneratedKUT(`${window.location.origin}/mkut/${mId}`);
      setShortCode('');
    } else {
      // K-KUT: short 6-char code stored in Supabase for gateway resolution
      const code = generateShortCode();
      const destination = buildDestination(type, id);
      setShortCode(code);
      setMkutId('');
      setGeneratedKUT(`kkupid.com/k/${code}`);
      // Fire-and-forget: persist code → destination mapping
      fetch('/api/k/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, destination, item_type: type, item_id: id }),
      }).catch(() => { /* creator still works if offline */ });
    }
  };

  const copyToClipboard = async () => {
    const toCopy = kutMode === 'mkut' ? generatedKUT : `https://${generatedKUT}`;
    await navigator.clipboard.writeText(toCopy);
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B4513]/20 to-[#C8A882]/20 border border-[#8B4513]/40 px-6 py-3 rounded-full mb-6 shadow-lg shadow-[#8B4513]/10">
            <Zap size={18} className="text-[#8B4513] animate-pulse" />
            <span className="text-sm font-black text-[#8B4513] tracking-[0.3em] uppercase">KKK</span>
            <Sparkles size={18} className="text-[#8B4513] animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A0522D] via-[#8B4513] to-[#CD853F] mb-4 tracking-tight">
            K-KUT-Kreator
          </h1>
          <p className="text-lg text-[#F5E6D3]/80 max-w-2xl mx-auto mb-2">
            Create sleek, shareable K-KUTs with <span className="text-[#8B4513] font-bold">6-character codes</span>
          </p>
          <p className="text-sm text-[#F5E6D3]/50">
            Short links. Big impact. Easy to share.
          </p>
        </div>

        {/* Mode Toggle — K-KUT vs mKUT */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-[#2a1f0f] border border-[#C8A882]/20 rounded-full p-1 gap-1">
            <button
              onClick={() => { setKutMode('kkut'); setGeneratedKUT(''); setSelectedItem(null); }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                kutMode === 'kkut'
                  ? 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#3E2723] shadow-md'
                  : 'text-[#F5E6D3]/50 hover:text-[#F5E6D3]'
              }`}
            >
              K-KUT
            </button>
            <button
              onClick={() => { setKutMode('mkut'); setGeneratedKUT(''); setSelectedItem(null); }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                kutMode === 'mkut'
                  ? 'bg-gradient-to-r from-[#2a6e48] to-[#3a9e65] text-white shadow-md'
                  : 'text-[#F5E6D3]/50 hover:text-[#F5E6D3]'
              }`}
            >
              mKUT
            </button>
          </div>
        </div>

        {/* Structure tag selector — mKUT mode only */}
        {kutMode === 'mkut' && (
          <div className="flex justify-center mb-6">
            <div className="bg-[#2a1f0f] border border-[#4a8060]/30 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#4a8060] mb-3">
                Structure Tag — which excerpt?
              </p>
              <div className="flex gap-2 justify-center">
                {(['Verse', 'BR', 'Ch'] as const).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setStructTag(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                      structTag === tag
                        ? 'bg-gradient-to-r from-[#2a6e48] to-[#3a9e65] text-white shadow-md'
                        : 'bg-[#3E2723] border border-[#4a8060]/30 text-[#F5E6D3]/60 hover:text-[#F5E6D3]'
                    }`}
                  >
                    {tag === 'Verse' ? 'Verse' : tag === 'BR' ? 'Bridge' : 'Chorus'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Type Selector - Sleek Pills */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedType('STI')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              selectedType === 'STI'
                ? 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#3E2723] shadow-lg shadow-[#8B4513]/30 scale-105'
                : 'bg-[#3E2723] border border-[#C8A882]/30 text-[#F5E6D3] hover:border-[#8B4513]/50'
            }`}
          >
            <Music size={18} />
            <span>Songs</span>
          </button>
          <button
            onClick={() => setSelectedType('BTI')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              selectedType === 'BTI'
                ? 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#3E2723] shadow-lg shadow-[#8B4513]/30 scale-105'
                : 'bg-[#3E2723] border border-[#C8A882]/30 text-[#F5E6D3] hover:border-[#8B4513]/50'
            }`}
          >
            <Heart size={18} />
            <span>Stories</span>
          </button>
          <button
            onClick={() => setSelectedType('FP')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              selectedType === 'FP'
                ? 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#3E2723] shadow-lg shadow-[#8B4513]/30 scale-105'
                : 'bg-[#3E2723] border border-[#C8A882]/30 text-[#F5E6D3] hover:border-[#8B4513]/50'
            }`}
          >
            <Radio size={18} />
            <span>Playlists</span>
          </button>
        </div>

        {/* Items List - Compact Cards */}
        <div className="bg-[#3E2723]/80 backdrop-blur rounded-2xl border border-[#C8A882]/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-[#A0522D] mb-4 flex items-center gap-2">
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
                    ? 'bg-gradient-to-r from-[#8B4513]/20 to-[#C8A882]/10 border-2 border-[#8B4513] shadow-lg shadow-[#8B4513]/10'
                    : 'bg-[#2a1f0f]/50 border border-[#C8A882]/10 hover:border-[#8B4513]/30 hover:bg-[#2a1f0f]'
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
                      ? 'bg-[#8B4513] text-[#3E2723]'
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
          <div className="bg-gradient-to-br from-[#8B4513]/5 via-[#C8A882]/5 to-[#8B4513]/5 rounded-2xl border-2 border-[#8B4513] p-8 shadow-2xl shadow-[#8B4513]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B4513] to-[#CD853F] flex items-center justify-center">
                <Share2 className="text-[#3E2723]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#8B4513]">
                  {kutMode === 'mkut' ? 'Your mKUT is Ready!' : 'Your K-KUT is Ready!'}
                </h2>
                <p className="text-sm text-[#F5E6D3]/60">
                  {kutMode === 'mkut'
                    ? 'Canonical mKUT prefab container link'
                    : '6-character code for easy sharing'}
                </p>
              </div>
            </div>

            {/* Link Display */}
            <div className="bg-[#3E2723] rounded-xl p-6 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#F5E6D3]/40 uppercase tracking-wider mb-2">
                    {kutMode === 'mkut' ? 'mKUT Prefab Link' : 'K-KUT Share Link'}
                  </p>
                  <code className="text-sm font-mono font-bold text-[#A0522D] tracking-wider break-all">
                    {generatedKUT}
                  </code>
                  {kutMode === 'mkut' && mkutId && (
                    <p className="mt-1 text-[10px] text-[#F5E6D3]/30 font-mono break-all">ID: {mkutId}</p>
                  )}
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`ml-4 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#3E2723] hover:shadow-lg hover:shadow-[#8B4513]/30'
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
              {kutMode === 'mkut'
                ? 'Share this mKUT link. Recipients open a prefab mini-player pre-loaded with your content.'
                : 'Share this short link anywhere. Recipients will be directed to your selected content on kkupid.com.'}
            </p>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#F5E6D3]/40 mb-4">
            K-KUTs are permanent 6-character links. mKUTs use canonical IDs for prefab container routing.
          </p>
          <Link href="/kupid" className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#8B4513]/80 font-bold transition-colors">
            <span>←</span> Back to K-KUTs Lockets
          </Link>
        </div>
      </div>
    </main>
  );
}
