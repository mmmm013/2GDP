# Repository Architecture

## 🚨 CRITICAL ISSUE IDENTIFIED

**PROBLEM:** The current GitHub repository `mmmm013/2GDP` contains music platform code, but **2GDP HAS ZERO INVOLVEMENT WITH ANYTHING MUSIC**. 2GDP is ONLY for Konsulting services.

**SEVERITY:** Critical Branding Violation  
**STATUS:** Requires Immediate Corrective Action  
**IMPACT:** Brand confusion, organizational misalignment

**VIOLATION:**
- Repository named "2GDP" contains 20,674 music tracks
- Repository named "2GDP" contains music player infrastructure
- Repository named "2GDP" deploys to `gpmc.vercel.app` (should be GPMC project)

**REQUIRED CORRECTION:**
- Move ALL music code OUT of `mmmm013/2GDP`
- Create proper music repository (NOT named 2GDP)
- Ensure 2GDP contains ZERO music content
- Reserve 2GDP exclusively for Konsulting

---

## Overview

This document describes the G Putnam Music platform architecture and repository organization under GPEx (Groom Process Excellarators).

**Last Updated:** 2026-03-28  
**Status:** Active - Architecture Review in Progress

---

## Business Structure

### Parent Company
- **GPEx** (Groom Process Excellarators)
  - Parent company overseeing all operations
  - Name currently unstable, subject to change

### Business Units

#### 1. Music Operations
- **GPMC** - G Putnam Music Catalog
- **GPMCC** - G Putnam Music Commercial Catalog
- **GPME** - G Putnam Music Engine (shared music library)

#### 2. Konsulting Operations
- **2GDP** (2gdp.com) - Exclusively for Konsulting services
- **The Vektor [Konsulting]** - Konsulting brand

---

## Architecture Model

### Shared Core: GPME (G Putnam Music Engine)

```
                    ┌─────────────────────┐
                    │       GPEx          │
                    │  (Parent Company)   │
                    └─────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼─────────┐         ┌──────────▼──────────┐
    │   Music Platform  │         │    Konsulting       │
    │                   │         │                     │
    │  ┌─────────────┐  │         │   ┌──────────────┐ │
    │  │    GPMC     │  │         │   │     2GDP     │ │
    │  │  (Catalog)  │  │         │   │  2gdp.com    │ │
    │  └─────────────┘  │         │   └──────────────┘ │
    │         │         │         │                     │
    │         ▼         │         │   The Vektor        │
    │  ┌─────────────┐  │         │   [Konsulting]      │
    │  │    GPME     │◄─┼─────────┤                     │
    │  │   (Engine)  │  │         └─────────────────────┘
    │  └─────────────┘  │
    │         ▲         │
    │         │         │
    │  ┌─────────────┐  │
    │  │   GPMCC     │  │
    │  │ (Commercial)│  │
    │  └─────────────┘  │
    └───────────────────┘
```

### Key Relationships

1. **GPME (Music Engine)**
   - Central music library shared by both catalogs
   - Contains 20,674+ tracks with complete metadata
   - Single source of truth for all music assets

2. **GPMC (Music Catalog)**
   - Relies on GPME for music library
   - Primary music catalog
   - Should be mirrored by GPMCC

3. **GPMCC (Music Commercial Catalog)**
   - Relies on GPME for music library
   - Mirrors GPMC structure
   - Commercial-focused catalog variant

---

## 🚨 CRITICAL ISSUE: Current Repository Misuse

### This Repository: `mmmm013/2GDP`
**GitHub URL:** https://github.com/mmmm013/2GDP

**❌ PROBLEM:** This repository is named "2GDP" but currently contains MUSIC platform code. This is a **CRITICAL BRANDING VIOLATION**.

**Current State (INCORRECT):**
- ❌ Music platform frontend (Next.js) - SHOULD NOT BE IN 2GDP REPO
- ❌ 20,674 track catalog in `public/assets/stl.csv` - SHOULD NOT BE IN 2GDP REPO
- ❌ Music players and audio infrastructure - SHOULD NOT BE IN 2GDP REPO
- ❌ Environment configuration for Supabase - SHOULD NOT BE IN 2GDP REPO
- ❌ Stripe payment integration for music - SHOULD NOT BE IN 2GDP REPO

**Deployment:**
- **Vercel Project:** GPMC (G Putnam Music Catalog) - UPDATE IN PROGRESS
- **Live URL:** https://gpmc.vercel.app (TARGET URL)

