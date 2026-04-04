/**
 * GET /api/preview-audio
 *
 * Streams a time-bounded audio excerpt from Supabase Storage using HTTP Range
 * headers. Designed for K-KUT / mini-KUT / K-kUpId inline preview players.
 *
 * Query params:
 *   title      string  required  ASCAP title (single source of truth)
 *   start      number  optional  Start offset in seconds (default: 20)
 *   duration   number  optional  Clip duration in seconds (default: 30, max: 60)
 *
 * Byte-range estimation: GPM tracks are encoded at ~128 kbps.
 *   1 second ≈ 16,000 bytes  (128_000 bits ÷ 8)
 *   ID3 header overhead: ~10 KB — added to start offset
 *
 * Returns: audio/mpeg stream (partial content 206) or 302 redirect to signed URL.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BYTES_PER_SECOND  = 16_000   // 128 kbps
const ID3_OFFSET_BYTES  = 10_240   // ~10 KB header guard
const DEFAULT_START_S   = 20
const DEFAULT_DURATION_S = 30
const MAX_DURATION_S    = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title     = searchParams.get('title')?.trim()
  const startS    = Math.max(0, Number(searchParams.get('start')    ?? DEFAULT_START_S))
  const durationS = Math.min(MAX_DURATION_S, Math.max(5, Number(searchParams.get('duration') ?? DEFAULT_DURATION_S)))

  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Resolve track by ASCAP title
  const { data: track } = await supabase
    .from('tracks')
    .select('track_id, title')
    .ilike('title', title)
    .limit(1)
    .single()

  if (!track?.track_id) {
    return NextResponse.json({ error: 'Track not found', title }, { status: 404 })
  }

  // Short-lived signed URL (10 min)
  const { data: signed } = await supabase.storage
    .from('audio')
    .createSignedUrl(`${track.track_id}.mp3`, 600)

  if (!signed?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })
  }

  // Calculate byte range
  const startByte = ID3_OFFSET_BYTES + Math.floor(startS * BYTES_PER_SECOND)
  const endByte   = startByte + Math.floor(durationS * BYTES_PER_SECOND) - 1

  try {
    const upstream = await fetch(signed.signedUrl, {
      headers: { Range: `bytes=${startByte}-${endByte}` },
    })

    if (upstream.status !== 206 && !upstream.ok) {
      return NextResponse.redirect(signed.signedUrl, 302)
    }

    const body = upstream.body
    if (!body) return NextResponse.redirect(signed.signedUrl, 302)

    return new Response(body, {
      status: 206,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Range':
          upstream.headers.get('Content-Range') ??
          `bytes ${startByte}-${endByte}/*`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=300',
        'X-GPM-Preview': `start=${startS}s duration=${durationS}s`,
      },
    })
  } catch {
    return NextResponse.redirect(signed.signedUrl, 302)
  }
}
