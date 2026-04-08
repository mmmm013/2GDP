'use client';

import { useState } from 'react';

// ── Promo leads shown when BRAVE is expanded ──────────────────────────────────
const PROMO_LEADS = [
  {
    emoji: '🛶',
    label: 'Join — KANOE',
    sub: '$13.13/mo · Ships Sponsor',
    href: '/join',
    color: '#4da6ff',
  },
  {
    emoji: '🚢',
    label: 'Join — KRUISER',
    sub: '$23.23/mo · Senior Ships Sponsor',
    href: '/join',
    color: '#D4A017',
  },
  {
    emoji: '🎹',
    label: 'Michael Scherer',
    sub: 'Jazz · KUT Catalog',
    href: '/scherer',
    color: '#f9a8d4',
  },
  {
    emoji: '🎸',
    label: 'KLEIGH',
    sub: 'Alt Rock · The Vault',
    href: 'https://www.2kleigh.com',
    color: '#C8A882',
  },
  {
    emoji: '🎁',
    label: 'Free Gift Drop',
    sub: 'Hourly · K-KUTs & mini-KUTs',
    href: '/gift',
    color: '#4ade80',
  },
];

export function BraveEagleBanner() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-gradient-to-r from-[#0a1e35] via-[#0d2440] to-[#0a1e35] border-b border-[#4da6ff]/30">
      {/* ── Collapsed bar ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-xs text-[#F5e6c8]/75 leading-relaxed text-left hover:text-[#F5e6c8] transition-colors cursor-pointer group"
          aria-expanded={open}
          aria-label="Toggle BRAVE promo leads"
        >
          <span className="text-[#4da6ff] font-black group-hover:text-[#7ec3ff] transition-colors">
            🦅 BRAVE
          </span>
          <span className="text-[#4da6ff]/60 text-[10px] font-black uppercase tracking-widest transition-transform duration-200" style={{ display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            ▶
          </span>
          <span>
            — Almost ALL GPM revenues support{' '}
            <a href="/scherer" onClick={(e) => e.stopPropagation()} className="text-[#D4A017] font-bold hover:underline">Michael Scherer</a>
            {' '}& family — battling auto-immune illness.{' '}
            <span className="opacity-70">Devout. All-American. Kind as kind comes.</span>
            {' '}Artists:{' '}
            <a href="/scherer" onClick={(e) => e.stopPropagation()} className="text-[#D4A017] hover:underline font-semibold">Michael Scherer</a>
            {', '}
            <a href="https://www.2kleigh.com" onClick={(e) => e.stopPropagation()} className="text-[#C8A882] hover:underline font-semibold">KLEIGH</a>
            {', Lloyd G Miller.'}
          </span>
        </button>

        <a
          href="/join"
          className="shrink-0 bg-[#4da6ff] text-[#0a1e35] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full hover:bg-[#7ec3ff] transition-colors whitespace-nowrap"
        >
          ⛵ Ships — Profit Share
        </a>
      </div>

      {/* ── Expanded promo leads ───────────────────────────────────── */}
      {open && (
        <div className="border-t border-[#4da6ff]/20 bg-[#081828]/60 px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#4da6ff]/50 mb-3 text-center sm:text-left">
              🦅 GPM Promo Leads
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {PROMO_LEADS.map((lead) => (
                <a
                  key={lead.label}
                  href={lead.href}
                  className="flex flex-col items-center text-center bg-[#0a1e35]/80 border border-[#4da6ff]/15 rounded-xl px-3 py-3 hover:border-[#4da6ff]/50 transition-all group"
                >
                  <span className="text-2xl mb-1">{lead.emoji}</span>
                  <span className="text-[11px] font-black leading-tight" style={{ color: lead.color }}>
                    {lead.label}
                  </span>
                  <span className="text-[10px] text-[#F5e6c8]/40 mt-0.5 leading-tight">{lead.sub}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
