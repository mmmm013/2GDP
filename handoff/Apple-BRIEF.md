# Apple Ecosystem Integration Brief
# G Putnam Music, LLC — gputnam-music-mothership

## Status as of March 2026

### Apple Developer Program: ACTIVE
- **Team ID:** VAVA94C24T
- **License Agreement Signed:** February 23, 2026
- **Account Email:** gputnam@gputnammusic.com
- **AuthKeys present in repo root:**
  - AuthKey_39DJJ7BT9X.p8
  - AuthKey_678VL857AT.p8

## Platform Strategy: Apple-Only (No Google/Gemini)

This project pivoted from Gemini/Google AI to a 100% Apple ecosystem approach.
All AI processing is on-device via Core ML. No cloud inference.

## Core Integration Points

### 1. MusicKit JS / MusicKit for Swift
- Embed Apple Music catalog search and playback
- Use MusicKit entitlement (requires App Store distribution)
- Key: AuthKey_*.p8 files are MusicKit API keys registered at developer.apple.com

### 2. Core ML — On-Device AI
- Replace all Gemini AI calls with Core ML models
- Models: genre classification, vocal/instrumental detection, mood tagging
- Non-destructive: original audio masters preserved at all times
- Target: < 200ms inference on iPhone 12+

### 3. AVAudioEngine — Audio Processing
- All audio mixing, EQ, and effects via AVAudioEngine
- No third-party audio SDKs
- Preserve original masters (read-only source files)

### 4. App Store Distribution
- In-App Purchase (IAP) via StoreKit 2 — NOT Stripe for digital content
- ASCAP license proof required before submission
- Target: first-submission approval

### 5. App Store Connect / TestFlight
- TestFlight build required before public release
- App ID must be registered at developer.apple.com/account
- Bundle ID convention: com.gputnammusic.[appname]

### 6. WWDC / Developer Relations
- Target WWDC 2026 for Apple Developer Relations pitch
- Lab sessions: Core ML, MusicKit, StoreKit
- Prepare demo reel of on-device AI music tagging

## Constraints
- On-device only (Core ML, no cloud)
- Preserve original audio masters (non-destructive)
- ASCAP license compliance required
- Use Apple IAP, not Stripe, for digital content
- Target App Store approval on first submission

## Files in This Repo Related to Apple Integration
- `AuthKey_39DJJ7BT9X.p8` — MusicKit/API key (root)
- `AuthKey_678VL857AT.p8` — MusicKit/API key (root)
- `handoff/Apple-CHECKLIST.md` — Phase-by-phase checklist
- `handoff/MusicKit-GUIDE.md` — MusicKit integration guide

## Next Steps (Phase 2)
1. Register App ID at developer.apple.com
2. Create MusicKit entitlement in Xcode
3. Submit first TestFlight build
4. Complete Core ML model training on GPM catalog
5. Prepare WWDC 2026 pitch deck
