'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
// import WeeklyRace from '@/components/WeeklyRace';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
// import EmailCapture from '@/components/EmailCapture';
import Navigation from '@/components/Navigation';
import { getBrandFromHostname, getBrandConfig } from '@/config/brandConfig';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// ============================================================
// KFS HOMEPAGE: Kids Fun Songs brand landing
// ============================================================
function KFSHomePage() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracks() {
      let localData: any[] = [];
      try {
        const res = await fetch('/handoff/awesome-squad.json');
        if (res.ok) localData = await res.json();
      } catch (e) { /* fallback */ }
      setTracks(localData);
      setLoading(false);
    }
    loadTracks();
  }, []);

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* KFS Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-b from-[#FF6B35]/20 via-[#1a0f05] to-[#1a0f05]">
          <div className="text-center z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-[#FF6B35] mb-4">
              Kids Fun Songs
            </h1>
            <p className="text-2xl md:text-3xl text-[#00BCD4] mb-2">
              Pediatric & Classroom Approved
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Songs that Heal & Teach
            </p>
            <Link
              href="/singalongs"
              className="inline-block bg-[#FF6B35] hover:bg-[#E55A28] text-white font-bold py-4 px-8 rounded-xl text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
            >
              START STREAMING
            </Link>
          </div>
        </section>

        {/* Singalong Tracks Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#FF6B35] mb-2 text-center">
              Awesome Squad Singalongs
            </h2>
            <p className="text-gray-400 text-center mb-10">
              {tracks.length} interactive tracks for kids and classrooms
            </p>

            {loading ? (
              <div className="text-center text-gray-400">Loading tracks...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tracks.map((track: any) => (
                  <div
                    key={track.id}
                    className="group bg-black/30 border border-gray-700 rounded-xl p-4 hover:border-[#FF6B35] hover:bg-black/50 transition-all cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-gradient-to-br from-[#FF6B35]/30 to-[#00BCD4]/30 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">\ud83c\udfb5</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF6B35] transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {track.artist}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* KFS Quick Links */}
        <section className="py-12 px-4 bg-black/20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/educators" className="block p-6 rounded-xl border border-gray-700 hover:border-[#00BCD4] bg-black/30 transition-all text-center">
              <span className="text-4xl block mb-3">\ud83c\udf4e</span>
              <h3 className="text-xl font-bold text-white mb-2">Educators</h3>
              <p className="text-gray-400 text-sm">Free classroom streaming for verified educators</p>
            </Link>
            <Link href="/heroes" className="block p-6 rounded-xl border border-gray-700 hover:border-[#4CAF50] bg-black/30 transition-all text-center">
              <span className="text-4xl block mb-3">\ud83e\uddb8</span>
              <h3 className="text-xl font-bold text-white mb-2">Hero Pillars</h3>
              <p className="text-gray-400 text-sm">Character-building values through music</p>
            </Link>
            <Link href="/sti" className="block p-6 rounded-xl border border-gray-700 hover:border-[#FF6B35] bg-black/30 transition-all text-center">
              <span className="text-4xl block mb-3">\ud83d\udcda</span>
              <h3 className="text-xl font-bold text-white mb-2">STI Menu</h3>
              <p className="text-gray-400 text-sm">Browse all streaming content categories</p>
            </Link>
          </div>
        </section>

        {/* KFS Attribution */}
        <section className="py-8 text-center">
          <p className="text-xs text-gray-500">
            All content curated and approved by G Putnam Music LLC.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ============================================================
// GPM HOMEPAGE: G Putnam Music flagship (original)
// ============================================================

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

// KLEIGH-BRANDED FP: 3 Congruent PIX - Continuous Loop
const KLEIGH_FP_PIX = [
  { src: '/k-hero.jpg', alt: 'KLEIGH - Artist Portrait' },
  { src: '/k-hero-alternate.JPG', alt: 'KLEIGH - Alternate' },
  { src: '/assets/Front Pose.jpg', alt: 'KLEIGH - Front Pose' },
];

const FP_ROTATION_MS = 4000; // 4s per PIX - sleek cycle

function GPMHomePage() {
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

  // KLEIGH FP: Continuous 3-PIX rotation loop
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

      {/* HERO */}
      <section className="relative h-screen min-h-[600px]">
        <div className={`absolute inset-0 transition-opacity duration-300 ${heroFading ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={heroImage.src}
            alt="G Putnam Music"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: heroImage.objectPosition }}
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1207] via-transparent to-transparent" />
        <div className="absolute bottom-16 left-8 md:left-16 z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
            G Putnam Music
          </h1>
          <p className="text-2xl md:text-3xl text-[#DAA520]">
            The One Stop Song Shop
          </p>
          <p className="text-lg text-gray-300">
            Activity-Based, Context-Aware Music Intelligence
          </p>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-8">
        <FeaturedPlaylists />
      </section>

      <Footer />
    </>
  );
}

// ============================================================
// ROOT EXPORT: Brand-aware homepage router
// ============================================================
export default function Hero() {
  const [brand, setBrand] = useState<string>('GPM');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const resolved = getBrandFromHostname(window.location.hostname);
    setBrand(resolved);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (brand === 'KFS') {
    return <KFSHomePage />;
  }

  return <GPMHomePage />;
}
