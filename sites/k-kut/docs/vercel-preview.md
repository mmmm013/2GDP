# Vercel Preview vs Production — k-kut deployment guide

This document describes how to configure Vercel for the **k-kut** Next.js site,
which lives at `sites/k-kut` in the GPMC monorepo.

---

## Deploying from the monorepo root

Set **Root Directory** to `sites/k-kut` in your Vercel project settings
(Project → Settings → General → Root Directory).  The build command defaults
to `next build` from that directory.

If you keep Root Directory as the repo root you must override:
- **Build Command**: `cd sites/k-kut && npm run build`
- **Install Command**: `npm install` (runs at repo root; Vercel resolves workspaces)

---

## Environment variables

### Preview deployment — audio-only (minimum required)

The audio experience (K-KUT, mini-KUT, K-kUpId demos) depends **only** on
Supabase.  A Preview deployment works with these three variables:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | Set to the Preview URL or `https://k-kut.com` |

In Vercel → Project → Settings → Environment Variables, make sure each variable
has **Preview** (and **Development**) checked.

Stripe env vars are **intentionally omitted** from Preview.  Missing Stripe
configuration does not break the deploy or the audio paths:
- `/api/checkout/sovereign` redirects to `/pricing?checkout=not-configured`
- `/api/stripe/webhook` returns HTTP 200 with `{"received":true,"note":"…"}` and
  does nothing — so Stripe won't even need to be pointed at Preview URLs.

### Production deployment — full experience

All variables below must be set for a fully operational production deployment.
Add them in Vercel under the **Production** environment (or "All Environments").

**Supabase (required everywhere)**

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public, exposed to browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public, exposed to browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret — server-side only (notify sign-ups, webhook upserts) |

**Stripe (required in Production)**

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public, used in client-side Stripe.js |
| `STRIPE_SECRET_KEY` | Secret — never expose to browser |
| `STRIPE_WEBHOOK_SECRET` | Secret — signing secret for `/api/stripe/webhook` |
| `STRIPE_SOVEREIGN_PRICE_ID` | Stripe Price ID for the Sovereign Pass plan |

**Site**

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, e.g. `https://k-kut.com` |

---

## Stripe webhooks in Production

1. In Stripe Dashboard → Developers → Webhooks, create an endpoint:
   - URL: `https://k-kut.com/api/stripe/webhook`
   - Events: `checkout.session.completed` (add others as needed)
2. Copy the **Signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET` in
   Vercel (Production environment).
3. Trigger a test event from the Stripe Dashboard to verify the endpoint
   receives and verifies events correctly.

> **Do not point Stripe webhooks at ephemeral Preview URLs.**  Preview
> deployments use a different URL per commit; use the Production endpoint
> exclusively for Stripe.

---

## Environment detection

The site uses `process.env.VERCEL_ENV` (automatically set by Vercel) to
distinguish environments:

| `VERCEL_ENV` value | Meaning |
|---|---|
| `"production"` | Production deployment |
| `"preview"` | Preview (branch/PR) deployment |
| `"development"` | `vercel dev` local development |
| `undefined` | Plain `next dev` / local without Vercel CLI |

`isPreview()` in `lib/stripe.ts` returns `true` for `preview`, `development`,
and `undefined` so that local development also gets the graceful Stripe
no-op behaviour.

---

## Quick checklist

### Minimum for audio Preview

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set on Preview
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set on Preview
- [ ] `NEXT_PUBLIC_SITE_URL` set on Preview
- [ ] Vercel Root Directory → `sites/k-kut`

### Full Production

- [ ] All Supabase vars set on Production
- [ ] All Stripe vars set on Production
- [ ] Stripe webhook endpoint created and pointing at `https://k-kut.com/api/stripe/webhook`
- [ ] `STRIPE_WEBHOOK_SECRET` matches the Stripe Dashboard signing secret
