/**
 * Stripe configuration helpers for k-kut.
 *
 * Stripe is OPTIONAL in Vercel Preview / development so that the audio-focused
 * experience works without payment configuration.  Routes that need Stripe
 * should call `isStripeConfigured()` first and degrade gracefully when it
 * returns false.  In Production, missing Stripe vars will surface as clear
 * errors at invocation time rather than silently at boot.
 */

/** True when running in Vercel Preview or local development. */
export function isPreview(): boolean {
  const env = process.env.VERCEL_ENV;
  // VERCEL_ENV is "production" | "preview" | "development" | undefined (local)
  return env === "preview" || env === "development" || env === undefined;
}

/** True only if all required Stripe env vars are present. */
export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.STRIPE_SOVEREIGN_PRICE_ID
  );
}

/**
 * Returns a lazily-constructed Stripe instance.
 * Throws a descriptive error if STRIPE_SECRET_KEY is not set so callers get a
 * clear message instead of a silent failure.
 */
export function getStripe(): import("stripe").default {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. " +
        "Configure Stripe env vars or skip Stripe-dependent code paths in Preview."
    );
  }
  // Dynamic import keeps the module tree-shakeable and avoids Stripe
  // initialisation at import time (which would fail in environments where the
  // key is absent).
  const Stripe = require("stripe") as typeof import("stripe").default;
  // @ts-expect-error – Stripe constructor accepts the key directly
  return new Stripe(key);
}
