-- =============================================================
-- K-KUT Section Architecture — GPM ASCAP-Compliant Song-Section Model
-- Migration: 20260408000001_kkut_section_architecture.sql
-- Idempotent: uses IF NOT EXISTS / DROP CONSTRAINT / ADD CONSTRAINT
-- =============================================================
--
-- Changes:
--   A) Expand k_kut_assets.structure_tag constraint from 3 values
--      (Verse, BR, Ch) to the full canonical GPM song-section taxonomy:
--      Intro, V1, Pre1, Ch1, V2, Pre2, Ch2, BR, Ch3, Outro
--      (matches lib/kkut-sections.ts SECTION_ORDER)
--
--   B) Add track_id uuid (nullable, no FK for portability) to pix_pck
--      so section packages know which gpm_tracks row they belong to.
--
--   C) Add pix_pck_id uuid and sections text[] to k_kut_codes
--      so a purchased K-KUT code records exactly which section package
--      and which sections (contiguous, in original order) were bought.
--
-- ASCAP compliance note:
--   sections[] is validated at the application layer (lib/kkut-sections.ts)
--   to enforce contiguity and original-order rules before storage.
-- =============================================================

-- ============================================================
-- A) Expand k_kut_assets.structure_tag constraint
-- ============================================================

-- Drop the existing whitelist constraint (only Verse/BR/Ch)
ALTER TABLE public.k_kut_assets
  DROP CONSTRAINT IF EXISTS k_kut_assets_structure_tag_check;

-- Re-add with the full canonical taxonomy
ALTER TABLE public.k_kut_assets
  ADD CONSTRAINT k_kut_assets_structure_tag_check
    CHECK (structure_tag IN ('Intro','V1','Pre1','Ch1','V2','Pre2','Ch2','BR','Ch3','Outro'));

-- Also drop and re-add the unique slot constraint to include the new tags
-- (it already covers all tags; just ensure it is still present)
ALTER TABLE public.k_kut_assets
  DROP CONSTRAINT IF EXISTS k_kut_assets_unique_slot;

ALTER TABLE public.k_kut_assets
  ADD CONSTRAINT k_kut_assets_unique_slot
    UNIQUE (pix_pck_id, structure_tag, variant);

-- ============================================================
-- B) Add track_id to pix_pck
--    Nullable uuid — links a section package to its source track.
--    No FK constraint: gpm_tracks may not have a migration file yet.
-- ============================================================

ALTER TABLE public.pix_pck
  ADD COLUMN IF NOT EXISTS track_id uuid;

CREATE INDEX IF NOT EXISTS idx_pix_pck_track_id
  ON public.pix_pck (track_id)
  WHERE track_id IS NOT NULL;

-- ============================================================
-- C) Add pix_pck_id + sections to k_kut_codes
-- ============================================================

-- pix_pck_id: which section package this code refers to
ALTER TABLE public.k_kut_codes
  ADD COLUMN IF NOT EXISTS pix_pck_id uuid;

-- sections: ordered array of structure_tag values that were purchased.
-- Must be contiguous and in original song order (enforced at app layer).
-- Example: ARRAY['V1','Ch1','V2','Ch2']
ALTER TABLE public.k_kut_codes
  ADD COLUMN IF NOT EXISTS sections text[];

-- Check that every element of sections[] is a valid tag
-- (fires on INSERT/UPDATE of the k_kut_codes row)
ALTER TABLE public.k_kut_codes
  DROP CONSTRAINT IF EXISTS k_kut_codes_sections_tags_check;

ALTER TABLE public.k_kut_codes
  ADD CONSTRAINT k_kut_codes_sections_tags_check
    CHECK (
      sections IS NULL
      OR (
        -- Every element must be a valid section tag
        NOT EXISTS (
          SELECT 1
          FROM unnest(sections) AS s(tag)
          WHERE s.tag NOT IN ('Intro','V1','Pre1','Ch1','V2','Pre2','Ch2','BR','Ch3','Outro')
        )
      )
    );

-- ============================================================
-- Rollback notes (run in reverse to revert)
-- ============================================================
-- ALTER TABLE public.k_kut_codes DROP CONSTRAINT IF EXISTS k_kut_codes_sections_tags_check;
-- ALTER TABLE public.k_kut_codes DROP COLUMN IF EXISTS sections;
-- ALTER TABLE public.k_kut_codes DROP COLUMN IF EXISTS pix_pck_id;
-- ALTER TABLE public.pix_pck    DROP COLUMN IF EXISTS track_id;
-- ALTER TABLE public.k_kut_assets DROP CONSTRAINT IF EXISTS k_kut_assets_structure_tag_check;
-- ALTER TABLE public.k_kut_assets
--   ADD CONSTRAINT k_kut_assets_structure_tag_check
--     CHECK (structure_tag IN ('Verse', 'BR', 'Ch'));
