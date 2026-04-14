-- =============================================================
-- Migration: 20260409000001_audio_qc_activation_guard.sql
-- G Putnam Music — Audio QC Activation Guard + Failure=FREE
-- Idempotent: ADD COLUMN IF NOT EXISTS / DROP CONSTRAINT / ADD CONSTRAINT
--
-- Rules enforced at the DB layer:
--   1. k_kut_assets.status  → 'active'  is BLOCKED unless audio_qc_status = 'pass'
--   2. pix_pck.is_active    → true       is BLOCKED unless audio_qc_status = 'pass'
--   3. audio_qc_status = 'fail' auto-sets is_free = true (Failure=FREE)
--   4. Anon users can read k_kut_assets / pix_pck rows where is_free = true
-- =============================================================


-- ============================================================
-- A) public.k_kut_assets — QC columns
-- ============================================================

ALTER TABLE public.k_kut_assets
  ADD COLUMN IF NOT EXISTS audio_qc_status text        NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS audio_qc_at     timestamptz,
  ADD COLUMN IF NOT EXISTS audio_qc_note   text,
  ADD COLUMN IF NOT EXISTS is_free         boolean     NOT NULL DEFAULT false;

ALTER TABLE public.k_kut_assets
  DROP CONSTRAINT IF EXISTS k_kut_assets_audio_qc_status_check;

ALTER TABLE public.k_kut_assets
  ADD CONSTRAINT k_kut_assets_audio_qc_status_check
    CHECK (audio_qc_status IN ('pending', 'pass', 'fail'));

CREATE INDEX IF NOT EXISTS idx_k_kut_assets_qc_status
  ON public.k_kut_assets (audio_qc_status);

CREATE INDEX IF NOT EXISTS idx_k_kut_assets_is_free
  ON public.k_kut_assets (is_free)
  WHERE is_free = true;


-- ============================================================
-- B) public.pix_pck — QC columns
-- ============================================================

ALTER TABLE public.pix_pck
  ADD COLUMN IF NOT EXISTS audio_qc_status text        NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS audio_qc_at     timestamptz,
  ADD COLUMN IF NOT EXISTS audio_qc_note   text,
  ADD COLUMN IF NOT EXISTS is_free         boolean     NOT NULL DEFAULT false;

ALTER TABLE public.pix_pck
  DROP CONSTRAINT IF EXISTS pix_pck_audio_qc_status_check;

ALTER TABLE public.pix_pck
  ADD CONSTRAINT pix_pck_audio_qc_status_check
    CHECK (audio_qc_status IN ('pending', 'pass', 'fail'));

CREATE INDEX IF NOT EXISTS idx_pix_pck_qc_status
  ON public.pix_pck (audio_qc_status);

CREATE INDEX IF NOT EXISTS idx_pix_pck_is_free
  ON public.pix_pck (is_free)
  WHERE is_free = true;


-- ============================================================
-- C) Activation guard trigger on k_kut_assets
--    • Blocks status → 'active' without a QC pass
--    • Auto-sets is_free = true when audio_qc_status = 'fail'
--    • Stamps audio_qc_at when QC status first leaves 'pending'
-- ============================================================

CREATE OR REPLACE FUNCTION public.k_kut_assets_audio_qc_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-set is_free when QC fails; stamp audio_qc_at on first transition
  IF NEW.audio_qc_status = 'fail' THEN
    NEW.is_free := true;
  END IF;

  IF NEW.audio_qc_status IS DISTINCT FROM OLD.audio_qc_status
     AND NEW.audio_qc_status <> 'pending'
     AND NEW.audio_qc_at IS NULL
  THEN
    NEW.audio_qc_at := now();
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
-- ============================================================

CREATE OR REPLACE FUNCTION public.pix_pck_audio_qc_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-set is_free when QC fails; stamp audio_qc_at on first transition
  IF NEW.audio_qc_status = 'fail' THEN
    NEW.is_free := true;
  END IF;

  IF NEW.audio_qc_status IS DISTINCT FROM OLD.audio_qc_status
     AND NEW.audio_qc_status <> 'pending'
     AND NEW.audio_qc_at IS NULL
  THEN
    NEW.audio_qc_at := now();
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
-- E) RLS: k_kut_assets — two-tier read policy
-- ============================================================

