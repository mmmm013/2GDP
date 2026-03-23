# Apple Ecosystem Integration Checklist
# G Putnam Music, LLC

## Phase 1: Apple Developer Account Setup
- [x] Enroll in Apple Developer Program ($99/yr)
- [x] Sign Apple Developer Program License Agreement (Feb 23, 2026)
- [x] Team ID confirmed: VAVA94C24T
- [x] MusicKit API Keys generated (AuthKey_39DJJ7BT9X.p8, AuthKey_678VL857AT.p8)
- [ ] Register App ID at developer.apple.com/account
- [ ] Enable MusicKit entitlement on App ID
- [ ] Enable In-App Purchase (StoreKit) entitlement on App ID

## Phase 2: Xcode Project Setup
- [ ] Create new Xcode project (iOS target, minimum iOS 16)
- [ ] Set Bundle ID: com.gputnammusic.[appname]
- [ ] Add Team VAVA94C24T to Xcode signing
- [ ] Enable MusicKit capability in Xcode Capabilities tab
- [ ] Enable In-App Purchase capability
- [ ] Add AuthKey_*.p8 to secure storage (NOT to git)
- [ ] Configure Info.plist: NSMusicLibraryUsageDescription

## Phase 3: MusicKit Integration
- [ ] Implement MusicAuthorization request flow
- [ ] Add MusicKit catalog search (MusicCatalogSearchRequest)
- [ ] Implement ApplicationMusicPlayer for playback
- [ ] Create MusicKit token provider using AuthKey .p8 file
- [ ] Test on physical device (MusicKit requires real device)
- [ ] Verify Apple Music subscription entitlement check

## Phase 4: Core ML (On-Device AI)
- [ ] Export initial Core ML model (.mlmodel) for genre classification
- [ ] Export Core ML model for vocal/instrumental detection
- [ ] Add models to Xcode project bundle
- [ ] Implement MLModel inference pipeline
- [ ] Verify < 200ms inference on iPhone 12+
- [ ] Test non-destructive processing (read-only on source files)

## Phase 5: AVAudioEngine
- [ ] Implement AVAudioEngine graph for playback
- [ ] Add EQ node (AVAudioUnitEQ)
- [ ] Add reverb/effects nodes as needed
- [ ] Test interruption handling (phone calls, etc.)
- [ ] Implement background audio (UIBackgroundModes: audio)

## Phase 6: StoreKit 2 / In-App Purchase
- [ ] Configure products in App Store Connect
- [ ] Implement StoreKit 2 Product.products() fetch
- [ ] Implement purchase() flow
- [ ] Implement Transaction.updates listener
- [ ] Test with StoreKit sandbox account
- [ ] Verify no Stripe usage for digital content (Apple policy)

## Phase 7: ASCAP / Legal
- [ ] Confirm ASCAP license covers streaming app use case
- [ ] Prepare ASCAP proof document for App Store submission
- [ ] Review Apple MusicKit terms of service
- [ ] Confirm patent-pending invention disclosure does not conflict

## Phase 8: App Store Submission
- [ ] Create app record in App Store Connect
- [ ] Upload screenshots (iPhone 6.7", iPad 12.9")
- [ ] Write App Store description and keywords
- [ ] Set age rating
- [ ] Submit TestFlight build for internal testing
- [ ] Submit for App Review
- [ ] Target: first-submission approval

## Phase 9: WWDC 2026 Pitch (Optional)
- [ ] Prepare 3-min demo video of on-device AI music tagging
- [ ] Submit WWDC lab session request (Core ML, MusicKit)
- [ ] Draft Apple Developer Relations contact email
- [ ] Identify Apple evangelists for music/ML track

## Key Contacts
- Apple Developer Support: developer.apple.com/contact
- App Review: appstoreconnect.apple.com
- MusicKit docs: developer.apple.com/musickit
- Core ML docs: developer.apple.com/machine-learning
