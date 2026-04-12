import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const track_id = searchParams.get('track_id')

  if (!track_id) {
    return NextResponse.json({ error: 'track_id required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get track info
  const { data: track, error: trackError } = await supabase
    .from('tracks')
    .select('track_id, title, artist')
    .eq('track_id', track_id)
    .single()

  if (trackError || !track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 })
  }

  // Check if track is in current featured playlist
  const { data: rotation } = await supabase
    .from('featured_rotation')
    .select('current_playlist_id')
    .eq('domain', 'gputnammusic.com')
    .single()

  if (rotation) {
    const { data: inPlaylist } = await supabase
      .from('playlist_tracks')
      .select('track_id')
      .eq('playlist_id', rotation.current_playlist_id)
      .eq('track_id', track_id)
      .single()

    if (inPlaylist) {
      // Track is featured - allow free play
      const { data: signedUrl } = await supabase.storage
        .from('tracks')
        .createSignedUrl(`${track_id}.mp3`, 3600)

      return NextResponse.json({
        track_id: track.track_id,
        title: track.title,
        artist: track.artist,
        url: signedUrl?.signedUrl,
        access: 'free',
        source: 'featured_playlist'
      })
    }
  }

  // Not in featured playlist
  return NextResponse.json({
    track_id: track.track_id,
    title: track.title,
    artist: track.artist,
    access: 'purchase_required',
    message: 'This track is not currently in the featured playlist'
  }, { status: 403 })
}
