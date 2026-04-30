import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const SAMPLE_AUDIO_BASE = 'https://gputnammusic.com/pix';
const SAMPLE_AUDIO = {
  loveRenews: `${SAMPLE_AUDIO_BASE}/kleigh--solace.mp3`,
  loveRenewsReprise: `${SAMPLE_AUDIO_BASE}/kleigh--nightfall.mp3`,
  loveRenewsHook: `${SAMPLE_AUDIO_BASE}/kleigh--waterfall.mp3`,
  midnightJazz: `${SAMPLE_AUDIO_BASE}/new-orleans-piano-trio-1.mp3`,
  woundedWilling: `${SAMPLE_AUDIO_BASE}/i-am-a-fighter--el-mix-instro.mp3`,
  highEnergy: `${SAMPLE_AUDIO_BASE}/dance-party.mp3`,
  deepFocus: `${SAMPLE_AUDIO_BASE}/perfect-day.mp3`,
  sunriseVibes: `${SAMPLE_AUDIO_BASE}/going-outside.mp3`,
  lateNightSoul: `${SAMPLE_AUDIO_BASE}/nighttime.mp3`,
  heartTap: `${SAMPLE_AUDIO_BASE}/wanna-know-you.mp3`,
  melancholyBlues: `${SAMPLE_AUDIO_BASE}/why-does-life-gotta-be-this-hard.mp3`,
  dreamyState: `${SAMPLE_AUDIO_BASE}/kleigh--reflections.mp3`,
  cloudNine: `${SAMPLE_AUDIO_BASE}/kleigh--a-calm-evening.mp3`,
} as const;

/**
 * The three co-equal K-KUT inventions — ALL deliver exact audio snippets:
 *
 *  K-KUT (KK)  — exact audio excerpt from a whole song section (original PIX via 4PE-BIZ-MSC)
 *  mini-KUT (mK) — short exact audio hook/phrase; tied to its ASCAP track + Track ID,
 *                  aggregates within the SAME PIX-PCK per title (LOOP 8 aggregation rule)
 *  K-kUpId (KPD) — exact audio excerpt curated for 5 romance levels:
 *                  Interest → Date → Love → Sex → Forever
 */
export interface KutItem {
  id: number | string;
  title: string;
  artist: string;
  /** Direct audio URL — ALL three invention types carry exact audio snippets */
  url: string;
  duration?: number | string;
  tags?: string;
  /** Invention type — K-KUT, mK (mini-KUT), or KPD (K-kUpId) */
  type: 'K-KUT' | 'mK' | 'KPD';
  /** K-kUpId (KPD) only: the romance level for this excerpt */
  romance_level?: 'Interest' | 'Date' | 'Love' | 'Sex' | 'Forever';
}

// ─────────────────────────────────────────────────────────────────────────────
// K-KUT fetcher
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the Top 13 K-KUT audio excerpts from the GPM-Warehouse / Supabase pipeline.
 * K-KUTs are exact audio excerpts of original PIX via 4PE-BIZ-MSC.
 * "Love Renews" PIX excerpts lead (ADMIN DIRECTIVE).
 */
export async function getFeaturedKuts(): Promise<KutItem[]> {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) return FALLBACK_KUTS;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: loveRenews } = await supabase
      .from('tracks')
      .select('id, title, artist, url, duration, tags')
      .or('title.ilike.%Love Renews%,tags.ilike.%love_renews%,tags.ilike.%love renews%')
      .not('url', 'is', null)
      .limit(5);

    const loveRenewsIds = (loveRenews ?? []).map((t) => t.id);
    const safeIds = loveRenewsIds
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id) && id > 0);

    let restQuery = supabase
      .from('tracks')
      .select('id, title, artist, url, duration, tags')
      .not('url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (safeIds.length > 0) {
      restQuery = restQuery.not('id', 'in', `(${safeIds.join(',')})`);
    }

    const { data: rest } = await restQuery;

    const combined: KutItem[] = [
      ...(loveRenews ?? []).map((t) => ({ ...t, type: 'K-KUT' as const })),
      ...(rest ?? []).map((t) => ({ ...t, type: 'K-KUT' as const })),
    ].slice(0, 13);

    return combined.length > 0 ? combined : FALLBACK_KUTS;
  } catch {
    return FALLBACK_KUTS;
  }
}

