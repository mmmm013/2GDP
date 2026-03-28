# 🎵 Quick Start - Get Your App Running in 5 Minutes

## Your Supabase Project
✅ I already know your Supabase project:
- **Project ID:** `lbzpfqarraegkghxwbah`
- **URL:** `https://lbzpfqarraegkghxwbah.supabase.co`

## Super Simple Setup (Pick One)

### Option 1: Interactive Setup (EASIEST) ⭐

Just run this one command:

```bash
./scripts/quick-setup.sh
```

It will:
1. Ask you for your Supabase anon key (I'll tell you exactly where to find it)
2. Create your `.env.local` file automatically
3. Tell you the next steps

That's it!

### Option 2: Manual Setup (if you prefer)

1. **Copy the template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Get your Supabase anon key:**
   - Go to: https://supabase.com/dashboard/project/lbzpfqarraegkghxwbah/settings/api
   - Copy the **anon** key (looks like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

3. **Edit `.env.local`:**
   ```bash
   nano .env.local
   ```

4. **Fill in these values:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://lbzpfqarraegkghxwbah.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste your anon key here>
   ```

5. **Save and close**

## Test It Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 - you should see your app working!

## Deploy to Vercel

After local setup works, run:

```bash
./scripts/setup-vercel.sh
```

This will guide you through setting environment variables in Vercel.

**Or do it manually:**

1. Go to https://vercel.com/dashboard
2. Select your project → Settings → Environment Variables
3. Add these two variables:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`  
     **Value:** `https://lbzpfqarraegkghxwbah.supabase.co`
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     **Value:** (your anon key)
4. Select all environments (Production, Preview, Development)
5. Click Save for each
6. Go to Deployments tab → Click ⋯ on latest → Redeploy

## Where to Get Your Anon Key

**Direct link to your project's API settings:**
https://supabase.com/dashboard/project/lbzpfqarraegkghxwbah/settings/api

Look for the section "Project API keys" and copy the **anon** key.

## Need Help?

See detailed guides in the `docs/` folder:
- [ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) - Complete setup guide
- [VERCEL_SETUP.md](docs/VERCEL_SETUP.md) - Vercel deployment guide

## Quick Commands

```bash
# Setup environment variables (interactive)
./scripts/quick-setup.sh

# Verify your setup
./scripts/verify-env.sh

# Setup Vercel (interactive guide)
./scripts/setup-vercel.sh

# Test locally
npm run dev

# Build for production
npm run build
```

## That's It! 🎉

Your app should be running in under 5 minutes!
