-- =============================================================
-- Migration: 20260409000001_audio_qc_activation_guard.sql
-- G Putnam Music — Audio QC Activation Guard + Failure=FREE
--
-- RULE: Every inventory item — K-KUT, mini-KUT (via pix_pck),
--       and K-kUpId — MUST pass a scripted audio QC check before
--       it can be activated.  Activation (status → 'active' /
--       is_active → true) is BLOCKED at the database level until
--       audio_qc_status = 'pass'.
--
-- RULE: Failure = FREE.  When audio_qc_status is set to 'fail',
--       is_free is automatically set to TRUE.  RLS is updated so
--       that free-flagged assets are visible to ALL users (anon).
--
-- Covers:
--   A) public.k_kut_assets
--      • Adds: audio_qc_status, audio_qc_at, audio_qc_note, is_free
--      • Trigger: block status → 'active' if audio_qc_status != 'pass'
--      • Trigger: auto-set is_free = true when audio_qc_status = 'fail'
--      • Updated RLS: anon SELECT allowed when is_free = true
--
--   B) public.pix_pck
--      • Adds: audio_qc_status, audio_qc_note, is_free
--      • Trigger: block is_active → true if audio_qc_status != 'pass'
--      • Trigger: auto-set is_free = true when audio_qc_status = 'fail'
--
--   C) View: public.v_inventory_qc_status
--      Full QC dashboard — every asset and package with its
--      invention type, QC state, and free/paid status.
--
-- Rollback notes at the bottom of the file.
-- =============================================================


-- ============================================================
-- A) public.k_kut_assets — QC columns + guards
-- ============================================================

-- A1. Add QC columns (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'k_kut_assets'
      AND column_name  = 'audio_qc_status'
  ) THEN
    ALTER TABLE public.k_kut_assets
      ADD COLUMN audio_qc_status text      NOT NULL DEFAULT 'pending'
                                           CHECK (audio_qc_status IN ('pending', 'pass', 'fail')),
      ADD COLUMN audio_qc_at     timestamptz,
      ADD COLUMN audio_qc_note   text,
      ADD COLUMN is_free         boolean   NOT NULL DEFAULT false;
  END IF;
END;
$$;

-- A2. Index for QC state + free flag (coverage queries, RLS)
CREATE INDEX IF NOT EXISTS idx_k_kut_assets_qc_status
  ON public.k_kut_assets (audio_qc_status);

CREATE INDEX IF NOT EXISTS idx_k_kut_assets_is_free
  ON public.k_kut_assets (is_free)
  WHERE is_free = true;

-- A3. Trigger function: block activation unless audio_qc_status = 'pass'
--     Fires BEFORE UPDATE on k_kut_assets.
--     Applies to ALL inventory variants: K-KUT, K-kut (K-kUpId).
CREATE OR REPLACE FUNCTION public.enforce_audio_qc_before_asset_activation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only enforce when status is being set to 'active'
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status = 'active'
     AND NEW.audio_qc_status IS DISTINCT FROM 'pass'
  THEN
    RAISE EXCEPTION
      'Audio QC required: k_kut_assets % (variant=%, tag=%) cannot be activated '
      'until audio_qc_status = ''pass''. Current status: ''%''.',
      NEW.id, NEW.variant, NEW.structure_tag, NEW.audio_qc_status
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_audio_qc_asset_activation ON public.k_kut_assets;
CREATE TRIGGER trg_enforce_audio_qc_asset_activation
  BEFORE UPDATE OF status
  ON public.k_kut_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_audio_qc_before_asset_activation();

-- A4. Trigger function: auto-set is_free = true on QC failure
CREATE OR REPLACE FUNCTION public.auto_free_on_asset_qc_fail()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When audio QC transitions to 'fail', mark the asset as free
  IF NEW.audio_qc_status = 'fail'
     AND (OLD.audio_qc_status IS DISTINCT FROM 'fail')
  THEN
    NEW.is_free    := true;
    NEW.audio_qc_at := COALESCE(NEW.audio_qc_at, now());
  END IF;

  -- Stamp the QC timestamp when status first moves out of 'pending'
  IF OLD.audio_qc_status = 'pending'
     AND NEW.audio_qc_status <> 'pending'
     AND NEW.audio_qc_at IS NULL
  THEN
    NEW.audio_qc_at := now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_free_on_asset_qc_fail ON public.k_kut_assets;
CREATE TRIGGER trg_auto_free_on_asset_qc_fail
  BEFORE UPDATE OF audio_qc_status
  ON public.k_kut_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_free_on_asset_qc_fail();