DROP POLICY IF EXISTS "k_kut_assets_authenticated_read"  ON public.k_kut_assets;
DROP POLICY IF EXISTS "k_kut_assets_free_public_read"    ON public.k_kut_assets;
DROP POLICY IF EXISTS "k_kut_assets_paid_read"           ON public.k_kut_assets;
DROP POLICY IF EXISTS "k_kut_assets_anon_free_read"      ON public.k_kut_assets;

-- Anon + authenticated can read free (Failure=FREE) active assets
CREATE POLICY "k_kut_assets_free_public_read"
  ON public.k_kut_assets
  FOR SELECT
  TO anon, authenticated
  USING (is_free = true AND status = 'active');

-- Authenticated users see their org's active paid assets
CREATE POLICY "k_kut_assets_paid_read"
  ON public.k_kut_assets
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_jwt_org_id() AND status = 'active');


-- ============================================================
-- F) RLS: pix_pck — enable + policies
-- ============================================================

ALTER TABLE public.pix_pck ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pix_pck_authenticated_read"  ON public.pix_pck;
DROP POLICY IF EXISTS "pix_pck_anon_free_read"       ON public.pix_pck;
DROP POLICY IF EXISTS "pix_pck_service_write"        ON public.pix_pck;

CREATE POLICY "pix_pck_authenticated_read"
  ON public.pix_pck
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_jwt_org_id() AND is_active = true);

CREATE POLICY "pix_pck_anon_free_read"
  ON public.pix_pck
  FOR SELECT
  TO anon
  USING (is_free = true);

CREATE POLICY "pix_pck_service_write"
  ON public.pix_pck
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- G) View: public.v_inventory_qc_status
--    QC dashboard — every asset and package with QC state.
-- ============================================================

CREATE OR REPLACE VIEW public.v_inventory_qc_status AS

-- K-KUT and K-kUpId assets (variant-level audio)
SELECT
  a.variant                              AS item_type,
  a.id                                   AS item_id,
  a.structure_tag                        AS title,
  CASE a.variant
    WHEN 'K-KUT' THEN 'K-KUT'
    WHEN 'K-kut' THEN 'K-kUpId'
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

GRANT SELECT ON public.v_inventory_qc_status TO authenticated, service_role;


-- ============================================================
-- Rollback notes (ALLOW_BIC required to execute)
-- ============================================================
-- DROP TRIGGER  IF EXISTS trg_k_kut_assets_audio_qc_guard ON public.k_kut_assets;
-- DROP FUNCTION IF EXISTS public.k_kut_assets_audio_qc_guard();
-- DROP TRIGGER  IF EXISTS trg_pix_pck_audio_qc_guard      ON public.pix_pck;
-- DROP FUNCTION IF EXISTS public.pix_pck_audio_qc_guard();
-- DROP POLICY   IF EXISTS "k_kut_assets_free_public_read"  ON public.k_kut_assets;
-- DROP POLICY   IF EXISTS "k_kut_assets_paid_read"         ON public.k_kut_assets;
-- DROP POLICY   IF EXISTS "pix_pck_authenticated_read"     ON public.pix_pck;
-- DROP POLICY   IF EXISTS "pix_pck_anon_free_read"         ON public.pix_pck;
-- DROP POLICY   IF EXISTS "pix_pck_service_write"          ON public.pix_pck;
-- DROP VIEW     IF EXISTS public.v_inventory_qc_status;
-- ALTER TABLE   public.pix_pck DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE   public.k_kut_assets DROP CONSTRAINT IF EXISTS k_kut_assets_audio_qc_status_check; -- ALLOW_BIC
-- ALTER TABLE   public.k_kut_assets DROP COLUMN IF EXISTS audio_qc_status; -- ALLOW_BIC
-- ALTER TABLE   public.k_kut_assets DROP COLUMN IF EXISTS audio_qc_at;     -- ALLOW_BIC
-- ALTER TABLE   public.k_kut_assets DROP COLUMN IF EXISTS audio_qc_note;   -- ALLOW_BIC
-- ALTER TABLE   public.k_kut_assets DROP COLUMN IF EXISTS is_free;         -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP CONSTRAINT IF EXISTS pix_pck_audio_qc_status_check; -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP COLUMN IF EXISTS audio_qc_status; -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP COLUMN IF EXISTS audio_qc_at;     -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP COLUMN IF EXISTS audio_qc_note;   -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP COLUMN IF EXISTS is_free;         -- ALLOW_BIC
