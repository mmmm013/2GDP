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
- **GPMC** — G Putnam Music Catalog (this repo)
- **GPME** — G Putnam Music Engine (shared music library)

#### 2. The Vektor — Parent Company (GPEx)
- **The Vektor** = **GPEx** = **Parent Company**. Domain: **2gdp.com**. Display name: **The Vektor**.
- **Sole association:** GPEx is the parent entity. It is The Vektor. Nothing else.
- **Role:** Drafts and owns the **GENERIC versions of 4PE** — universally-pertinent templates adaptable to any industry of focus.
- **4PE absolute components (immutable):**
  - **STI** — Standard Template Item (slot/container)
  - **STI-Slot** — the container space that houses BTI(s)
  - **BTI** — Branded Template Item (fills STI-Slots)
- **4PE is a process** — a ubiquitous, universally-applicable process created and owned by GPEx (The Vektor). Its generic model uses **KKr per industry**. Adaptable to all industries of focus.
- **2GDP** (repo: `mmmm013/2GDP`, domain: `2gdp.com`) houses the 4PE platform engine, KKr, Business Konsulting, Admin Platform. **Zero music content ever.**

#### 3. GPEx Business "Excel-A-rator" (NON-MUSIC — completely separate)
- **GPEx** — standalone business acceleration platform for Central IL industries. **Has NOTHING to do with music or GPM.**

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
