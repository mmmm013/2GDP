'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import Link from 'next/link';
import { KUPID_TIERS } from '@/lib/kupid-protocol';

export default function KupidPage() {
  const [isVDay, setIsVDay] = useState(false);

  useEffect(() => {
    const now = new Date();
    const m = now.getMonth();
    const d = now.getDate();
    setIsVDay(m === 0 && d >= 20 || m === 1 && d <= 16);
  }, []);

  const historicTier = KUPID_TIERS.find(t => t.id === 'historic');

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />
      <GlobalPlayer />

      {/* Hero Section */}
      <section className="pt-20 pb-6 px-4 text-center">
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
          Patented Invention
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-2 text-[#C8A882]">K-KUTs</h1>
        <p className="text-xl md:text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-semibold">
          Sovereign Locket
        </p>
        <p className="mt-4 text-white/60 max-w-lg mx-auto">
          The lock-and-key frequency device that pairs music to your creative energy. Three tiers. One invention.
        </p>
      </section>

      {/* V-Day Banner */}
      {isVDay && (
        <section className="mx-4 mb-6">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-red-900/40 via-pink-900/30 to-red-900/40 border border-red-500/20 rounded-2xl p-6 text-center">
            <p className="text-3xl mb-2">&#10084;&#65039;</p>
            <h2 className="text-xl font-bold text-white mb-2">The Valentine&apos;s Day Locket</h2>
            <p className="text-white/70 text-sm mb-4">
              Gift a K-KUTs Locket this Valentine&apos;s Day. A patented invention paired to your frequency. The ultimate gift of creative energy.
            </p>
            <Link
              href="/valentines"
              className="inline-block px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm hover:bg-white/20 transition-colors"
            >
              Valentine&apos;s Gift Guide &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* MAKE HISTORY CALLOUT */}
      <section className="mx-4 mb-8">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-900/30 via-amber-900/20 to-yellow-900/30 border border-yellow-500/30 rounded-2xl p-8 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-400/80 mb-2">Patent-Pending</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            &#9733; Make History Today
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-4">
            2 brand-new patent-pending inventions. 2 new trademarks making his 3rd. A jewelry product born from pure emotion &mdash; a completely new way to say what words can&apos;t. This purchase doesn&apos;t just buy a locket. It makes history.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              2 Patent-Pending Inventions
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              3 Trademarks
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Emotional Jewelry
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
              A New Way to Say It
            </span>
          </div>
          <Link
            href={KUPID_TIERS.find(t => t.id === 'historic')?.stripeLink || '#'}
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-sm hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20"
          >
            Get HISTORIC Locket &mdash; {KUPID_TIERS.find(t => t.id === 'historic')?.price}
          </Link>
        </div>
      </section>

      {/* Pricing Grid — excludes Historic (rendered as bookend below) */}
      <section className="px-4 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {KUPID_TIERS.filter(t => t.id !== 'historic').map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border ${tier.borderColor} bg-white/5 p-6 flex flex-col ${
                tier.featured ? 'md:-mt-4 md:mb-4 ring-2 ring-orange-400/40' : ''
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider bg-orange-500 text-black">
                  MOST POPULAR
                </div>
              )}
              <span className={`inline-block px-3 py-0.5 rounded text-[10px] font-bold tracking-widest bg-gradient-to-r ${tier.color} text-black w-fit mb-3`}>
                {tier.badge}
              </span>
              <p className={`text-3xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-1`}>
                {tier.price}
              </p>
              <p className="text-white/40 text-xs mb-4">one-time</p>
              <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
              <p className="text-white/60 text-sm mb-4 flex-grow">{tier.description}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-green-400 mt-0.5">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.stripeLink}
                className={`w-full py-3 rounded-xl text-center font-bold text-sm transition-all ${tier.buttonClass}`}
              >
                Get {tier.badge} Locket
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* HISTORIC BOOKEND — matches top Make History box */}
      {historicTier && (
        <section className="mx-4 mb-12">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-900/30 via-amber-900/20 to-yellow-900/30 border border-yellow-500/30 rounded-2xl p-8 text-center">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-400/80 mb-2">Makes History</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {historicTier.name}
            </h2>
            <p className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${historicTier.color} bg-clip-text text-transparent mb-2`}>
              {historicTier.price}
            </p>
            <p className="text-white/40 text-xs mb-4">one-time</p>
            <p className="text-white/70 max-w-xl mx-auto mb-6">
              {historicTier.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {historicTier.features.map((f, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  {f}
                </span>
              ))}
            </div>
            <Link
              href={historicTier.stripeLink}
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-sm hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20"
            >
              Get HISTORIC Locket &mdash; {historicTier.price}
            </Link>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">What is K-KUTs?</h2>
          <p className="text-white/60 mb-3">
            K-KUTs is a patent-pending music-frequency locket technology by G Putnam Music. Each locket is electronically paired to curated music frequencies designed to amplify focus, creativity, and personal energy.
          </p>
          <p className="text-white/60 mb-6">
            Born from 2 brand-new inventions and protected by 3 trademarks, K-KUTs represents a completely new form of emotional jewelry &mdash; a personal, pure way to communicate through music and creative energy. The Historic tier makes you part of that story.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gift" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
              Heart-Tap Gifts &rarr;
            </Link>
            <Link href="/join" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
              Join the Fleet &rarr;
            </Link>
            <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
              Back to Home &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
