import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const TIERS = ['tap', 'double_tap', 'long_press', 'hold_heart'] as const;
type Tier = (typeof TIERS)[number];

const TIER_AMOUNTS: Record<Tier, number> = {
  tap: 199,
  double_tap: 499,
  long_press: 999,
  hold_heart: 2499,
};

const TIER_LABELS: Record<Tier, string> = {
  tap: 'Quick Tap',
  double_tap: 'Double Tap',
  long_press: 'Long Press',
  hold_heart: 'Hold My Heart',
};

type CheckoutBody = {
  tier?: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  message?: string;
  isAnonymous?: boolean;
};

const isTier = (value: string): value is Tier => (TIERS as readonly string[]).includes(value);
const clean = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
  });
  try {
    let body: CheckoutBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const tier = clean(body.tier, 50);
    const donorName = clean(body.donorName, 120);
    const donorEmail = clean(body.donorEmail, 254);
    const donorPhone = clean(body.donorPhone, 40);
    const message = clean(body.message, 500);
    const isAnonymous = Boolean(body.isAnonymous);

    if (!isTier(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: tap, double_tap, long_press, or hold_heart' },
        { status: 400 }
      );
    }

    const amount = TIER_AMOUNTS[tier];
    const label = TIER_LABELS[tier];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `GPM Heart-Tap: ${label}`,
              description: `Support G. Putnam Music - ${label} tier gift`,
              images: ['https://www.gputnammusic.com/og-image.png'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gift?cancelled=true`,
      metadata: {
        tier,
        donorName: donorName || '',
        donorEmail: donorEmail || '',
        donorPhone: donorPhone || '',
        message: message || '',
        isAnonymous: isAnonymous ? 'true' : 'false',
      },
    });

    const { error: dbError } = await supabaseAdmin.from('gpm_donations').insert({
      stripe_session_id: session.id,
      donor_name: isAnonymous ? 'Anonymous' : donorName || null,
      donor_email: donorEmail || null,
      donor_phone: donorPhone || null,
      amount_cents: amount,
      tier,
      message: message || null,
      is_anonymous: isAnonymous,
      grand_prize_eligible: tier !== 'tap',
      status: 'pending',
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
    }

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout URL' }, { status: 500 });
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}