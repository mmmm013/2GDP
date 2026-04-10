# Repository Roles — GPMC-BIZ-MSC

> **Canonical name for this repo: GPMC-BIZ-MSC**
> GitHub repository: `mmmm013/GPMC`
> This document is the authoritative boundary contract for the entire GPMx ecosystem.

---

## Hard Domain Separation — IN STONE

| Layer | Repo / Platform | Domain | Music? |
|---|---|---|---|
| **2GDP / The Vektor** | `mmmm013/2GDP` | 4PE engine, KKr, Business Konsulting, Admin Platform (4PE per-industry) | ❌ NEVER |
| **GPMC-BIZ-MSC** (this repo) | `mmmm013/GPMC` | All KUTs + Derivatives + PIX + Jewelry + Inventions | ✅ Only |
| **GPMDs** | `gputnam-music-final-site` + mirrors | Consumer-facing music destinations | ✅ Only |

**2GDP is off-limits to all music industry work.**
2GDP = The Vektor = 4PE = KKr = Business Konsulting = Admin Platform.
No music code, no music assets, no music APIs ever live in 2GDP.

---

## GPMC-BIZ-MSC (this repo)

This repository is the canonical **BTI-in-STI-Slot** hub for all GPMx music and music-adjacent products.

It owns:

- **K-KUT** — exact-excerpt audio (section-based, ASCAP-compliant)
- **mini-KUT (mK)** — text micro-assets (words/phrases/hooks/compounds), harvested by KKr-MSC MetaGrab
- **K-kUpId** — romance/gifting invention (5 levels: Interest → Date → Love → Sex → Forever)
- **PIX packages** — LT-PIX (MetaGrab cue), IN-PIX (inner-section), INO-PIX (intro-only), EP (EP cut)
- **Jewelry derivations**
- **Inventions**
- **Supabase schema** (migrations, edge functions, storage policies) for all of the above

Kernel acronyms owned by this repo:

- **STI** — Standard Template Item (slot/container)
- **STI-Slot** — the container space filled by a BTI
- **BTI** — Branded Template Item (fills STI slots)
- **FP** — Featured Playlist (standard to ALL GPMDs)
- **KK / K-KUT** — exact-excerpt audio invention
- **mK / mini-KUT** — text micro-asset invention
- **KKr** — KutsKorner (music-side platform layer)

---

## Mirrored Music Repos

Each product line has its own mirror repo that sources from GPMC-BIZ-MSC, never from 2GDP:

| Mirror Repo | Scope |
|---|---|
| `mmmm013/GPM-KKUT` | K-KUT + K-kUpId playback / edge functions |
| `mmmm013/GPM-PIX` | PIX packages: IN-PIX, INO-PIX, LT-PIX, EP |
| `mmmm013/GPM-MKUT` | mini-KUT text micro-assets + MetaGrab pipeline |

Shared lib/schema flows from **GPMC-BIZ-MSC → mirrors** only.
No mirror pulls from 2GDP. No mirror pushes back to 2GDP.

---

## Public GPMD Sites

Any public GPMD (G Putnam Music Destination) lives in a separate site repository and consumes platform outputs, data views, or APIs from GPMC-BIZ-MSC.

GPMDs **must link only to `gputnam-music-final-site`**, never to 2GDP or GPMC internal routes.

### Staging deployments in this repo

Standalone Next.js apps that deploy independently via Vercel (each with its own `vercel.json` and `Root Directory` setting):

| Path | Site | Notes |
|---|---|---|
| `staging/gputnam-music-final-site/` | gputnammusic.com | Primary GPM consumer destination |
| `staging/2kleigh-site/` | 2kleigh.com | KLEIGH artist destination |
| `staging/gpex-biz/` | GPEx Business | Excel-A-rator platform |
| `staging/k-kut/` | K-KUT | K-KUT invention family GPMD |

> Each staging app sets **Root Directory** to its own subfolder in Vercel project settings.

GPMD responsibilities:

- Landing pages
- Catalog views
- K-KUT / PIX surfacing
- Contact / commerce hooks
- Public navigation and branding
- FP (Featured Playlist) — standard to ALL GPMDs

---

## Automation + DMAIC Control Phase

### CI Pipeline (per repo)
Each repo runs: lint → build → edge function deploy → smoke test on every push.
Shared Supabase migration runner fires on GPMC-BIZ-MSC merges and broadcasts schema sync to mirrors.

### Signed URL TTL
Stream-audio edge function uses TTL = 3600s (1 hour) to reduce refresh frequency at scale.

### Audio Pipeline Structured Logging
Every audio pipeline call emits:
```json
{ "pipeline": "<name>", "trackId": "<uuid>", "latencyMs": 0, "status": "ok|error", "retryCount": 0 }
```
Aggregate at `/admin/audio-health` (daily rollup): error rate, p99 latency, retry rate per pipeline.

### Alert Threshold
Error rate > 0.1% on any pipeline triggers Lone Admin notification.

### DMAIC Review (Control Phase — monthly)
| Phase | Action |
|---|---|
| **Define** | CTQ per pipeline: error rate < 0.1%, p99 < 800ms |
| **Measure** | Automated weekly report from structured logs |
| **Analyze** | Flag any pipeline breaching CTQ for root-cause review |
| **Improve** | Hotfix or backlog item per breach |
| **Control** | Monthly calendar review: validate CTQ, confirm fixes held, no regressions |
