-- =============================================================
-- Audio QC Activation Guard
-- Migration: 20260409000001_audio_qc_activation_guard.sql
-- Idempotent: ADD COLUMN IF NOT EXISTS / DROP CONSTRAINT / ADD CONSTRAINT
-- =============================================================
--
-- ALL inventory items (k_kut_assets + pix_pck) require
-- audio_qc_status = 'pass' before they can be made active/live.
--
-- Rules enforced at the DB layer:
--   1. k_kut_assets.status  → 'active'  is BLOCKED unless audio_qc_status = 'pass'
--   2. pix_pck.is_active    → true       is BLOCKED unless audio_qc_status = 'pass'
--   3. audio_qc_status = 'fail' auto-sets is_free = true (graceful free-tier fallback)
--   4. Anon users can read k_kut_assets / pix_pck rows where is_free = true
--
-- Admin records QC results at POST /api/admin/audio-qc
-- =============================================================

-- ============================================================
-- A) Add audio_qc_status + is_free to public.k_kut_assets
-- ============================================================

ALTER TABLE public.k_kut_assets
  ADD COLUMN IF NOT EXISTS audio_qc_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS is_free         boolean NOT NULL DEFAULT false;

-- Enforce valid QC status values
ALTER TABLE public.k_kut_assets
  DROP CONSTRAINT IF EXISTS k_kut_assets_audio_qc_status_check;

ALTER TABLE public.k_kut_assets
  ADD CONSTRAINT k_kut_assets_audio_qc_status_check
    CHECK (audio_qc_status IN ('pending', 'pass', 'fail'));

-- Index for free-tier lookups
CREATE INDEX IF NOT EXISTS idx_k_kut_assets_is_free
  ON public.k_kut_assets (is_free)
  WHERE is_free = true;

-- ============================================================
-- B) Add audio_qc_status + is_free to public.pix_pck
-- ============================================================

ALTER TABLE public.pix_pck
  ADD COLUMN IF NOT EXISTS audio_qc_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS is_free         boolean NOT NULL DEFAULT false;

ALTER TABLE public.pix_pck
  DROP CONSTRAINT IF EXISTS pix_pck_audio_qc_status_check;

ALTER TABLE public.pix_pck
  ADD CONSTRAINT pix_pck_audio_qc_status_check
    CHECK (audio_qc_status IN ('pending', 'pass', 'fail'));

CREATE INDEX IF NOT EXISTS idx_pix_pck_is_free
  ON public.pix_pck (is_free)
  WHERE is_free = true;

-- ============================================================
-- C) Activation guard trigger on k_kut_assets
--
-- BEFORE INSERT OR UPDATE:
--   • If the row is being activated (status → 'active') and audio
--     has not passed QC, block the operation.
--   • If audio_qc_status is set to 'fail', automatically set
--     is_free = true so anon users can still access the asset.
-- ============================================================

CREATE OR REPLACE FUNCTION public.k_kut_assets_audio_qc_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-set is_free when QC fails
  IF NEW.audio_qc_status = 'fail' THEN
    NEW.is_free := true;
  END IF;

  -- Block activation without a QC pass
  IF NEW.status = 'active' AND NEW.audio_qc_status IS DISTINCT FROM 'pass' THEN
    RAISE EXCEPTION
      'Audio QC required: k_kut_assets % cannot be set to active until audio_qc_status = ''pass'' (current: %).',
      NEW.id, NEW.audio_qc_status
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_k_kut_assets_audio_qc_guard ON public.k_kut_assets;
CREATE TRIGGER trg_k_kut_assets_audio_qc_guard
  BEFORE INSERT OR UPDATE OF status, audio_qc_status
  ON public.k_kut_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.k_kut_assets_audio_qc_guard();

-- ============================================================
-- D) Activation guard trigger on pix_pck
--
-- BEFORE INSERT OR UPDATE:
--   • If is_active is being set to true and audio has not passed
--     QC, block the operation.
--   • If audio_qc_status is set to 'fail', automatically set
--     is_free = true.
-- ============================================================

