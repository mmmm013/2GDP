'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import Link from 'next/link';
import { KUPID_TIERS } from '@/lib/kupid-protocol';
import GpmBot, { type JourneyStep } from '@/components/GpmBot';

export default function KupidPage() {
  const [showInfo, setShowInfo] = useState(false);

  // K-KUT purchase journey steps for LF-BOT
  const kupidSteps: JourneyStep[] = [
    {
      title: 'Explore K-KUT & mini-KUT options',
      hint: 'Scroll down to see all digital tiers for K-KUT links, mini-KUT clips, and creator tools.',
      action: 'See All Tiers',
      href: '#tiers',
    },
    {
      title: 'Pick your tier',
      hint: 'KLEAN KUT ($49) = digital link. Mini-KUT ($29) = audio clip. Creator Suite adds unlimited generation + analytics.',
      action: 'View Tiers',
      href: '#tiers',
    },
    {
      title: 'Tap your chosen tier',
      hint: 'Each card has a direct Stripe checkout link. Tap the button to purchase securely.',
    },
    {
      title: 'Receive your K-KUT code',
      hint: 'Your 6-character code is delivered by email. Tap it to open your Sweet Spot experience.',
    },
    {
      title: 'Share or gift your K-kUpId',
      hint: 'Text it, post it, or add it to a Heart-Tap gift for the ultimate handoff.',
      action: 'Gift Options',
      href: '/gift',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />
      <GlobalPlayer />

      {/* LF-BOT: guides users through the K-KUT purchase journey */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <GpmBot bot="LF-BOT" steps={kupidSteps} startCollapsed={false} className="max-w-xs w-full" />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-6 px-4 text-center">
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
          Patented Invention
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-2 text-[#C8A882]">K-KUTs</h1>
        <p className="text-xl md:text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-semibold">
          Own the Sweet Spot
        </p>
        <p className="mt-4 text-white/60 max-w-lg mx-auto">
          Every track has a moment that moves you. K-KUTs capture that Sweet Spot &mdash; a curated highlight delivered as a clean, shareable digital experience.
        </p>
      </section>

      {/* Pricing Grid */}
      <section id="tiers" className="px-4 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {KUPID_TIERS.map((tier) => (
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
                Get {tier.badge}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* What is K-KUTs? - Trigger Button + Links */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <button
            onClick={() => setShowInfo(true)}
            className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors underline underline-offset-4 mb-6 cursor-pointer"
          >
            What is K-KUTs? &rarr;
          </button>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gift" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">Heart-Tap Gifts &rarr;</Link>
            <Link href="/join" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">Join the Fleet &rarr;</Link>
            <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">Back to Home &rarr;</Link>
          </div>
        </div>
      </section>

      {/* What is K-KUTs? POPUP MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowInfo(false)}>
          <div className="relative max-w-lg w-full bg-gray-900 border border-amber-500/30 rounded-2xl p-8 text-center max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl font-bold transition-colors"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-amber-400 mb-4">What is K-KUTs?</h2>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Every track has a Sweet Spot &mdash; the moment the music hits hardest. K-KUTs capture that curated highlight and package it as an instant digital handoff.
            </p>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Each piece comes with 3 Optimum Sweet Spots to choose from: the power chorus, the delicate verse, or the bridge. Want something more personal? Custom K-KUTs let you pick your own highlight up to 1:30 in length &mdash; your personal hug, your way.
            </p>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Pre-loaded with curated frequency pairings designed to amplify focus, creativity, and personal energy. It&apos;s a clean way to carry and share the music that moves you.
            </p>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Built for speed and clarity, K-KUTs and mini-KUTs give artists and fans a direct path from emotion to action.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">3 Sweet Spots per Track</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">Custom up to 1:30</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Digital-first</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Instant Share</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">Gift Ready</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
