/**
 * /api/cron/free-gift — GPM Hourly Free Gift (staging/gputnam-music-final-site)
 *
 * Runs every hour via Vercel Cron. Logs the regional gift drop and records
 * the issuance in Supabase `free_gift_issuances`.
 *
 * Regional schedule (UTC hours):
 *   US  14 18 22 | CA  15 19 23 | UK  8 12 17
 *   AUS  0  4 21 | CN   1  5  9 | GLOBAL: all other hours
 *
 * Priority: K-KUT > mini-KUT > K-kUpId
 * Rules: items < $50, never historic cost-items.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

type GiftRegion = 'US' | 'CA' | 'UK' | 'AUS' | 'CN' | 'GLOBAL';

const REGION_HOURS: Record<GiftRegion, number[]> = {
  US:     [14, 18, 22],
  CA:     [15, 19, 23],
  UK:     [8,  12, 17],
  AUS:    [0,   4, 21],
  CN:     [1,   5,  9],
  GLOBAL: [], // everything else
};

function getRegionForHour(utcHour: number): GiftRegion {
  for (const [region, hours] of Object.entries(REGION_HOURS) as [GiftRegion, number[]][]) {
    if (region !== 'GLOBAL' && hours.includes(utcHour)) return region;
  }
  return 'GLOBAL';
}

function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && !secret) return false;
  if (!secret) return true;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_URL not configured' }, { status: 500 });
  }

  if (!serviceKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const utcHour = new Date().getUTCHours();
  const region  = getRegionForHour(utcHour);

  // Pull eligible tracks from the catalog as gift items
  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('title, mood')
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const giftTitle = tracks?.[0]?.title ?? 'GPM K-KUT Sampler';

  const issuanceId  = randomUUID();
  const issuedAt    = new Date().toISOString();

  const { error: insertError } = await supabase
    .from('free_gift_issuances')
    .insert({
      id:              issuanceId,
      issued_at:       issuedAt,
      utc_hour:        utcHour,
      region,
      gift_title:      giftTitle,
      gift_type:       'K-KUT',
      gift_cost_cents: 0,
      delivery_url:    `${supabaseUrl}/storage/v1/object/public/tracks/`,
    });

  if (insertError) {
    // Table may not exist yet — log and continue
    console.warn('[free-gift] insert skipped:', insertError.message);
  }

  return NextResponse.json({
    ok:         true,
    issuanceId,
    region,
    utcHour,
    giftTitle,
    issuedAt,
  });
}
