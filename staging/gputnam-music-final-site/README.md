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

## Environment Variables (Vercel)

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for `lbzpfqarraegkghxwbah.supabase.co` |

## Local Dev

```bash
cd staging/gputnam-music-final-site
npm install
npm run dev
```

