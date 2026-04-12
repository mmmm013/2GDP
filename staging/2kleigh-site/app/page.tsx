'use client';

/**
 * 2kleigh.com — Home Page
 *
 * Standalone project. Connects to gputnammusic.com via links only.
 * No shared code, no shared APIs, no domain detection tricks.
 *
 * Sections:
 *   1. Header — GPM identity (Tier 1) + KLEIGH brand (Tier 2)
 *   2. Hero — Artist identity + CTA
 *   3. Tier cards — Tier 1 / Tier 2 / KUB explanation
 *   4. T20 Vault — KleighT20Grid (activity-based streaming, KLEIGH PIX only)
 *   5. Behind the Music — vocal track stories in KLEIGH's own words
 *   6. KUB CTA — sponsorship footer section
 *   7. Footer
 */

import { useState } from 'react';
import KleighT20Grid from '@/components/KleighT20Grid';

// ── Behind the Music stories ──────────────────────────────────────────────────
const TRACK_STORIES = [
  {
    title: 'Beautiful World (Album)',
    type: 'Album',
    quote: 'It was one of the most intense 10 days of my life.',
    story: `The album Beautiful World was recorded over an extraordinary 10-day session in Tari, North New South Wales. He traveled four hours from Apollo Bay to Bendigo, then another 16 hours by car to reach the studio. Working with an incredibly supportive producer, the sessions were so intense that he lost 13 kilograms during the recording — pushed hard in the studio, drenched in sweat, drinking five or six liters of water a day. The result is an album treasured by many.`,
  },
  {
    title: 'Devil Get Away from Me',
    type: 'Album',
    quote: 'This is a turning point and I\'m not going to put up with your crap anymore.',
    story: `Written during a major turning point while living in a suburb of Bendigo, Victoria. After leaving a six-year job and battling seven years of fear, paranoia, and illness, he set up a small home studio — black curtains, a modest PC, guitar, and piano. Devil Get Away from Me became the pilot album that led to the Beautiful World recording sessions in Tari. It is the sound of standing up, getting strong, and refusing to be held back any longer.`,
  },
  {
    title: 'A Better Me',
    type: 'Track',
    quote: 'It didn\'t click with me at first, but then with a bit more effort, it just turned.',
    story: `A Better Me almost didn't happen. He wasn't happy with the initial version — no guitars, something missing. Then friend and collaborator Bill stepped in at the new studio (the Purple Room at mum's place), came up with a guitar riff on the spot, and over a couple of hours laid down tracks that transformed the song. He reproduced the whole thing, re-sang it, and A Better Me came alive. It's about the universal pursuit of becoming a better self.`,
  },
  {
    title: 'Bounce Back',
    type: 'Track',
    quote: 'Sometimes you just got to ignore the haters.',
    story: `Born from years of dealing with jealousy and a lack of support from those closest to him, Bounce Back is his anthem of resilience. To this day, external listeners have resonated deeply with his music while those nearest have held back. The song is a lesson in self-belief — if you believe in what you've got, that's a massive step forward, even when people deliberately choose not to give your work a chance.`,
  },
  {
    title: 'Beautiful World (Title Track)',
    type: 'Track',
    quote: 'My cat tore up the lyrics while I was recording.',
    story: `Written in Apollo Bay, Victoria, inside a two-story Western Red Cedar home overlooking the ocean. He had just recovered from bronchitis when the song came together — starting as nothing more than piano and vocal. The cat famously shredded the handwritten lyrics mid-session, but the pages were pieced back together for the pilot vocal. When a friend heard the demo, he shouted that it was amazing. Recorded later in Tari for the album, the title track captures a moment in a truly beautiful place.`,
  },
];

