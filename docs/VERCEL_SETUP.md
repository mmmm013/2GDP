# Vercel Deployment Guide

## 🚀 Setting Environment Variables in Vercel

This guide shows you **exactly** how to configure environment variables in Vercel so your deployment works.

## Step-by-Step Instructions

### Step 1: Access Your Vercel Project

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Log in to your account
3. Find and click on your project: **gputnam-music-final-site**

### Step 2: Navigate to Environment Variables

1. In your project dashboard, click the **Settings** tab at the top
2. In the left sidebar, click **Environment Variables**

### Step 3: Get Your Supabase Credentials

Before adding variables, get your Supabase credentials:

1. Open a new tab and go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click the **Settings** gear icon in the left sidebar
4. Click **API** in the settings menu
5. You'll see two values we need:
   - **Project URL** (under "Configuration")
   - **anon public** key (under "Project API keys")

Keep this tab open - you'll copy these values in the next step.

### Step 4: Add Environment Variables

Now, back in the Vercel tab, add each variable:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL

1. Click **Add New** button (or **Add Another** if you've already added one)
2. In the **Name** field, type: `NEXT_PUBLIC_SUPABASE_URL`
3. In the **Value** field, paste your Supabase Project URL
   - Example: `https://abcdefghijklmnop.supabase.co`
4. Select **which environments** this applies to:
   - ✅ Check **Production**
   - ✅ Check **Preview**  
   - ✅ Check **Development**
5. Click **Save**

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

1. Click **Add Another**
2. In the **Name** field, type: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In the **Value** field, paste your Supabase anon public key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (will be much longer)
4. Select environments:
   - ✅ Check **Production**
   - ✅ Check **Preview**
   - ✅ Check **Development**
5. Click **Save**

#### Optional: Stripe Variables

If you're using payment features, add these too:

**NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:**
1. Click **Add Another**
2. Name: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Value: Your Stripe publishable key (from [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys))
4. Select all environments
5. Click **Save**

**STRIPE_SECRET_KEY:**
1. Click **Add Another**
2. Name: `STRIPE_SECRET_KEY`
3. Value: Your Stripe secret key
4. Select all environments
5. Click **Save**

### Step 5: Redeploy Your Application

After adding all environment variables, you need to redeploy:

1. Click the **Deployments** tab at the top
2. Find your most recent deployment (at the top of the list)
3. Click the **⋯** (three dots) menu button on the right
4. Select **Redeploy**
5. Confirm by clicking **Redeploy** again

Wait for the deployment to complete (usually 1-2 minutes).

### Step 6: Verify It Works

1. Once deployment is complete, click **Visit** to open your site
2. The page should load without the "Application error" message
3. Open browser DevTools (F12) and check the Console tab
4. You should see: `"🎵 Connecting to G Putnam Archives (tracks)..."`
5. If you have data in your Supabase database, music features should work

## 📋 Quick Reference: Required Variables

Copy these exact names when adding to Vercel:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Optional (for payment features):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
```

## 🎯 Visual Guide

Here's what the Environment Variables page looks like:

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Name: NEXT_PUBLIC_SUPABASE_URL                        │
│  Value: https://abcdefghijklmnop.supabase.co           │
│  Environments: ☑ Production ☑ Preview ☑ Development   │
│  [Save]                                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Name: NEXT_PUBLIC_SUPABASE_ANON_KEY                   │
│  Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...        │
│  Environments: ☑ Production ☑ Preview ☑ Development   │
│  [Save]                                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## ⚠️ Common Mistakes to Avoid

1. **Typos in variable names** - Copy the exact names from this guide
2. **Extra spaces** - Don't add spaces before/after the value
3. **Quotes around values** - Don't wrap values in quotes
4. **Forgetting to redeploy** - Changes only apply after redeploying
5. **Wrong environment selected** - Make sure all three are checked

## 🔍 Troubleshooting

### "Environment variables not applied"

**Solution:** Make sure you selected all three environments (Production, Preview, Development) when adding each variable.

### "Still showing application error after redeploy"

**Solution:**
1. Double-check variable names are exactly correct (case-sensitive)
2. Verify values don't have extra spaces or quotes
3. Wait a minute and try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check Vercel deployment logs for errors

### "Variables work in development but not production"

**Solution:** Make sure "Production" environment is checked for all variables.

## ✅ Verification Checklist

After completing all steps:

- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- [ ] All environments (Production, Preview, Development) are checked
- [ ] Saved each variable
- [ ] Redeployed the application
- [ ] Deployment completed successfully
- [ ] Visited the site and it loads without errors
- [ ] Checked browser console - no Supabase errors

## 🎉 Success!

Once your checklist is complete, your deployment should be working perfectly!

If you need more help, see:
- [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) - Complete setup guide
- [DEPLOYMENT.md](../DEPLOYMENT.md) - General deployment information
- [Vercel Docs](https://vercel.com/docs/concepts/projects/environment-variables) - Official documentation
