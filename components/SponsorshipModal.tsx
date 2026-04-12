'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { GIFT_TIERS, type TierConfig, type GiftTier, initiateCheckout } from '@/lib/gift-protocol';
import GiftTierCard from '@/components/GiftTierCard';
import GrandPrizeDrawer from '@/components/GrandPrizeDrawer';

export default function SponsorshipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedTier, setSelectedTier] = useState<TierConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrizeDrawer, setShowPrizeDrawer] = useState(false);

  if (!isOpen) return null;

  const handleQuickGift = async (tier: TierConfig) => {
    setIsLoading(true);
    try {
      const { url } = await initiateCheckout({ tier: tier.tier as GiftTier });
      if (url) window.location.href = url;
    } catch {
      console.error('Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-[#3E2723]/90 backdrop-blur-md transition-opacity" />

      {/* MODAL CONTENT */}
      <div className="relative bg-[#4E342E] border border-[#FFD54F]/30 rounded-3xl max-w-lg w-full p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A07CCB] hover:text-white bg-black/20 p-2 rounded-full">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-[#FFD54F] mb-2 uppercase tracking-wide">
            Heart-Tap
          </h2>
          <p className="text-[#A07CCB] text-xs font-bold uppercase tracking-widest opacity-70">
            Tap to support. Get a Digital Mixed Bag.
          </p>
        </div>

        {/* FOUR TIERS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {GIFT_TIERS.map((tier) => (
            <GiftTierCard
              key={tier.tier}
              tier={tier}
              isSelected={selectedTier?.tier === tier.tier}
              onSelect={setSelectedTier}
            />
          ))}
        </div>

        {/* SEND BUTTON */}
        {selectedTier && (
          <button
            onClick={() => handleQuickGift(selectedTier)}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-lg hover:from-amber-300 hover:to-orange-400 transition-all disabled:opacity-50 mb-3"
          >
            {isLoading ? 'Processing...' : `Send ${selectedTier.label} Gift`}
          </button>
        )}

        {/* GRAND PRIZE LINK */}
        <button
          onClick={() => setShowPrizeDrawer(true)}
          className="w-full text-center text-xs text-amber-300/60 hover:text-amber-300 transition-colors"
        >
          View Grand Prize Drawing Details
        </button>

        <div className="mt-4 text-center border-t border-[#FFD54F]/10 pt-4">
          <p className="text-[#A07CCB] text-sm leading-relaxed font-medium mb-2">
            100% of proceeds support Vocalist Development.
          </p>
          <p className="text-[10px] text-[#A07CCB] opacity-50 uppercase font-bold tracking-widest">
            Secure Payments via Stripe
          </p>
        </div>
      </div>

      {/* GRAND PRIZE DRAWER */}
      <GrandPrizeDrawer
        isOpen={showPrizeDrawer}
        onClose={() => setShowPrizeDrawer(false)}
      />
    </div>
  );
}
