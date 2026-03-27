# Repository Roles

## 2GDP

This repository is the platform / 4PE-universal codebase.

It is reserved for industry-agnostic platform logic, engine modules, internal architecture, and protected kernel concepts, including but not limited to:

- 4PE
- STI
- STI-Slot
- BTI
- KK
- mK
- KKr

Public-facing consumer copy should avoid exposing internal kernel naming.

## Public GPMD sites

Any public GPMD implementation should live in a separate site repository and consume platform outputs, data views, or APIs.

For music-specific consumer experiences, the designated final-site repository should own:

- landing pages
- catalog views
- K-KUT / PIX surfacing
- contact / commerce hooks
- public navigation and branding

## Content boundary

Music-specific assets and pages should be removed from, or archived out of, this repository over time. This repo should retain only platform-safe, reusable, non-music-specific code and documentation.