-- A5. Updated RLS: free-flagged assets visible to anon (Failure = FREE for ALL users)
--     Drop old authenticated-only read policy and replace with a two-tier policy.
DROP POLICY IF EXISTS "k_kut_assets_authenticated_read"  ON public.k_kut_assets;
DROP POLICY IF EXISTS "k_kut_assets_free_public_read"    ON public.k_kut_assets;
DROP POLICY IF EXISTS "k_kut_assets_paid_read"           ON public.k_kut_assets;

-- Anon can see (and therefore play) assets that are free due to QC failure
CREATE POLICY "k_kut_assets_free_public_read"
  ON public.k_kut_assets
  FOR SELECT
  TO anon, authenticated
  USING (
    is_free = true
    AND status = 'active'
  );

-- Authenticated users see their org's active + paid assets (original behaviour)
CREATE POLICY "k_kut_assets_paid_read"
  ON public.k_kut_assets
  FOR SELECT
  TO authenticated
  USING (
    org_id = public.get_jwt_org_id()
    AND status = 'active'
  );


-- ============================================================
-- B) public.pix_pck — QC columns + guards
--    pix_pck is the parent of mini-KUT text assets.
--    Its audio track must pass QC before the package can go live.
-- ============================================================

-- B1. Add QC columns (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'pix_pck'
      AND column_name  = 'audio_qc_status'
  ) THEN
    ALTER TABLE public.pix_pck
      ADD COLUMN audio_qc_status text    NOT NULL DEFAULT 'pending'
                                         CHECK (audio_qc_status IN ('pending', 'pass', 'fail')),
      ADD COLUMN audio_qc_at     timestamptz,
      ADD COLUMN audio_qc_note   text,
      ADD COLUMN is_free         boolean NOT NULL DEFAULT false;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_pix_pck_qc_status
  ON public.pix_pck (audio_qc_status);

CREATE INDEX IF NOT EXISTS idx_pix_pck_is_free
  ON public.pix_pck (is_free)
  WHERE is_free = true;

-- B2. Trigger function: block pix_pck activation unless audio_qc_status = 'pass'
CREATE OR REPLACE FUNCTION public.enforce_audio_qc_before_pck_activation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.is_active IS DISTINCT FROM OLD.is_active
     AND NEW.is_active = true
     AND NEW.audio_qc_status IS DISTINCT FROM 'pass'
  THEN
    RAISE EXCEPTION
      'Audio QC required: pix_pck % (''%'') cannot be activated '
      'until audio_qc_status = ''pass''. Current QC status: ''%''.',
      NEW.id, NEW.title, NEW.audio_qc_status
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_audio_qc_pck_activation ON public.pix_pck;
CREATE TRIGGER trg_enforce_audio_qc_pck_activation
  BEFORE UPDATE OF is_active
  ON public.pix_pck
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_audio_qc_before_pck_activation();

-- B3. Trigger function: auto-set is_free = true on pix_pck QC failure
CREATE OR REPLACE FUNCTION public.auto_free_on_pck_qc_fail()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.audio_qc_status = 'fail'
     AND (OLD.audio_qc_status IS DISTINCT FROM 'fail')
  THEN
    NEW.is_free    := true;
    NEW.audio_qc_at := COALESCE(NEW.audio_qc_at, now());
  END IF;

  IF OLD.audio_qc_status = 'pending'
     AND NEW.audio_qc_status <> 'pending'
     AND NEW.audio_qc_at IS NULL
  THEN
    NEW.audio_qc_at := now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_free_on_pck_qc_fail ON public.pix_pck;
CREATE TRIGGER trg_auto_free_on_pck_qc_fail
  BEFORE UPDATE OF audio_qc_status
  ON public.pix_pck
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_free_on_pck_qc_fail();


-- ============================================================
-- C) View: public.v_inventory_qc_status
--
-- One row per inventory item across all 3 invention types:
--   • K-KUT / K-kUpId audio assets (from k_kut_assets)
--   • mini-KUT parent packages     (from pix_pck)
--
-- Columns:
--   item_type        — 'K-KUT' | 'K-kUpId' | 'mini-KUT-pkg'
--   item_id          — uuid of the k_kut_assets or pix_pck row
--   title            — human-readable label
--   invention        — which of the 3 inventions this belongs to
--   status           — activation status
--   audio_qc_status  — pending | pass | fail
--   audio_qc_at      — when QC was run (null = not yet run)
--   is_free          — true when Failure=FREE has been triggered
--   is_active        — true when live for users
-- ============================================================

