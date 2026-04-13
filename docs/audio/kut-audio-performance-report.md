# KUT Audio Performance Report

**Scope:** All three KUT inventions — K-KUT (KK), mini-KUT (mK), K-kUpId (KPD)  
**Repo:** `mmmm013/GPMC` → `sites/k-kut`  
**Supabase project:** `vwlzubxshjjonabpeagd`  
**Pipeline:** `BotDemo.tsx` → `KutAudioPlayer` → `get-audio-url` edge fn → AUDIO bucket → signed URL → HTML5 Audio  
**Date:** 2026-04-13

---

## Architecture Confirmation

> **Q: All KUT activity resides and is managed from `mmmm013/GPMC` (`sites/k-kut`), right — even KUTs displayed outside k-kut.com (e.g. gputnammusic.com)?**

**Yes. Clear. Sensible. Logical. Compatible. Suitable.**

- The AUDIO Supabase Storage bucket (`vwlzubxshjjonabpeagd`) and all four edge functions (`get-audio-url`, `play-k-kut`, `play-m-kut`, `play-k-kupid`) are the **single source of truth** for all KUT audio.
- All KUTs are 4PE-BIZ-MSC-processed assets ingested into this pipeline. No KUT originates outside it.
- Any GPEx domain (`gputnammusic.com`, `gpex-biz.com`, etc.) that needs to play a KUT **consumes pre-made, post-processed KUTs from the K-KUT pipeline** — they do not create or store KUTs independently.
- Cross-domain access is already enabled: `_shared/responses.ts` sets `Access-Control-Allow-Origin: *` (overridable per-environment via the `ALLOWED_ORIGIN` secret). Any GPEx domain with the Supabase anon key can call the edge functions from the browser.
- The `KutAudioPlayer` component, or a lightweight equivalent, is the correct integration point for any consumer site. It handles the full state machine (idle → loading → playing → paused/error/unavailable).

---

---

## Section 1 — K-KUT (KK)

**Definition:** Exact section excerpt from a registered ASCAP track. Tagged by section code (Ch1 / V2 / BR).

### Audio Path Convention

```
k-kut/<title-slug>-<section>.mp3
```

### Demo Manifest (3 KUTs)

| Storage Path | Track | Section | Tag |
|---|---|---|---|
| `k-kut/love-renews-Ch1.mp3` | LOVE RENEWS | Chorus 1 | `Ch1` |
| `k-kut/starts-with-me-V2.mp3` | STARTS WITH ME | Verse 2 | `V2` |
| `k-kut/still-here-BR.mp3` | STILL HERE | Bridge | `BR` |

### Pipeline Trace

```
BotDemo → KKutBot → KKUT_SCRIPTS[n].card.section
  → KutAudioPlayer(invention="KK", audioPath="k-kut/<slug>-<section>.mp3")
    → fetchAudioPathUrl()
      → POST /functions/v1/get-audio-url { bucket: "AUDIO", path: "k-kut/<slug>-<section>.mp3" }
        → Supabase Storage: AUDIO bucket → signed URL (1 hr)
          → HTML5 Audio.play()
```

### Slug Function

```ts
// BotDemo.tsx
function toSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
// "LOVE RENEWS" → "love-renews"
// "STARTS WITH ME" → "starts-with-me"
// "STILL HERE" → "still-here"
```

### Validation Results

| Check | Status |
|---|---|
| Path convention matches storage manifest | ✅ |
| `toSlug()` generates correct slugs for all 3 demo tracks | ✅ |
| Section codes match script cards (Ch1, V2, BR) | ✅ |
| `get-audio-url` path extension guard (`.mp3`) passes | ✅ |
| `KutAudioPlayer` receives correct `invention="KK"` | ✅ |
| `audioPath` priority over DB-backed edge fn is set | ✅ |
| Player states (idle/loading/playing/paused/error/unavailable) all handled | ✅ |
| CORS headers on `get-audio-url` allow any origin | ✅ |

### Issues

None. All KK paths are correctly wired.

---

---

## Section 2 — mini-KUT (mK)

**Definition:** Per-phrase audio snippet extracted from a registered ASCAP master track. Tagged by phrase slug. Demo shows master-track reference clip; per-phrase mK clips follow the same path convention.

### Audio Path Convention

```
mk/<title-slug>-<phrase>.mp3          ← per-phrase clip
mk/<title-slug>-master.mp3            ← master-track reference (demo header)
```

### Demo Manifest (3 master clips + 36 phrase slots)

| Storage Path | Track | Type |
|---|---|---|
| `mk/love-renews-master.mp3` | LOVE RENEWS | Master reference |
| `mk/starts-with-me-master.mp3` | STARTS WITH ME | Master reference |
| `mk/still-here-master.mp3` | STILL HERE | Master reference |

Per-phrase clips (examples from demo word cannon):

| Storage Path | Track | Phrase |
|---|---|---|
| `mk/love-renews-rise-up.mp3` | LOVE RENEWS | RISE UP |
| `mk/love-renews-never-again.mp3` | LOVE RENEWS | NEVER AGAIN |
| `mk/starts-with-me-forgive-me.mp3` | STARTS WITH ME | FORGIVE ME |
| `mk/still-here-through-it.mp3` | STILL HERE | THROUGH IT |
| *(12 per track × 3 tracks = 36 total)* | | |

> **LOOP 8 Aggregation Rule**: mK clips NEVER aggregate by title or artist. Each phrase stays tied to its Registered ASCAP track + ASCAP Track ID. All 12 phrases from one track aggregate only within the same PIX-PCK for that title.