CREATE OR REPLACE FUNCTION public.pix_pck_audio_qc_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-set is_free when QC fails
  IF NEW.audio_qc_status = 'fail' THEN
    NEW.is_free := true;
  END IF;

  -- Block activation without a QC pass
  IF NEW.is_active = true AND NEW.audio_qc_status IS DISTINCT FROM 'pass' THEN
    RAISE EXCEPTION
      'Audio QC required: pix_pck % cannot be set to is_active=true until audio_qc_status = ''pass'' (current: %).',
      NEW.id, NEW.audio_qc_status
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pix_pck_audio_qc_guard ON public.pix_pck;
CREATE TRIGGER trg_pix_pck_audio_qc_guard
  BEFORE INSERT OR UPDATE OF is_active, audio_qc_status
  ON public.pix_pck
  FOR EACH ROW
  EXECUTE FUNCTION public.pix_pck_audio_qc_guard();

-- ============================================================
-- E) RLS: anon access to is_free=true assets on k_kut_assets
--
-- Existing policies:
--   k_kut_assets_authenticated_read  — org-scoped active assets
--   k_kut_assets_service_write       — service_role full access
-- New policy:
--   k_kut_assets_anon_free_read      — anon read of is_free=true
-- ============================================================

DROP POLICY IF EXISTS "k_kut_assets_anon_free_read" ON public.k_kut_assets;

CREATE POLICY "k_kut_assets_anon_free_read"
  ON public.k_kut_assets
  FOR SELECT
  TO anon
  USING (is_free = true);

-- ============================================================
-- F) RLS: enable on pix_pck + add policies
--
-- pix_pck had no RLS before this migration.  Enable it now and
-- add policies to match k_kut_assets access model.
-- ============================================================

ALTER TABLE public.pix_pck ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pix_pck_authenticated_read"  ON public.pix_pck;
DROP POLICY IF EXISTS "pix_pck_anon_free_read"       ON public.pix_pck;
DROP POLICY IF EXISTS "pix_pck_service_write"        ON public.pix_pck;

-- Authenticated users see active packages in their org
CREATE POLICY "pix_pck_authenticated_read"
  ON public.pix_pck
  FOR SELECT
  TO authenticated
  USING (
    org_id = public.get_jwt_org_id()
    AND is_active = true
  );

-- Anon users see free packages
CREATE POLICY "pix_pck_anon_free_read"
  ON public.pix_pck
  FOR SELECT
  TO anon
  USING (is_free = true);

-- Service role full access (ingestion / admin)
CREATE POLICY "pix_pck_service_write"
  ON public.pix_pck
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Rollback notes (ALLOW_BIC required to execute)
-- ============================================================
-- DROP TRIGGER  IF EXISTS trg_k_kut_assets_audio_qc_guard ON public.k_kut_assets;
-- DROP FUNCTION IF EXISTS public.k_kut_assets_audio_qc_guard();
-- DROP TRIGGER  IF EXISTS trg_pix_pck_audio_qc_guard      ON public.pix_pck;
-- DROP FUNCTION IF EXISTS public.pix_pck_audio_qc_guard();
-- DROP POLICY   IF EXISTS "k_kut_assets_anon_free_read"   ON public.k_kut_assets;
-- DROP POLICY   IF EXISTS "pix_pck_authenticated_read"    ON public.pix_pck;
-- DROP POLICY   IF EXISTS "pix_pck_anon_free_read"        ON public.pix_pck;
-- DROP POLICY   IF EXISTS "pix_pck_service_write"         ON public.pix_pck;
-- ALTER TABLE   public.pix_pck DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE   public.k_kut_assets DROP CONSTRAINT IF EXISTS k_kut_assets_audio_qc_status_check;
-- ALTER TABLE   public.k_kut_assets DROP COLUMN IF EXISTS audio_qc_status; -- ALLOW_BIC
-- ALTER TABLE   public.k_kut_assets DROP COLUMN IF EXISTS is_free;          -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP CONSTRAINT IF EXISTS pix_pck_audio_qc_status_check;
-- ALTER TABLE   public.pix_pck      DROP COLUMN IF EXISTS audio_qc_status; -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP COLUMN IF EXISTS is_free;          -- ALLOW_BIC
