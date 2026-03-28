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