**🚨 CRITICAL BRANDING RULES:**
- ❌ **2GDP HAS ZERO INVOLVEMENT WITH ANYTHING MUSIC**
- ❌ **2GDP IS ONLY FOR KONSULTING**
- ❌ **NEVER use "2GDP" or "2gdp" or "2gdp.com" for ANY music content**
- ✅ "GPMC" (G Putnam Music Catalog) is the correct project name for music
- ✅ "2GDP/2gdp.com" is exclusively for The Vektor [Konsulting]

**Root Cause:**
This repository was incorrectly named or repurposed. The GitHub repository name `mmmm013/2GDP` creates confusion and violates branding separation. All music code currently in this repo needs to be migrated to proper music repository.

---

## Recommended Repository Structure

### Proposed Organization

#### Repository 1: GPME (Music Engine)
**Suggested Name:** `gputnam-music-engine` or `gpme-library`

**Purpose:** Core music library and shared components

**Contents:**
- Track metadata database (20,674+ tracks)
- Audio file storage integration
- Shared music player components
- API endpoints for music queries
- Authentication/authorization logic
- Stripe payment processing

**Technology:**
- Node.js/TypeScript backend
- Supabase for database and storage
- Shared utilities and types

---

#### Repository 2: GPMC (Music Catalog)
**Suggested Name:** `gputnam-music-catalog` or `gpmc-catalog`

**Purpose:** Primary music catalog frontend

**Contents:**
- Next.js frontend application
- Catalog browsing UI
- Track discovery features
- User-facing music pages
- Integration with GPME API

**Depends On:**
- GPME (Music Engine)

**Deployment:**
- Vercel project: gputnam-music-catalog
- Custom domain: TBD

---

#### Repository 3: GPMCC (Music Commercial Catalog)
**Suggested Name:** `gputnam-music-commercial` or `gpmcc-commercial`

**Purpose:** Commercial variant of music catalog (mirrors GPMC)

**Contents:**
- Next.js frontend application (mirror of GPMC)
- Commercial-focused features
- Business-to-business interfaces
- Integration with GPME API

**Depends On:**
- GPME (Music Engine)
- Mirrors structure of GPMC

**Deployment:**
- Vercel project: gputnam-music-commercial
- Custom domain: TBD

---

#### Repository 4: 2GDP (Konsulting)
**Suggested Name:** `2gdp-konsulting` or `the-vektor-konsulting`

**Purpose:** Konsulting services platform

**Contents:**
- Konsulting business logic
- The Vektor [Konsulting] branding
- Consulting service offerings
- Completely separate from music

**Depends On:**
- None (independent from music platform)

**Deployment:**
- Vercel project: 2gdp or the-vektor-konsulting
- Domain: 2gdp.com

---

## Technology Stack

### Shared Technologies (GPME, GPMC, GPMCC)

**Frontend:**
- Next.js 16+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS

**Backend/Infrastructure:**
- Supabase (Database + Storage)
- Stripe (Payments)
- Vercel (Hosting)

**Data:**
- PostgreSQL (via Supabase)
- CSV catalog (20,674 tracks)
- Audio files in Supabase storage

---

## Migration Path

### Phase 1: Documentation & Problem Identification ✅ COMPLETE
- [x] Document current architecture
- [x] Define GPMC, GPMCC, GPME relationships
- [x] **IDENTIFY CRITICAL ISSUE: mmmm013/2GDP repo contains music code (VIOLATION)**
- [ ] Get user approval on corrective action plan

### Phase 2: Repository Creation 🚨 URGENT
- [ ] **CRITICAL:** Create proper music repository (NOT named 2GDP)
- [ ] Create GPME repository for music engine
- [ ] Create GPMC repository for music catalog
- [ ] Create GPMCC repository for commercial catalog
- [ ] **CRITICAL:** Clear 2GDP repository of ALL music content
- [ ] Repurpose 2GDP exclusively for Konsulting

### Phase 3: Code Migration 🚨 REQUIRED
- [ ] **Move ALL music code OUT of mmmm013/2GDP**
- [ ] Extract shared music code to GPME
- [ ] Move music catalog code to GPMC
- [ ] Mirror GPMC to GPMCC
- [ ] **Ensure 2GDP contains ZERO music content**
- [ ] Add Konsulting-only code to 2GDP

### Phase 4: Integration
- [ ] Set up GPME API
- [ ] Connect GPMC to GPME
- [ ] Connect GPMCC to GPME
- [ ] Configure deployment pipelines

