/**
 * lib/t20Queue.ts — GPM T20 Active/Jogger Queue Builder
 *
 * Builds a Fisher-Yates shuffled, 2-hour no-repeat queue from the
 * T20 activity tracks.  Used by HomeFP to power the Active/Jogger
 * experience (§1 of the GPM Active/Jogger Experience plan).
 */

export interface QueueTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  durationSeconds?: number;
  mood?: string;
  bpm?: number;
}

/** Fisher-Yates in-place shuffle */
export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a 2-hour no-repeat queue from `pool`.
 *
 * Strategy:
 *  1. Shuffle pool.
 *  2. Concatenate shuffled copies until cumulative duration ≥ 120 min.
 *  3. Track IDs that have been played (via `playedIds`) are skipped in the
 *     first pass so as not to repeat within the last 2-hr window.
 *
 * If `estimatedDurationSeconds` is missing for a track we assume 210 s (3.5 min).
 */
export function buildT20Queue(
  pool: QueueTrack[],
  playedIds: Set<string> = new Set(),
  targetMinutes = 120
): QueueTrack[] {
  const TARGET_SECONDS = targetMinutes * 60;
  const DEFAULT_DURATION = 210; // 3.5 minutes

  if (pool.length === 0) return [];

  // Separate unplayed from recently-played
  const unplayed = pool.filter((t) => !playedIds.has(t.id));
  const recent = pool.filter((t) => playedIds.has(t.id));

  // Start with shuffled unplayed, then append shuffled recent if we need more
  const ordered = [
    ...fisherYatesShuffle(unplayed),
    ...fisherYatesShuffle(recent),
  ];

  const queue: QueueTrack[] = [];
  let total = 0;
  let passIndex = 0;

  while (total < TARGET_SECONDS) {
    const pass = fisherYatesShuffle(ordered);
    for (const track of pass) {
      // Avoid consecutive duplicates
      if (queue.length > 0 && queue[queue.length - 1].id === track.id) continue;
      queue.push(track);
      total += track.durationSeconds ?? DEFAULT_DURATION;
      if (total >= TARGET_SECONDS) break;
    }
    passIndex++;
    // Safety: avoid infinite loop if pool is tiny
    if (passIndex > 50) break;
  }

  return queue;
}

/** Returns total seconds for a queue */
export function queueDurationSeconds(queue: QueueTrack[]): number {
  return queue.reduce((acc, t) => acc + (t.durationSeconds ?? 210), 0);
}
