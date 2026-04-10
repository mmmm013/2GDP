import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const DEFAULT_BUCKET = 'audio-stream'
const SIGNED_URL_TTL_SECONDS = 300

serve(async (req) => {
  try {
    const body = await req.json().catch(() => null)
    const trackId = body?.trackId ?? body?.track_id
    const bucket = body?.bucket ?? DEFAULT_BUCKET

    if (!trackId) {
      return new Response(JSON.stringify({ error: 'trackId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client with service role for storage access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch track metadata
    const { data: track, error: trackError } = await supabase
      .from('gpm_tracks')
      .select('id, title, file_path, is_public')
      .eq('id', trackId)
      .single()

    if (trackError || !track) {
      return new Response(JSON.stringify({ error: 'Track not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!track.file_path) {
      return new Response(JSON.stringify({ error: 'No file_path on track record' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(track.file_path, SIGNED_URL_TTL_SECONDS)

    if (urlError || !urlData?.signedUrl) {
      return new Response(JSON.stringify({ error: urlError?.message ?? 'Failed to generate stream URL' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Increment play count (best-effort)
    await supabase.rpc('increment_play_count', { track_id: trackId }).catch(() => {})

    return new Response(
      JSON.stringify({
        url: urlData.signedUrl,
        expires_in: SIGNED_URL_TTL_SECONDS,
        bucket,
        file_path: track.file_path,
        track: {
          id: track.id,
          title: track.title,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
