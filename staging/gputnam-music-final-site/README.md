# gputnam-music-final-site

**Production site for gputnammusic.com** — deployed via Vercel from `staging/gputnam-music-final-site/`.

## Template (locked — GTM PLT)

| Row | Zone | Content |
|-----|------|---------|
| 1   | Header (STI top row) | Amber nav — logo · links — BTI-filled slots (gtmplt) |
| 2   | Hero + Stream | Rotating hero image (left) · GPM Featured Playlist audio player (right) |
| 3   | T20 Grid | Top 20 streaming activities — live Supabase data |
| 4   | Footer (STO) | Links · copyright |

**MC-BOT** sits top-right, voice-activated (SpeechRecognition).  
Voice commands: `next` · `back` · `go` · `done/collapse` · `expand`

## Vercel Deployment

**Vercel project "Root Directory" must be set to:** `staging/gputnam-music-final-site`

In the Vercel dashboard:
1. Go to Project → Settings → General → Root Directory
2. Set to `staging/gputnam-music-final-site`
3. Framework: Next.js (auto-detected)

## Environment Variables (Vercel)

See `.env.example` for all required variables. Set these in Vercel → Settings → Environment Variables:

| Key | Required | Description |
|-----|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key for `lbzpfqarraegkghxwbah.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server-only) — for Creator Portal & crons |
| `CREATOR_SESSION_SECRET` | ✅ | JWT secret for creator portal sessions (generate: `openssl rand -hex 32`) |
| `NEXT_PUBLIC_WEBAUTHN_RP_ID` | ✅ | `gputnammusic.com` |
| `NEXT_PUBLIC_WEBAUTHN_ORIGIN` | ✅ | `https://gputnammusic.com` |
| `CRON_SECRET` | ✅ | Bearer token for cron job auth |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — 4-row GTM PLT template |
| `/artists` | GPM Artist roster |
| `/heroes` | Heroes page |
| `/gift` | Free Gift program |
| `/join` | Join / Sponsor tiers (KUB · KEZ) |
| `/contact` | Contact |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Use |
| `/herb-blog` | PIXIE's PIX (Jane Burton — herb blog + playlist) |
| `/creator/[brand]` | Biometric-gated Creator Portal |
| `/creator/enroll` | Admin enrollment |

## Local Dev

```bash
cd staging/gputnam-music-final-site
cp .env.example .env.local
# fill in .env.local values
npm install
npm run dev
```

