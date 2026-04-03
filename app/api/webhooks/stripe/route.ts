import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
  });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(intent);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tier = session.metadata?.tier;
  if (!tier) return;

  // Update donation status to completed
  const { error: updateError } = await supabaseAdmin
    .from('gpm_donations')
    .update({
      status: 'completed',
      stripe_payment_intent: session.payment_intent as string,
      completed_at: new Date().toISOString(),
    })
    .eq('stripe_session_id', session.id);

  if (updateError) {
    console.error('Failed to update donation:', updateError);
    return;
  }

  // Assign a random gift asset from the tier
  const { data: assets } = await supabaseAdmin
    .from('gpm_gift_assets')
    .select('id')
    .eq('tier', tier)
    .eq('is_active', true);

  if (assets && assets.length > 0) {
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    await supabaseAdmin
      .from('gpm_donations')
      .update({ gift_asset_id: randomAsset.id })
      .eq('stripe_session_id', session.id);
  }

  // Send SMS notification if phone provided
  const donorPhone = session.metadata?.donorPhone;
  if (donorPhone) {
    await sendGiftSMS(donorPhone, tier, session.id);
  }

  console.log(`Gift completed: ${tier} tier, session ${session.id}`);
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  // Mark donation as failed
  const { error } = await supabaseAdmin
    .from('gpm_donations')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent', intent.id);

  if (error) {
    console.error('Failed to update failed payment:', error);
  }
}

async function sendGiftSMS(phone: string, tier: string, sessionId: string) {
  // Fetch SMS template from tier config
  const { data: config } = await supabaseAdmin
    .from('gpm_tier_config')
    .select('sms_message_template')
    .eq('tier', tier)
    .single();

  if (!config?.sms_message_template) return;

  const giftLink = `${process.env.NEXT_PUBLIC_BASE_URL}/gift/claim/${sessionId}`;
  const message = config.sms_message_template.replace('{link}', giftLink);

  // Twilio SMS (or swap for any provider)
  try {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioSid || !twilioAuth || !twilioFrom) {
      console.log('SMS skipped - Twilio not configured. Message:', message);
      return;
    }

    const resp = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioFrom,
          Body: message,
        }),
      }
    );

    if (!resp.ok) {
      console.error('SMS send failed:', await resp.text());
    }
  } catch (err) {
    console.error('SMS error:', err);
  }
}
