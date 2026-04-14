import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const SIGNED_URL_TTL = 3600;

async function resolveAssetSignedUrl(assetId: string): Promise<string | null> {
  const { data: asset, error } = await supabaseAdmin
    .from('creator_assets')
    .select('id, storage_path, is_published')
    .eq('id', assetId)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !asset?.storage_path) return null;

  // Link-intake entries are metadata references, not storage objects.
  if (asset.storage_path.startsWith('link-intake/')) return null;

  const { data: signed, error: signErr } = await supabaseAdmin.storage
    .from('creator-assets')
    .createSignedUrl(asset.storage_path, SIGNED_URL_TTL);

  if (signErr || !signed?.signedUrl) return null;
  return signed.signedUrl;
}

function getAssetId(req: NextRequest): string {
  return req.nextUrl.searchParams.get('id')?.trim() ?? '';
}

export async function GET(req: NextRequest) {
  const assetId = getAssetId(req);
  if (!assetId) {
    return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
  }

  try {
    const signedUrl = await resolveAssetSignedUrl(assetId);
    if (!signedUrl) {
      return NextResponse.json({ error: 'Asset not found or not streamable' }, { status: 404 });
    }

    // Browser-friendly behavior for page links.
    return NextResponse.redirect(signedUrl, { status: 302 });
  } catch (err) {
    console.error('[stream-asset] unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const assetId = getAssetId(req);
  if (!assetId) {
    return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
  }

  try {
    const signedUrl = await resolveAssetSignedUrl(assetId);
    if (!signedUrl) {
      return NextResponse.json({ error: 'Asset not found or not streamable' }, { status: 404 });
    }

    // JSON response for client refresh flows.
    return NextResponse.json({ url: signedUrl, signedUrl });
  } catch (err) {
    console.error('[stream-asset] unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
