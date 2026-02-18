'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getBrandFromHostname, getBrandConfig } from '@/config/brandConfig';

// STI Categories for the KFS brand
const KFS_STI_CATEGORIES = [
  {
    id: 'singalongs',
    name: 'Singalongs',
    description: 'Interactive songs designed for group participation and classroom use',
    icon: '🎵',
    href: '/singalongs',
    count: 14,
    color: 'bg-[#FF6B35]',
  },
  {
    id: 'educators',
    name: 'Educators',
    description: 'Free classroom streaming access for verified educators',
    icon: '🍎',
    href: '/educators',
    count: null,
    color: 'bg-[#00BCD4]',
  },
  {
    id: 'heroes',
    name: 'Hero Pillars',
    description: 'Character-building content aligned with KFS Hero values',
    icon: '🦸',
    href: '/heroes',
    count: null,
    color: 'bg-[#4CAF50]',
  },
];

// GPM STI Categories (flagship full catalog)
const GPM_STI_CATEGORIES = [
  {
    id: 'who',
    name: 'GPM E1',
    description: 'Brand identity and story of G Putnam Music',
    icon: '🎸',
    href: '/who',
    count: null,
    color: 'bg-[#8B4513]',
  },
  {
    id: 'artists',
    name: 'R-Lists',
    description: 'Creative roster of GPM artists and vocalists',
    icon: '🎤',
    href: '/artists',
    count: null,
    color: 'bg-[#DAA520]',
  },
  {
    id: 'heroes',
    name: 'Heroes',
    description: "Strategy: Grandpa's Legacy and Hero Pillars",
    icon: '🦸',
    href: '/heroes',
    count: null,
    color: 'bg-[#4CAF50]',
  },
  {
    id: 'ships',
    name: 'KUBs',
    description: 'Business sponsorships and partnerships',
    icon: '🚢',
    href: '/ships',
    count: null,
    color: 'bg-[#1565C0]',
  },
  {
    id: 'gift',
    name: 'Gift',
    description: 'Gift tiers and seasonal streaming gifts',
    icon: '🎁',
    href: '/gift',
    count: null,
    color: 'bg-[#E91E63]',
  },
  {
    id: 'kupid',
    name: 'kUpId',
    description: 'Sweet Spot promotions and featured content',
    icon: '💘',
    href: '/kupid',
    count: null,
    color: 'bg-[#FF4081]',
  },
  {
    id: 'jazz',
    name: 'Jazz',
    description: 'Jazz domain streaming experience',
    icon: '🎷',
    href: '/jazz',
    count: null,
    color: 'bg-[#795548]',
  },
  {
    id: 'singalongs',
    name: 'Singalongs',
    description: 'Kids Fun Songs interactive singalong library',
    icon: '🎵',
    href: '/singalongs',
    count: 14,
    color: 'bg-[#FF6B35]',
  },
];

export default function STIMenuPage() {
  const [brand, setBrand] = useState<string>('GPM');

  useEffect(() => {
    const resolved = getBrandFromHostname(window.location.hostname);
    setBrand(resolved);
  }, []);

  const isKFS = brand === 'KFS';
  const brandConfig = getBrandConfig(brand as any);
  const categories = isKFS ? KFS_STI_CATEGORIES : GPM_STI_CATEGORIES;

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isKFS ? 'text-[#FF6B35]' : 'text-[#DAA520]'
            }`}>
              {isKFS ? 'Kids Fun Songs Menu' : 'GPM Standard Template Items'}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {isKFS
                ? 'Explore our pediatric and classroom-approved streaming content'
                : 'Navigate all streaming types and features in the GPM Mothership'
              }
            </p>
          </div>

          {/* STI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group block rounded-xl border border-gray-700 hover:border-gray-500 bg-black/30 p-6 transition-all hover:bg-black/50 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-3xl w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center`}>
                    {cat.icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-[#FF6B35] transition-colors">
                      {cat.name}
                    </h2>
                    {cat.count && (
                      <span className="text-xs text-gray-400">
                        {cat.count} tracks
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Brand Attribution */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500">
              All content curated and approved by G Putnam Music LLC.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
