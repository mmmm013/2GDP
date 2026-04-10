# GPMC Repository Architecture

**Repository:** `mmmm013/GPMC`  
**Last Updated:** 2026-04-03  
**Status:** Active

---

## Overview

This document describes the G Putnam Music platform architecture and repository organization.

---

## Business Structure

### Business Units

#### 1. Music Operations
- **GPMC** — G Putnam Music Catalog
- **GPMCC** — G Putnam Music Commercial Catalog
- **GPME** — G Putnam Music Engine (shared music library)

#### 2. Konsulting Operations
- **The Vektor [Konsulting]** — Separate from all music operations. Lives in its own repository. Has ZERO connection to GPMC or music.

#### 3. GPEx Business (NON-MUSIC — completely separate)
- **GPEx** — GPEx Business "Excel-A-rator" — standalone business acceleration platform for Central IL industries. **Has NOTHING to do with music or GPM.**

---

## This Repository: `mmmm013/GPMC`

**GitHub URL:** https://github.com/mmmm013/GPMC  
**Vercel Project:** GPMC  
**Domain:** gputnammusic.com

### Contains
- Music platform frontend (Next.js App Router)
- GPME music library (`config/kleighLibrary.ts`, `lib/`)
- Creator portal (WebAuthn biometric auth)
- K-KUT / PIX / FP streaming catalog
- Free-gift cron system
- Bot UX (MC-BOT / LF-BOT / GD-BOT / PIXIE-BOT)

---

## Deployment Targets

| Site | Domain | Vercel Project |
|------|--------|---------------|
| Main catalog | gputnammusic.com | GPMC |
| KLEIGH brand | 2kleigh.com | GPMC |

---

## Key Architecture Rules

- Track identity: ASCAP title is single source of truth — never DISCO IDs
- KLEIGH page uses `KleighT20Grid` (not `T20Grid`)
- Creator portal auth: WebAuthn + JWT HttpOnly cookie (`gpmc_creator_session`, 4hr)
- Free-gift cron: hourly, regional schedule, priority K-KUT > mini-KUT > K-kUpId
- `staging/gputnam-music-final-site/` is self-contained; no root imports
- Kreators are HUMANS (collaborators, composers, vocalists) — never cost-items or Products
