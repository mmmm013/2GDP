-- =============================================================
-- IN-PIX / INO-PIX package types + SWSP 13-second minimum
-- Migration: 20260408000002_inpix_inopix_swsp_minimum.sql
-- Idempotent: DROP CONSTRAINT / ADD CONSTRAINT pattern
-- =============================================================
--
-- Terminology:
--   IN-PIX  — Inner-section PIX package (instrumental / inner-song excerpt type)
--   INO-PIX — Intro-Only PIX package   (intro-anchored excerpt type)
--   SWSP    — Sweet Spot = an audio asset (row in k_kut_assets) that belongs to
--             an IN-PIX or INO-PIX package.
--
-- Rule (from product owner):
--   ONLY SWSPs for IN-PIX and INO-PIX have a time constraint.
--   ALL SWSPs must last a minimum of 13 seconds (13,000 ms) to be meaningful.
--   K-KUTs have NO time constraint — they are section-based only (ASCAP rule).
--
-- Changes:
--   A) Expand pix_pck.pck_type from ('LT','EP') to also include 'IN', 'INO'
--   B) Add BEFORE INSERT OR UPDATE trigger on k_kut_assets that rejects any
--      asset row whose owning pix_pck has pck_type IN ('IN','INO') and whose
--      duration_ms is non-null and less than 13,000.
-- =============================================================

-- ============================================================
-- A) Expand pix_pck.pck_type constraint
-- ============================================================

ALTER TABLE public.pix_pck
  DROP CONSTRAINT IF EXISTS pix_pck_pck_type_check;

ALTER TABLE public.pix_pck
  ADD CONSTRAINT pix_pck_pck_type_check
    CHECK (pck_type IN ('LT', 'EP', 'IN', 'INO'));

-- Update the default index to cover the new types (drop + recreate is idempotent)
DROP INDEX IF EXISTS idx_pix_pck_type_active;
CREATE INDEX IF NOT EXISTS idx_pix_pck_type_active
  ON public.pix_pck (pck_type, is_active);

-- ============================================================
-- B) SWSP 13-second minimum guard
--
-- Fires BEFORE INSERT and BEFORE UPDATE (when duration_ms changes or
-- pix_pck_id changes) on k_kut_assets.
--
-- Logic:
--   1. If the owning pix_pck has pck_type IN ('IN', 'INO')
--   2. AND duration_ms is NOT NULL
--   3. AND duration_ms < 13000
--   → raise exception (operation is aborted)
--
-- Note: if duration_ms is NULL the check passes — duration may not be
-- known at ingestion time and is validated separately by the ingest tool.
-- ============================================================

CREATE OR REPLACE FUNCTION public.enforce_swsp_minimum_duration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pck_type  text;
BEGIN
  -- Look up the package type for this asset row
  SELECT pck_type
  INTO   v_pck_type
  FROM   public.pix_pck
  WHERE  id = NEW.pix_pck_id;

  -- Only enforce for IN-PIX and INO-PIX packages
  IF v_pck_type IS NULL OR v_pck_type NOT IN ('IN', 'INO') THEN
    RETURN NEW;
  END IF;

  -- Allow NULL duration (not yet measured) — the ingest tool validates separately
  IF NEW.duration_ms IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.duration_ms < 13000 THEN
    RAISE EXCEPTION
      'SWSP minimum violated: asset in %s-PIX package (pix_pck %) has duration_ms=%; minimum is 13,000 ms (13 seconds).',
      v_pck_type, NEW.pix_pck_id, NEW.duration_ms
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

-- Attach: BEFORE INSERT to catch new assets; BEFORE UPDATE to catch duration updates
DROP TRIGGER IF EXISTS trg_swsp_minimum_duration ON public.k_kut_assets;
CREATE TRIGGER trg_swsp_minimum_duration
  BEFORE INSERT OR UPDATE OF duration_ms, pix_pck_id
  ON public.k_kut_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_swsp_minimum_duration();

-- ============================================================
-- Rollback notes
-- ============================================================
-- DROP TRIGGER  IF EXISTS trg_swsp_minimum_duration  ON public.k_kut_assets;
-- DROP FUNCTION IF EXISTS public.enforce_swsp_minimum_duration();
-- ALTER TABLE   public.pix_pck
--   DROP CONSTRAINT IF EXISTS pix_pck_pck_type_check;
-- ALTER TABLE   public.pix_pck
--   ADD CONSTRAINT pix_pck_pck_type_check
--     CHECK (pck_type IN ('LT', 'EP'));
