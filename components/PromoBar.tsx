'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Promos rotate — each has a message, a CTA, and a destination
const PROMOS = [
  {
    id: 'kk-create',
    bg: 'bg-amber-500',
    text: 'text-black',
<<<<<<< HEAD
    label: '⚡ K-KUT QUICKSTART — All KKs are pre-made. Pick your Sweet Spot and launch instantly.',
    cta: 'OPEN PRE-MADE KK →',
    href: '/kkut/create',
=======
    // NOTE: K-KUT language is product/inventory language; this bar is sponsor-focused.
    // Keep it sponsor-centric (KUB) because /join is where sponsors join.
    label: '⚡ FOUNDER SPECIAL — First 50 KUBs get permanent ELDER status for the price of JOEY. Limited.',
    cta: 'CLAIM IT →',
    href: '/join',
>>>>>>> origin/copilot/fix-audio-playback-issues
  },
  {
    id: 'mk-play',
    bg: 'bg-cyan-800',
    text: 'text-cyan-100',
    label: '🎧 MINI-KUT LIVE — Open a prefab mK and hear a verse/bridge/chorus snippet instantly.',
    cta: 'PLAY mK →',
    href: '/mkut/swift1',
  },
  {
    id: 'kpd',
    bg: 'bg-zinc-900',
    text: 'text-amber-400',
    label: '🔗 KPD HUB — All KPD packages are pre-made and ready to activate with KK links and mK clips.',
    cta: 'OPEN KPD →',
    href: '/kupid',
  },
  {
    id: 'gift',
    bg: 'bg-red-900',
    text: 'text-red-100',
    label: '🎁 HEART-TAP — Turn your moment into a ready-to-send gift with message and checkout.',
    cta: 'GIFT IT →',
    href: '/gift',
  },
  {
<<<<<<< HEAD
=======
    id: 'kleigh',
    bg: 'bg-purple-900',
    text: 'text-purple-200',
    label: "🐨 KLEIGH KUB — Alt rock from Down Under. KUBs are KLEIGH's koala crew. Stream free, join the pride.",
    cta: 'BECOME A KUB →',
    href: 'https://2kleigh.com',
  },
  {
>>>>>>> origin/copilot/fix-audio-playback-issues
    id: 'heroes',
    bg: 'bg-[#1a1a1a]',
    text: 'text-amber-300',
    label: '⭐ Share a Hero story today — Military, Medical, Educator. Honor someone who served.',
    cta: 'SHARE →',
    href: '/heroes',
  },
];

export default function PromoBar() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % PROMOS.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(iv);
  }, [dismissed]);

  if (dismissed) return null;

  const p = PROMOS[idx];
  const isExternal = p.href.startsWith('http');

  return (
    <div
      className={`w-full ${p.bg} ${p.text} transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 text-sm font-bold">
        <span className="flex-1 text-center leading-snug">{p.label}</span>
        <div className="flex items-center gap-3 shrink-0">
          {isExternal ? (
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline whitespace-nowrap"
            >
              {p.cta}
            </a>
          ) : (
            <Link href={p.href} className="underline hover:no-underline whitespace-nowrap">
              {p.cta}
            </Link>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="opacity-50 hover:opacity-100 transition-opacity leading-none text-lg"
            aria-label="Dismiss promo"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
