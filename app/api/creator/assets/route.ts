/**
 * GET  /api/creator/assets         — list this creator's assets
 * DELETE /api/creator/assets?id=   — delete an asset by id
 *
 * Requires a valid gpmc_creator_session cookie.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hasGpmeAdminBypass, blockedCustomizationResponse } from '@/lib/policy/gpmeCustomizationPolicy';

const SESSION_SECRET = process.env.CREATOR_SESSION_SECRET ?? 'change-me-in-production';
const STORAGE_BUCKET = 'creator-assets';

interface SessionPayload {
  brand: string;
  portalId: string;
  displayName: string;
}

function getSession(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get('gpmc_creator_session')?.value;
  if (!token) return null;
  try {
    return verify(token, SESSION_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope') ?? undefined;

  let query = supabaseAdmin
    .from('creator_assets')
    .select('*')
    .eq('brand', session.brand)
    .order('uploaded_at', { ascending: false });

  if (scope) {
    query = query.eq('scope', scope);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assets: data });
}

export async function DELETE(req: NextRequest) {
  if (!hasGpmeAdminBypass(req)) {
    return NextResponse.json(blockedCustomizationResponse(), { status: 403 });
  }

  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id query param required' }, { status: 400 });
  }

  // Verify the asset belongs to this creator brand
  const { data: asset, error: fetchErr } = await supabaseAdmin
    .from('creator_assets')
    .select('id, brand, storage_path')
    .eq('id', id)
    .eq('brand', session.brand)
    .single();

  if (fetchErr || !asset) {
    return NextResponse.json({ error: 'Asset not found or access denied' }, { status: 404 });
  }

  // Remove from storage
  await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([asset.storage_path as string]);

  // Remove from DB
  const { error: deleteErr } = await supabaseAdmin
    .from('creator_assets')
    .delete()
    .eq('id', id)
    .eq('brand', session.brand);

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!hasGpmeAdminBypass(req)) {
    return NextResponse.json(blockedCustomizationResponse(), { status: 403 });
  }

  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json() as { id: string; label?: string; is_published?: boolean };
    const { id, label, is_published } = body;
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (label !== undefined)        updates.label        = label;
    if (is_published !== undefined) updates.is_published = is_published;

    const { data, error } = await supabaseAdmin
      .from('creator_assets')
      .update(updates)
      .eq('id', id)
      .eq('brand', session.brand)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, asset: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
