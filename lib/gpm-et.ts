/**
 * GPM ET — G Putnam Music Event Tracker
 * Lightweight wrapper around @vercel/analytics track()
 * Tracks streaming analytics: plays, pauses, skips, duration, errors
 * 
 * USAGE:
 *   import { gpmET } from '@/lib/gpm-et';
 *   gpmET.play({ title: 'Song', vocalist: 'Artist', source: 'GlobalPlayer' });
 */

import { track } from '@vercel/analytics';

// ── Types ──────────────────────────────────────────
export interface TrackMeta {
  title: string;
  vocalist: string;
  source: 'GlobalPlayer' | 'FeaturedPlayer' | 'MoodGrid' | 'T20';
  mood?: string;
  url?: string;
}

export interface DurationMeta extends TrackMeta {
  seconds: number;
}

// ── Helpers ────────────────────────────────────────
const safe = (s: string | undefined): string => (s || 'unknown').slice(0, 80);

// ── Event Emitters ─────────────────────────────────
export const gpmET = {

  /** Fires when a track starts playing */
  play(meta: TrackMeta) {
    track('Stream Play', {
      title: safe(meta.title),
      vocalist: safe(meta.vocalist),
      source: meta.source,
      mood: safe(meta.mood),
    });
  },

  /** Fires when user pauses a track */
  pause(meta: TrackMeta) {
    track('Stream Pause', {
      title: safe(meta.title),
      vocalist: safe(meta.vocalist),
      source: meta.source,
    });
  },

  /** Fires when user skips (next/prev) */
  skip(meta: TrackMeta & { direction: 'next' | 'prev' }) {
    track('Stream Skip', {
      title: safe(meta.title),
      vocalist: safe(meta.vocalist),
      source: meta.source,
      direction: meta.direction,
    });
  },

  /** Fires when a track ends naturally or user navigates away */
  duration(meta: DurationMeta) {
    track('Stream Duration', {
      title: safe(meta.title),
      vocalist: safe(meta.vocalist),
      source: meta.source,
      seconds: Math.round(meta.seconds),
    });
  },

  /** Fires on playback error */
  error(meta: TrackMeta & { errorMsg: string }) {
    track('Stream Error', {
      title: safe(meta.title),
      vocalist: safe(meta.vocalist),
      source: meta.source,
      error: safe(meta.errorMsg),
    });
  },

  /** Fires when FP auto-plays on Heroes page */
  autoPlay(meta: TrackMeta) {
    track('FP Auto Play', {
      title: safe(meta.title),
      vocalist: safe(meta.vocalist),
      source: meta.source,
    });
  },

  /** Fires when repeat is toggled */
  repeat(meta: TrackMeta & { enabled: boolean }) {
    track('Stream Repeat', {
      title: safe(meta.title),
      source: meta.source,
      enabled: meta.enabled ? 'on' : 'off',
    });
  },

  /** Generic page-level event */
  page(name: string, data?: Record<string, string | number>) {
    track(name, data || {});
  },
};

export default gpmET;
