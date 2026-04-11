'use client';

import { useEffect, useState } from 'react';
import KutHorizontalScroll from '@/components/KutHorizontalScroll';
import { getFeaturedKuts, FALLBACK_KUTS } from '@/lib/featuredKuts';
import type { KutItem } from '@/lib/featuredKuts';

export default function KKutPage() {
  const [featuredKuts, setFeaturedKuts] = useState<KutItem[]>(FALLBACK_KUTS);

  useEffect(() => {
    getFeaturedKuts().then((kuts) => {
      if (kuts.length > 0) setFeaturedKuts(kuts);
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-16">

      {/* Header */}
      <header className="mb-12 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-amber-400/70 mb-3">
          4PE&#8209;BIZ&#8209;MSC
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          K&#8209;KUT
        </h1>
        <p className="text-sm text-white/50 max-w-xs mx-auto leading-relaxed">
          Exact audio excerpts from original PIX.
          <br />
          Stream. Feel. Connect.
        </p>
      </header>

      {/* Viral Audio Stream */}
      <section
        className="w-full max-w-2xl mb-12"
        aria-label="K-KUT audio stream — excerpts from original PIX"
      >
        <p className="text-center text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">
          The Emotional Virus: Active K&#8209;KUTs
        </p>
        <KutHorizontalScroll
          items={featuredKuts}
          density="high"
          autoStream={true}
          autoPlay={true}
          loop={true}
        />
      </section>

      {/* Get Access CTA */}
      <a
        href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03"
        className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-black rounded-full font-bold text-sm tracking-wide hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Access — $24.99
      </a>

      <p className="mt-4 text-[10px] text-white/25 tracking-widest uppercase">
        Relief · One Stop Song Shop
      </p>

    </main>
  );
}
