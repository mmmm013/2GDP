import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// ---------------------------------------------------------------------------
// GET /api/msj-revenue?token=<MSJ_DASHBOARD_TOKEN>
//
// Token-protected, read-only revenue transparency dashboard for Michael Scherer.
// Returns: total completed donations, gross revenue, MSJ 90% share, and catalog.
//
// Set MSJ_DASHBOARD_TOKEN in environment variables and share the URL privately
// with Michael so he can see his accrued revenue at any time.
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const expected = process.env.MSJ_DASHBOARD_TOKEN;

  if (!expected) {
    return NextResponse.json(
      { error: 'Dashboard not configured — MSJ_DASHBOARD_TOKEN not set' },
      { status: 503 }
    );
  }
  if (!token || token !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Fetch completed donations ──────────────────────────────────────────────
  const { data: donations, error: donationsError } = await supabaseAdmin
    .from('gpm_donations')
    .select('id, tier, amount_cents, status, completed_at, created_at, donor_name')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (donationsError) {
    console.error('[msj-revenue] gpm_donations error', donationsError.message);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }

  const rows = donations ?? [];
  const totalCents = rows.reduce((sum, d) => sum + (d.amount_cents ?? 0), 0);
  const msjShareCents = Math.round(totalCents * 0.9);

  // ── Fetch MSJ TV catalog ───────────────────────────────────────────────────
  const { data: catalog, error: catalogError } = await supabaseAdmin
    .from('msj_tv_thoroughbreds')
    .select('id, title, tv_network, tv_show, tv_region, sync_tier, gpmcc_sfw')
    .order('title');

  if (catalogError) {
    console.error('[msj-revenue] msj_tv_thoroughbreds error', catalogError.message);
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }

  return NextResponse.json({
    summary: {
      total_completed_donations: rows.length,
      gross_revenue_usd: (totalCents / 100).toFixed(2),
      msj_share_90pct_usd: (msjShareCents / 100).toFixed(2),
      gputnam_kleigh_10pct_usd: ((totalCents - msjShareCents) / 100).toFixed(2),
      note: '90% of all G Putnam Music revenues bearing Michael Scherer\'s name flows to Michael and his family per Founder\'s standing directive.',
      generated_at: new Date().toISOString(),
    },
    catalog: catalog ?? [],
    recent_donations: rows.slice(0, 25),
  });
}
