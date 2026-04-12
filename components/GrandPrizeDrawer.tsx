'use client';

import { useState, useEffect } from 'react';
import { GIFT_TIERS, getGrandPrizeLabel } from '@/lib/gift-protocol';

interface GrandPrizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GrandPrizeDrawer({ isOpen, onClose }: GrandPrizeDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const eligibleTiers = GIFT_TIERS.filter((t) => t.grandPrizeEntries > 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-white/10 rounded-t-3xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="px-6 pb-8 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-1">
              Grand Prize Drawing
            </h2>
            <p className="text-sm text-white/50">
              Higher tiers = more entries = better odds
            </p>
          </div>

          {/* Prize Info */}
          <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 border border-amber-400/20 rounded-2xl p-5 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Current Grand Prize
            </h3>
            <p className="text-white/70 text-sm">
              One lucky winner receives a signed G. Putnam vinyl, exclusive studio session pass,
              custom merch bundle, and a personal shoutout during the next live stream.
            </p>
            <p className="text-xs text-amber-300/60 mt-3">
              Drawing held monthly. Winners notified via SMS and email.
            </p>
          </div>

          {/* Entries per Tier */}
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
            Entries by Tier
          </h3>
          <div className="space-y-3">
            {eligibleTiers.map((tier) => (
              <div
                key={tier.tier}
                className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tier.emoji}</span>
                  <div>
                    <p className="text-white font-medium">{tier.displayName}</p>
                    <p className="text-xs text-white/40">{tier.label}</p>
                  </div>
                </div>
                <span className="text-amber-300 font-bold text-sm">
                  {getGrandPrizeLabel(tier.grandPrizeEntries)}
                </span>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
