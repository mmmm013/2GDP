# FEATURED PLAYLISTS (FP) - MASTER PROTOCOL
**Last Updated:** January 16, 2026
**Component:** `components/FeaturedPlaylists.tsx`
**Status:** ACTIVE - UNIVERSAL ROTATION

## I. THE UNIVERSAL ROTATION SCHEME (5-SLOT GRID)
The FP Grid must always follow this alternating A-B-A-B-A pattern to balance Legacy (Reading) with Product (Listening).

* **SLOT 1 (READ): "Grandpa's Story"**
    * *Type:* Hero Legacy
    * *Action:* Link to `/heroes`
    * *Icon:* BookOpen

* **SLOT 2 (LISTEN): "The First Note" (or Rotated Vocalist)**
    * *Type:* Sonic Brand / Vocalist Feature
    * *Action:* Play Audio
    * *Icon:* Music
    * *Requirement:* File must exist in Supabase `songs` bucket.

* **SLOT 3 (READ): "Who is G Putnam Music"**
    * *Type:* Vocalist Bio
    * *Action:* Link to `/who`
    * *Icon:* Users

* **SLOT 4 (LISTEN): "Studio Session A" (or Rotated Vocalist)**
    * *Type:* GPMC Catalog / Co-Copyright
    * *Action:* Play Audio
    * *Icon:* Play
    * *Requirement:* File must exist in Supabase `songs` bucket.

* **SLOT 5 (READ): "The FLAGSHIP Engine"**
    * *Type:* Business / Sponsorship
    * *Action:* Link to `/ships`
    * *Icon:* Anchor

## II. THE DYNAMIC INJECTION ENGINE
The code uses `useEffect` to shuffle a `trackLibrary` array on every page load.
* **Target Slots:** Only Slots 2 and 4 are injected dynamically.
* **Static Slots:** Slots 1, 3, and 5 remain fixed links.

## III. LEGAL & COPYRIGHT DESIGNATIONS
When displaying tracks for specific partners, the UI must use the following designations:
* **Michael Scherer:** Must be labeled **"CO-COPYRIGHT"**
* **Erik W. Nelson:** Must be labeled **"CO-COPYRIGHT"**
* **Kleigh:** Labeled **"GPMC LEGACY"**
* **GPM:** Labeled **"SONIC BRAND"**

## IV. ASSET REQUIREMENTS
For the rotation to function without errors, these files MUST exist in Supabase (`songs` bucket):
1.  `first-note.mp3`
2.  `038 - kleigh - bought into your game.mp3`
3.  `scherer-feature.mp3`
4.  `nelson-feature.mp3`

---
*Protocol Saved for Retrieval & Continuity*
