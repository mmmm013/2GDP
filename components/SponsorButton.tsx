'use client';

import React from 'react';

export default function SponsorButton() {
  // LINK FIXED: Kleigh SponsorCubs Payment Link
  const STRIPE_LINK = "https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03";

  return (
    <div className="flex flex-col items-center justify-center py-8 bg-neutral-900/50 rounded-xl backdrop-blur-sm mx-4 my-8">
      <h3 className="text-xl font-bold text-white mb-2">
        Become a <span className="text-yellow-400">KUB 🐨</span>
      </h3>
      <p className="text-neutral-400 mb-6 text-center max-w-md px-4">
        KUBs are KLEIGH's koala crew — unlock exclusive high-energy tracks, support the vocalist directly, and get your "KUB" badge.
      </p>

      <a 
        href={STRIPE_LINK} 
        target="_blank" 
        rel="noopener noreferrer"
        className="
          px-8 py-3 rounded-full 
          bg-gradient-to-r from-yellow-500 to-orange-500 
          text-black font-bold text-lg 
          hover:scale-105 transition-transform shadow-lg shadow-orange-500/20
        "
      >
        Join the Pride ($5/mo)
      </a>
    </div>
  );
}