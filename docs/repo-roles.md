# Repository Roles

## 2GDP — The Mothership (this repo)

**2GDP** is the G Putnam Music Platform — The Mothership. It is the 4PE-universal platform codebase.

**2GDP has nothing to do with music.** It is a general-purpose platform engine. Music is a downstream consumer of 2GDP outputs, not something housed here.

This repository is reserved for industry-agnostic platform logic, engine modules, internal architecture, and protected kernel concepts, including but not limited to:

- 4PE
- STI
- STI-Slot
- BTI
- KK
- mK
- KKr

Public-facing consumer copy should avoid exposing internal kernel naming.

## Public GPMD sites

Any public GPMD implementation must live in a separate site repository.

**GPMDs link to `gputnam-music-final-site` only — never to 2GDP/GPMC.**

For music-specific consumer experiences, the designated `gputnam-music-final-site` repository owns:

- landing pages
- catalog views
- K-KUT / PIX surfacing
- contact / commerce hooks
- public navigation and branding

## Content boundary

Music-specific assets and pages must be removed from, or archived out of, this repository over time. This repo retains only platform-safe, reusable, non-music-specific code and documentation.
