'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import WeeklyRace from '@/components/WeeklyRace';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Brand hero images for rotation
// MOBILE FIX: Only render the ACTIVE image, not all 6 stacked
// Each image has its own objectPosition for perfect framing
const HERO_IMAGES: { src: string; objectPosition: string }[] = [
  { src: '/assets/hero.jpg', objectPosition: 'center center' },
  { src: '/k-hero.jpg', objectPosition: 'center center' },
  { src: '/k-hero-alternate.JPG', objectPosition: 'center center' },
  { src: '/IMG_7429.JPG', objectPosition: '30% center' },
  { src: '/assets/MC Agnst Stone Wall Knee Bent.jpg', objectPosition: 'center center' },
  { src: '/assets/Smoking 1.jpg', objectPosition: 'center center' },
];

// KLEIGH-BRANDED FP: 3 Congruent PIX — Continuous Loop
const KLEIGH_FP_PIX = [
  { src: '/k-hero.jpg', alt: 'KLEIGH — Artist Portrait' },
  { src: '/k-hero-alternate.JPG', alt: 'KLEIGH — Alternate' },
  { src: '/assets/Front Pose.jpg', alt: 'KLEIGH — Front Pose' },
];
const FP_ROTATION_MS = 4000; // 4s per PIX — sleek cycle

export default function Hero() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroFading, setHeroFading] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // KLEIGH FP PIX state
  const [fpIndex, setFpIndex] = useState(0);
  const [fpFading, setFpFading] = useState(false);

  // MOBILE PERF: Detect mobile for lighter rendering
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Shuffle-based hero rotation
  useEffect(() => {
    const indices = Array.from({ length: HERO_IMAGES.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    let pos = 0;
    setHeroIndex(indices[0]);
    const interval = setInterval(() => {
      setHeroFading(true);
      fadeTimeoutRef.current = setTimeout(() => {
        pos = (pos + 1) % indices.length;
        setHeroIndex(indices[pos]);
        setHeroFading(false);
      }, 300);
    }, 8000);
    return () => {
      clearInterval(interval);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  // KLEIGH FP: Continuous 3-PIX rotation loop — active until inactivated
  useEffect(() => {
    const interval = setInterval(() => {
      setFpFading(true);
      setTimeout(() => {
        setFpIndex(prev => (prev + 1) % KLEIGH_FP_PIX.length);
        setFpFading(false);
      }, 400);
    }, FP_ROTATION_MS);
    return () => clearInterval(interval);
  }, []);

  const heroImage = HERO_IMAGES[heroIndex];
  const fpPix = KLEIGH_FP_PIX[fpIndex];

  return (
    <>
      <Header />
      <GlobalPlayer />

      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          key={heroImage.src}
          src={heroImage.src}
          alt="G Putnam Music"
          fill
          priority
          className={`object-cover transition-opacity duration-300 ${heroFading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectPosition: heroImage.objectPosition }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">G Putnam Music</h1>
          <p className="mt-2 text-lg md:text-xl text-white/90 drop-shadow">The One Stop Song Shop</p>
          <p className="mt-1 text-sm md:text-base text-[#C8A882] drop-shadow">Activity-Based, Context-Aware Music Intelligence</p>
        </div>
      </section>

      {/* KLEIGH-BRANDED FLOATING PLAYER — 3 Congruent PIX */}
      <section className="bg-black py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* FP Visual Core */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
            <Image
              key={fpPix.src}
              src={fpPix.src}
              alt={fpPix.alt}
              fill
              className={`object-cover transition-opacity duration-500 ${fpFading ? 'opacity-0' : 'opacity-100'}`}
              sizes="(max-width: 768px) 100vw, 896px"
            />
            {/* KLEIGH brand overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-pink-300/80 font-bold mb-1">Now Streaming</p>
              <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">KLEIGH</h2>
              <p className="text-white/60 text-sm mt-1">Songwriter / Singer / Musician</p>
            </div>
            {/* PIX indicator dots */}
            <div className="absolute top-4 right-4 flex gap-1.5">
              {KLEIGH_FP_PIX.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === fpIndex ? 'bg-pink-400 scale-125' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stream CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/kleigh"
              className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm tracking-wider rounded-full hover:brightness-110 transition shadow-lg"
            >
              STREAM KLEIGH
            </Link>
            <Link
              href="/kupid"
              className="px-8 py-3 border border-[#C8A882]/40 text-[#C8A882] font-bold text-sm tracking-wider rounded-full hover:bg-[#C8A882]/10 transition"
            >
              KUPID Locket\u2122
            </Link>
          </div>

          {/* Platform stats */}
          <p className="text-center text-white/30 text-xs mt-6 tracking-wide">
            1,000+ GPMC Catalog Tracks \u00b7 Continuous FP Streaming \u00b7 2+ Hours No Repeats
          </p>
        </div>
      </section>

      {/* SINGLE FOOTER LINK: All T20 Activities */}
      <section className="bg-neutral-950 py-6 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/heroes"
            className="inline-flex items-center gap-2 text-[#C8A882] hover:text-white text-sm font-medium tracking-wide transition-colors"
          >
            <span className="text-lg">\ud83c\udfa7</span>
            Explore All 20 Activity Streams \u2192
          </Link>
        </div>
      </section>

      <FeaturedPlaylists />
      <WeeklyRace />
      <Footer />
    </>
  );
}
