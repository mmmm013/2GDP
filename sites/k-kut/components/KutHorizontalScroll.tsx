'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { KutItem } from '@/lib/featuredKuts';

interface KutHorizontalScrollProps {
  items: KutItem[];
  /** 'high' = denser chip layout */
  density?: 'high' | 'normal';
  /** Auto-advances to next item on completion */
  autoStream?: boolean;
  /** Starts playback on mount (graceful fallback if browser blocks) */
  autoPlay?: boolean;
  /** Loops indefinitely */
  loop?: boolean;
}

/** Per-invention color tokens */
const INVENTION_COLORS: Record<KutItem['type'], { active: string; passive: string; pill: string; bar: string }> = {
  'K-KUT': {
    active: 'border-amber-400/80 bg-amber-400/10 text-amber-300',
    passive: 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white/80',
    pill: 'text-amber-400/80',
    bar: 'bg-amber-400',
  },
  'mK': {
    active: 'border-violet-400/80 bg-violet-400/10 text-violet-300',
    passive: 'border-violet-400/20 bg-violet-400/5 text-white/60 hover:border-violet-400/50 hover:text-violet-200',
    pill: 'text-violet-400/80',
    bar: 'bg-violet-400',
  },
  'KPD': {
    active: 'border-rose-400/80 bg-rose-400/10 text-rose-300',
    passive: 'border-rose-400/20 bg-rose-400/5 text-white/60 hover:border-rose-400/50 hover:text-rose-200',
    pill: 'text-rose-400/80',
    bar: 'bg-rose-400',
  },
};


/**
 * KutHorizontalScroll
 *
 * Viral audio stream — works for ALL THREE inventions:
 *   K-KUT (KK)  → amber   — exact audio excerpt from original PIX (4PE-BIZ-MSC)
 *   mini-KUT (mK) → violet — short exact audio hook; ASCAP-tied per PIX-PCK (LOOP 8)
 *   K-kUpId (KPD) → rose  — romance-level exact audio excerpt (Interest→Forever)
 *
 * Renders a horizontally-scrollable chip rail, auto-streams, and shows
 * a per-invention Heart-Tap waveform visualizer.
 */
export default function KutHorizontalScroll({
  items,
  density = 'normal',
  autoStream = false,
  autoPlay = false,
  loop = false,
}: KutHorizontalScrollProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [bars, setBars] = useState<number[]>([3, 5, 8, 4, 6, 3, 7, 4]);
  const animTimeoutRef = useRef<number | null>(null);

  const activeItem = items[activeIndex] ?? null;
  const colors = activeItem ? INVENTION_COLORS[activeItem.type] : INVENTION_COLORS['K-KUT'];

  // ── Waveform animation ─────────────────────────────────────────────────────
  const animateBars = useCallback(() => {
    if (!isPlaying) return;
    setBars((prev) => prev.map(() => Math.floor(Math.random() * 14) + 2));
    animTimeoutRef.current = window.setTimeout(animateBars, 150);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animTimeoutRef.current = window.setTimeout(animateBars, 150);
    } else {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      setBars([3, 5, 8, 4, 6, 3, 7, 4]);
    }
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [isPlaying, animateBars]);

  // ── Load track ─────────────────────────────────────────────────────────────
  const loadTrack = useCallback(
    (idx: number, andPlay: boolean) => {
      const item = items[idx];
      if (!item) return;
      const audio = audioRef.current;
      if (!audio) return;

      if (item.url) {
        audio.src = item.url;
        audio.load();
      }

      if (andPlay && item.url) {
        audio
          .play()
          .then(() => { setIsPlaying(true); setBlocked(false); })
          .catch(() => { setIsPlaying(false); setBlocked(true); });
      }
    },
    [items]
  );

  // ── Scroll chip into view ──────────────────────────────────────────────────
  const scrollToChip = useCallback((idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const chip = container.children[idx] as HTMLElement | undefined;
    if (chip) chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, []);

  // ── Auto-play on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (items.length === 0) return;
    loadTrack(0, autoPlay);
  }, [items.length, autoPlay, loadTrack]);

  // ── Auto-advance ───────────────────────────────────────────────────────────
  const advanceToNext = useCallback(() => {
    if (!autoStream) return;
    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next >= items.length) {
        if (loop) { scrollToChip(0); loadTrack(0, true); return 0; }
        return prev;
      }
      scrollToChip(next);
      loadTrack(next, true);
      return next;
    });
  }, [autoStream, items.length, loop, loadTrack, scrollToChip]);

  // ── Wire audio events ──────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => { setIsPlaying(false); advanceToNext(); };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [advanceToNext]);

  // ── Chip click ─────────────────────────────────────────────────────────────
  const handleChipClick = (idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (idx === activeIndex) {
      if (isPlaying) { audio.pause(); }
      else if (activeItem?.url) { audio.play().then(() => setIsPlaying(true)).catch(() => setBlocked(true)); }
      return;
    }
    setActiveIndex(idx);
    loadTrack(idx, true);
    scrollToChip(idx);
  };

  if (items.length === 0) return null;

  const chipGap = density === 'high' ? 'gap-2' : 'gap-3';

  return (
    <div className="w-full">
      {/* ── Scroll rail ─────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className={`flex ${chipGap} overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory`}
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        role="list"
        aria-label={`${activeItem?.type ?? 'Invention'} audio stream`}
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          const c = INVENTION_COLORS[item.type];

          return (
            <button
              key={item.id}
              role="listitem"
              onClick={() => handleChipClick(idx)}
              className={[
                'flex-shrink-0 snap-start rounded-sm px-3 py-1.5 text-left transition-all duration-200',
                density === 'high' ? 'text-[10px]' : 'text-xs',
                'border',
                isActive ? c.active : c.passive,
              ].join(' ')}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${item.type}: ${item.title} by ${item.artist}${item.romance_level ? ` — ${item.romance_level}` : ''}`}
            >
              <span className="block font-semibold tracking-wide truncate max-w-[120px]">
                {item.title}
              </span>
              <span className="block opacity-50 truncate max-w-[120px] mt-0.5">
                {/* KPD: show romance level; mK: show track ref; KK: show artist */}
                {item.type === 'KPD' && item.romance_level
                  ? item.romance_level
                  : item.artist}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Now-playing bar ─────────────────────────────────────────────── */}
      {activeItem && (
        <div className="mt-3 flex items-center gap-3">
          {/* Waveform — Heart-Tap aesthetic */}
          <div
            className="flex items-end gap-[2px] h-4 cursor-pointer"
            onClick={() => handleChipClick(activeIndex)}
            aria-label={isPlaying ? 'Pause' : blocked ? 'Tap to play' : 'Play'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleChipClick(activeIndex)}
          >
            {bars.map((h, i) => (
              <span
                key={i}
                className={`block w-[3px] rounded-full transition-all duration-150 ${
                  isPlaying ? colors.bar : 'bg-white/25'
                }`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-[10px] uppercase tracking-widest truncate ${colors.pill}`}>
              {activeItem.type === 'K-KUT' ? 'K\u2011KUT'
                : activeItem.type === 'mK' ? 'mK'
                : 'KPD'}
              {' \u00b7 '}
              {activeItem.title}
              {activeItem.romance_level ? ` \u00b7 ${activeItem.romance_level}` : ''}
            </p>
            <p className="text-[9px] text-white/40 truncate">{activeItem.artist}</p>
          </div>

          {blocked && (
            <span className="text-[9px] uppercase tracking-widest text-white/40 shrink-0">
              tap to play
            </span>
          )}
        </div>
      )}

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
