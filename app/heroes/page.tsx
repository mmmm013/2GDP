import React from 'react';
import Link from 'next/link';

// BRANDING CONSTANTS
const COLORS = {
  AMBER: '#FFBF00', // GPM Strategic
  TAN: '#D2B48C',   // KLEIGH Artisan
  WHEAT: '#F5DEB3'  // L Cole Farms / KFS
};

const HERO_PILLARS = [
  {
    id: 'military-marvels',
    title: 'MILITARY MARVELS ⚡',
    subtitle: 'Active Duty, Veterans, Reserves, and National Guard',
    borderColor: COLORS.AMBER,
    text: 'Dedicated to the US military for steadfastly protecting ALL Americans and our borders!'
  },
  {
    id: 'medical-angels',
    title: 'ER / ICU / ONCOLOGY ANGELS 👼',
    subtitle: 'Frontline Medical and Trauma Recovery Titans',
    borderColor: COLORS.TAN,
    text: 'For those serving in the high-intensity theater of care and recovery.'
  },
  {
    id: 'sovereign-mentors',
    title: 'SOVEREIGN MENTORS 🍎',
    subtitle: 'Teachers & Educators (KFS Silo C)',
    borderColor: COLORS.WHEAT,
    text: 'Guiding the next generation through the KFS Awesome Squad rhythm.'
  }
];

export default function HeroesPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* ONE-STOP BRANDING HEADER */}
        <p className="mb-2 text-sm tracking-[0.25em] text-amber-400 uppercase">
          One-Stop Original Sync & Streaming OS
        </p>
        <h1 className="text-4xl font-extrabold mb-2 tracking-tighter">
          HERO RECOGNITION
        </h1>
        <p className="mb-12 text-lg opacity-80 uppercase">
          Accessing the Sovereign MIP1 Priority Stream.
        </p>

        {/* MIP1 HERO PILLARS */}
        <div className="grid gap-8">
          {HERO_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="border-l-8 p-8 bg-zinc-900 shadow-2xl transition-all hover:scale-[1.01]"
              style={{ borderLeftColor: pillar.borderColor }}
            >
              <h2 className="text-2xl font-bold mb-1">{pillar.title}</h2>
              <h3 className="text-sm font-semibold opacity-60 mb-4 uppercase tracking-widest">
                {pillar.subtitle}
              </h3>
              <p className="text-lg leading-relaxed">{pillar.text}</p>

              {/* MIP1 RECOGNITION FORM CTA */}
              <Link href="/mip">
                <button className="mt-6 px-6 py-2 border font-bold hover:bg-white hover:text-black transition-colors uppercase">
                  MIP1 RECOGNITION FORM
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* HELP US BUTTON: route OR mailto */}
        <div className="fixed bottom-10 right-10">
          <Link href="/contact">
            <button className="bg-amber-500 text-black px-8 py-4 rounded-full font-black text-xl shadow-2xl hover:scale-110 transition-transform">
              HELP US
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
