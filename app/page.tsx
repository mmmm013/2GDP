'use client';

/**
 * gputnammusic.com — Home Page
 *
 * Layout (locked):
 *   1. Header  — STI top row, BTI-filled slots (Amber brand / gtmplt default)
 *   2. Hero    — 1 rotating brand image (shuffle, 8s interval)
 *   3. HomeFP  — 1 Featured Playlist: non-stop GPM stream, 2-hr no-repeat,
 *                all original, independent from SYBC Band / Wounded & Willing,
 *                never instrumental or kids
 *   4. Footer  — STO GPM footer
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeFP from '@/components/HomeFP';

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
    // Fisher-Yates shuffle of indices for non-repeating hero order
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
      {/* ── 1. TOP ROW: STI Header with BTI-filled slots (Amber / gtmplt) ── */}
      <Header />

      {/* ── 2. HERO: 1 rotating brand image ── */}
      <section className="relative w-full h-[62vh] md:h-[72vh] overflow-hidden">
        <Image
          key={hero.src}
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          className={`object-cover transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectPosition: hero.objectPosition }}
          sizes="100vw"
        />
        {/* Amber-tinted gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1506]/50 via-transparent to-[#1a1207]/80" />

        {/* Brand lockup */}
        <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#C8A882]/70 mb-2 font-bold">
            G Putnam Music · The One Stop Song Shop
          </p>
          <h1 className="text-3xl md:text-6xl font-black text-white leading-none drop-shadow-2xl">
            All Original.
            <br />
            <span className="text-[#D4A017]">Always Streaming.</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#C8A882]/80 max-w-md drop-shadow">
            Activity-based, context-aware music intelligence — delivered via K-kUpId.
          </p>
        </div>
      </section>

      {/* ── 3. FEATURED PLAYLIST: 1 GPM FP, non-stop, 2-hr no-repeat ── */}
      <HomeFP />

      {/* ── 4. STO GPM FOOTER ── */}
      <Footer />
    </>
  );
}
