# Deployment Guide for G Putnam Music (GPMC)

## Vercel Project Settings (Critical)

In **Vercel → Project → Settings → General**:

| Setting | Value |
|---|---|
| **Root Directory** | `./` (repo root) |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |

> ⚠️ If Root Directory is set to a subfolder (e.g. `staging/gputnam-music-final-site/`),
> Vercel will deploy an older or incomplete UI. Always keep it at the repo root.

---

## Security (Critical — Read First)

**Never commit private keys or secrets** to this repository.

Files that must never be committed:
- `*.p8` (Apple MusicKit / APNs keys)
- `*.pem`, `*.key` (certificates / private keys)
- `.env`, `.env.local`, `.env.production`

These patterns are now in `.gitignore`.

**If a key has already been committed:**
1. Remove the file from the repo (commit the deletion).
2. **Revoke / rotate** the key immediately at the issuing provider (Apple Developer, Stripe, etc.).
3. Update production secrets in Vercel env vars with the new key material.
4. Consider a git history rewrite (`git filter-repo`) if the repo is public.

> ⚠️ **Action required:** Keys committed in this repo (`AuthKey_39DJJ7BT9X.p8`,
> `AuthKey_678VL857AT.p8`) have been removed from the repository. These keys **must be
> treated as compromised** and rotated immediately at the issuing provider (Apple Developer
> portal) if not already done. Update any Vercel environment variables or server configs
> that referenced the old keys with the new credentials.

---

## Audio: Single Source of Truth

All audio in this application is served from the **Supabase `tracks` public bucket**.

### Canonical resolver: `lib/audio/resolveAudioUrl.ts`

This module is the **only place** that knows how to turn a track key or URL into a
playable audio URL. Both `FeaturedPlaylists` and `GlobalPlayer` import and use it.

Resolution rules (applied in order):
1. Absolute `http(s)://` URL → returned as-is.
2. URL already containing `/storage/v1/object/public/` → returned as-is.
3. Everything else (filename / track key) → basename extracted and resolved into:
   `NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL + filename`

### Track key convention

Track `src` values stored in component config are **bare filenames** (track keys):

```
kleigh--reflections.mp3          ✅ correct
/pix/kleigh--reflections.mp3     ❌ do not use — local path won't survive deploy
https://...supabase.co/...       ✅ also fine — resolver passes through as-is
```

### Adding new tracks

1. Upload the `.mp3` to Supabase Storage → `tracks` bucket (public).
2. Add the bare filename as the `src` in the playlist config inside `FeaturedPlaylists.tsx`
   (or the relevant component).
3. No resolver changes needed.

---

## Required Environment Variables

Copy `.env.example` to `.env.local` for local development.

### Supabase (Required)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here   # server-side only, keep secret
```

### Audio (Required for production audio playback)

```bash
# Base URL for the Supabase tracks bucket.
# Format: https://<project-ref>.supabase.co/storage/v1/object/public/tracks/
NEXT_PUBLIC_SUPABASE_TRACKS_BASE_URL=https://lbzpfqarraegkghxwbah.supabase.co/storage/v1/object/public/tracks/
```

> If this variable is not set, the resolver falls back to the hardcoded project ref
> (`lbzpfqarraegkghxwbah`). Set it explicitly in Vercel so deploys are not coupled
> to a specific project ref in source code.

### Stripe (Optional)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
STRIPE_SECRET_KEY=sk_live_or_test_key   # keep secret
```

### Deployment URL (Optional)

```bash
NEXT_PUBLIC_VERCEL_URL=your-app.vercel.app
```

---

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard.
2. Navigate to **Settings → Environment Variables**.
3. Add each variable with the appropriate value.
4. Select the environments (Production, Preview, Development).
5. Click **Save**, then redeploy.

---

## Storage Buckets (Supabase)

Ensure the following public storage buckets exist in your Supabase project:

| Bucket | Visibility | Purpose |
|---|---|---|
| `tracks` | Public | All audio files (canonical source) |
| `videos` | Public | Video files |
| `audio` | Public | (Legacy; prefer `tracks`) |

---

## Local Development

```bash
cp .env.example .env.local
# Fill in .env.local with real credentials
npm install
npm run dev
```

## Build Verification

```bash
npm run build
```

The build should complete without errors even if optional environment variables are absent.

