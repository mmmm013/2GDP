import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    console.log(
      JSON.stringify({
        source: 'audio-telemetry',
        ...payload,
      })
    );
  } catch {
    // Never fail the client on telemetry issues.
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
