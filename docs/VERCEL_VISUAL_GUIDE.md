# Visual Guide: Setting Environment Variables in Vercel

## Your Exact Values to Use:

Based on your Supabase project, here are the EXACT values you need:

```
NEXT_PUBLIC_SUPABASE_URL
https://lbzpfqarraegkghxwbah.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
[Get from: https://supabase.com/dashboard/project/lbzpfqarraegkghxwbah/settings/api]
```

## Step-by-Step Visual Guide

### 1. Go to Vercel Dashboard

```
URL: https://vercel.com/dashboard

┌─────────────────────────────────────────────────────┐
│  Vercel Dashboard                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Your Projects:                                     │
│                                                     │
│  📁 gputnam-music-final-site  <--- CLICK THIS      │
│  📁 other-project                                   │
│  📁 another-project                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Navigate to Environment Variables

```
┌─────────────────────────────────────────────────────┐
│  gputnam-music-final-site                          │
├─────────────────────────────────────────────────────┤
│  [Overview] [Deployments] [Analytics] [Settings]   │
│                                          ↑          │
│                                    CLICK HERE       │
└─────────────────────────────────────────────────────┘

Then in the sidebar:

┌──────────────────────┐
│  Settings            │
├──────────────────────┤
│  General             │
│  Domains             │
│  ► Environment Vars  │ <--- CLICK THIS
│  Git                 │
│  Functions           │
└──────────────────────┘
```

### 3. Add First Variable

```
┌─────────────────────────────────────────────────────┐
│  Environment Variables                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Add New]  <--- CLICK THIS                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Name                                               │
│  ┌───────────────────────────────────────────────┐ │
│  │ NEXT_PUBLIC_SUPABASE_URL                      │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Value                                              │
│  ┌───────────────────────────────────────────────┐ │
│  │ https://lbzpfqarraegkghxwbah.supabase.co     │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Environments                                       │
│  ☑ Production                                      │
│  ☑ Preview                                         │
│  ☑ Development                                     │
│                                                     │
│  [Save]  <--- CLICK THIS AFTER FILLING            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4. Add Second Variable

```
┌─────────────────────────────────────────────────────┐
│  Environment Variables                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ NEXT_PUBLIC_SUPABASE_URL (saved)               │
│                                                     │
│  [Add Another]  <--- CLICK THIS                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Name                                               │
│  ┌───────────────────────────────────────────────┐ │
│  │ NEXT_PUBLIC_SUPABASE_ANON_KEY                 │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Value                                              │
│  ┌───────────────────────────────────────────────┐ │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.......  │ │
│  │ (paste your full anon key here - very long)   │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Environments                                       │
│  ☑ Production                                      │
│  ☑ Preview                                         │
│  ☑ Development                                     │
│                                                     │
│  [Save]  <--- CLICK THIS                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5. Redeploy

```
┌─────────────────────────────────────────────────────┐
│  [Overview] [Deployments] [Analytics] [Settings]   │
│               ↑                                     │
│          CLICK HERE                                 │
└─────────────────────────────────────────────────────┘

Then:

┌─────────────────────────────────────────────────────┐
│  Deployments                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Production                                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ copilot/fix-client-side-exception           │  │
│  │ ● Ready  2 min ago                      [⋯] │ │
│  │                                          ↑   │  │
│  └──────────────────────────────────────── │ ──┘  │
│                                             │      │
│                                    CLICK THE DOTS  │
│                                                     │
│  Then select: [Redeploy]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6. Confirmation

```
┌─────────────────────────────────────────────────────┐
│  Redeploy to Production?                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  This will trigger a new deployment with the       │
│  latest environment variables.                     │
│                                                     │
│  [Cancel]  [Redeploy]                             │
│              ↑                                     │
│         CLICK HERE                                 │
└─────────────────────────────────────────────────────┘
```

### 7. Wait for Deployment

```
┌─────────────────────────────────────────────────────┐
│  Building...                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ● Building    [▓▓▓▓▓▓▓░░░] 70%                   │
│                                                     │
│  Wait 1-2 minutes...                               │
│                                                     │
└─────────────────────────────────────────────────────┘

Then when done:

┌─────────────────────────────────────────────────────┐
│  ✓ Ready                                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Visit]  <--- CLICK TO SEE YOUR SITE              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Checklist

Use this to track your progress:

```
□ Opened Vercel dashboard
□ Selected gputnam-music-final-site project
□ Clicked Settings → Environment Variables
□ Added NEXT_PUBLIC_SUPABASE_URL
   Value: https://lbzpfqarraegkghxwbah.supabase.co
   ☑ All three environments checked
   Clicked Save
□ Added NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: (your anon key from Supabase)
   ☑ All three environments checked
   Clicked Save
□ Went to Deployments tab
□ Clicked ⋯ on latest deployment
□ Selected Redeploy
□ Confirmed Redeploy
□ Waited for deployment to complete
□ Clicked Visit
□ Site loads without "Application error"
□ Checked browser console - no errors
```

## That's It!

Your deployment should now be working perfectly! 🎉
