'use client';

/**
 * K-KUT — Home Page
 *
 * Standalone deployment. Connects to gputnammusic.com via links only.
 * No shared code, no shared APIs with GPMC root.
 *
 * Sections:
 *   1. Header — GPM identity + K-KUT brand
 *   2. Hero — invention pitch
 *   3. Invention cards — K-KUT, mini-KUT, K-kUpId
 *   4. CTA — link to browse / purchase
 *   5. Footer
 */

import Link from 'next/link';

const INVENTIONS = [
  {
    id: 'kkut',
    label: 'K-KUT',
    tagline: 'Own a Song Section',
    description:
      'An exact audio excerpt of one or more contiguous song sections — Intro, Verse, Pre, Chorus, Bridge, Outro — in original order. ASCAP-compliant. One K-KUT per purchase.',
    color: '#D4A017',
    href: '/invention#k-kut',
  },
  {
    id: 'mkut',
    label: 'mini-KUT',
    tagline: 'Own the Words',
    description:
      'Text micro-assets harvested from master tracks: verbs, nouns, compounds, phrases, and hooks. 12 mini-KUTs per Master Track (8/12/20 rule). Text only — no audio.',
    color: '#C8A882',
    href: '/invention#mini-kut',
  },
  {
    id: 'kupid',
    label: 'K-kUpId',
    tagline: 'Send the Feeling',
    description:
      'A curated K-KUT experience built around 5 romance levels: Interest → Date → Love → Sex → Forever. Cryptographically signed, shareable, and giftable.',
    color: '#C0392B',
    href: '/invention#k-kupid',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <span className="text-xs text-[#C8A882] uppercase tracking-widest">G Putnam Music</span>
          <h1 className="text-xl font-bold text-[#D4A017] leading-none">K-KUT</h1>
        </div>
        <nav className="flex gap-4 text-sm text-[#C8A882]">
          <Link href="/invention" className="hover:text-[#D4A017] transition-colors">Inventions</Link>
          <Link href="/demo" className="hover:text-[#D4A017] transition-colors">Demo</Link>
          <a
            href="https://gputnammusic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4A017] transition-colors"
          >
            GPM
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C8A882]">G Putnam Music Invention</p>
        <h2 className="text-5xl font-extrabold text-[#D4A017] max-w-2xl leading-tight">
          Own Exactly What Moves You
        </h2>
        <p className="max-w-xl text-[#C8A882] text-lg leading-relaxed">
          K-KUT lets you own an exact excerpt of a real song section — not a clip, not a
          sample, not a playlist. A permanent, legal, playable piece of the original.
        </p>
        <Link
          href="/demo"
          className="mt-2 px-8 py-3 bg-[#D4A017] text-[#0a0a0a] font-bold rounded-full hover:bg-[#C8A882] transition-colors"
        >
          See It In Action
        </Link>
      </section>

      {/* ── Invention Cards ── */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <h3 className="text-sm uppercase tracking-widest text-[#C8A882] mb-8 text-center">
          The K-KUT Invention Family
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INVENTIONS.map((inv) => (
            <Link
              key={inv.id}
              href={inv.href}
              className="block rounded-xl border border-white/10 bg-[#111] p-6 hover:border-[#D4A017]/50 transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: inv.color }}>
                {inv.label}
              </p>
              <p className="text-lg font-bold text-[#F5e6c8] mb-3 group-hover:text-[#D4A017] transition-colors">
                {inv.tagline}
              </p>
              <p className="text-sm text-[#C8A882] leading-relaxed">{inv.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-white/10 px-6 py-6 text-center text-xs text-[#C8A882]">
        <p>
          K-KUT is a{' '}
          <a href="https://gputnammusic.com" className="text-[#D4A017] hover:underline">
            G Putnam Music
          </a>{' '}
          invention. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
