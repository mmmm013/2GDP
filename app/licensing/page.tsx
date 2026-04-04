import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import InventionBadge from '@/components/InventionBadge';

export const metadata: Metadata = {
  title: 'Sync Licensing — G Putnam Music | GPME',
  description:
    'License G Putnam Music tracks for film, TV, advertising, and digital media. GPMCC SFW-certified catalog. Music supervisors: contact us for placement inquiries.',
  openGraph: {
    title: 'Sync Licensing — G Putnam Music',
    description:
      'GPMCC SFW-certified music for film, TV, advertising & digital media. Contact G Putnam Music for sync licensing.',
    url: 'https://gputnammusic.com/licensing',
  },
};

const USE_CASES = [
  { icon: '🎬', label: 'Film & Documentary' },
  { icon: '📺', label: 'TV & Streaming' },
  { icon: '📣', label: 'Advertising & Brand' },
  { icon: '🎮', label: 'Games & Interactive' },
  { icon: '🎙️', label: 'Podcast & YouTube' },
  { icon: '🌐', label: 'Digital & Social' },
];

const TIERS = [
  {
    name: 'Standard Sync',
    badge: 'GPMCC SFW',
    price: 'Contact for quote',
    features: [
      'Broadcast & streaming rights',
      'GPMCC SFW certified — no explicit content',
      'ASCAP-registered compositions',
      'One-time placement fee',
    ],
    highlight: false,
  },
  {
    name: 'Premium Placement',
    badge: 'TV Thoroughbred',
    price: 'Contact for quote',
    features: [
      'Exclusive TV / film feature placement',
      'MSJ TV Thoroughbreds selection',
      'Full composition story & notes',
      'Stem files available on request',
      'Co-writer credit documentation',
    ],
    highlight: true,
  },
  {
    name: 'Blanket License',
    badge: 'Enterprise',
    price: 'Contact for quote',
    features: [
      'Full GPM catalog access',
      'Multi-project / multi-season use',
      'Custom cue sheet management',
      'Direct Founder contact',
    ],
    highlight: false,
  },
];

export default function LicensingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-10 px-4 text-center">
        <InventionBadge size="lg" className="mx-auto mb-5" />
        <span className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
          GPMCC SFW Certified
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-[#C8A882] mb-4 leading-tight">
          Sync Licensing
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8">
          G Putnam Music LLC offers broadcast-ready, ASCAP-registered tracks for film, TV,
          advertising, and digital media. Every track in the GPMCC catalog is SFW-certified
          and available for one-time or blanket sync licensing.
        </p>
        <a
          href="mailto:licensing@gputnammusic.com"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Contact Licensing →
        </a>
      </section>

      {/* ── Use Cases ────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-white/80 text-center mb-6">
          Where GPM Music Works
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {USE_CASES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-semibold text-white/80">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tiers ────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Licensing Tiers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-7 flex flex-col gap-4 ${
                tier.highlight
                  ? 'border-amber-500/60 bg-amber-500/10 shadow-xl shadow-amber-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 ${
                    tier.highlight
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {tier.badge}
                </span>
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-sm text-white/40 mt-1">{tier.price}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:licensing@gputnammusic.com"
                className={`block text-center px-5 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 ${
                  tier.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                    : 'bg-white/10 border border-white/20 text-white'
                }`}
              >
                Inquire
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── MSJ Catalog CTA ──────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 mb-4">
            Featured Artist
          </span>
          <h2 className="text-2xl font-bold text-white mb-3">
            MSJ TV Thoroughbreds
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Michael Scherer (MSJ) — Decatur IL · Hollywood CA · Nashville TN. Soulful, broadcast-ready
            placements with proven TV network credits. GPMCC SFW certified.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/scherer"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
            >
              Browse MSJ Catalog
            </Link>
            <a
              href="/api/msj-catalog"
              className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              Download CSV
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-xl font-bold text-white/80 mb-3">Music Supervisors</h2>
        <p className="text-white/50 text-sm mb-6">
          Cue sheets, stem files, and ISRC codes available on request. All compositions
          are ASCAP-registered. Contact us with your project details.
        </p>
        <a
          href="mailto:licensing@gputnammusic.com"
          className="inline-block px-8 py-3 rounded-xl border border-amber-500/40 text-amber-400 font-semibold text-sm hover:bg-amber-500/10 transition-colors"
        >
          licensing@gputnammusic.com
        </a>
      </section>

      <Footer />
    </main>
  );
}
