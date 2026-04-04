import { NextRequest, NextResponse } from 'next/server';

// Pride tier pricing (cents/month)
const TIER_AMOUNTS: Record<string, number> = {
  joey: 500,
  climber: 1000,
  alpha: 1500,
  elder: 2000,
};

const TIER_LABELS: Record<string, string> = {
  joey: 'Joey \u2014 The Young One',
  climber: 'Climber \u2014 On the Rise',
  alpha: 'Alpha \u2014 The Leader',
  elder: 'Elder \u2014 The Patriarch',
};

export async function POST(req: NextRequest) {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
  });
  try {
    const body = await req.json();
    const { tier } = body;

    if (!tier || !TIER_AMOUNTS[tier]) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: joey, climber, alpha, or elder' },
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
              name: `GPM Pride: ${label}`,
              description: 'Monthly Pride membership \u2014 100% fuels development & artist support',
              images: ['https://www.gputnammusic.com/og-image.png'],
            },
            unit_amount: amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/join?success=true&tier=${tier}`,
      cancel_url: `${baseUrl}/join?cancelled=true`,
      metadata: {
        tier,
        source: 'pride_join',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Subscription checkout error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unable to create subscription checkout' },
      { status: 500 }
    );
  }
}
