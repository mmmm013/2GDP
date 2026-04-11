# K-KUT Deployment Reference

## Vercel Project

| Setting | Value |
|---|---|
| **Vercel project name** | `k-kut` |
| **Vercel team** | `g-putnam-music` |
| **Connected repo** | `mmmm013/GPMC` |
| **Root Directory** | `sites/k-kut` ← **critical — must be set** |
| **Production branch** | `main` |
| **Framework preset** | Next.js (auto-detected) |
| **Build command** | `npm run build` (default) |
| **Output directory** | `.next` (default) |

> **⚠️ Root Directory is the #1 misconfiguration risk.**
> `mmmm013/GPMC` is a monorepo. Vercel must be rooted at `sites/k-kut`,
> not the repo root. If this is blank or set to `.`, the wrong Next.js
> app deploys and all API routes / Stripe / Supabase wiring will break.

---

## Required Environment Variables

Set all of the following in **Vercel → k-kut → Settings → Environment Variables**
for **Production**, **Preview**, and **Development** environments.

### Supabase

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Public — safe in browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Public — safe in browser |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | **Secret** — server-side only, never expose client-side |

### Stripe

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | Public — safe in browser |
| `STRIPE_SECRET_KEY` | ✅ Yes | **Secret** — server-side only |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ Strongly recommended | Required if webhooks are used for entitlement activation (e.g. "Hold My Heart" pass). Without this, payments may succeed but access will not be granted. |

### Price IDs (recommended)

If the application code reads price IDs from environment variables (rather than
hardcoding them), add explicit vars such as:

```
STRIPE_PRICE_ID_199
STRIPE_PRICE_ID_499
STRIPE_PRICE_ID_999
STRIPE_PRICE_ID_2499
```

Check `sites/k-kut` API routes for the exact names expected.

### Site URL

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | Set to `https://k-kut.com` in production |

---

## Setting Up Locally

```bash
cd sites/k-kut
cp .env.example .env.local
# Fill in .env.local with real values — never commit secrets
npm install
npm run dev
```

---

## Troubleshooting: "Failed to fetch"

Work through these checks in order:

### 1. Root Directory mismatch (most common)
- Go to **Vercel → k-kut → Settings → General → Root Directory**.
- Must be exactly `sites/k-kut`.
- If blank or wrong, set it, then **redeploy**.

### 2. Missing environment variables
- Go to **Vercel → k-kut → Settings → Environment Variables**.
- Confirm all required vars above are present and scoped to the right environments.
- After adding/changing vars, always **redeploy** — Vercel bakes env vars at build time for `NEXT_PUBLIC_*` vars.

### 3. CORS / wrong API routes
- `NEXT_PUBLIC_SITE_URL` must match the actual deployment URL.
- If the app constructs API URLs from `NEXT_PUBLIC_SITE_URL` and that value is
  wrong, all fetch calls will hit the wrong origin and fail with CORS or 404.

### 4. Stripe webhook not firing
- Confirm `STRIPE_WEBHOOK_SECRET` is set.
- In the Stripe Dashboard, confirm the webhook endpoint points to
  `https://k-kut.com/api/stripe/webhook` (or whatever route the app uses).
- Check the Stripe Dashboard → Developers → Webhooks for delivery failures.

### 5. Supabase RLS blocking requests
- Anon/public routes rely on Row-Level Security policies allowing anon reads.
- Server routes (purchases, entitlements) require `SUPABASE_SERVICE_ROLE_KEY`.
- Check Supabase → Authentication → Policies if data calls return empty arrays.

---

## Deployment Discipline

- **Never change Root Directory without an explicit architecture review.**
- `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are secrets — do not
  log, expose in client code, or commit to the repo.
- Preview deployments should use **test-mode** Stripe keys
  (`pk_test_...` / `sk_test_...`).
- Production deployments must use live-mode keys.
- Webhook secret in production must match the live Stripe webhook endpoint.
