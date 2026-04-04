/**
 * config/lyrics.ts — GPM Timestamped Lyrics Store
 *
 * Structure: ASCAP title (single source of truth) → array of timed lines.
 * Each line has `time` (seconds from track start) and `text`.
 *
 * ──────────────────────────────────────────────────────────────────
 * STATUS: PLACEHOLDER
 * Real lyrics are populated per-track by GPM ops team.
 * Until a track's lyrics are present the overlay shows nothing.
 * ──────────────────────────────────────────────────────────────────
 */

export interface LyricLine {
  time: number;   // seconds from track start when this line should be highlighted
  text: string;
}

/** Map ASCAP title → timed lyrics */
export const LYRICS_LIBRARY: Record<string, LyricLine[]> = {
  // ─── Example entry — replace / extend with real content ──────────
  // 'Example Track Title': [
  //   { time: 0,   text: '...' },
  //   { time: 4,   text: '...' },
  // ],
};

/**
 * Look up lyrics for a track by ASCAP title.
 * Returns empty array if not yet populated.
 */
export function getLyrics(ascapTitle: string): LyricLine[] {
  return LYRICS_LIBRARY[ascapTitle] ?? [];
}

/**
 * Given lyrics array + current playback time, return the index of the
 * currently active line (last line whose `time` ≤ currentTime).
 */
export function getActiveLyricIndex(lines: LyricLine[], currentTime: number): number {
  let active = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= currentTime) active = i;
    else break;
  }
  return active;
}
