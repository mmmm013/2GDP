import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

async function rotatePromotion() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

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
      updated_at: new Date().toISOString()
    })

  return {
    success: true,
    previous_playlist: current?.current_playlist_id,
    new_playlist: nextPlaylistId
  }
}

// GET is required for Vercel Cron Jobs (vercel.json schedules a GET request)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await rotatePromotion()
  return NextResponse.json(result)
}

// Keep POST for manual/admin triggers — requires same CRON_SECRET
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await rotatePromotion()
  return NextResponse.json(result)
}
