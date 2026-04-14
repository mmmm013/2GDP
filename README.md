# G Putnam Music (GPMC)

Public-facing Next.js application for [G Putnam Music](https://gputnammusic.com).

## Homepage & Source of Truth

| Item | Value |
|---|---|
| **Homepage route** | `app/page.tsx` |
| **Vercel Root Directory** | `./` (repo root) |
| **Framework** | Next.js App Router |

> Do **not** deploy any `staging/` sub-application from this repo as the Vercel root.
> All production traffic must come from the repo-root `app/` directory.

## Deployment Isolation (Critical)

This repository controls multiple Vercel projects. Use only the guarded deploy scripts below.

- Flagship (`gputnammusic.com`): `npm run deploy:flagship:prod`
- K-KUT (`k-kut.com`): `npm run deploy:kkut:prod`
- Hygiene check (blocks unsafe raw deploy commands): `npm run deploy:hygiene`

These scripts force a relink to the expected Vercel project and fail if the link does not match.
The K-KUT script deploys from repo root with pinned Vercel project/org IDs because the
`k-kut` Vercel project Root Directory is `sites/k-kut`.
Both deploy scripts also require an explicit confirmation token (`DEPLOY_CONFIRM`) and will
abort if it is missing or wrong.

Do not run bare deploy commands like `vercel --prod` from repo root when targeting K-KUT.

## Required Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL` | ✅ | Canonical audio bucket base URL (see below) |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Service role key (never expose client-side) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | optional | Stripe publishable key |
| `STRIPE_SECRET_KEY` | optional | Stripe secret key (server only) |

See `.env.example` for the full template and `DEPLOYMENT.md` for detailed setup instructions.

## Audio Architecture

All audio is served from one canonical source: the **Supabase `tracks` public bucket**.

### Resolver: `lib/audio/resolveAudioUrl.ts`

Single source of truth for converting any track reference into a playable URL:

- Absolute `http(s)` URL → pass through unchanged.
- Supabase storage path → pass through unchanged.
- Bare filename / track key → resolved via `NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL`.

Both `FeaturedPlaylists` and `GlobalPlayer` use this resolver. **Never hardcode Supabase
project refs or `/pix/...` paths in component files.**

### Canonical base URL

```
NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL=https://<project-ref>.supabase.co/storage/v1/object/public/tracks/
```

## Local Development

```bash
cp .env.example .env.local
# Fill in real values in .env.local
npm install
npm run dev
```

## Security

- **Never commit** private keys (`*.p8`, `*.pem`, `*.key`) or `.env` files.
  These patterns are enforced in `.gitignore`.
- If a secret is ever committed: remove it, **revoke/rotate it immediately** at the provider,
  and update Vercel environment variables with the new credentials.
- Store all secrets as Vercel environment variables, never in source code.

## Build

```bash
npm run build   # must pass with zero TypeScript or Next.js errors
```

## Revenue Funnel Smoke

Run the live money-path checks locally:

```bash
npm run perf:http:prod
npm run perf:e2e:prod
npm run perf:prod
```

The scheduled/manual GitHub Actions smoke is defined in `.github/workflows/revenue-funnel-prod-smoke.yml`
and runs these checks against live production URLs so redirect, runtime, and load-budget regressions are caught
without relying on a fresh deploy.

## Creator Auth Validation

Run live production credential matrix validation for creator password auth (KLEIGH, MSJ, ZG, LGM, PIXIE):

```bash
npm run creator:auth:validate:prod
```

Run environment parity checks (no credential values logged) for preview/development:

```bash
npm run creator:auth:validate:preview
npm run creator:auth:validate:dev
```

Run all three checks in sequence:

```bash
npm run creator:auth:validate:all
```

Reports are written under `handoff/` and contain only status metadata, not secret values.

