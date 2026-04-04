'use client';

/**
 * InventionBadge — USPTO "Music Invention™ Patent Pending" stamp
 *
 * Displayed on any product tied to the two GPM patent-pending inventions:
 *  1. K-KUT Sweet Spot Link System
 *  2. K-kUpId Frequency Gifting System
 *
 * Usage:
 *   <InventionBadge />              — default compact badge
 *   <InventionBadge size="lg" />   — larger version for hero sections
 *   <InventionBadge href="/inventions" /> — link to disclosure page
 */

import Link from 'next/link';

type BadgeSize = 'sm' | 'md' | 'lg';

interface InventionBadgeProps {
  size?: BadgeSize;
  /** Optional link to the /inventions disclosure page */
  href?: string;
  className?: string;
}

const SIZE_CLASSES: Record<BadgeSize, { wrapper: string; text: string; icon: string }> = {
  sm: { wrapper: 'px-2 py-0.5 gap-1', text: 'text-[9px] tracking-[0.15em]', icon: 'text-xs' },
  md: { wrapper: 'px-3 py-1 gap-1.5', text: 'text-[10px] tracking-[0.2em]', icon: 'text-sm' },
  lg: { wrapper: 'px-4 py-1.5 gap-2', text: 'text-xs tracking-[0.25em]', icon: 'text-base' },
};

export default function InventionBadge({ size = 'md', href, className = '' }: InventionBadgeProps) {
  const s = SIZE_CLASSES[size];

  const inner = (
    <span
      className={`inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 font-black uppercase text-amber-300 ${s.wrapper} ${s.text} ${className}`}
      title="U.S. Music Invention™ — Patent Pending (USPTO)"
    >
      <span className={s.icon} role="img" aria-label="patent">⚗️</span>
      <span>U.S. Music Invention™ · Patent Pending</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    );
  }

  return inner;
}