### Phase 5: Testing & Deployment
- [ ] Test all repositories independently
- [ ] Test integration between repos
- [ ] Deploy to production
- [ ] Update DNS and domains

---

## Current Implementation Details

### Music Features (GPMC/GPMCC)

**Content Pages (KKs):**
- `/kleigh` - Kleigh Legacy Collection
- `/heroes` - The Okinawa Legacy
- `/jazz` - Scherer Jazz Collection
- `/ships` - SHIPS Engine
- `/who` - About G Putnam Music
- `/uru` - Universal Rights Unit
- `/singalongs` - Interactive mood player

**Music Platform (mKs):**
- `/mip` - MIP Portal (password: `gpmpro26`)

**Data Assets:**
- `public/assets/stl.csv` - 20,674 tracks
- `gpm_stl.csv` - 586 track subset
- `awesome-squad.json` - 14 specialty tracks

**Integrations:**
- Supabase: `lbzpfqarraegkghxwbah.supabase.co`
- Stripe: 14+ checkout links ($5-$100 tiers)

---

## Architectural Principles

### 1. Separation of Concerns
- Music platform completely separate from Konsulting
- GPMC and GPMCC share engine but have separate deployments
- GPME provides unified API for all music operations

### 2. Mirroring Strategy
- GPMCC mirrors GPMC structure
- Both depend on GPME
- Changes to GPMC can be replicated to GPMCC
- Allows for catalog variants without code duplication

### 3. Shared Core
- GPME contains all music logic
- Single source of truth for track data
- Centralized authentication and payments
- Reusable components across catalogs

### 4. Scalability
- Architecture supports multiple catalog variants
- Can add more catalog types (GPMC-Retail, GPMC-Enterprise, etc.)
- Music engine scales independently
- Each catalog can be deployed separately

---

## Templates & Tooling (4PE)

### Cross-Platform Components

Per user guidance, these terms/tools adapt to ANY business environment:

- **4PE** - Process framework
- **4PE-MSC** - Music-specific process framework
- **KKr** - Content repository system
- **STI** - Strategic Template Interface
- **BTI** - Business Template Interface
- **gtmplt** - Generic template system

**Behaviors, Functions & Features:**
- Template-based components ("Tppls")
- Cross all GPMDs (deployments) on backend
- Cross all templates on frontend
- Adapt to any business environment

---

## Action Items

### 🚨 CRITICAL - Immediate Action Required
- [x] Document architecture
- [x] Clarify GPMC, GPMCC, GPME relationships
- [x] **IDENTIFY THE PROBLEM: mmmm013/2GDP repository name is WRONG for music**
- [ ] **User approval: How to migrate music code OUT of 2GDP repo?**
- [ ] **User decision: Create new music repository immediately?**

### Short Term - Corrective Actions
- [ ] **Create proper repository for music platform (NOT 2GDP)**
- [ ] **Migrate ALL music code from mmmm013/2GDP to new music repo**
- [ ] **Remove ALL music content from 2GDP repository**
- [ ] Update Vercel deployment to point to new repository
- [ ] Ensure 2GDP repository is exclusively for Konsulting

### Long Term - Proper Architecture
- [ ] Execute full migration plan
- [ ] Set up mirroring between GPMC and GPMCC
- [ ] Establish development workflows
- [ ] Document deployment procedures
- [ ] Maintain strict separation: 2GDP = Konsulting ONLY, Music = Separate Repos

---

## Questions for Review

1. **Repository Names:** Are the suggested names acceptable?
   - `gputnam-music-engine` (GPME)
   - `gputnam-music-catalog` (GPMC)
   - `gputnam-music-commercial` (GPMCC)

2. **Mirroring Strategy:** How should GPMCC mirror GPMC?
   - Git submodules?
   - Shared packages via npm?
   - Monorepo structure?
   - Template inheritance?

3. **GPME Scope:** What should live in the engine vs. catalogs?
   - Audio player components?
   - UI components?
   - Business logic only?

4. **Timeline:** What's the priority for this restructuring?

---

## References

- **Branding Guidelines:** See stored memory - "2GDP is ONLY for Konsulting"
- **Current Deployment:** https://gpmc.vercel.app (G Putnam Music Catalog)
- **Track Inventory:** `docs/KK_MK_VERIFICATION.md`
- **Setup Guide:** `FINALIZATION_GUIDE.md`
