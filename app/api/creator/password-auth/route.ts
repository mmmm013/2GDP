import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { timingSafeEqual } from 'node:crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const SESSION_SECRET = process.env.CREATOR_SESSION_SECRET ?? 'change-me-in-production';

type CredentialRecord = {
  userId: string;
  password: string;
};

function normalizeSecret(value: string | undefined | null): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

function getExpectedCredential(brand: string): CredentialRecord | null {
  const upper = brand.toUpperCase();

  // Highest-priority override: JSON object in env
  // Example:
  // {"PIXIE":{"userId":"pixie-admin","password":"..."}}
  const jsonRaw = process.env.CREATOR_PASSWORD_CREDENTIALS;
  if (jsonRaw) {
    try {
      const parsed = JSON.parse(jsonRaw) as Record<string, CredentialRecord>;
      const cred = parsed[upper];
      if (cred?.userId && cred?.password) {
        return {
          userId: normalizeSecret(cred.userId),
          password: normalizeSecret(cred.password),
        };
      }
    } catch {
      // Ignore malformed JSON and continue with explicit env keys.
    }
  }

  // Brand-scoped env variables
  const brandUser = process.env[`CREATOR_${upper}_USER_ID`];
  const brandPass = process.env[`CREATOR_${upper}_PASSWORD`];
  if (brandUser && brandPass) {
    return {
      userId: normalizeSecret(brandUser),
      password: normalizeSecret(brandPass),
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      brand?: string;
      userId?: string;
      password?: string;
    };

    const brand = body.brand?.toUpperCase().trim();
    const userId = normalizeSecret(body.userId);
    const password = normalizeSecret(body.password);

    if (!brand || !userId || !password) {
      return NextResponse.json({ error: 'brand, userId, and password are required' }, { status: 400 });
    }

    const { data: portal, error: portalErr } = await supabaseAdmin
      .from('creator_portals')
      .select('id, brand, display_name')
      .eq('brand', brand)
      .single();

    if (portalErr || !portal) {
      return NextResponse.json({ error: 'Unknown creator brand' }, { status: 404 });
    }

    const expected = getExpectedCredential(brand);
    if (!expected) {
      return NextResponse.json({ error: 'Password auth is not configured for this creator' }, { status: 503 });
    }

    const userOk = safeEqual(userId, expected.userId);
    const passOk = safeEqual(password, expected.password);
    if (!userOk || !passOk) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = sign(
      { brand, portalId: portal.id, displayName: portal.display_name },
      SESSION_SECRET,
      { expiresIn: '4h' }
    );

    const response = NextResponse.json({ ok: true, brand, displayName: portal.display_name });
    response.cookies.set('gpmc_creator_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 4 * 60 * 60,
      path: '/creator',
    });

    return response;
  } catch (err) {
    console.error('[creator/password-auth]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
