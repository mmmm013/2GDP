import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({} as Record<string, unknown>));
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0]?.trim() || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const event = typeof payload.event === 'string' ? payload.event : 'unknown';
    const source = typeof payload.source === 'string' ? payload.source : 'unknown';
    const path = typeof payload.path === 'string' ? payload.path : null;
    const url = typeof payload.url === 'string' ? payload.url : null;
    const message = typeof payload.message === 'string' ? payload.message : null;
    const track = typeof payload.track === 'string' ? payload.track : null;

    console.log(
      JSON.stringify({
        source: 'audio-telemetry',
        ts: new Date().toISOString(),
        ua: userAgent,
        ip: clientIp,
        event,
        telemetry_source: source,
        path,
        url,
        message,
        track,
      })
    );

    // Best-effort persistence for quick 24h/7d traffic checks.
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const { error } = await supabase.from('audio_telemetry_events').insert({
        event,
        source,
        path,
        url,
        message,
        track,
        ua: userAgent,
        ip: clientIp,
        payload,
      });

      // Ignore missing-table during rollout; endpoint remains write-safe.
      if (error && error.code !== '42P01') {
        console.error('[audio-telemetry] persist error:', error.message);
      }
    }
  } catch {
    // Never fail the client on telemetry issues.
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
