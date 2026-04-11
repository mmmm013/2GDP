'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { KutItem } from '@/lib/featuredKuts';

interface KutHorizontalScrollProps {
  items: KutItem[];
  /** 'high' = denser chip layout (target 40–80 mini-KUTs visible) */
  density?: 'high' | 'normal';
  /** Auto-advances to next item on completion */
  autoStream?: boolean;
  /** Starts playback on mount (graceful fallback if browser blocks) */
  autoPlay?: boolean;
  /** Loops indefinitely */
  loop?: boolean;
}

/**
 * KutHorizontalScroll
 *
 * Viral audio stream component for the Home Page.
 * – Renders a horizontally-scrollable list of KUT items.
 * – Auto-streams through items (autoStream=true).
 * – Low-profile "Heart-Tap" waveform visualizer.
 * – Respects browser autoplay policies with graceful fallback.
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
  // Waveform bar animation heights (8 bars)
  const [bars, setBars] = useState<number[]>([3, 5, 8, 4, 6, 3, 7, 4]);
  const animFrameRef = useRef<number | null>(null);

  const activeItem = items[activeIndex] ?? null;

  // ── Waveform animation ─────────────────────────────────────────────────────
  const animateBars = useCallback(() => {
    if (!isPlaying) return;
    setBars((prev) =>
      prev.map(() => Math.floor(Math.random() * 14) + 2)
    );
    animFrameRef.current = window.setTimeout(animateBars, 150);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = window.setTimeout(animateBars, 150);
    } else {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
      setBars([3, 5, 8, 4, 6, 3, 7, 4]);
    }
    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [isPlaying, animateBars]);

  // ── Load track into audio element ──────────────────────────────────────────
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
          .then(() => {
            setIsPlaying(true);
            setBlocked(false);
          })
          .catch(() => {
            // Browser autoplay policy blocked playback — show tap-to-play UI
            setIsPlaying(false);
            setBlocked(true);
          });
      }
    },
    [items, setIsPlaying, setBlocked]
  );

  // ── Scroll active chip into view ───────────────────────────────────────────
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

  // ── Auto-advance to next item ──────────────────────────────────────────────
  const advanceToNext = useCallback(() => {
    if (!autoStream) return;
    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next >= items.length) {
        if (loop) {
          scrollToChip(0);
          loadTrack(0, true);
          return 0;
        }
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

    const onEnded = () => {
      setIsPlaying(false);
      advanceToNext();
    };
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

  // ── User taps a chip ───────────────────────────────────────────────────────
  const handleChipClick = (idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (idx === activeIndex) {
      // Toggle play / pause on current item
      if (isPlaying) {
        audio.pause();
      } else {
        if (activeItem?.url) {
          audio.play().then(() => setIsPlaying(true)).catch(() => setBlocked(true));
        }
      }
      return;
    }

    // Switch to a new item
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
        aria-label="Featured KUT stream"
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          const isLoveRenews =
            item.title?.toLowerCase().includes('love renews') ||
            item.tags?.toLowerCase().includes('love_renews') ||
            item.tags?.toLowerCase().includes('love renews');

          return (
            <button
              key={item.id}
              role="listitem"
              onClick={() => handleChipClick(idx)}
              className={[
                'flex-shrink-0 snap-start rounded-sm px-3 py-1.5 text-left transition-all duration-200',
                density === 'high' ? 'text-[10px]' : 'text-xs',
                'border',
                isActive
                  ? 'border-amber-400/80 bg-amber-400/10 text-amber-300'
                  : isLoveRenews
                  ? 'border-pink-500/40 bg-pink-500/5 text-pink-300 hover:border-pink-400/70'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white/80',
              ].join(' ')}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${item.type ?? 'KUT'}: ${item.title} by ${item.artist}`}
            >
              <span className="block font-semibold tracking-wide truncate max-w-[120px]">
                {item.title}
              </span>
              <span className="block opacity-50 truncate max-w-[120px] mt-0.5">
                {item.artist}
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
                  isPlaying ? 'bg-amber-400' : 'bg-white/25'
                }`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-amber-400/80 truncate">
              {activeItem.type === 'mini-KUT' ? 'mK' : 'K-KUT'}{' · '}
              {activeItem.title}
            </p>
            <p className="text-[9px] text-white/40 truncate">{activeItem.artist}</p>
          </div>

          {/* Blocked / tap-to-play notice */}
          {blocked && (
            <span className="text-[9px] uppercase tracking-widest text-white/40 shrink-0">
              tap to play
            </span>
          )}
        </div>
      )}

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
