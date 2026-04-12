/**
 * GET /api/healthcheck
 *
 * Lightweight streaming-wiring status endpoint.
 * Reports env presence and Supabase function reachability.
 * Does NOT leak secret values — only reports key names as present/missing.
 *
 * Use in Vercel monitoring / uptime checks.
 * HTTP 200 → ok or degraded (streaming may work)
 * HTTP 503 → misconfigured (streaming will not work)
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  const envOk = Boolean(supabaseUrl && anonKey);

  let functionReachable = false;
  let functionDetail    = 'unchecked';

  if (envOk) {
    try {
      // OPTIONS ping to the edge function — no auth needed, no data leaked
      const res = await fetch(`${supabaseUrl}/functions/v1/get-stream-url`, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(5000),
      });
      functionReachable = res.ok || res.status === 200 || res.status === 204;
      functionDetail    = `HTTP ${res.status}`;
    } catch (err) {
      functionDetail = err instanceof Error ? err.message : 'unreachable';
    }
  }

  const status =
    !envOk             ? 'misconfigured' :
    !functionReachable ? 'degraded'      :
                         'ok';

  const httpStatus = status === 'misconfigured' ? 503 : 200;

  return NextResponse.json(
    {
      status,
      checks: {
        env: {
          NEXT_PUBLIC_SUPABASE_URL:      supabaseUrl  ? 'set' : 'missing',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey      ? 'set' : 'missing',
          SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing',
        },
        supabase_function: {
          name:      'get-stream-url',
          reachable: functionReachable,
          detail:    functionDetail,
        },
      },
      timestamp: new Date().toISOString(),
    },
    { status: httpStatus }
  );
}
