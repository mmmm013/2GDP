# K-KUT Marketing Site

Dark, minimal/futuristic marketing site for **K-KUT** — the exact-excerpt audio sharing invention by G Putnam Music, LLC.

**Live domain:** [k-kut.com](https://k-kut.com)  
**Stack:** Next.js 15 · Tailwind CSS · Supabase · Stripe · Vercel

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Make Moments, How it works, Why it's different |
| `/invention` | The Invention — 3 pillars, comparison, Actions |
| `/demo` | Demo — Step-by-step flow, feelings grid, demo scenarios |
| `/pricing` | Pricing — 4 plans, status, Get Notified / checkout |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/robots.txt` | Auto-generated via `app/robots.ts` |
| `/sitemap.xml` | Auto-generated via `app/sitemap.ts` |

---

## Pricing Plans

| Level | Action | Price | Status |
|---|---|---|---|
| mK Single | Quick Tap | $1.99/mo | Re-Syncing Audio (Coming back online) |
| K-KUT Duo | Double Tap | $4.99/mo | Re-Syncing Audio (Coming back online) |
| PIX Stream | Long Press | $9.99/mo | Re-Syncing Audio (Coming back online) |
| Sovereign Pass | Hold My Heart | $24.99/mo | **Live** |

Plans with status "Re-Syncing Audio" show a **Get Notified** form (email capture → Supabase).  
Sovereign Pass shows **Get Sovereign Pass** → Stripe Checkout.

---

## Deploy to Vercel

### 1. Create a new Vercel project

In the Vercel dashboard:
1. Click **Add New → Project**
2. Import the `mmmm013/GPMC` repository
3. Set **Root Directory** to `sites/k-kut`
4. Framework: **Next.js** (auto-detected)

### 2. Connect the domain

1. In your Vercel project → **Settings → Domains**
2. Add `k-kut.com` (apex) — Vercel will guide you through DNS
3. Add `www.k-kut.com` — set it to **redirect to** `k-kut.com` (permanent 308)

**DNS records (if using external DNS):**
```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

**Canonical host:** `https://k-kut.com` (no www)  
The `vercel.json` in this directory includes a rule to redirect `www.k-kut.com` → `k-kut.com`.

### 3. Set environment variables

In Vercel project → **Settings → Environment Variables**, add:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | optional | Stripe publishable key |
| `STRIPE_SECRET_KEY` | optional | Stripe secret key (server only, never expose) |
| `STRIPE_SOVEREIGN_PRICE_ID` | optional | Stripe Price ID for Sovereign Pass |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical URL (defaults to `https://k-kut.com`) |

> **Note:** If Supabase env vars are not set, the Get Notified form will gracefully return an error with a helpful message. If Stripe env vars are not set, the checkout route redirects to `/pricing?checkout=not-configured`.

### 4. Supabase: create the notify_signups table

Run this in your Supabase SQL editor:

```sql
create table if not exists notify_signups (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  note        text,
  source      text default 'k-kut.com',
  created_at  timestamptz default now(),
  constraint notify_signups_email_unique unique (email)
);

-- Enable Row Level Security
alter table notify_signups enable row level security;

-- Allow service role to insert (server-side only)
create policy "service_insert" on notify_signups
  for insert with check (true);
```

### 5. Deploy

Push to the branch connected to your Vercel project. Vercel auto-deploys on push.

```bash
git push origin main
```

---

## Local Development

```bash
cd sites/k-kut
npm install
cp .env.example .env.local
# Fill in .env.local with your values
npm run dev
# → http://localhost:3000
```

---

## Design System

Design tokens are defined as CSS variables in `app/globals.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#030712` | Page background |
| `--surface` | `#0d1117` | Card/section background |
| `--border` | `#1a2332` | Default border |
| `--text` | `#e2e8f0` | Primary text |
| `--text-muted` | `#64748b` | Secondary text |
| `--accent` | `#00e5ff` | Electric cyan — primary accent |
| `--accent-glow` | `rgba(0,229,255,0.15)` | Glow overlays |

Tailwind tokens mirror these in `tailwind.config.ts` under the `kkut` color key.

---

## Link from gputnammusic.com

Add a nav/footer link on `gputnammusic.com` pointing to `https://k-kut.com`:

```
K-KUT → https://k-kut.com
```

For attribution tracking, append UTM parameters:
```
https://k-kut.com?utm_source=gputnammusic&utm_medium=nav&utm_campaign=kkut_launch
```

---

## Notes

- This site is **self-contained** in `sites/k-kut/`. It does not affect the root GPMC app.
- The root `app/` directory remains the `gputnammusic.com` Vercel project.
- Vercel project for K-KUT should have **Root Directory = `sites/k-kut`** in project settings.
