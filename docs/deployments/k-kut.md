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
| `STRIPE_WEBHOOK_SECRET` | ✅ Yes | Required for `/api/stripe/webhook` — without this, Sovereign Pass payments succeed in Stripe but the entitlement record is never written and access is never granted. |
| `STRIPE_SOVEREIGN_PRICE_ID` | ✅ Yes | Stripe Price ID for the Sovereign Pass ($24.99/mo). Read by `/api/checkout/sovereign`. |

### Price IDs — other tiers (rolling-out plans, add when live)

```
STRIPE_PRICE_ID_199    # mK Single
STRIPE_PRICE_ID_499    # K-KUT Duo
STRIPE_PRICE_ID_999    # PIX Stream
```

### Stripe Webhook — endpoint setup

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**.
2. URL: `https://k-kut.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy the **Signing secret** (`whsec_...`) → set as `STRIPE_WEBHOOK_SECRET` in Vercel.
5. For Preview environments, create a separate test-mode webhook pointing to your preview URL.

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

## Database Migrations

Run migrations after every merge to `main`:

```bash
PROJ=vwlzubxshjjonabpeagd
supabase db push --project-ref $PROJ
```

Key tables created by the migration stack:
- `notify_signups` — email capture for rolling-out plans (`/api/notify`)
- `sovereign_subscriptions` — Stripe Sovereign Pass entitlement records (`/api/stripe/webhook`)
- `k_kut_assets` — audio asset registry (core audio pipeline)
- `audit_log` — fire-and-forget action log for edge functions

---

## Audio — Supabase Edge Functions

Deploy all four audio edge functions after every merge to `main`:

```bash
PROJ=vwlzubxshjjonabpeagd

supabase functions deploy get-audio-url  --project-ref $PROJ
supabase functions deploy play-k-kut     --project-ref $PROJ
supabase functions deploy play-m-kut     --project-ref $PROJ
supabase functions deploy play-k-kupid   --project-ref $PROJ
```

Run the kuts QC storage migration (idempotent — safe to re-run):

```bash
supabase db push --project-ref $PROJ
```

---

## Audio — AUDIO Bucket File Manifest

All audio files must be uploaded to the `AUDIO` Supabase Storage bucket at
project `vwlzubxshjjonabpeagd` **before** the `/demo` page will play audio.
The bucket is private — files are served via signed URLs generated by
`get-audio-url`.

### K-KUT (KK) — exact section excerpts

Path convention: `k-kut/<title-slug>-<section>.mp3`

| File | Track | Section |
|---|---|---|
| `k-kut/love-renews-Ch1.mp3` | LOVE RENEWS | Chorus 1 |
| `k-kut/starts-with-me-V2.mp3` | STARTS WITH ME | Verse 2 |
| `k-kut/still-here-BR.mp3` | STILL HERE | Bridge |

### mini-KUT (mK) — master-track demo audio

Path convention: `mk/<title-slug>-master.mp3`

| File | Track |
|---|---|
| `mk/love-renews-master.mp3` | LOVE RENEWS |
| `mk/starts-with-me-master.mp3` | STARTS WITH ME |
| `mk/still-here-master.mp3` | STILL HERE |

> Each `mk/*-master.mp3` is the master-track reference clip played in the mK
> BOT demo header. Individual per-phrase mK clips follow the same convention
> with the phrase slug replacing `master`, e.g. `mk/love-renews-rise-up.mp3`.

### K-kUpId (KPD) — romance-level excerpts

Path convention: `kpd/<level>-<slug>.mp3`

| File | Level | Track |
|---|---|---|
| `kpd/interest-find-me.mp3` | Interest | FIND ME |
| `kpd/date-one-night.mp3` | Date | ONE NIGHT |
| `kpd/love-love-renews.mp3` | Love | LOVE RENEWS |
| `kpd/sex-burn.mp3` | Sex | BURN |
| `kpd/forever-forever-yours.mp3` | Forever | FOREVER YOURS |

---

## Deployment Discipline

- **Never change Root Directory without an explicit architecture review.**
- `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are secrets — do not
  log, expose in client code, or commit to the repo.
- Preview deployments should use **test-mode** Stripe keys
  (`pk_test_...` / `sk_test_...`).
- Production deployments must use live-mode keys.
- Webhook secret in production must match the live Stripe webhook endpoint.
