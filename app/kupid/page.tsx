'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import Link from 'next/link';
import { KUPID_TIERS } from '@/lib/kupid-protocol';
import GpmBot, { type JourneyStep } from '@/components/GpmBot';
import InventionBadge from '@/components/InventionBadge';

export default function KupidPage() {
  const [isVDay, setIsVDay] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Audio preview state
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPreviewTitle(null);
  }, []);

  const playExcerpt = useCallback(async () => {
    if (previewLoading) return;
    if (previewTitle) { stopPreview(); return; }

    setPreviewLoading(true);
    try {
      const res = await fetch('/api/ww-excerpt');
      if (!res.ok) return;
      const data = await res.json() as { title?: string; previewUrl?: string };
      if (!data.previewUrl) return;

      stopPreview();
      const audio = new Audio(data.previewUrl);
      audio.volume = 0.8;
      audio.play().catch(() => null);
      audioRef.current = audio;
      setPreviewTitle(data.title ?? 'W&W Excerpt');
      audio.addEventListener('ended', stopPreview);
    } finally {
      setPreviewLoading(false);
    }
  }, [previewLoading, previewTitle, stopPreview]);

  // Clean up on unmount
  useEffect(() => () => stopPreview(), [stopPreview]);

  // K-KUT purchase journey steps for LF-BOT
  const kupidSteps: JourneyStep[] = [
    {
      title: 'Explore K-KUT & mini-KUT options',
      hint: 'Scroll down to see all tiers — from $5.99 KidKUTs to the flagship Sovereign Locket.',
      action: 'See All Tiers',
      href: '#tiers',
    },
    {
      title: 'Pick your tier',
      hint: 'KLEAN KUT ($49) = digital link. Mini-KUT ($29) = audio clip. Lockets start at $333.',
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
      hint: 'Text it, post it, or pair it with a K-kUpId jewelry capsule for the ultimate gift.',
      action: 'Gift Options',
      href: '/gift',
    },
  ];

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

      {/* LF-BOT: guides users through the K-KUT purchase journey */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <GpmBot bot="LF-BOT" steps={kupidSteps} startCollapsed={false} className="max-w-xs w-full" />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-6 px-4 text-center">
        <InventionBadge size="lg" href="/inventions" className="mx-auto mb-4" />
        <h1 className="text-5xl md:text-7xl font-bold mb-2 text-[#C8A882]">K-KUTs</h1>
        <p className="text-xl md:text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-semibold">
          Own the Sweet Spot
        </p>
        <p className="mt-4 text-white/60 max-w-lg mx-auto">
          Every track has a moment that moves you. K-KUTs capture that Sweet Spot &mdash; the curated highlight paired to a patent-pending locket or charm. It&apos;s almost like a hug, delivered through music.
        </p>

        {/* W&W Audio Excerpt Preview */}
        <div className="mt-5">
          <button
            onClick={playExcerpt}
            disabled={previewLoading}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border font-semibold text-sm transition-all ${
              previewTitle
                ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
            } disabled:opacity-50`}
          >
            {previewLoading ? (
              <><span className="animate-spin">⟳</span> Loading excerpt…</>
            ) : previewTitle ? (
              <><span>⏹</span> Stop — {previewTitle}</>
            ) : (
              <><span>▶</span> Hear a W&amp;W excerpt</>
            )}
          </button>
          <p className="text-[10px] text-white/30 mt-1.5">Random 30s clip from Wounded &amp; Willings PIX</p>
        </div>
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
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">2 Patent-Pending Inventions</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">3 Trademarks</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">Emotional Jewelry</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">A New Way to Say It</span>
          </div>
          <Link
            href={KUPID_TIERS.find(t => t.id === 'historic')?.stripeLink || '#'}
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-sm hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20"
          >
            Get HISTORIC Locket &mdash; {KUPID_TIERS.find(t => t.id === 'historic')?.price}
          </Link>
        </div>
      </section>

      {/* Pricing Grid - excludes Historic (rendered as bookend below) */}
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
              {(tier.id === 'mini-kut' || tier.id === 'klean-kut' || tier.id === 'genesis' || tier.id === 'sovereign') && (
                <div className="mb-2">
                  <InventionBadge size="sm" href="/inventions" />
                </div>
              )}
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

      {/* HISTORIC BOOKEND - matches top Make History box */}
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
              Every track has a Sweet Spot &mdash; the moment the music hits hardest. K-KUTs capture that curated highlight and pair it to a patent-pending locket or charm, so the feeling lives with you.
            </p>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Each piece comes with 3 Optimum Sweet Spots to choose from: the power chorus, the delicate verse, or the bridge. Want something more personal? Custom K-KUTs let you pick your own highlight up to 1:30 in length &mdash; your personal hug, your way.
            </p>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Pre-loaded with curated frequency pairings designed to amplify focus, creativity, and personal energy. It&apos;s more than jewelry &mdash; it&apos;s a new way to carry the music that moves you.
            </p>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Born from 2 patent-pending inventions and protected by 3 trademarks, K-KUTs represents a completely new form of emotional jewelry by G Putnam Music. Available as affordable charms, digital music links, or premium lockets up to gold &amp; diamond.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">3 Sweet Spots per Track</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">Custom up to 1:30</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Patent-Pending</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">3 Trademarks</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">Emotional Jewelry</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
