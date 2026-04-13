/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events.
 *
 * Behaviour by environment:
 * - Preview / development + Stripe not configured → 200 no-op (audio-focused
 *   Preview deployments should work without payment infrastructure).
 * - Production + Stripe not configured → 503 (misconfiguration must be loud).
 * - All environments + Stripe configured → normal signature-verified handling.
 */

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isPreview, isStripeConfigured, getStripe } from "@/lib/stripe";

// Required by Stripe's rawBody verification – disable Next.js body parsing.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard: Stripe not configured ─────────────────────────────────────────
  if (!isStripeConfigured()) {
    if (isPreview()) {
      // Graceful no-op in Preview: Stripe webhooks are not expected here.
      return NextResponse.json(
        {
          received: true,
          note: "Stripe is not configured in this Preview deployment. Webhook ignored.",
        },
        { status: 200 }
      );
    }

    // In Production, missing Stripe config is a real misconfiguration.
    return NextResponse.json(
      {
        error: "Stripe webhook is not configured.",
        missingEnv: [
          ...(!process.env.STRIPE_SECRET_KEY ? ["STRIPE_SECRET_KEY"] : []),
          ...(!process.env.STRIPE_WEBHOOK_SECRET
            ? ["STRIPE_WEBHOOK_SECRET"]
            : []),
          ...(!process.env.STRIPE_SOVEREIGN_PRICE_ID
            ? ["STRIPE_SOVEREIGN_PRICE_ID"]
            : []),
        ],
      },
      { status: 503 }
    );
  }

  // ── Stripe signature verification ────────────────────────────────────────
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const stripe = getStripe();

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[k-kut webhook] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // ── Event handling ────────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      default:
        // Acknowledge but do not process unhandled event types.
        break;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[k-kut webhook] Error handling ${event.type}:`, message);
    return NextResponse.json(
      { error: `Handler error: ${message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// ── Handlers ──────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  // Only process Sovereign Pass subscriptions.
  if (session.metadata?.plan !== "sovereign-pass") {
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn(
      "[k-kut webhook] Supabase admin client unavailable – " +
        "sovereign_subscriptions upsert skipped."
    );
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  if (!subscriptionId) {
    console.warn(
      "[k-kut webhook] checkout.session.completed has no subscription ID – skipping."
    );
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  const customerEmail =
    session.customer_email ?? session.customer_details?.email ?? null;

  const { error } = await supabase.from("sovereign_subscriptions").upsert(
    {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_session_id: session.id,
      customer_email: customerEmail,
      status: "active",
    },
    { onConflict: "stripe_subscription_id" }
  );

  if (error) {
    console.error(
      "[k-kut webhook] sovereign_subscriptions upsert error:",
      error.message
    );
    throw new Error(error.message);
  }
}
