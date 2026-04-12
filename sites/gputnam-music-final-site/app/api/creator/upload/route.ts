/**
 * POST /api/creator/upload
 * Authenticated creator file upload.
 * Requires a valid gpmc_creator_session cookie.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCreatorBySlug, SCOPE_ACCEPT, type CreatorScope } from '@/config/creators';

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

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized — biometric login required' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file     = formData.get('file') as File | null;
    const scope    = formData.get('scope') as CreatorScope | null;
    const label    = (formData.get('label') as string | null) ?? '';

    if (!file || !scope) {
      return NextResponse.json({ error: 'file and scope are required' }, { status: 400 });
    }

    const creator = getCreatorBySlug(session.brand.toLowerCase());
    if (!creator) {
      return NextResponse.json({ error: 'Unknown creator brand in session' }, { status: 400 });
    }

    if (!creator.scope.includes(scope)) {
      return NextResponse.json(
        { error: `Scope '${scope}' is not permitted for brand ${creator.brand}` },
        { status: 403 }
      );
    }

    const allowed = SCOPE_ACCEPT[scope] ?? [];
    if (allowed.length > 0 && !allowed.includes(file.type)) {
      return NextResponse.json(
        { error: `File type '${file.type}' is not allowed for scope '${scope}'` },
        { status: 415 }
      );
    }

    const safeName    = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const storagePath = `${creator.brand}/${scope}/${Date.now()}-${safeName}`;

    const arrayBuf = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, arrayBuf, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error('[creator/upload] storage error', uploadError);
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    const { data: portal } = await supabaseAdmin
      .from('creator_portals')
      .select('id, brand, display_name')
      .eq('brand', creator.brand)
      .single();

    if (!portal) {
      return NextResponse.json({ error: 'Creator portal record not found' }, { status: 404 });
    }

    const meta = {
      brand:    creator.brand,
      creator:  creator.legalName,
      type:     file.type,
      scope,
      label,
      uploaded: new Date().toISOString(),
    };

    const { data: asset, error: dbError } = await supabaseAdmin
      .from('creator_assets')
      .insert({
        creator_id:      portal.id,
        brand:           creator.brand,
        creator_auth_id: session.portalId,
        file_url:        publicUrl,
        storage_path:    storagePath,
        file_type:       file.type,
        scope,
        label,
        meta,
        is_published:    false,
        uploaded_at:     new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('[creator/upload] db error', dbError);
      return NextResponse.json({ error: 'Asset registration failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, asset });
  } catch (err) {
    console.error('[creator/upload]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
