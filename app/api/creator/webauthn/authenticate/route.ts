/**
 * POST /api/creator/webauthn/authenticate
 *
 * Two-phase WebAuthn authentication:
 *   Phase 1 (POST { brand, phase: 'options' }):
 *     Returns PublicKeyCredentialRequestOptions.
 *   Phase 2 (POST { brand, phase: 'verify', credential }):
 *     Verifies and returns a short-lived signed session token
 *     stored in an HttpOnly cookie so the portal client can
 *     prove identity to subsequent API calls.
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sign } from 'jsonwebtoken';

const RP_ID  = process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID  ?? 'gputnammusic.com';
const ORIGIN = process.env.NEXT_PUBLIC_WEBAUTHN_ORIGIN ?? 'https://gputnammusic.com';
const SESSION_SECRET = process.env.CREATOR_SESSION_SECRET ?? 'change-me-in-production';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, phase } = body as { brand: string; phase: 'options' | 'verify'; credential?: unknown };

    if (!brand || !phase) {
      return NextResponse.json({ error: 'brand and phase are required' }, { status: 400 });
    }

    const brandUpper = brand.toUpperCase();

    const { data: portal, error: portalErr } = await supabaseAdmin
      .from('creator_portals')
      .select('id, brand, display_name, webauthn_credential_id, webauthn_public_key, webauthn_counter')
      .eq('brand', brandUpper)
      .single();

    if (portalErr || !portal) {
      return NextResponse.json({ error: 'Unknown creator brand' }, { status: 404 });
    }

    if (!portal.webauthn_credential_id) {
      return NextResponse.json({ error: 'Creator not yet enrolled — visit /creator/enroll first' }, { status: 412 });
    }

    // ----------------------------------------------------------------
    // Phase 1: return authentication options
    // ----------------------------------------------------------------
    if (phase === 'options') {
      await supabaseAdmin
        .from('webauthn_challenges')
        .delete()
        .eq('brand', brandUpper)
        .eq('type', 'authentication');

      const options = await generateAuthenticationOptions({
        rpID: RP_ID,
        userVerification: 'required',
        allowCredentials: [
          { id: portal.webauthn_credential_id as string },
        ],
      });

      await supabaseAdmin.from('webauthn_challenges').insert({
        brand: brandUpper,
        challenge: options.challenge,
        type: 'authentication',
      });

      return NextResponse.json(options);
    }

    // ----------------------------------------------------------------
    // Phase 2: verify authentication response
    // ----------------------------------------------------------------
    if (phase === 'verify') {
      const { credential } = body as { credential: Record<string, unknown> };
      if (!credential) {
        return NextResponse.json({ error: 'credential is required' }, { status: 400 });
      }

      const { data: challengeRow } = await supabaseAdmin
        .from('webauthn_challenges')
        .select('challenge, created_at')
        .eq('brand', brandUpper)
        .eq('type', 'authentication')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!challengeRow) {
        return NextResponse.json({ error: 'No pending authentication challenge' }, { status: 400 });
      }

      const ageMs = Date.now() - new Date(challengeRow.created_at as string).getTime();
      if (ageMs > 5 * 60 * 1000) {
        return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
      }

      const credentialID        = portal.webauthn_credential_id as string;
      const credentialPublicKey = Buffer.from(portal.webauthn_public_key as string, 'base64url');
      const currentCounter      = portal.webauthn_counter as number;

      let verification;
      try {
        verification = await verifyAuthenticationResponse({
          response: credential as unknown as Parameters<typeof verifyAuthenticationResponse>[0]['response'],
          expectedChallenge: challengeRow.challenge as string,
          expectedOrigin: ORIGIN,
          expectedRPID: RP_ID,
          requireUserVerification: true,
          credential: {
            id: credentialID,
            publicKey: credentialPublicKey,
            counter: currentCounter,
          },
        });
      } catch (err) {
        return NextResponse.json({ error: `Verification failed: ${String(err)}` }, { status: 401 });
      }

      if (!verification.verified) {
        return NextResponse.json({ error: 'Authentication not verified' }, { status: 401 });
      }

      // Update counter to prevent replay attacks
      await supabaseAdmin
        .from('creator_portals')
        .update({
          webauthn_counter: verification.authenticationInfo.newCounter,
          updated_at: new Date().toISOString(),
        })
        .eq('brand', brandUpper);

      // Clean up challenge
      await supabaseAdmin
        .from('webauthn_challenges')
        .delete()
        .eq('brand', brandUpper)
        .eq('type', 'authentication');

      // Issue a short-lived session JWT (4 hours)
      const token = sign(
        { brand: brandUpper, portalId: portal.id, displayName: portal.display_name },
        SESSION_SECRET,
        { expiresIn: '4h' }
      );

      const response = NextResponse.json({ ok: true, brand: brandUpper, displayName: portal.display_name });
      response.cookies.set('gpmc_creator_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 4 * 60 * 60,
        path: '/creator',
      });
      return response;
    }

    return NextResponse.json({ error: 'Unknown phase' }, { status: 400 });
  } catch (err) {
    console.error('[webauthn/authenticate]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
