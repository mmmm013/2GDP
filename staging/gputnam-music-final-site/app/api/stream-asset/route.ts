/**
 * GET /api/stream-asset?id=ASSET_ID
 *
 * Resolves a signed storage URL for a published creator asset and redirects
 * the client to it. Used by /herb-blog (PIXIE's PIX playlist) so the raw
 * storage path is never exposed in the HTML source.
 *
 * - Only published assets (is_published = true) are served.
 * - Signed URLs expire in 1 hour (3 600 s).
 * - Requires SUPABASE_SERVICE_ROLE_KEY (server-only; never exposed client-side).
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const SIGNED_URL_TTL = 3600; // 1 hour

export async function GET(req: NextRequest) {
  const assetId = req.nextUrl.searchParams.get('id');

  if (!assetId) {
    return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
  }

  try {
    // Look up the published asset — never serve unpublished items
    const { data: asset, error } = await supabaseAdmin
      .from('creator_assets')
      .select('id, storage_path, file_type, is_published')
      .eq('id', assetId)
      .eq('is_published', true)
      .single();

    if (error || !asset) {
      return NextResponse.json({ error: 'Asset not found or not published' }, { status: 404 });
    }

    if (!asset.storage_path) {
      return NextResponse.json({ error: 'Asset has no storage path' }, { status: 422 });
    }

    // Generate a short-lived signed URL (creator-assets bucket)
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from('creator-assets')
      .createSignedUrl(asset.storage_path, SIGNED_URL_TTL);

    if (signErr || !signed?.signedUrl) {
      console.error('[stream-asset] signing failed', signErr);
      return NextResponse.json({ error: 'Could not sign asset URL' }, { status: 502 });
    }

    // Redirect — browser follows to the signed URL
    return NextResponse.redirect(signed.signedUrl, { status: 302 });
  } catch (err) {
    console.error('[stream-asset] unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
