import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getActiveScheduledPromo } from '@/config/promoSchedule'

async function rotatePromotion() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── 1. Check for an active scheduled promo first ──────────────────────────
  const scheduledPromo = getActiveScheduledPromo()

  if (scheduledPromo) {
    // Upsert scheduled promo into active_promo table (or featured_rotation)
    await supabase
      .from('featured_rotation')
      .upsert({
        domain: 'gputnammusic.com',
        promo_id: scheduledPromo.id,
        promo_name: scheduledPromo.name,
        promo_tagline: scheduledPromo.tagline,
        promo_product_url: scheduledPromo.featuredProductUrl,
        promo_gift_title: scheduledPromo.featuredGiftTitle,
        sponsor_tier: scheduledPromo.sponsorTier,
        source: 'scheduled',
        updated_at: new Date().toISOString(),
      })

    return {
      success: true,
      source: 'scheduled',
      promo: scheduledPromo.id,
      tagline: scheduledPromo.tagline,
    }
  }

  // ── 2. Fallback: random playlist rotation ────────────────────────────────
  const { data: current } = await supabase
    .from('featured_rotation')
    .select('current_playlist_id')
    .eq('domain', '2kleigh.com')
    .single()

  const nextPlaylistId = current
    ? (current.current_playlist_id % 7) + 1
    : 1

  await supabase
    .from('featured_rotation')
    .upsert({
      domain: '2kleigh.com',
      current_playlist_id: nextPlaylistId,
      source: 'random',
      updated_at: new Date().toISOString(),
    })

  return {
    success: true,
    source: 'random',
    previous_playlist: current?.current_playlist_id,
    new_playlist: nextPlaylistId,
  }
}

/**
 * Shared auth guard for both GET (Vercel cron) and POST (admin trigger).
 *
 * Rules:
 *  - In production, CRON_SECRET MUST be set; requests without the correct
 *    bearer token are always rejected.
 *  - In non-production environments (local dev / CI) the check is skipped
 *    so the endpoint can be tested without secrets configured.
 */
function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && !secret) {
    // Mis-configured production — deny all rather than expose the endpoint.
    return false
  }

  if (!secret) {
    // Non-production with no secret configured — allow for local dev/CI.
    return true
  }

  return request.headers.get('authorization') === `Bearer ${secret}`
}

// GET is required for Vercel Cron Jobs (vercel.json schedules a GET request)
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await rotatePromotion()
  return NextResponse.json(result)
}

// Keep POST for manual/admin triggers — uses the same CRON_SECRET guard
export async function POST(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await rotatePromotion()
  return NextResponse.json(result)
}
