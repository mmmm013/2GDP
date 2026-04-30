'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, Copy, Check, Music, Radio, Heart, Sparkles, Zap } from 'lucide-react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabaseClient';
import GpmBot from '@/components/GpmBot';
import KFamilyVisualStrip from '@/components/KFamilyVisualStrip';
import {
  SECTION_ORDER,
  SECTION_LABELS,
  SECTION_BADGES,
  SectionTag,
  validateSections,
  sectionRange,
} from '@/lib/kkut-sections';

interface CatalogItem {
  id: string;
  title: string;
  type: 'STI' | 'BTI' | 'FP';
  artist?: string;
}

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

  // Section selection state for K-KUT mode (STI type)
  const [sectionFrom, setSectionFrom] = useState<SectionTag>('V1');
  const [sectionTo,   setSectionTo]   = useState<SectionTag>('Ch1');
  const [sectionError, setSectionError] = useState<string>('');

  // mKUT section (single section only)
  const [mkutTag, setMkutTag] = useState<'V1' | 'BR' | 'Ch1'>('V1');

  const [tracks, setTracks] = useState<CatalogItem[]>([]);
  const [playlists, setPlaylists] = useState<CatalogItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      try {
        let resolvedTracks: any[] = [];
        let resolvedPlaylists: any[] = [];

        // Primary track source (legacy table).
        const trackPrimary = await supabase
          .from('gpm_tracks')
          .select('id, title, artist')
          .order('title');

        if (!trackPrimary.error && trackPrimary.data?.length) {
          resolvedTracks = trackPrimary.data;
        } else {
          // Fallback track source (current catalog table).
          const trackFallback = await supabase
            .from('tracks')
            .select('id, track_id, title, artist')
            .order('title');

          if (!trackFallback.error && trackFallback.data?.length) {
            resolvedTracks = trackFallback.data.map((row: any) => ({
              id: row.track_id ?? String(row.id),
              title: row.title,
              artist: row.artist,
            }));
          }
        }

        // Primary playlist source (featured flag).
        const playlistPrimary = await supabase
          .from('playlists')
          .select('id, name')
          .eq('is_featured', true)
          .order('name');

        if (!playlistPrimary.error && playlistPrimary.data?.length) {
          resolvedPlaylists = playlistPrimary.data;
        } else {
          // Fallback when schema differs (no is_featured column).
          const playlistFallback = await supabase
            .from('playlists')
            .select('id, name')
            .order('name');

          if (!playlistFallback.error && playlistFallback.data?.length) {
            resolvedPlaylists = playlistFallback.data;
          } else {
            // Last-resort fallback to configured featured playlist metadata.
            const playlistConfig = await supabase
              .from('featured_playlists_config')
              .select('id, display_name')
              .order('display_name');

            if (!playlistConfig.error && playlistConfig.data?.length) {
              resolvedPlaylists = playlistConfig.data.map((row: any) => ({
                id: row.id,
                name: row.display_name,
              }));
            }
          }
        }

        if (!isMounted) return;

        setTracks(
          resolvedTracks.map((t: any) => ({
            id: String(t.id),
            title: t.title,
            type: 'STI' as const,
            artist: t.artist,
          }))
        );

        setPlaylists(
          resolvedPlaylists.map((p: any) => ({
            id: String(p.id),
            title: p.name,
            type: 'FP' as const,
          }))
        );
      } finally {
        if (isMounted) setItemsLoading(false);
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  // Derive the selected section range for K-KUT STI
  const selectedSections: SectionTag[] = sectionRange(sectionFrom, sectionTo);

  // Build the relative destination path for a given type + itemId + optional sections
  const buildDestination = (type: string, itemId: string, sections?: SectionTag[]): string => {
    switch (type) {
      case 'STI': {
        let url = `/gift/songs?track=${encodeURIComponent(itemId)}`;
        if (sections && sections.length > 0) {
          url += `&sections=${encodeURIComponent(sections.join(','))}`;
        }
        return url;
      }
      case 'BTI': return `/gift/behind?track=${encodeURIComponent(itemId)}`;
      case 'FP':  return `/gift/playlists?playlist=${encodeURIComponent(itemId)}`;
      default:    return '/kupid';
    }
  };

  const generateKUT = (id: string, type: string) => {
    setSelectedItem(id);
    setSectionError('');

    if (kutMode === 'mkut') {
      // Canonical mKUT format: mkut-{type}-{pixPckId}-{structTag}-{base36ts}
      // For mKUT, use a single section tag (mapped to legacy Verse/BR/Ch for edge fn)
      const legacyTag = mkutTag === 'Ch1' ? 'Ch' : mkutTag === 'BR' ? 'BR' : 'Verse';
      const mId = generateMkutId(type, id, legacyTag);
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
      // Fire-and-forget: persist code -> destination mapping
      fetch('/api/k/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, destination, item_type: type, item_id: id }),
      }).catch(() => { /* creator still works if offline */ });
      return;
    }

    // K-KUT mode — validate and encode sections for STI type
    let sections: SectionTag[] | undefined;
    if (type === 'STI') {
      const err = validateSections(selectedSections);
      if (err) { setSectionError(err); return; }
      sections = selectedSections;
    }

    const code = generateShortCode();
    const destination = buildDestination(type, id, sections);
    setShortCode(code);
    setMkutId('');
    setGeneratedKUT(`kkupid.com/k/${code}`);

    // Fire-and-forget: persist code → destination mapping with sections
    fetch('/api/k/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        destination,
        item_type: type,
        item_id: id,
        ...(sections ? { sections } : {}),
      }),
    }).catch(() => { /* creator still works offline */ });
  };

  const copyToClipboard = async () => {
    const toCopy = kutMode === 'mkut' ? generatedKUT : `https://${generatedKUT}`;
    await navigator.clipboard.writeText(toCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCurrentItems = (): CatalogItem[] => {
    switch (selectedType) {
      case 'STI': return tracks;
      case 'BTI': return tracks.map(t => ({ ...t, type: 'BTI' as const }));
      case 'FP':  return playlists;
      default:    return [];
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#8B7355] via-[#6B5442] to-[#3E2723] text-[#F5E6D3]">
      <Header />

      {/* GD-BOT: step-by-step K-KUT creation guide */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <GpmBot
          bot="GD-BOT"
          steps={[
            { title: 'Select your track type', hint: 'Choose STI (Standard Template Item), BTI (Branded Template Item), or FP (Featured Playlist).', action: 'Pick Type' },
            { title: 'Find your track', hint: 'Search or browse the catalog. Select the exact track you want to link.' },
            { title: 'Set your Sweet Spot', hint: 'Toggle K-KUT (full sweet-spot link) or mini-KUT (short clip). Enter your timestamp.' },
            { title: 'Generate your code', hint: 'Hit Generate — your 6-character K-KUT code is created instantly.', action: 'Generate' },
            { title: 'Copy & share', hint: 'Copy the short link and send it anywhere. No app needed — just tap and hear it.', action: 'Copy Link' },
          ]}
          startCollapsed={false}
          className="max-w-xs w-full"
        />
      </div>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        {/* KKK Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B4513]/20 to-[#C8A882]/20 border border-[#8B4513]/40 px-6 py-3 rounded-full mb-6 shadow-lg shadow-[#8B4513]/10">
            <Zap size={18} className="text-[#8B4513] animate-pulse" />
            <span className="k-family-kicker text-[#8B4513]">KKK</span>
            <Sparkles size={18} className="text-[#8B4513] animate-pulse" />
          </div>
          
          <h1 className="k-family-title text-transparent bg-clip-text bg-gradient-to-r from-[#A0522D] via-[#8B4513] to-[#CD853F] mb-4">
            K-KUT-Kreator
          </h1>
          <p className="k-family-subtitle text-[#F5E6D3]/80 max-w-2xl mx-auto mb-2">
            Create sleek, shareable K-KUTs with <span className="text-[#8B4513] font-bold">6-character codes</span>
          </p>
          <p className="text-sm text-[#F5E6D3]/50">
            Short links. Big impact. Easy to share.
          </p>

          <KFamilyVisualStrip
            containerClassName="max-w-3xl border-[#8B4513]/40 bg-[#2a1f0f]/60 shadow-[#8B4513]/20"
            primaryImageSrc="/k-hero.jpg"
            primaryImageAlt="K-KUT visual hero"
            primaryBadge="K-KUT VISUAL"
            primaryCopy="Signature open look for short-code handoffs"
            primarySizes="(max-width: 768px) 100vw, 66vw"
            secondaryImageSrc="/gpm_qr_code.jpg"
            secondaryImageAlt="K-KUT QR visual reference"
            secondarySizes="(max-width: 768px) 100vw, 33vw"
            gridStyle={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}
          />
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

        {/* ── K-KUT mode: Song Section Picker (STI only) ── */}
        {kutMode === 'kkut' && selectedType === 'STI' && (
          <div className="mb-8 max-w-2xl mx-auto bg-[#2a1f0f] border border-[#C8A882]/20 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8A882]/70 mb-3">
              Song Sections — K-KUT Excerpt
            </p>
            <p className="text-xs text-[#F5E6D3]/50 mb-4">
              Select <strong className="text-[#C8A882]">contiguous sections</strong> in original song order (ASCAP rule — no rearranging).
              Pick start and end; all sections in between are included.
            </p>

            {/* Section range: FROM */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 mb-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#4a8060] mb-2">From</p>
                <div className="flex flex-wrap gap-1.5">
                  {SECTION_ORDER.map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setSectionFrom(tag); setGeneratedKUT(''); setSectionError(''); }}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        sectionFrom === tag
                          ? 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#3E2723] shadow-sm'
                          : 'bg-[#3E2723] border border-[#C8A882]/20 text-[#F5E6D3]/60 hover:text-[#F5E6D3]'
                      }`}
                    >
                      {SECTION_BADGES[tag]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[#C8A882]/40 font-bold hidden sm:block">→</div>

              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#4a8060] mb-2">To</p>
                <div className="flex flex-wrap gap-1.5">
                  {SECTION_ORDER.map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setSectionTo(tag); setGeneratedKUT(''); setSectionError(''); }}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        sectionTo === tag
                          ? 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#3E2723] shadow-sm'
                          : 'bg-[#3E2723] border border-[#C8A882]/20 text-[#F5E6D3]/60 hover:text-[#F5E6D3]'
                      }`}
                    >
                      {SECTION_BADGES[tag]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview of selected range */}
            <div className="flex flex-wrap gap-1.5 items-center mt-1">
              <span className="text-[10px] text-[#F5E6D3]/40 uppercase tracking-widest mr-1">Excerpt:</span>
              {selectedSections.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B4513]/30 text-[#C8A882] border border-[#8B4513]/30">
                  {SECTION_LABELS[tag]}
                </span>
              ))}
            </div>

            {sectionError && (
              <p className="mt-3 text-xs text-red-400/80">{sectionError}</p>
            )}
          </div>
        )}

        {/* mKUT section tag — single section only */}
        {kutMode === 'mkut' && (
          <div className="flex justify-center mb-6">
            <div className="bg-[#2a1f0f] border border-[#4a8060]/30 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#4a8060] mb-3">
                Structure Tag — which section?
              </p>
              <div className="flex gap-2 justify-center">
                {(['V1', 'BR', 'Ch1'] as const).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setMkutTag(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                      mkutTag === tag
                        ? 'bg-gradient-to-r from-[#2a6e48] to-[#3a9e65] text-white shadow-md'
                        : 'bg-[#3E2723] border border-[#4a8060]/30 text-[#F5E6D3]/60 hover:text-[#F5E6D3]'
                    }`}
                  >
                    {tag === 'V1' ? 'Verse' : tag === 'BR' ? 'Bridge' : 'Chorus'}
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
            {itemsLoading ? (
              <p className="text-center text-[#F5E6D3]/40 py-6 text-sm">Loading…</p>
            ) : getCurrentItems().length === 0 ? (
              <p className="text-center text-[#F5E6D3]/40 py-6 text-sm">No items found.</p>
            ) : null}
            {!itemsLoading && getCurrentItems().map((item) => (
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
            <span>←</span> Back to K-KUT Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
