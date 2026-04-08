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
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL (canonical — used by client + server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (safe for client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server-only) — for Creator Portal, crons & signed audio URLs |
| `CREATOR_SESSION_SECRET` | ✅ | JWT secret for creator portal sessions (generate: `openssl rand -hex 32`) |
| `NEXT_PUBLIC_WEBAUTHN_RP_ID` | ✅ | `gputnammusic.com` |
| `NEXT_PUBLIC_WEBAUTHN_ORIGIN` | ✅ | `https://gputnammusic.com` |
| `CRON_SECRET` | ✅ | Bearer token for cron job auth |

> **Important:** Never hardcode `NEXT_PUBLIC_SUPABASE_URL` or any key in source code.  
> The homepage player shows a clear **"Stream Misconfigured"** message if env vars are absent.

## Streaming Architecture

All audio playback is routed through the Supabase Edge Function **`get-stream-url`**:

```
Client → HomeFP player → supabase.functions.invoke('get-stream-url', { track_id })
                       → signed URL (5 min TTL) → <audio> element
```

- No raw public storage URLs are exposed in client-side HTML.
- Creator asset audio (PIXIE's playlist on `/herb-blog`) routes through `/api/stream-asset`.
- Signed URLs are resolved **on demand** (when the user presses PLAY), never at page load.

### Player States (HomeFP)

| State | Trigger | User sees |
|-------|---------|-----------|
| Loading | Tracks fetching from Supabase | "Loading tracks…" |
| Ready | Tracks loaded | Track title + artist + PLAY controls |
| Misconfigured | `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` missing | Warning + healthcheck link |
| Empty catalog | No tracks in DB | "No tracks in catalog yet." |
| Playback error | `get-stream-url` fails | Inline error message |

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
| `/herb-blog` | PIXIE's PIX (herb blog + playlist) |
| `/creator/[brand]` | Biometric-gated Creator Portal |
| `/creator/enroll` | Admin enrollment |
| `/api/healthcheck` | Streaming wiring status (env + function reachability) — for Vercel monitoring |
| `/api/stream-asset` | Signed URL proxy for published creator assets |

## Healthcheck

```
GET /api/healthcheck
```

Returns JSON without leaking secret values:

```json
{
  "status": "ok",
  "checks": {
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "set",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "set",
      "SUPABASE_SERVICE_ROLE_KEY": "set"
    },
    "supabase_function": {
      "name": "get-stream-url",
      "reachable": true,
      "detail": "HTTP 200"
    }
  },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

- `status: "ok"` → HTTP 200 — streaming should work
- `status: "degraded"` → HTTP 200 — env set but function unreachable
- `status: "misconfigured"` → HTTP 503 — missing env vars

Add `https://www.gputnammusic.com/api/healthcheck` as an uptime check in Vercel monitoring.

## Local Dev

```bash
cd staging/gputnam-music-final-site
cp .env.example .env.local
# fill in .env.local values (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, etc.)
npm install
npm run dev
```

