import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// ---------------------------------------------------------------------------
// GET /api/msj-catalog
//
// Returns the MSJ TV Thoroughbreds catalog as a CSV file suitable for
// import into music supervision tools, spreadsheets, or broadcast systems.
//
// Fields: title, artist, tv_network, tv_show, tv_region, sync_tier,
//         gpmcc_sfw, composition_story, lemon_squeezy_url
//
// No auth required — catalog is public product info.
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest) {
  const { data: tracks, error } = await supabaseAdmin
    .from('msj_tv_thoroughbreds')
    .select(
      'title, artist, tv_network, tv_show, tv_region, tv_spot_description, sync_tier, gpmcc_sfw, composition_story, lemon_squeezy_url'
    )
    .order('title');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const headers = [
    'Title',
    'Artist',
    'PRO',
    'TV Network',
    'TV Show',
    'Region',
    'Spot Description',
    'Sync Tier',
    'GPMCC SFW',
    'Composition Story',
    'License URL',
  ];

  const escape = (val: string | null | boolean | undefined): string => {
    if (val === null || val === undefined) return '';
    const s = String(val);
    // Wrap in quotes and escape any internal quotes
    return `"${s.replace(/"/g, '""')}"`;
  };

  const rows = (tracks ?? []).map((t) =>
    [
      escape(t.title),
      escape(t.artist ?? 'Michael Scherer'),
      escape('ASCAP'),
      escape(t.tv_network),
      escape(t.tv_show),
      escape(t.tv_region),
      escape(t.tv_spot_description),
      escape(t.sync_tier),
      escape(t.gpmcc_sfw ? 'Yes' : 'No'),
      escape(t.composition_story),
      escape(t.lemon_squeezy_url),
    ].join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="msj-tv-thoroughbreds.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
