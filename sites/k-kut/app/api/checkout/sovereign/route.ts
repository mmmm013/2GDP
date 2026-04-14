import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_SOVEREIGN_PRICE_ID;
  const fallbackCheckoutUrl =
    process.env.STRIPE_SOVEREIGN_FALLBACK_URL ||
    "https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://k-kut.com";

  if (!stripeSecretKey || !priceId) {
    // Keep checkout live even if native Stripe env wiring is incomplete.
    return NextResponse.redirect(fallbackCheckoutUrl);
  }

  try {
    // Dynamic import to avoid build errors when stripe is not configured
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/pricing?success=true`,
      cancel_url: `${siteUrl}/pricing`,
      metadata: { plan: "sovereign-pass", source: "k-kut.com" },
    });

    if (!session.url) {
      throw new Error("No session URL returned from Stripe.");
    }

    return NextResponse.redirect(session.url);
  } catch (err) {
    console.error("[K-KUT checkout/sovereign] Error:", err);
    const url = new URL("/pricing", req.url);
    url.searchParams.set("checkout", "error");
    return NextResponse.redirect(url);
  }
}
