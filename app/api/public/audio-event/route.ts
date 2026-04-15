import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0]?.trim() || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log(
      JSON.stringify({
        source: 'audio-telemetry',
        ts: new Date().toISOString(),
        ua: userAgent,
        ip: clientIp,
        ...payload,
      })
    );
  } catch {
    // Never fail the client on telemetry issues.
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
