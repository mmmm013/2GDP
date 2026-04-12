import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — Choose your Action.",
  description:
    "Four levels of access. One purpose: send a feeling with the exact moment of a song.",
  alternates: { canonical: "https://k-kut.com/pricing" },
  openGraph: {
    title: "Pricing | K-KUT",
    description: "Four levels of access. One purpose: send a feeling with the exact moment of a song.",
    url: "https://k-kut.com/pricing",
  },
};

const PLANS = [
  {
    level: "mK Single",
    action: "Quick Tap",
    price: "$1.99",
    tagline: "One quick moment. Instant feeling.",
    status: "rolling-out" as const,
    popular: false,
  },
  {
    level: "K-KUT Duo",
    action: "Double Tap",
    price: "$4.99",
    tagline: "Two moments — double the meaning.",
    status: "rolling-out" as const,
    popular: true,
  },
  {
    level: "PIX Stream",
    action: "Long Press",
    price: "$9.99",
    tagline: "Stay in the feeling — continuous discovery.",
    status: "rolling-out" as const,
    popular: false,
  },
  {
    level: "Sovereign Pass",
    action: "Hold My Heart",
    price: "$24.99",
    tagline: "Full access via the GPM Hub. The flagship experience.",
    status: "live" as const,
    popular: false,
    checkoutPath: "/api/checkout/sovereign",
  },
];

const FAQ = [
  {
    q: "What is a K-KUT?",
    a: "A short, exact excerpt of a professional track — picked for a specific feeling or moment.",
  },
  {
    q: "Is it made for sharing?",
    a: "Yes. K-KUT is designed to move at the speed of messaging. Clean links, instant playback.",
  },
  {
    q: "When will the other Actions be available?",
    a: "We're re-syncing audio and rolling access back online in waves. Get notified and you'll be first.",
  },
  {
    q: "Are plans monthly?",
    a: "Yes. All plans are monthly subscriptions. Cancel anytime.",
  },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; success?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <Nav />
      <main className="pt-14">
        {/* ─── Hero ──────────────────────────────── */}
        <section className="relative border-b border-[var(--border)] grid-bg py-24 px-4 text-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] blur-[100px] opacity-30" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              K-KUT Access
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
              Choose your Action.
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
              Four levels of access. One purpose: send a feeling with the exact
              moment of a song.
            </p>
          </div>
        </section>

        {/* ─── Status notices ───────────────────── */}
        {params.success === "true" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
            <div className="border border-[var(--accent)] bg-[var(--accent-glow)] rounded-sm p-4 text-center">
              <p className="text-sm text-[var(--accent)]">
                ✦ Payment successful. Welcome to Sovereign Pass. Check your email for next steps.
              </p>
            </div>
          </div>
        )}
        {params.checkout === "not-configured" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
            <div className="border border-yellow-600/40 bg-yellow-900/10 rounded-sm p-4 text-center">
              <p className="text-sm text-yellow-400">
                Checkout is not yet configured. Please set STRIPE_SECRET_KEY and STRIPE_SOVEREIGN_PRICE_ID.
              </p>
            </div>
          </div>
        )}
        {params.checkout === "error" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
            <div className="border border-red-600/40 bg-red-900/10 rounded-sm p-4 text-center">
              <p className="text-sm text-red-400">
                Something went wrong with checkout. Please try again or contact support.
              </p>
            </div>
          </div>
        )}

        {/* ─── Pricing Cards ────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <PricingCard key={plan.level} {...plan} />
            ))}
          </div>
          <p className="text-center text-xs text-[var(--text-subtle)] mt-6">
            All prices in USD. Monthly subscription. Cancel anytime.
          </p>
        </section>

        {/* ─── Feature comparison ───────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              What&rsquo;s included
            </p>
            <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-10">
              Common to all paid plans.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "Full K-KUT snippet playback",
                "Save favorites",
                "Share link / send flow",
                "Feeling-first discovery",
                "No ads",
                "Access to growing library",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-[var(--text-muted)]"
                >
                  <span className="text-[var(--accent)] text-xs">✦</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            FAQ
          </p>
          <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-10">
            Quick answers.
          </h2>
          <div className="space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="border-b border-[var(--border)] pb-6">
                <p className="text-sm font-semibold text-[var(--text)] mb-2">{q}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Sovereign CTA ────────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              Live now
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">
              Sovereign Pass is live.
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-8">
              Hold My Heart — $24.99 / mo. Full access via the GPM Hub.
            </p>
            <Link
              href="/api/checkout/sovereign"
              className="inline-block px-10 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
            >
              Get Sovereign Pass
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
