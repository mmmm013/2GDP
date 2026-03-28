# Repository Architecture

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

## Current Repository Status

### This Repository: `mmmm013/2GDP`
**GitHub URL:** https://github.com/mmmm013/2GDP

**Purpose:** Mixed-use repository containing music platform code

**Current State:**
- ✅ Music platform frontend (Next.js)
- ✅ 20,674 track catalog in `public/assets/stl.csv`
- ✅ Music players and audio infrastructure
- ✅ Environment configuration for Supabase
- ✅ Stripe payment integration
- ⚠️ Name confusion: GitHub repo is "2GDP" but serves music content

**Deployment:**
- **Vercel Project:** gputnam-music-final-site
- **Live URL:** https://gputnam-music-final-site.vercel.app

**Branding Rule:**
- ❌ "2GDP" should NOT be used for music platform
- ✅ "gputnam-music-final-site" is correct for music
- ✅ "2GDP/2gdp.com" is exclusively for Konsulting

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

### Phase 1: Documentation (Current)
- [x] Document current architecture
- [x] Define GPMC, GPMCC, GPME relationships
- [ ] Map current code to proposed structure
- [ ] Identify shared vs. catalog-specific code

### Phase 2: Repository Creation
- [ ] Create GPME repository
- [ ] Create GPMC repository
- [ ] Create GPMCC repository
- [ ] Rename/repurpose 2GDP repository for Konsulting

### Phase 3: Code Migration
- [ ] Extract shared code to GPME
- [ ] Move catalog code to GPMC
- [ ] Mirror GPMC to GPMCC
- [ ] Separate Konsulting code

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

### Immediate (This PR)
- [x] Document architecture
- [x] Clarify GPMC, GPMCC, GPME relationships
- [ ] Review current repository with user

### Short Term
- [ ] Get user approval on repository structure
- [ ] Plan repository creation sequence
- [ ] Define API contracts for GPME

### Long Term
- [ ] Execute migration plan
- [ ] Set up mirroring between GPMC and GPMCC
- [ ] Establish development workflows
- [ ] Document deployment procedures

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
- **Current Deployment:** https://gputnam-music-final-site.vercel.app
- **Track Inventory:** `docs/KK_MK_VERIFICATION.md`
- **Setup Guide:** `FINALIZATION_GUIDE.md`