### Pipeline Trace

```
BotDemo → MiniKutBot → MK_BATCHES[n].track
  → KutAudioPlayer(invention="mK", tag="master", audioPath="mk/<slug>-master.mp3")
    → fetchAudioPathUrl()
      → POST /functions/v1/get-audio-url { bucket: "AUDIO", path: "mk/<slug>-master.mp3" }
        → Supabase Storage: AUDIO bucket → signed URL (1 hr)
          → HTML5 Audio.play()
```

Per-phrase clip (when a word card is tapped in production):
```
→ KutAudioPlayer(invention="mK", audioPath="mk/<slug>-<phrase-slug>.mp3")
  → same get-audio-url path
```

### Validation Results

| Check | Status |
|---|---|
| Path convention matches storage manifest for master clips | ✅ |
| `toSlug()` generates correct slugs for all 3 demo tracks | ✅ |
| `tag="master"` correctly identifies master-track demo clip | ✅ |
| Per-phrase path convention (`mk/<slug>-<phrase-slug>.mp3`) documented and consistent | ✅ |
| `play-m-kut` edge function exists as DB-backed fallback | ✅ |
| `KutAudioPlayer` `invention="mK"` routes to `play-m-kut` when using kutId/pixPckId | ✅ |
| `audioPath` priority bypasses DB — works before ingestion rows exist | ✅ |
| CORS headers allow any GPEx domain to request mK audio | ✅ |
| ASCAP Track ID / PIX-PCK aggregation rule preserved in architecture | ✅ |

### Issues

None for demo master clips. Per-phrase clips require 36 files uploaded to AUDIO bucket before individual phrase playback is live. Path convention is correct.

---

---

## Section 3 — K-kUpId (KPD)

**Definition:** Romance-level-tagged audio excerpt. 5 fixed levels: Interest → Date → Love → Sex → Forever. Each level maps to one track excerpt per PIX-PCK.

### Audio Path Convention

```
kpd/<level>-<title-slug>.mp3
```

### Demo Manifest (5 KUTs — one per romance level)

| Storage Path | Level | Track | Level Code |
|---|---|---|---|
| `kpd/interest-find-me.mp3` | Interest | FIND ME | 01 |
| `kpd/date-one-night.mp3` | Date | ONE NIGHT | 02 |
| `kpd/love-love-renews.mp3` | Love | LOVE RENEWS | 03 |
| `kpd/sex-burn.mp3` | Sex | BURN | 04 |
| `kpd/forever-forever-yours.mp3` | Forever | FOREVER YOURS | 05 |

### Pipeline Trace

```
BotDemo → KupidBot → KUPID_LEVELS[n].audioPath
  → KutAudioPlayer(invention="KPD", audioPath="kpd/<level>-<slug>.mp3", color=lv.color)
    → fetchAudioPathUrl()
      → POST /functions/v1/get-audio-url { bucket: "AUDIO", path: "kpd/<level>-<slug>.mp3" }
        → Supabase Storage: AUDIO bucket → signed URL (1 hr)
          → HTML5 Audio.play()
```

> `KUPID_LEVELS[n].audioPath` is hardcoded in `BotDemo.tsx` — no slug generation needed. Paths match the AUDIO bucket manifest exactly.

### Romance Level → Color Map

| Level | Label | Color (RGB) |
|---|---|---|
| 01 | INTEREST | 255,200,100 |
| 02 | DATE | 255,153,0 |
| 03 | LOVE | 255,105,180 |
| 04 | SEX | 200,50,150 |
| 05 | FOREVER | 150,100,255 |

### Validation Results

| Check | Status |
|---|---|
| All 5 `audioPath` values in `KUPID_LEVELS` match AUDIO bucket manifest exactly | ✅ |
| Level labels match `romanceLevel` convention (lowercase = tag) | ✅ |
| `KutAudioPlayer invention="KPD"` routes to `play-k-kupid` for DB-backed fallback | ✅ |
| `audioPath` priority bypasses DB — works before ingestion rows exist | ✅ |
| Color map assigned correctly per level (escalating warm → deep) | ✅ |
| All 5 levels render distinct KutAudioPlayer instances on the demo | ✅ |
| CORS headers allow any GPEx domain to request KPD audio | ✅ |

### Issues

None. All 5 KPD paths are correctly hardcoded and match the bucket manifest.

---

---

## Cross-Domain Access Summary

Any GPEx domain wanting to play KUTs only needs:

1. `NEXT_PUBLIC_SUPABASE_URL` = `https://vwlzubxshjjonabpeagd.supabase.co`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the project anon key
3. The `KutAudioPlayer` component (or equivalent `fetch` call to `get-audio-url`)
4. The `audioPath` of the pre-made KUT (from the AUDIO bucket manifest)

No additional infrastructure required. All KUTs are pre-processed by 4PE-BIZ-MSC and stored in the AUDIO bucket. Consumer sites are read-only endpoints.

---

## Overall Status

| Invention | Demo Files | Pipeline | CORS | Issues |
|---|---|---|---|---|
| K-KUT (KK) | 3 / 3 | ✅ | ✅ | None |
| mini-KUT (mK) | 3 master / 36 phrase slots | ✅ | ✅ | Phrase clips need upload |
| K-kUpId (KPD) | 5 / 5 | ✅ | ✅ | None |

**Total demo KUTs wired and path-verified: 11 (3 KK + 3 mK master + 5 KPD)**