CREATE OR REPLACE VIEW public.v_inventory_qc_status AS

-- K-KUT and K-kUpId assets (variant-level audio)
SELECT
  a.variant                              AS item_type,
  a.id                                   AS item_id,
  a.structure_tag                        AS title,
  CASE a.variant
    WHEN 'K-KUT'  THEN 'K-KUT'
    WHEN 'K-kut'  THEN 'K-kUpId'
    ELSE a.variant
  END                                    AS invention,
  a.status                               AS status,
  a.audio_qc_status                      AS audio_qc_status,
  a.audio_qc_at                          AS audio_qc_at,
  a.is_free                              AS is_free,
  (a.status = 'active')                  AS is_active,
  a.org_id                               AS org_id,
  a.pix_pck_id                           AS pix_pck_id
FROM public.k_kut_assets a

UNION ALL

-- pix_pck packages (mini-KUT parent track QC)
SELECT
  'mini-KUT-pkg'                         AS item_type,
  p.id                                   AS item_id,
  p.title                                AS title,
  'mini-KUT'                             AS invention,
  CASE WHEN p.is_active THEN 'active' ELSE 'staged' END AS status,
  p.audio_qc_status                      AS audio_qc_status,
  p.audio_qc_at                          AS audio_qc_at,
  p.is_free                              AS is_free,
  p.is_active                            AS is_active,
  p.org_id                               AS org_id,
  p.id                                   AS pix_pck_id
FROM public.pix_pck p;

-- Admin and service role can see full QC status
GRANT SELECT ON public.v_inventory_qc_status TO authenticated, service_role;

-- Anon can see only free items (Failure=FREE display)
DROP POLICY IF EXISTS "v_inventory_qc_public_free_read" ON public.v_inventory_qc_status;
-- Views don't support RLS directly — anon access is enforced via the underlying table policies above.
-- The view is granted to authenticated + service_role only; the underlying free-read policy
-- on k_kut_assets gives anon access to the raw rows they are entitled to.


-- ============================================================
-- Rollback notes (ALLOW_BIC required)
-- ============================================================
-- DROP TRIGGER  IF EXISTS trg_enforce_audio_qc_asset_activation ON public.k_kut_assets;
-- DROP FUNCTION IF EXISTS public.enforce_audio_qc_before_asset_activation();
-- DROP TRIGGER  IF EXISTS trg_auto_free_on_asset_qc_fail       ON public.k_kut_assets;
-- DROP FUNCTION IF EXISTS public.auto_free_on_asset_qc_fail();
-- DROP TRIGGER  IF EXISTS trg_enforce_audio_qc_pck_activation  ON public.pix_pck;
-- DROP FUNCTION IF EXISTS public.enforce_audio_qc_before_pck_activation();
-- DROP TRIGGER  IF EXISTS trg_auto_free_on_pck_qc_fail         ON public.pix_pck;
-- DROP FUNCTION IF EXISTS public.auto_free_on_pck_qc_fail();
-- DROP VIEW     IF EXISTS public.v_inventory_qc_status;
-- DROP POLICY   IF EXISTS "k_kut_assets_free_public_read" ON public.k_kut_assets; -- ALLOW_BIC
-- DROP POLICY   IF EXISTS "k_kut_assets_paid_read"        ON public.k_kut_assets; -- ALLOW_BIC
-- ALTER TABLE public.k_kut_assets DROP COLUMN IF EXISTS audio_qc_status; -- ALLOW_BIC
-- ALTER TABLE public.k_kut_assets DROP COLUMN IF EXISTS audio_qc_at;     -- ALLOW_BIC
-- ALTER TABLE public.k_kut_assets DROP COLUMN IF EXISTS audio_qc_note;   -- ALLOW_BIC
-- ALTER TABLE public.k_kut_assets DROP COLUMN IF EXISTS is_free;         -- ALLOW_BIC
-- ALTER TABLE public.pix_pck      DROP COLUMN IF EXISTS audio_qc_status; -- ALLOW_BIC
-- ALTER TABLE public.pix_pck      DROP COLUMN IF EXISTS audio_qc_at;     -- ALLOW_BIC
-- ALTER TABLE public.pix_pck      DROP COLUMN IF EXISTS audio_qc_note;   -- ALLOW_BIC
-- ALTER TABLE public.pix_pck      DROP COLUMN IF EXISTS is_free;         -- ALLOW_BIC