/** Static fallback — K-KUT audio excerpts from original PIX. "Love Renews" leads. */
export const FALLBACK_KUTS: KutItem[] = [
  { id: 'lr-01', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenews, type: 'K-KUT', tags: 'love_renews' },
  { id: 'lr-02', title: 'Love Renews (Reprise)', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenewsReprise, type: 'K-KUT', tags: 'love_renews' },
  { id: 'lr-03', title: 'Love Renews (Hook)', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenewsHook, type: 'K-KUT', tags: 'love_renews' },
  { id: 'kk-01', title: 'Midnight Jazz', artist: 'G Putnam Music', url: SAMPLE_AUDIO.midnightJazz, type: 'K-KUT', tags: 'jazz' },
  { id: 'kk-02', title: 'Wounded & Willing', artist: 'G Putnam Music', url: SAMPLE_AUDIO.woundedWilling, type: 'K-KUT', tags: 'healing' },
  { id: 'kk-03', title: 'High Energy', artist: 'G Putnam Music', url: SAMPLE_AUDIO.highEnergy, type: 'K-KUT', tags: 'energy' },
  { id: 'kk-04', title: 'Deep Focus', artist: 'G Putnam Music', url: SAMPLE_AUDIO.deepFocus, type: 'K-KUT', tags: 'focus' },
  { id: 'kk-05', title: 'Sunrise Vibes', artist: 'G Putnam Music', url: SAMPLE_AUDIO.sunriseVibes, type: 'K-KUT', tags: 'uplifting' },
  { id: 'kk-06', title: 'Late Night Soul', artist: 'G Putnam Music', url: SAMPLE_AUDIO.lateNightSoul, type: 'K-KUT', tags: 'night' },
  { id: 'kk-07', title: 'Heart Tap', artist: 'KLEIGH', url: SAMPLE_AUDIO.heartTap, type: 'K-KUT', tags: 'emotional' },
  { id: 'kk-08', title: 'Melancholy Blues', artist: 'G Putnam Music', url: SAMPLE_AUDIO.melancholyBlues, type: 'K-KUT', tags: 'melancholy' },
  { id: 'kk-09', title: 'Dreamy State', artist: 'G Putnam Music', url: SAMPLE_AUDIO.dreamyState, type: 'K-KUT', tags: 'dreamy' },
  { id: 'kk-10', title: 'Cloud Nine', artist: 'KLEIGH', url: SAMPLE_AUDIO.cloudNine, type: 'K-KUT', tags: 'uplifting' },
];

// ─────────────────────────────────────────────────────────────────────────────
// mini-KUT (mK) fetcher
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches mini-KUT (mK) audio snippets from the Supabase pipeline.
 *
 * Each mK is a short exact audio hook/phrase from a registered ASCAP track.
 * mKs NEVER aggregate by title or artist — they remain tied to their
 * ASCAP Track ID and aggregate within the SAME PIX-PCK per title (LOOP 8).
 * Multiple mKs per title give users dozens of emotional word/phrase options
 * from ONE track while preserving full royalty traceability.
 */
export async function getFeaturedMKuts(): Promise<KutItem[]> {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) return FALLBACK_MKUTS;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data } = await supabase
      .from('tracks')
      .select('id, title, artist, url, duration, tags')
      .or('type.eq.mK,tags.ilike.%mkut%,tags.ilike.%mini_kut%,tags.ilike.%mini-kut%')
      .not('url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(13);

    const items: KutItem[] = (data ?? []).map((t) => ({ ...t, type: 'mK' as const }));
    return items.length > 0 ? items : FALLBACK_MKUTS;
  } catch {
    return FALLBACK_MKUTS;
  }
}

/** Static fallback — mini-KUT audio snippets, ASCAP-tied per PIX-PCK title. */
export const FALLBACK_MKUTS: KutItem[] = [
  { id: 'mk-01', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenews, type: 'mK', tags: 'love_renews mkut' },
  { id: 'mk-02', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenewsReprise, type: 'mK', tags: 'love_renews mkut' },
  { id: 'mk-03', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenewsHook, type: 'mK', tags: 'love_renews mkut' },
  { id: 'mk-04', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenews, type: 'mK', tags: 'love_renews mkut' },
  { id: 'mk-05', title: 'Wounded & Willing', artist: 'G Putnam Music', url: SAMPLE_AUDIO.woundedWilling, type: 'mK', tags: 'healing mkut' },
  { id: 'mk-06', title: 'Wounded & Willing', artist: 'G Putnam Music', url: SAMPLE_AUDIO.woundedWilling, type: 'mK', tags: 'healing mkut' },
  { id: 'mk-07', title: 'Wounded & Willing', artist: 'G Putnam Music', url: SAMPLE_AUDIO.woundedWilling, type: 'mK', tags: 'healing mkut' },
  { id: 'mk-08', title: 'Midnight Jazz', artist: 'G Putnam Music', url: SAMPLE_AUDIO.midnightJazz, type: 'mK', tags: 'jazz mkut' },
  { id: 'mk-09', title: 'Midnight Jazz', artist: 'G Putnam Music', url: SAMPLE_AUDIO.midnightJazz, type: 'mK', tags: 'jazz mkut' },
  { id: 'mk-10', title: 'Heart Tap', artist: 'KLEIGH', url: SAMPLE_AUDIO.heartTap, type: 'mK', tags: 'emotional mkut' },
  { id: 'mk-11', title: 'Heart Tap', artist: 'KLEIGH', url: SAMPLE_AUDIO.heartTap, type: 'mK', tags: 'emotional mkut' },
  { id: 'mk-12', title: 'High Energy', artist: 'G Putnam Music', url: SAMPLE_AUDIO.highEnergy, type: 'mK', tags: 'energy mkut' },
  { id: 'mk-13', title: 'Cloud Nine', artist: 'KLEIGH', url: SAMPLE_AUDIO.cloudNine, type: 'mK', tags: 'uplifting mkut' },
];

