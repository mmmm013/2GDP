import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Stripe webhook endpoint — /api/stripe/webhook
 *
 * Receives signed Stripe events and keeps `sovereign_subscriptions` in sync.
 *
 * Handled events:
 *   checkout.session.completed  → insert/activate subscription record
 *   invoice.payment_succeeded   → extend current_period_end on renewal
 *   customer.subscription.deleted → mark subscription canceled
 *   customer.subscription.updated → sync status changes (past_due, unpaid, etc.)
 *
 * Setup (Stripe Dashboard → Developers → Webhooks → Add endpoint):
 *   URL:    https://k-kut.com/api/stripe/webhook
 *   Events: checkout.session.completed
 *            invoice.payment_succeeded
 *            customer.subscription.deleted
 *            customer.subscription.updated
 *
 * The webhook secret (whsec_...) must be set as STRIPE_WEBHOOK_SECRET in Vercel.
 */

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error("[K-KUT webhook] STRIPE_SECRET_KEY not set.");
    return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });
  }

  if (!webhookSecret) {
    console.error("[K-KUT webhook] STRIPE_WEBHOOK_SECRET not set.");
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  let event;
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[K-KUT webhook] Signature verification failed:", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[K-KUT webhook] Supabase admin client not configured.");
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!subscriptionId) {
          console.warn("[K-KUT webhook] checkout.session.completed: no subscription ID");
          break;
        }

        const customerEmail =
          session.customer_email ?? session.customer_details?.email ?? null;

        const { error } = await supabase.from("sovereign_subscriptions").upsert(
          {
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            stripe_session_id: session.id,
            customer_email: customerEmail,
            status: "active",
          },
          { onConflict: "stripe_subscription_id" }
        );

        if (error) {
          console.error("[K-KUT webhook] DB upsert error (checkout.session.completed):", error.message);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as import("stripe").Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : (invoice.subscription as { id?: string } | null)?.id ?? null;

        if (!subscriptionId) break;

        const { error } = await supabase
          .from("sovereign_subscriptions")
          .update({
            status: "active",
            current_period_start: invoice.period_start
              ? new Date(invoice.period_start * 1000).toISOString()
              : null,
            current_period_end: invoice.period_end
              ? new Date(invoice.period_end * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) {
          console.error("[K-KUT webhook] DB update error (invoice.payment_succeeded):", error.message);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as import("stripe").Stripe.Subscription;
        const { error } = await supabase
          .from("sovereign_subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);

        if (error) {
          console.error("[K-KUT webhook] DB update error (subscription.deleted):", error.message);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as import("stripe").Stripe.Subscription;
        // Sync status: active, past_due, unpaid, etc.
        const { error } = await supabase
          .from("sovereign_subscriptions")
          .update({
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            canceled_at: sub.canceled_at
              ? new Date(sub.canceled_at * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", sub.id);

        if (error) {
          console.error("[K-KUT webhook] DB update error (subscription.updated):", error.message);
        }
        break;
      }

      default:
        // Acknowledge unhandled event types without error
        break;
    }
  } catch (err) {
    console.error("[K-KUT webhook] Handler error:", err);
    return NextResponse.json({ error: "Internal error handling event." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
