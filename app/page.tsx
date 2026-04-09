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

// ---------------------------------------------------------------------------
// Hero image rotation — shuffle-based, one image on screen at a time
// ---------------------------------------------------------------------------

type HeroImage = {
  src: string;
  objectPosition: string;
  alt: string;
};

const HERO_IMAGES: HeroImage[] = [
  {
    src: '/assets/hero.jpg',
    objectPosition: 'center center',
    alt: 'G Putnam Music',
  },
  {
    src: '/IMG_7429.JPG',
    objectPosition: '30% center',
    alt: 'G Putnam Music live',
  },
  {
    src: '/assets/MC Agnst Stone Wall Knee Bent.jpg',
    objectPosition: 'center center',
    alt: 'GPM artist',
  },
  {
    src: '/assets/Smoking 1.jpg',
    objectPosition: 'center center',
    alt: 'GPM artist',
  },
];

const HERO_FADE_DURATION_MS = 400;
const HERO_INTERVAL_MS = 8000;

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Build a shuffled list of indices (Fisher–Yates)
    const indices = Array.from({ length: HERO_IMAGES.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let position = 0;
    setHeroIndex(indices[0]);

    const interval = setInterval(() => {
      setIsFading(true);

      timeoutRef.current = setTimeout(() => {
        position = (position + 1) % indices.length;
        setHeroIndex(indices[position]);
        setIsFading(false);
      }, HERO_FADE_DURATION_MS);
    }, HERO_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const hero = HERO_IMAGES[heroIndex];

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

        {/* Right: GPM Featured Playlist — non-stop stream */}
        <div className="flex flex-col justify-center border-l border-[#5C3A1E]/20 bg-[#110D06]">
          <HomeFP />
        </div>
      </section>

      {/* Row 3 — Top 20 streaming activities */}
      <T20Grid />

      {/* Row 4 — Footer */}
      <Footer />
    </>
  );
}