// ─────────────────────────────────────────────────────────────────────────────
// K-kUpId (KPD) fetcher
// ─────────────────────────────────────────────────────────────────────────────

const ROMANCE_LEVELS = ['Interest', 'Date', 'Love', 'Sex', 'Forever'] as const;

function tagToRomanceLevel(tags?: string): KutItem['romance_level'] {
  if (!tags) return undefined;
  const t = tags.toLowerCase();
  if (t.includes('forever')) return 'Forever';
  if (t.includes('sex')) return 'Sex';
  if (t.includes('love')) return 'Love';
  if (t.includes('date')) return 'Date';
  if (t.includes('interest')) return 'Interest';
  return undefined;
}

/**
 * Fetches K-kUpId (KPD) audio excerpts from the Supabase pipeline.
 *
 * KPD is a standalone invention: same exact-excerpt audio strategy as K-KUT,
 * curated for 5 romance levels: Interest → Date → Love → Sex → Forever.
 * Cryptographically signed, shareable/giftable — every share is traceable.
 */
export async function getFeaturedKPDs(): Promise<KutItem[]> {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) return FALLBACK_KPDS;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data } = await supabase
      .from('tracks')
      .select('id, title, artist, url, duration, tags')
      .or('type.eq.KPD,tags.ilike.%kupid%,tags.ilike.%k_kupid%,tags.ilike.%kpd%')
      .not('url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(13);

    const items: KutItem[] = (data ?? []).map((t) => ({
      ...t,
      type: 'KPD' as const,
      romance_level: tagToRomanceLevel(t.tags),
    }));
    return items.length > 0 ? items : FALLBACK_KPDS;
  } catch {
    return FALLBACK_KPDS;
  }
}

/** Static fallback — K-kUpId audio excerpts, one per romance level (+ multiples for Love). */
export const FALLBACK_KPDS: KutItem[] = [
  { id: 'kpd-01', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenews, type: 'KPD', tags: 'interest kupid', romance_level: 'Interest' },
  { id: 'kpd-02', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenewsReprise, type: 'KPD', tags: 'date kupid', romance_level: 'Date' },
  { id: 'kpd-03', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenewsHook, type: 'KPD', tags: 'love kupid', romance_level: 'Love' },
  { id: 'kpd-04', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenews, type: 'KPD', tags: 'love kupid', romance_level: 'Love' },
  { id: 'kpd-05', title: 'Love Renews', artist: 'KLEIGH', url: SAMPLE_AUDIO.loveRenewsReprise, type: 'KPD', tags: 'love kupid', romance_level: 'Love' },
  { id: 'kpd-06', title: 'Heart Tap', artist: 'KLEIGH', url: SAMPLE_AUDIO.heartTap, type: 'KPD', tags: 'sex kupid', romance_level: 'Sex' },
  { id: 'kpd-07', title: 'Heart Tap', artist: 'KLEIGH', url: SAMPLE_AUDIO.heartTap, type: 'KPD', tags: 'sex kupid', romance_level: 'Sex' },
  { id: 'kpd-08', title: 'Cloud Nine', artist: 'KLEIGH', url: SAMPLE_AUDIO.cloudNine, type: 'KPD', tags: 'forever kupid', romance_level: 'Forever' },
  { id: 'kpd-09', title: 'Cloud Nine', artist: 'KLEIGH', url: SAMPLE_AUDIO.cloudNine, type: 'KPD', tags: 'forever kupid', romance_level: 'Forever' },
  { id: 'kpd-10', title: 'Wounded & Willing', artist: 'G Putnam Music', url: SAMPLE_AUDIO.woundedWilling, type: 'KPD', tags: 'interest kupid', romance_level: 'Interest' },
  { id: 'kpd-11', title: 'Wounded & Willing', artist: 'G Putnam Music', url: SAMPLE_AUDIO.woundedWilling, type: 'KPD', tags: 'date kupid', romance_level: 'Date' },
  { id: 'kpd-12', title: 'Midnight Jazz', artist: 'G Putnam Music', url: SAMPLE_AUDIO.midnightJazz, type: 'KPD', tags: 'love kupid', romance_level: 'Love' },
  { id: 'kpd-13', title: 'Deep Focus', artist: 'G Putnam Music', url: SAMPLE_AUDIO.deepFocus, type: 'KPD', tags: 'forever kupid', romance_level: 'Forever' },
];

/** All romance levels in order — used for KPD level filter UI */
export { ROMANCE_LEVELS };



