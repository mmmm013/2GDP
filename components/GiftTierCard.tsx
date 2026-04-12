'use client';

import { type TierConfig, getGrandPrizeLabel } from '@/lib/gift-protocol';

interface GiftTierCardProps {
  tier: TierConfig;
  isSelected: boolean;
  onSelect: (tier: TierConfig) => void;
}

export default function GiftTierCard({ tier, isSelected, onSelect }: GiftTierCardProps) {
  return (
    <button
      onClick={() => onSelect(tier)}
      className={`
        relative w-full p-6 rounded-2xl border-2 transition-all duration-300
        text-left group hover:scale-[1.02]
        ${isSelected
          ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20'
          : 'border-white/10 bg-white/5 hover:border-white/30'
        }
      `}
    >
      {/* Tier Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{tier.emoji}</span>
        <span className={`
          px-3 py-1 rounded-full text-sm font-bold
          bg-gradient-to-r ${tier.color} text-white
        `}>
          {tier.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-1">
        {tier.displayName}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/60 mb-3">
        {tier.description}
      </p>

      {/* Grand Prize Badge */}
      {tier.grandPrizeEntries > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-amber-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {getGrandPrizeLabel(tier.grandPrizeEntries)}
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
