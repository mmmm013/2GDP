'use client';

/**
 * gputnammusic.com — Home Page (GPM Flagship Template)
 *
 * Layout:
 *   Row 0 — PromoBar (flash specials)
 *   Row 1 — Header (STI top row, BTI-filled slots / Amber gtmplt)
 *   Row 2 — Hero image (left) + HomeFP stream player (right)
 *   Row 3 — T20Grid: Top 20 streaming activities
 *   Row 4 — STO GPM Footer
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeFP from '@/components/HomeFP';
import T20Grid from '@/components/T20Grid';
import PromoBar from '@/components/PromoBar';
import GpmBot from '@/components/GpmBot';
import GlobalPlayer from '@/components/GlobalPlayer';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import KutHorizontalScroll from '@/components/KutHorizontalScroll';
import { getFeaturedKuts, FALLBACK_KUTS } from '@/lib/featuredKuts';
import type { KutItem } from '@/lib/featuredKuts';
import { ArrowRight, Music } from 'lucide-react';

/**
 * Helper to normalize audio URL.
 */
function normalizeAudioUrl(input?: string | null): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export default function Hero() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [featuredKuts, setFeaturedKuts] = useState<KutItem[]>(FALLBACK_KUTS);

  // 1. MUSIC: Points to public/assets/fly-again.mp3
  const normalizedAudioUrl = normalizeAudioUrl('/assets/fly-again.mp3');
  const audioSrc = normalizedAudioUrl ?? '';

  // Load featured KUTs from Supabase pipeline
  useEffect(() => {
    getFeaturedKuts().then((kuts) => {
      if (kuts.length > 0) setFeaturedKuts(kuts);
    });
  }, []);

  const scrollToMusic = () => {
    const section = document.getElementById('featured');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Row 0 — Promo bar */}
      <PromoBar />

      {/* Row 1 — GPM Header (STI / BTI amber template) */}
      <Header />

      {/* GPM BOT — guides users from landing */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <GpmBot
          bot="MC-BOT"
          startCollapsed={false}
          className="w-full max-w-xs"
        />
      </div>

      {/* Row 2 — Hero (left) + Featured Playlist (right) */}
      <section className="grid w-full min-h-[56vh] grid-cols-1 md:min-h-[64vh] md:grid-cols-2">
        {/* Left: Rotating hero image */}
        <div className="relative w-full h-[52vw] min-h-[240px] overflow-hidden md:h-auto">
          <Image
            key={hero.src}
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            className={`object-cover transition-opacity duration-500 ${
              isFading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ objectPosition: hero.objectPosition }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Amber-tinted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1506]/40 via-transparent to-[#1A1207]/85" />

          {/* Brand lockup over hero image */}
          <div className="absolute bottom-6 left-5 right-5 md:bottom-8 md:left-8 md:right-8">
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.35em] text-[#C8A882]/70 md:text-xs">
              G Putnam Music · The One Stop Song Shop
            </p>
            <h1 className="text-2xl font-black leading-none text-white drop-shadow-2xl md:text-4xl">
              All Original.
              <br />
              <span className="text-[#D4A017]">Always Streaming.</span>
            </h1>
            <p className="mt-2 max-w-xs text-xs text-[#C8A882]/80 drop-shadow md:text-sm">
              Activity-based, context-aware music intelligence.
            </p>
          </div>
        </div>

      {/* Hero Content Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter drop-shadow-2xl">
          G Putnam Music
        </h1>
        <p className="text-xl text-neutral-200 max-w-2xl mb-8 drop-shadow-md">
          The One Stop Song Shop.
        </p>
        
        {/* CTA — Listen Now (Relief conversion anchor) */}
        <button 
          onClick={scrollToMusic}
          className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors shadow-lg"
        >
          <Music size={20} />
          <span>Listen Now</span>
          <ArrowRight size={20} />
        </button>

        {/* ── KutStream Inject — Viral Audio Stream ── */}
        {/* Sits below CTA, above scroll indicator / featured section */}
        <div className="viral-stream-container py-8 w-full max-w-3xl mx-auto">
          <h3 className="text-center text-xs tracking-widest uppercase opacity-50 mb-4">
            The Emotional Virus: Active K&#8209;KUTs
          </h3>
          <KutHorizontalScroll
            items={featuredKuts}
            density="high"
            autoStream={true}
            autoPlay={true}
            loop={true}
          />
        </div>
      </section>

      {/* Row 3 — Top 20 streaming activities */}
      <T20Grid />

      {/* Row 4 — Footer */}
      {/* GlobalPlayer: receives play-track events from T20Grid + FPPixBar */}
      <GlobalPlayer />

      {/* ROW 4: STO GPM Footer */}
      <Footer />
    </>
  );
}