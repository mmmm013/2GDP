import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface KutItem {
  id: number | string;
  title: string;
  artist: string;
  url: string;
  duration?: number | string;
  tags?: string;
  type?: 'K-KUT' | 'mini-KUT';
}

/**
 * Fetches the Top 13 featured KUT items from the GPM-Warehouse / Supabase pipeline.
 *
 * Content priority (ADMIN DIRECTIVE):
 *  1. "Love Renews" tracks lead (mini-KUTs first)
 *  2. Remaining tracks fill as K-KUT structural anchors / mini-KUTs
 *
 * Falls back to static seed data if the DB is unavailable or empty.
 */
export async function getFeaturedKuts(): Promise<KutItem[]> {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return FALLBACK_KUTS;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Primary: fetch any track tagged "love renews" or titled "Love Renews" first
    const { data: loveRenews } = await supabase
      .from('tracks')
      .select('id, title, artist, url, duration, tags')
      .or('title.ilike.%Love Renews%,tags.ilike.%love_renews%,tags.ilike.%love renews%')
      .limit(5);

    // Secondary: fetch remaining featured / top tracks
    const loveRenewsIds = (loveRenews ?? []).map((t) => t.id);

    // Sanitize IDs (numeric only) before embedding in filter string
    const safeIds = loveRenewsIds.filter((id) => /^\d+$/.test(String(id)));

    let restQuery = supabase
      .from('tracks')
      .select('id, title, artist, url, duration, tags')
      .order('created_at', { ascending: false })
      .limit(20);

    if (safeIds.length > 0) {
      restQuery = restQuery.not('id', 'in', `(${safeIds.join(',')})`);
    }

    const { data: rest } = await restQuery;

    const combined: KutItem[] = [
      ...(loveRenews ?? []).map((t) => ({ ...t, type: 'mini-KUT' as const })),
      ...(rest ?? []).map((t) => ({ ...t, type: 'K-KUT' as const })),
    ].slice(0, 13);

    return combined.length > 0 ? combined : FALLBACK_KUTS;
  } catch {
    return FALLBACK_KUTS;
  }
}

/**
 * Static fallback seed — used when DB is unreachable.
 * "Love Renews" items lead per ADMIN DIRECTIVE.
 */
export const FALLBACK_KUTS: KutItem[] = [
  { id: 'lr-01', title: 'Love Renews', artist: 'KLEIGH', url: '', type: 'mini-KUT', tags: 'love_renews' },
  { id: 'lr-02', title: 'Love Renews (Reprise)', artist: 'KLEIGH', url: '', type: 'mini-KUT', tags: 'love_renews' },
  { id: 'lr-03', title: 'Love Renews (Hook)', artist: 'KLEIGH', url: '', type: 'mini-KUT', tags: 'love_renews' },
  { id: 'kk-01', title: 'Midnight Jazz', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'jazz' },
  { id: 'kk-02', title: 'Wounded & Willing', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'healing' },
  { id: 'kk-03', title: 'High Energy', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'energy' },
  { id: 'kk-04', title: 'Deep Focus', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'focus' },
  { id: 'kk-05', title: 'Sunrise Vibes', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'uplifting' },
  { id: 'kk-06', title: 'Late Night Soul', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'night' },
  { id: 'kk-07', title: 'Heart Tap', artist: 'KLEIGH', url: '', type: 'K-KUT', tags: 'emotional' },
  { id: 'kk-08', title: 'Melancholy Blues', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'melancholy' },
  { id: 'kk-09', title: 'Dreamy State', artist: 'G Putnam Music', url: '', type: 'K-KUT', tags: 'dreamy' },
  { id: 'kk-10', title: 'Cloud Nine', artist: 'KLEIGH', url: '', type: 'K-KUT', tags: 'uplifting' },
];
