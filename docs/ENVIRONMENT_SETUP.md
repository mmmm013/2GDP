# Environment Variables Setup Guide

This guide will help you configure environment variables for the G Putnam Music application.

## 🚀 Quick Start (Recommended)

**The easiest and safest way** is to use our interactive setup wizard:

```bash
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

The wizard will:
- ✅ Guide you through each required variable
- ✅ Validate your inputs
- ✅ Create a properly formatted `.env.local` file
- ✅ Provide help links for finding values

After setup, verify everything is correct:

```bash
chmod +x scripts/verify-env.sh
./scripts/verify-env.sh
```

## 📋 Required Environment Variables

### 1. Supabase Configuration (Required)

These variables are **required** for the application to work properly.

#### `NEXT_PUBLIC_SUPABASE_URL`
Your Supabase project URL.

**How to find it:**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy the **Project URL** (under "Project Configuration")

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
Your Supabase anonymous (public) key.

**How to find it:**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy the **anon public** key (under "Project API keys")

**Example:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjg0MzIwMCwiZXhwIjoxOTQ4NDE5MjAwfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 2. Stripe Configuration (Optional)

These are only needed if you want payment features enabled.

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
Your Stripe publishable key.

**How to find it:**
1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key**
3. Use test keys (starting with `pk_test_`) for development
4. Use live keys (starting with `pk_live_`) for production

**Example:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz
```

#### `STRIPE_SECRET_KEY`
Your Stripe secret key (keep this secure!).

**How to find it:**
1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (you may need to reveal it)
3. Use test keys (starting with `sk_test_`) for development
4. Use live keys (starting with `sk_live_`) for production

**Example:**
```
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz
```

## 🔧 Manual Setup

If you prefer to set up manually:

1. **Copy the template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`:**
   ```bash
   nano .env.local
   # or use your preferred editor
   ```

3. **Fill in your values:**
   ```env
   # Supabase (Required)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Stripe (Optional)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   
   # Optional: deployment URL
   NEXT_PUBLIC_VERCEL_URL=your-app.vercel.app
   ```

4. **Verify your setup:**
   ```bash
   ./scripts/verify-env.sh
   ```

## ☁️ Deploying to Vercel

After setting up locally, you need to set the same environment variables in Vercel:

### Step-by-Step:

1. **Go to Vercel Dashboard:**
   - Navigate to [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project (2GDP)

2. **Open Environment Variables Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add each variable:**
   - Click **Add New** button
   - Enter the **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the **Value** (same as in your `.env.local`)
   - Select environments:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

4. **Required variables to add:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (if using Stripe)
   - `STRIPE_SECRET_KEY` (if using Stripe)

5. **Redeploy:**
   - After adding all variables, redeploy your application
   - Go to **Deployments** tab
   - Click the ⋯ menu on your latest deployment
   - Click **Redeploy**

### Screenshot Guide:

![Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🧪 Testing Your Setup

### Local Testing:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**What to check:**
- ✅ Page loads without "Application error" message
- ✅ No Supabase errors in browser console
- ✅ Music features work (if data is in your database)

### Build Testing:

```bash
# Test production build
npm run build
npm start
```

## 🔒 Security Best Practices

### DO:
- ✅ Use different keys for development and production
- ✅ Keep `.env.local` in `.gitignore` (already configured)
- ✅ Store production keys only in Vercel dashboard
- ✅ Use Stripe test keys during development
- ✅ Rotate keys if they're ever exposed

### DON'T:
- ❌ Commit `.env.local` to Git
- ❌ Share your secret keys in chat/email
- ❌ Use production keys in development
- ❌ Expose `STRIPE_SECRET_KEY` publicly
- ❌ Push keys to public repositories

## 🐛 Troubleshooting

### "Application error: a client-side exception has occurred"

**Cause:** Missing or incorrect Supabase environment variables.

**Solution:**
1. Verify variables are set: `./scripts/verify-env.sh`
2. Check values match your Supabase dashboard
3. Ensure no extra spaces or quotes in values
4. Restart dev server after changing `.env.local`

### "Failed to fetch" or "CORS error"

**Cause:** Supabase URL is incorrect or CORS not configured.

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check Supabase project is active
3. Verify storage buckets are public (if using media)

### "TypeError: Cannot read property 'xxx' of undefined"

**Cause:** Environment variable not loaded correctly.

**Solution:**
1. Ensure variable name starts with `NEXT_PUBLIC_` for client-side use
2. Restart dev server after changing `.env.local`
3. Clear Next.js cache: `rm -rf .next`

### Variables work locally but not on Vercel

**Cause:** Variables not set in Vercel dashboard.

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add all required variables
3. Select all environments (Production, Preview, Development)
4. Redeploy your application

## 📞 Need Help?

If you're still having issues:

1. Check the [DEPLOYMENT.md](../DEPLOYMENT.md) guide
2. Review [Supabase documentation](https://supabase.com/docs)
3. Review [Vercel documentation](https://vercel.com/docs)
4. Open an issue in the repository

## ✅ Checklist

Use this checklist to ensure everything is set up correctly:

- [ ] Ran `./scripts/setup-env.sh` successfully
- [ ] Verified with `./scripts/verify-env.sh`
- [ ] Tested locally with `npm run dev`
- [ ] Production build works: `npm run build`
- [ ] Set variables in Vercel dashboard
- [ ] Redeployed application on Vercel
- [ ] Verified deployment works at your-app.vercel.app
- [ ] Confirmed no errors in browser console
- [ ] Music/database features working (if applicable)

**Congratulations! Your environment is fully configured! 🎉**
