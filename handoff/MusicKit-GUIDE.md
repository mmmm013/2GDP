# MusicKit Integration Guide
# G Putnam Music, LLC

## Overview
This guide covers integrating MusicKit for Swift into the GPM iOS app.
MusicKit enables Apple Music catalog access, playback, and library management.

## Prerequisites
- Apple Developer Program membership (Team ID: VAVA94C24T)
- MusicKit API Key (.p8 file) stored in repo root
- Xcode 15+ with iOS 16+ deployment target
- Physical iPhone for testing (MusicKit does NOT work in simulator)

## Step 1: Configure App ID
1. Go to developer.apple.com/account
2. Certificates, Identifiers & Profiles > Identifiers
3. Create new App ID: com.gputnammusic.[appname]
4. Enable capability: MusicKit
5. Enable capability: In-App Purchase
6. Save

## Step 2: Xcode Capabilities
1. Open Xcode project
2. Target > Signing & Capabilities > + Capability
3. Add: MusicKit
4. Add: In-App Purchase
5. Xcode auto-adds entitlements file

## Step 3: Request Authorization
```swift
import MusicKit

func requestMusicAuthorization() async {
    let status = await MusicAuthorization.request()
    switch status {
    case .authorized:
        print("MusicKit authorized")
    case .denied, .restricted, .notDetermined:
        print("MusicKit not authorized: \(status)")
    @unknown default:
        break
    }
}
```

## Step 4: Search the Apple Music Catalog
```swift
func searchCatalog(query: String) async throws -> [Song] {
    var request = MusicCatalogSearchRequest(
        term: query,
        types: [Song.self]
    )
    request.limit = 25
    let response = try await request.response()
    return Array(response.songs)
}
```

## Step 5: Playback with ApplicationMusicPlayer
```swift
func play(song: Song) async throws {
    let player = ApplicationMusicPlayer.shared
    player.queue = [song]
    try await player.play()
}

func pause() {
    ApplicationMusicPlayer.shared.pause()
}
```

## Step 6: MusicKit Token (Server-Side)
For catalog API calls from a server or web context:
- Use AuthKey_39DJJ7BT9X.p8 (Key ID: 39DJJ7BT9X)
- Use AuthKey_678VL857AT.p8 (Key ID: 678VL857AT)
- Generate JWT: Header {alg: ES256, kid: KEY_ID} + Payload {iss: TEAM_ID, iat, exp}
- Sign with private key using ES256
- Pass as Bearer token in Authorization header

**IMPORTANT:** Never commit .p8 private keys to git. Use environment variables or secure vault.

## Step 7: Handle Subscription State
```swift
func checkAppleMusicSubscription() async -> Bool {
    do {
        let subscription = try await MusicSubscription.current
        return subscription.canPlayCatalogContent
    } catch {
        return false
    }
}
```

## Step 8: Info.plist Entries
Add to Info.plist:
```xml
<key>NSAppleMusicUsageDescription</key>
<string>G Putnam Music uses Apple Music to stream and discover tracks.</string>
```

## Common Issues
- **Simulator error**: MusicKit requires a real device with Apple ID signed in
- **401 Unauthorized**: Check .p8 key validity and Team ID in JWT
- **No results**: User must have Apple Music subscription for catalog playback
- **Entitlement missing**: Re-check App ID capabilities and re-download provisioning profile

## API Keys in This Repo
- `AuthKey_39DJJ7BT9X.p8` — Key ID: 39DJJ7BT9X, Team: VAVA94C24T
- `AuthKey_678VL857AT.p8` — Key ID: 678VL857AT, Team: VAVA94C24T

## References
- MusicKit docs: https://developer.apple.com/documentation/musickit
- MusicKit WWDC 2021: https://developer.apple.com/videos/play/wwdc2021/10294/
- StoreKit 2: https://developer.apple.com/storekit/
