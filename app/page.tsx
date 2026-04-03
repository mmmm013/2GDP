'use client';

/**
 * gputnammusic.com — Home Page
 *
 * Layout (locked):
 *   Row 1 — Header: STI top row, BTI-filled slots (Amber / gtmplt)
 *   Row 2 — Hero image (left) + HomeFP stream player (right) — side-by-side
 *   Row 3 — T20Grid: Top 20 streaming activities (BTI body row 2)
 *   Row 4 — STO GPM Footer
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeFP from '@/components/HomeFP';
import T20Grid from '@/components/T20Grid';
import PromoBar from '@/components/PromoBar';

// ---------------------------------------------------------------------------
// Hero image rotation — shuffle-based, one image on screen at a time
// ---------------------------------------------------------------------------

const HERO_IMAGES: { src: string; objectPosition: string; alt: string }[] = [
  { src: '/assets/hero.jpg',                           objectPosition: 'center center', alt: 'G Putnam Music' },
  { src: '/IMG_7429.JPG',                              objectPosition: '30% center',    alt: 'G Putnam Music live' },
  { src: '/assets/MC Agnst Stone Wall Knee Bent.jpg',  objectPosition: 'center center', alt: 'GPM artist' },
  { src: '/assets/Smoking 1.jpg',                      objectPosition: 'center center', alt: 'GPM artist' },
];

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fisher-Yates shuffle for non-repeating rotation
    const indices = Array.from({ length: HERO_IMAGES.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    let pos = 0;
    setHeroIndex(indices[0]);

    const interval = setInterval(() => {
      setFading(true);
      timerRef.current = setTimeout(() => {
        pos = (pos + 1) % indices.length;
        setHeroIndex(indices[pos]);
        setFading(false);
      }, 400);
    }, 8000);

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hero = HERO_IMAGES[heroIndex];

  return (
    <>
      {/* PROMO BAR: rotating flash specials above the fold */}
      <PromoBar />

      {/* ROW 1: STI Header with BTI-filled slots (Amber / gtmplt) */}
      <Header />

      {/* ROW 2: Hero Image (left) + Featured Playlist (right) */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[56vh] md:min-h-[64vh]">

        {/* LEFT: Rotating hero image */}
        <div className="relative w-full h-[52vw] md:h-auto min-h-[240px] overflow-hidden">
          <Image
            key={hero.src}
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            className={`object-cover transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
            style={{ objectPosition: hero.objectPosition }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Amber-tinted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1506]/40 via-transparent to-[#1a1207]/85" />

          {/* Brand lockup over hero image */}
          <div className="absolute bottom-6 left-5 right-5 md:bottom-8 md:left-8 md:right-8">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#C8A882]/70 mb-1.5 font-bold">
              G Putnam Music · The One Stop Song Shop
            </p>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-none drop-shadow-2xl">
              All Original.
              <br />
              <span className="text-[#D4A017]">Always Streaming.</span>
            </h1>
            <p className="mt-2 text-xs md:text-sm text-[#C8A882]/80 max-w-xs drop-shadow">
              Activity-based, context-aware music intelligence.
            </p>
          </div>
        </div>

        {/* RIGHT: GPM Featured Playlist — non-stop stream */}
        <div className="flex flex-col justify-center bg-[#110d06] border-l border-[#5C3A1E]/20">
          <HomeFP />
        </div>
      </section>

      {/* ROW 3: TOP 20 Streaming Activities (BTI body row 2) */}
      <T20Grid />

      {/* ROW 4: STO GPM Footer */}
      <Footer />
    </>
  );
}
