/**
 * GET /api/ww-excerpt
 *
 * Returns metadata for a randomly selected Wounded & Willings (W&W) audio
 * excerpt, weighted by mood:
 *   subtle / dreamy / calm      → 40 % weight
 *   encouraging / uplifting     → 35 % weight
 *   sad / melancholy            → 25 % weight
 *
 * Excludes intense / party / high energy tracks per Founder directive.
 *
 * Start times are chosen randomly, avoiding the first 10s and last 10s of
 * each track (based on `duration_seconds` column when available).
 *
 * Response:
 *   { title, artist, previewUrl, start, duration, mood }
 *
 * previewUrl points to /api/preview-audio?title=...&start=...&duration=30
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Mood weight buckets — maps DB mood tag substrings → weight
const MOOD_BUCKETS = [
  { moods: ['subtle', 'dreamy', 'calm', 'peaceful', 'gentle'],   weight: 40 },
  { moods: ['encouraging', 'uplifting', 'hopeful', 'happy'],     weight: 35 },
  { moods: ['sad', 'melancholy', 'tender', 'longing', 'wistful'], weight: 25 },
] as const

// Flattened allowed mood patterns for the DB query
const ALLOWED_MOODS = MOOD_BUCKETS.flatMap((b) => b.moods)

// Blocked moods — never use these for W&W excerpts
const BLOCKED_MOODS = ['intense', 'party', 'high energy', 'aggressive', 'rage']

const EXCERPT_DURATION_S = 30

/** Weighted random pick from a pool based on per-bucket weight. */
function weightedPick<T>(items: T[], getWeight: (item: T) => number): T {
  const total = items.reduce((s, i) => s + getWeight(i), 0)
  let rand = Math.random() * total
  for (const item of items) {
    rand -= getWeight(item)
    if (rand <= 0) return item
  }
  return items[items.length - 1]
}

/** Assign a weight score to a track based on its mood string. */
function trackWeight(mood: string | null): number {
  if (!mood) return 10
  const m = mood.toLowerCase()
  for (const { moods, weight } of MOOD_BUCKETS) {
    if (moods.some((tag) => m.includes(tag))) return weight
  }
  return 5 // neutral weight for unrecognised moods
}

/** True if the mood string contains any blocked tag. */
function isBlocked(mood: string | null): boolean {
  if (!mood) return false
  const m = mood.toLowerCase()
  return BLOCKED_MOODS.some((tag) => m.includes(tag))
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Build OR filter for allowed moods
  const moodFilter = ALLOWED_MOODS.map((m) => `mood.ilike.%${m}%`).join(',')

  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('track_id, title, artist, mood, duration_seconds')
    .or(moodFilter)
    .limit(100)

  if (error || !tracks || tracks.length === 0) {
    // Fallback: return any track
    const { data: fallback } = await supabase
      .from('tracks')
      .select('track_id, title, artist, mood, duration_seconds')
      .limit(20)

    const pool = (fallback ?? []).filter((t) => !isBlocked(t.mood))
    if (pool.length === 0) {
      return NextResponse.json({ error: 'No eligible tracks available' }, { status: 503 })
    }
    return buildResponse(pool[Math.floor(Math.random() * pool.length)])
  }

  // Filter out blocked moods
  const eligible = tracks.filter((t) => !isBlocked(t.mood))
  if (eligible.length === 0) {
    return NextResponse.json({ error: 'No eligible tracks after mood filter' }, { status: 503 })
  }

  // Weighted pick
  const picked = weightedPick(eligible, (t) => trackWeight(t.mood))
  return buildResponse(picked)
}

function buildResponse(track: {
  track_id: string
  title: string | null
  artist: string | null
  mood: string | null
  duration_seconds: number | null
}) {
  const totalDuration = track.duration_seconds ?? 180 // assume 3 min if unknown
  const safeWindow = Math.max(0, totalDuration - EXCERPT_DURATION_S - 10)
  const minStart = 10
  const maxStart = Math.max(minStart + 5, safeWindow)

  // Random start within the safe window
  const start = Math.floor(minStart + Math.random() * (maxStart - minStart))

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://gputnammusic.com'
  const previewUrl = `${base}/api/preview-audio?title=${encodeURIComponent(track.title ?? '')}&start=${start}&duration=${EXCERPT_DURATION_S}`

  return NextResponse.json({
    title: track.title,
    artist: track.artist,
    mood: track.mood,
    start,
    duration: EXCERPT_DURATION_S,
    previewUrl,
  })
}
