# V2 Manufacturing Backlog

These items are intentionally hidden from the live surface until manufacturing operations are ready.

## Hidden From Live UI (Now)

- Physical jewelry/charm/locket catalog tiers previously shown on `app/kupid/page.tsx`.
- Seasonal lockets showcase block previously shown on `app/valentines/page.tsx`.
- Jewelry skin presentation mode in `app/k/[id]/page.tsx` (URL wrappers still tolerated for legacy links, but no dedicated jewelry visual flow).
- Jewelry-forward CTA language on gift/about/bot guide surfaces.

## Deferred MFG-Dependent SKUs

- `kidkut-frequency` (My Frequency Enamel Charm)
- `kidkut-sounddrop` (Sound Drop Clip-On Charm)
- `kidkut-frequencylink` (Frequency Link 3-Pack)
- `genesis` (K-KUTs Genesis Locket)
- `sovereign` (K-KUTs Sovereign Locket)
- `historic` (K-KUTs Historic Locket)

## Keep Live (Not MFG-Blocked)

- `klean-kut` digital link tier
- `mini-kut` digital audio tier
- `kupid-creator` creator subscription tier
- Heart-Tap gift flow and digital gifting pages

## Re-enable Checklist (V2)

- Confirm manufacturer and fulfillment SLA.
- Restore physical SKUs in `lib/kupid-protocol.ts`.
- Restore physical UI sections in `app/kupid/page.tsx` and `app/valentines/page.tsx`.
- Re-introduce physical/jewelry copy in bot and public guide content only after logistics lock.
- Add fulfillment status telemetry and support runbook.
