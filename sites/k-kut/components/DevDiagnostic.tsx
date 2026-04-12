"use client";

import { useEffect } from "react";

/**
 * DevDiagnostic — development-only config check.
 * Logs the public Supabase URL (non-secret) and site URL to the browser
 * console so misconfiguration is immediately visible during local dev.
 * Renders nothing; never runs in production.
 */
export default function DevDiagnostic() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    console.group("[k-kut] Dev Config Diagnostic");
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL:",
      supabaseUrl ?? "⚠️ NOT SET — Supabase calls will fail"
    );
    console.log(
      "NEXT_PUBLIC_SITE_URL:",
      siteUrl ?? "⚠️ NOT SET — API URL construction may fail"
    );
    console.log(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:",
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        ? "✅ set"
        : "⚠️ NOT SET — Stripe will not load"
    );
    console.groupEnd();
  }, []);

  return null;
}
