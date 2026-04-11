'use client';

import { useEffect, useState } from 'react';
import KutHorizontalScroll from '@/components/KutHorizontalScroll';
import {
  getFeaturedKuts, FALLBACK_KUTS,
  getFeaturedMKuts, FALLBACK_MKUTS,
  getFeaturedKPDs, FALLBACK_KPDS,
} from '@/lib/featuredKuts';
import type { KutItem } from '@/lib/featuredKuts';

export default function KKutPage() {
  const [kks, setKKs] = useState<KutItem[]>(FALLBACK_KUTS);
  const [mks, setMKs] = useState<KutItem[]>(FALLBACK_MKUTS);
  const [kpds, setKPDs] = useState<KutItem[]>(FALLBACK_KPDS);

  useEffect(() => {
    getFeaturedKuts().then((d) => { if (d.length > 0) setKKs(d); });
    getFeaturedMKuts().then((d) => { if (d.length > 0) setMKs(d); });
    getFeaturedKPDs().then((d) => { if (d.length > 0) setKPDs(d); });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-4 py-16 flex flex-col items-center">

      {/* ── Master header ── */}
      <header className="mb-16 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">
          4PE&#8209;BIZ&#8209;MSC · The Three Inventions
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3">
          K&#8209;KUT Family
        </h1>
        <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed">
          Three co-equal inventions. Each delivers exact audio snippets from original PIX.
        </p>
      </header>

      <div className="w-full max-w-2xl flex flex-col gap-16">

        {/* ── Invention 1: K-KUT (KK) ── amber ─────────────────────────── */}
        <section aria-labelledby="kk-heading">
          <div className="mb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/50 mb-1">
              Invention 01 · KK
            </p>
            <h2 id="kk-heading" className="text-2xl font-bold tracking-tight text-amber-300">
              K&#8209;KUT
            </h2>
            <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-xs">
              Exact audio excerpt from a whole song section (original PIX via 4PE‑BIZ‑MSC).
            </p>
          </div>
          <KutHorizontalScroll
            items={kks}
            density="high"
            autoStream={true}
            autoPlay={true}
            loop={true}
          />
        </section>

        {/* ── Invention 2: mini-KUT (mK) ── violet ──────────────────────── */}
        <section aria-labelledby="mk-heading">
          <div className="mb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-violet-400/50 mb-1">
              Invention 02 · mK
            </p>
            <h2 id="mk-heading" className="text-2xl font-bold tracking-tight text-violet-300">
              mini&#8209;KUT
            </h2>
            <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-xs">
              Short exact audio hook, tied to its ASCAP Track ID. Aggregates within the same
              PIX&#8209;PCK per title (LOOP 8). Dozens of emotional options from one track.
            </p>
          </div>
          <KutHorizontalScroll
            items={mks}
            density="high"
            autoStream={true}
            autoPlay={false}
            loop={true}
          />
        </section>

        {/* ── Invention 3: K-kUpId (KPD) ── rose ───────────────────────── */}
        <section aria-labelledby="kpd-heading">
          <div className="mb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-rose-400/50 mb-1">
              Invention 03 · KPD
            </p>
            <h2 id="kpd-heading" className="text-2xl font-bold tracking-tight text-rose-300">
              K&#8209;kUpId
            </h2>
            <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-xs">
              Exact audio excerpt curated for 5 romance levels:
              Interest &rarr; Date &rarr; Love &rarr; Sex &rarr; Forever.
              Signed, shareable, traceable.
            </p>
          </div>
          <KutHorizontalScroll
            items={kpds}
            density="high"
            autoStream={true}
            autoPlay={false}
            loop={true}
          />
        </section>

      </div>

      {/* ── CTA ── */}
      <div className="mt-20 text-center">
        <a
          href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-wide hover:bg-neutral-100 transition-colors shadow-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Access — $24.99
        </a>
        <p className="mt-4 text-[10px] text-white/20 tracking-widest uppercase">
          Relief · One Stop Song Shop
        </p>
      </div>

    </main>
  );
}