// ── Header ────────────────────────────────────────────────────────────────────
function KleighHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#2C241B] border-b border-[#C8A882]/20 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT: GPM Tier 1 identity */}
        <a href="https://www.gputnammusic.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center">
            <span className="text-[#D4A017] font-black text-[10px]">GPM</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-[9px] font-black tracking-[0.2em] text-[#C8A882]/50 uppercase">G Putnam Music</div>
            <div className="text-[10px] font-black tracking-[0.15em] text-[#C8A882] uppercase">KLEIGH</div>
          </div>
        </a>

        {/* CENTER: desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '#audio-vault', label: 'The Vault' },
            { href: '#behind-the-music', label: 'Behind the Music' },
            { href: '#kub', label: '🐨 KUBs' },
            { href: 'https://www.gputnammusic.com', label: 'GPM ↗', external: true },
          ].map(({ href, label, external }) => (
            <a key={href} href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase text-[#C8A882]/70 hover:text-[#D4A017] transition-colors rounded-lg hover:bg-[#D4A017]/10">
              {label}
            </a>
          ))}
        </div>

        {/* RIGHT: KUB CTA + mobile burger */}
        <div className="flex items-center gap-3">
          <a href={process.env.NEXT_PUBLIC_KUB_STRIPE_LINK ?? '#kub'}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#C8A882] text-[#2C241B] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full hover:bg-[#D4B490] transition-colors">
            🐨 Become a KUB
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-[#C8A882]/10"
            aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-[#C8A882] transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#C8A882] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#C8A882] transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#C8A882]/15 bg-[#2C241B]/98">
          {[
            { href: '#audio-vault', label: 'The Vault' },
            { href: '#behind-the-music', label: 'Behind the Music' },
            { href: '#kub', label: '🐨 Become a KUB' },
            { href: 'https://www.gputnammusic.com', label: 'G Putnam Music ↗', external: true },
          ].map(({ href, label, external }) => (
            <a key={href} href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3.5 text-sm font-bold tracking-widest uppercase text-[#C8A882]/80 hover:text-[#D4A017] border-b border-[#C8A882]/10 last:border-0">
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function KleighFooter() {
  return (
    <footer className="w-full bg-[#1a100e] border-t border-[#C8A882]/20 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <div>
          <div className="text-[#C8A882] font-black text-sm uppercase tracking-widest">KLEIGH</div>
          <div className="text-[#C8A882]/40 text-xs mt-0.5">A G Putnam Music Product Brand</div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-[11px] font-bold text-[#C8A882]/50 uppercase tracking-widest">
          <a href="#audio-vault" className="hover:text-[#D4A017] transition-colors">The Vault</a>
          <a href="#behind-the-music" className="hover:text-[#D4A017] transition-colors">Behind the Music</a>
          <a href="#kub" className="hover:text-[#D4A017] transition-colors">KUBs</a>
          <a href="https://www.gputnammusic.com" target="_blank" rel="noopener noreferrer"
            className="hover:text-[#D4A017] transition-colors">gputnammusic.com ↗</a>
        </div>
        <div className="text-[#C8A882]/25 text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} G Putnam Music, LLC — All Rights Reserved
        </div>
        <p className="text-[10px] text-[#C8A882]/30 tracking-wider">
          <span className="border border-[#C8A882]/25 rounded px-1.5 py-0.5">ah<sup>c</sup></span>{' '}
          — All Human Created
        </p>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function KleighPage() {
  return (
    <main className="min-h-screen bg-[#0d0a06] text-[#F5e6c8]">
      <KleighHeader />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-[#D2B48C] to-[#C8A882] text-[#1a1207]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-white/10 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#2C241B]/75 mb-4">
            G Putnam Music, LLC Presents
          </p>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20">
            <span className="text-4xl">🎸</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-[#2C241B]">
            KLEIGH
          </h1>
          <p className="text-xl font-serif italic opacity-80 text-[#2C241B]">The Legacy Collection</p>
          <p className="max-w-2xl mx-auto mt-6 text-sm md:text-base leading-relaxed text-[#2C241B]/80">
            KLEIGH is the Tier 2 product brand. G Putnam Music remains the parent label, and this
            collection exists to preserve the voice, catalog, and story while inviting supporters
            to become KUBs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#kub"
              className="inline-flex items-center justify-center rounded-full bg-[#2C241B] px-6 py-3 text-sm font-bold uppercase tracking-[0.25em] text-[#F5e6c8] transition hover:bg-[#1E1812]">
              🐨 Become a KUB
            </a>
            <a href="#audio-vault"
              className="inline-flex items-center justify-center rounded-full border border-[#2C241B]/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.25em] text-[#2C241B] transition hover:bg-[#2C241B]/10">
              Enter The Vault ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── Tier structure cards ──────────────────────────────────────────── */}
      <section className="py-10 bg-[#1a1207] border-y border-[#C8A882]/15">
        <div className="max-w-4xl mx-auto px-6 grid gap-4 md:grid-cols-3">
          {[
            { tier: 'Tier 1', name: 'G Putnam Music, LLC', desc: 'Corporate identity, catalog stewardship, and platform governance.' },
            { tier: 'Tier 2', name: 'KLEIGH', desc: 'The public-facing product brand for legacy vocal storytelling and curated listening.' },
            { tier: 'Support', name: 'KUBs 🐨', desc: 'Sponsorship tied to the koala promo. Support the artist directly — real impact.' },
          ].map(({ tier, name, desc }) => (
            <div key={tier} className="rounded-2xl border border-[#C8A882]/20 bg-[#2C241B]/50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A882]/50 mb-2">{tier}</p>
              <p className="text-lg font-bold uppercase text-[#C8A882]">{name}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#F5e6c8]/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── T20 Vault ─────────────────────────────────────────────────────── */}
      <section id="audio-vault" className="bg-[#0d0a06] py-2">
        <div className="max-w-7xl mx-auto px-2">
          <div className="pt-8 pb-2 px-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C8A882]/40 mb-1">KLEIGH Vault</p>
            <h2 className="text-lg font-bold text-[#C8A882] tracking-wide">Play The Vault — Pick Your Mood</h2>
            <p className="text-xs text-[#C8A882]/40 mt-1">
              Tap any activity. KLEIGH PIX stream exclusively. When a mood&apos;s tracks finish,
              the player advances to the next category automatically.
            </p>
          </div>
          <KleighT20Grid />
        </div>
      </section>

      {/* ── Behind the Music ──────────────────────────────────────────────── */}
      <section id="behind-the-music" className="py-16 bg-[#2C241B]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[#C8A882] text-2xl">📖</span>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[#C8A882]">Behind the Music</h2>
          </div>
          <p className="text-[#F5e6c8]/60 text-sm mb-12 max-w-2xl">
            In his own words — the stories, struggles, and turning points behind the vocal tracks.
          </p>
          <div className="space-y-8">
            {TRACK_STORIES.map((item, i) => (
              <div key={i} className="border border-[#C8A882]/20 rounded-xl p-6 md:p-8 hover:border-[#C8A882]/40 transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20">
                    {item.type}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-[#F5e6c8]">{item.title}</h3>
                </div>
                <blockquote className="text-[#C8A882] font-serif italic text-base md:text-lg mb-4 pl-4 border-l-2 border-[#C8A882]/30">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <p className="text-[#F5e6c8]/70 text-sm leading-relaxed">{item.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KUB CTA ───────────────────────────────────────────────────────── */}
      <section id="kub" className="w-full bg-gradient-to-r from-[#2C241B] to-[#1a1207] border-t border-[#C8A882]/20 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-3xl">🐨</span>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C8A882]">
            KUB — KLEIGH&apos;s Koala Crew
          </p>
          <h2 className="text-2xl font-black text-[#F5e6c8]">Support The Artist. Become a KUB.</h2>
          <p className="text-sm text-[#F5e6c8]/60 leading-relaxed max-w-xl mx-auto">
            Every KUB sponsorship goes directly to KLEIGH&apos;s legacy, catalog preservation, and
            creative development. Your support keeps this voice in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href={process.env.NEXT_PUBLIC_KUB_STRIPE_LINK ?? 'https://www.gputnammusic.com/join'}
              target="_blank" rel="noopener noreferrer"
              className="bg-[#C8A882] text-[#2C241B] px-10 py-4 rounded-full font-black uppercase tracking-wider hover:bg-[#D4B490] transition-colors shadow-xl">
              🐨 Become a KUB
            </a>
            <a href="https://www.gputnammusic.com"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/5 border border-[#C8A882]/30 text-[#C8A882] px-10 py-4 rounded-full font-black uppercase tracking-wider hover:bg-white/10 transition-colors">
              G Putnam Music ↗
            </a>
          </div>
        </div>
      </section>

      <KleighFooter />
    </main>
  );
}
