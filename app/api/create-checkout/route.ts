import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

// Tier price mapping (cents)
const TIER_AMOUNTS: Record<string, number> = {
  tap: 199,
  double_tap: 499,
  long_press: 999,
  hold_heart: 2499,
};

const TIER_LABELS: Record<string, string> = {
  tap: 'Quick Tap',
  double_tap: 'Double Tap',
  long_press: 'Long Press',
  hold_heart: 'Hold My Heart',
};

export async function POST(req: NextRequest) {
  // Initialise Supabase inside the handler so env vars are never
  // evaluated at build time (fixes "supabaseUrl is required" build error)
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Server configuration error: Supabase env vars missing' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json();
    const { tier, donorName, donorEmail, donorPhone, message, isAnonymous } = body;

    // Validate tier
    if (!tier || !TIER_AMOUNTS[tier]) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: tap, double_tap, long_press, or hold_heart' },
        { status: 400 }
      );
    }

    const amount = TIER_AMOUNTS[tier];
    const label = TIER_LABELS[tier];

    // Create Stripe Checkout Session
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift?cancelled=true`,
      metadata: {
        tier,
        donorName: donorName || '',
        donorEmail: donorEmail || '',
        donorPhone: donorPhone || '',
        message: message || '',
        isAnonymous: isAnonymous ? 'true' : 'false',
      },
      customer_email: donorEmail || undefined,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
