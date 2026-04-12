/**
 * POST /api/creator/webauthn/register
 * Two-phase WebAuthn registration for GPM creator portal.
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  type VerifiedRegistrationResponse,
} from '@simplewebauthn/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const RP_NAME = 'GPM 4PE-MSC Creator Portal';
const RP_ID   = process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID  ?? 'gputnammusic.com';
const ORIGIN  = process.env.NEXT_PUBLIC_WEBAUTHN_ORIGIN ?? 'https://gputnammusic.com';

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
      .select('id, brand, display_name, webauthn_credential_id')
      .eq('brand', brandUpper)
      .single();

    if (portalErr || !portal) {
      return NextResponse.json({ error: 'Unknown creator brand' }, { status: 404 });
    }

    if (phase === 'options') {
      await supabaseAdmin
        .from('webauthn_challenges')
        .delete()
        .eq('brand', brandUpper)
        .eq('type', 'registration');

      const options = await generateRegistrationOptions({
        rpName: RP_NAME,
        rpID: RP_ID,
        userName: `${portal.brand.toLowerCase()}@gpmc.internal`,
        userDisplayName: portal.display_name,
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'required',
        },
        excludeCredentials: portal.webauthn_credential_id
          ? [{ id: portal.webauthn_credential_id }]
          : [],
      });

      await supabaseAdmin.from('webauthn_challenges').insert({
        brand: brandUpper,
        challenge: options.challenge,
        type: 'registration',
      });

      return NextResponse.json(options);
    }

    if (phase === 'verify') {
      const { credential } = body as { credential: Record<string, unknown> };
      if (!credential) {
        return NextResponse.json({ error: 'credential is required' }, { status: 400 });
      }

      const { data: challengeRow } = await supabaseAdmin
        .from('webauthn_challenges')
        .select('challenge, created_at')
        .eq('brand', brandUpper)
        .eq('type', 'registration')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!challengeRow) {
        return NextResponse.json({ error: 'No pending registration challenge' }, { status: 400 });
      }

      const ageMs = Date.now() - new Date(challengeRow.created_at as string).getTime();
      if (ageMs > 5 * 60 * 1000) {
        return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
      }

      let verification: VerifiedRegistrationResponse;
      try {
        verification = await verifyRegistrationResponse({
          response: credential as unknown as Parameters<typeof verifyRegistrationResponse>[0]['response'],
          expectedChallenge: challengeRow.challenge as string,
          expectedOrigin: ORIGIN,
          expectedRPID: RP_ID,
          requireUserVerification: true,
        });
      } catch (err) {
        return NextResponse.json({ error: `Verification failed: ${String(err)}` }, { status: 400 });
      }

      if (!verification.verified || !verification.registrationInfo) {
        return NextResponse.json({ error: 'WebAuthn verification not confirmed' }, { status: 400 });
      }

      const { credential: credInfo } = verification.registrationInfo;
      const credentialId  = Buffer.from(credInfo.id).toString('base64url');
      const publicKeyB64  = Buffer.from(credInfo.publicKey).toString('base64url');
      const counter       = credInfo.counter;

      await supabaseAdmin
        .from('creator_portals')
        .update({
          webauthn_credential_id: credentialId,
          webauthn_public_key:    publicKeyB64,
          webauthn_counter:       counter,
          enrolled_at:            new Date().toISOString(),
          updated_at:             new Date().toISOString(),
        })
        .eq('brand', brandUpper);

      await supabaseAdmin
        .from('webauthn_challenges')
        .delete()
        .eq('brand', brandUpper)
        .eq('type', 'registration');

      return NextResponse.json({ ok: true, brand: brandUpper });
    }

    return NextResponse.json({ error: 'Unknown phase' }, { status: 400 });
  } catch (err) {
    console.error('[webauthn/register]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
