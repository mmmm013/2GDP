import { NextRequest, NextResponse } from 'next/server';

// Ships tier pricing (cents/month)
const TIER_AMOUNTS: Record<string, number> = {
  canoe: 1313,
  cruiser: 2323,
};

const TIER_LABELS: Record<string, string> = {
  canoe: 'Canoe — Ship Sponsor',
  cruiser: 'Cruiser — Senior Ship Sponsor',
};

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        {
          error: 'Subscription checkout unavailable: STRIPE_SECRET_KEY is not configured',
          missingEnv: ['STRIPE_SECRET_KEY'],
        },
        { status: 503 }
      );
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-12-15.clover',
    });

    const body = await req.json();
    const { tier } = body;

    if (!tier || !TIER_AMOUNTS[tier]) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: canoe or cruiser' },
        { status: 400 }
      );
    }

    const amount = TIER_AMOUNTS[tier];
    const label = TIER_LABELS[tier];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gputnammusic.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `GPM Ships: ${label}`,
              description:
                'Monthly Ships sponsorship — profit-sharing member of G Putnam Music. Every KUT profit flows to Michael Scherer & family.',
              images: ['https://www.gputnammusic.com/gpm_logo.jpg'],
            },
            recurring: { interval: 'month' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/join?success=1&tier=${tier}`,
      cancel_url: `${baseUrl}/join?cancelled=1`,
      metadata: { tier, platform: 'gputnammusic', campaign: 'ships' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
