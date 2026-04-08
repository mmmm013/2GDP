'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'canoe',
    emoji: '🛶',
    name: 'CANOE',
    subtitle: 'Ship Sponsor',
    price: '$13.13',
    description: 'Board the vessel. Your monthly sponsorship directly funds the GPM catalog, artist support, and keeps the stream flowing.',
    perks: [
      'Verified Ships Sponsor badge',
      'Full GPM stream access',
      'Monthly profit-share participation',
      'Access to URU Story Engine',
    ],
    color: 'from-[#0e2a4a] to-[#0a1e35]',
    accent: '#4da6ff',
    border: 'border-[#4da6ff]/40',
    ring: 'hover:border-[#4da6ff]/80',
  },
  {
    id: 'cruiser',
    emoji: '🚢',
    name: 'CRUISER',
    subtitle: 'Senior Ship Sponsor',
    price: '$23.23',
    description: 'Command the deck. Senior Ships sponsors receive elevated profit-share status and are named in Founder dispatches.',
    perks: [
      'Verified Senior Ships Sponsor badge',
      'Full GPM stream access',
      'Elevated monthly profit-share',
      'Access to URU Story Engine',
      'Named in Founder dispatches',
      'Priority flash offer access',
    ],
    color: 'from-[#D4A017]/20 to-[#0a1e35]',
    accent: '#D4A017',
    border: 'border-[#D4A017]/60',
    ring: 'hover:border-[#D4A017]',
    featured: true,
  },
] as const;

// ─── Inner page (uses useSearchParams — wrapped in Suspense below) ─────────────
function JoinInner() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === '1';
  const cancelled = searchParams.get('cancelled') === '1';
  const successTier = searchParams.get('tier');

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleJoin = async (tier: string) => {
    setLoading(tier);
    setError('');
    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a1e35] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="text-7xl">⚓</div>
          <h1 className="text-3xl font-black text-[#4da6ff]">Welcome aboard, Ship!</h1>
          <p className="text-[#F5e6c8]/80 leading-relaxed">
            You&apos;re now a {successTier === 'cruiser' ? 'Cruiser' : 'Canoe'} — a Ships Sponsor of G Putnam Music.
            Every dollar flows directly to Michael Scherer and the GPM artist family. Thank you.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#D4A017] text-[#0a1e35] font-black px-8 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-[#e8b520] transition-colors"
          >
            Start Streaming →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1e35] text-[#F5e6c8]">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a1e35]/95 backdrop-blur border-b border-[#4da6ff]/20 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gpm_logo.jpg" alt="GPM" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-[#D4A017] font-bold text-lg hidden sm:block">G Putnam Music</span>
        </Link>
        <Link href="/" className="text-sm text-[#4da6ff] hover:text-[#D4A017] transition-colors">← Home</Link>
      </header>

      {/* ── Cancelled notice ───────────────────────────────────────── */}
      {cancelled && (
        <div className="bg-[#3d1a00] border-b border-orange-500/40 px-4 py-3 text-center text-sm text-orange-300">
          Checkout cancelled — your spot is still here when you&apos;re ready.
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#4da6ff]/5 blur-3xl rounded-full" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#4da6ff]/60 mb-4">
          G Putnam Music — Flagship
        </p>
        <div className="text-6xl mb-4">⛵</div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#F5e6c8] mb-3 leading-none">
          Join the<br /><span className="text-[#4da6ff]">Ships.</span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#F5e6c8]/50 mb-4">
          Ships Sponsors — the engine of gputnammusic.com
        </p>
        <p className="max-w-xl mx-auto text-[#F5e6c8]/70 text-sm leading-relaxed">
          Ships Sponsors are monthly partners who keep the flagship running.
          Every KUT profit flows directly from the Founder to Michael Scherer and family — no one in between.
          Your sponsorship fuels the music and the people behind it.
        </p>
      </section>

      {/* ── Error ──────────────────────────────────────────────────── */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <div className="bg-red-900/40 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-center text-sm font-bold">
            {error}
          </div>
        </div>
      )}

      {/* ── Tier Cards ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-2xl border-2 ${tier.border} ${tier.ring} bg-gradient-to-b ${tier.color} p-7 transition-all duration-200 flex flex-col`}
          >
            {tier.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A017] text-[#0a1e35] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-4xl">{tier.emoji}</span>
                <h2 className="text-2xl font-black mt-2" style={{ color: tier.accent }}>{tier.name}</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-[#F5e6c8]/50">{tier.subtitle}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-[#F5e6c8]">{tier.price}</div>
                <div className="text-xs text-[#F5e6c8]/40">/month</div>
              </div>
            </div>

            <p className="text-sm text-[#F5e6c8]/70 leading-relaxed mb-6">
              {tier.description}
            </p>

            <ul className="space-y-2 mb-8 flex-1">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-[#F5e6c8]/80">
                  <span style={{ color: tier.accent }} className="mt-0.5 shrink-0">✓</span>
                  {perk}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleJoin(tier.id)}
              disabled={loading === tier.id}
              className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50"
              style={{
                backgroundColor: tier.accent,
                color: tier.id === 'canoe' ? '#0a1e35' : '#0a1e35',
              }}
            >
              {loading === tier.id ? 'Loading…' : `Join as ${tier.name} →`}
            </button>
          </div>
        ))}
      </section>

      {/* ── Profit Share Notice ────────────────────────────────────── */}
      <section className="w-full bg-[#0e2a4a] border-t border-[#4da6ff]/20 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4da6ff]">⚓ Ships Sponsor Benefit</p>
          <h2 className="text-2xl font-black text-[#F5e6c8]">Real Profit Sharing. No Fine Print.</h2>
          <p className="text-[#F5e6c8]/70 text-sm leading-relaxed max-w-lg mx-auto">
            GPM Ships Sponsors are genuine profit-sharing members. Every KUT sold, every stream that
            counts — the proceeds flow directly from the Founder to Michael Scherer and the GPM artist
            family. You are not just a subscriber. You are a partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/scherer"
              className="bg-[#4da6ff]/10 border border-[#4da6ff]/40 text-[#4da6ff] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#4da6ff]/20 transition-colors"
            >
              🎹 Michael Scherer →
            </Link>
            <Link
              href="/"
              className="bg-[#D4A017]/10 border border-[#D4A017]/40 text-[#D4A017] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#D4A017]/20 transition-colors"
            >
              Stream Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-[#4da6ff]/10 py-6 text-center text-xs text-[#F5e6c8]/30">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}

// ─── Page export (Suspense boundary for useSearchParams) ─────────────────────
export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a1e35]" />}>
      <JoinInner />
    </Suspense>
  );
}
