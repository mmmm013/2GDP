-- =============================================================
-- Migration: 20260405000001_pix_pck_lt_mkut_guard.sql
-- G Putnam Music — LT-PIX mini-KUT minimum enforcement
--
-- Covers:
--   A) public.pix_pck — canonical PIX package registry.
--      pck_type = 'LT' (Long Track), 'ST' (Short Track), 'EP' (EP cut).
--      LT-type packages must always hold at least 40 active mini-KUT
--      assets in k_kut_assets.
--   B) FK on k_kut_assets.pix_pck_id → public.pix_pck(id).
--      Migration 20260322000006 added this FK conditionally (only if
--      pix_pck existed at run time).  Now that pix_pck is created here,
--      we ensure the FK is present.
--   C) Trigger: enforce_lt_pix_mkut_minimum
--      Fires AFTER DELETE and AFTER UPDATE (when status changes away
--      from 'active') on k_kut_assets.  For LT-type pix_pck rows,
--      raises an exception if the remaining active-asset count would
--      fall below 40.
--   D) View: public.v_lt_pix_mkut_coverage
--      Shows every LT-PIX with its current active mini-KUT count and
--      whether it satisfies the minimum.  Used by the admin check API.
--
-- Rollback notes at the bottom of the file.
-- =============================================================

-- ============================================================
-- A) public.pix_pck
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pix_pck (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Human-readable label for this package (track title or bundle name)
  title       text        NOT NULL,

  -- Package type:
  --   LT  Long Track  — standard full-length track package; requires ≥40 active mini-KUTs
  --   ST  Short Track — sub-3-minute track; no minimum enforced at DB level
  --   EP  EP Cut      — EP-specific excerpt package; no minimum enforced at DB level
  pck_type    text        NOT NULL DEFAULT 'ST'
                CHECK (pck_type IN ('LT', 'ST', 'EP')),

  -- Owning organisation (mirrors org_id on k_kut_assets for RLS scope)
  org_id      uuid        NOT NULL,

  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pix_pck_org_id
  ON public.pix_pck (org_id);

CREATE INDEX IF NOT EXISTS idx_pix_pck_type_active
  ON public.pix_pck (pck_type, is_active);

-- updated_at auto-stamp
CREATE OR REPLACE FUNCTION public.pix_pck_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pix_pck_updated_at ON public.pix_pck;
CREATE TRIGGER trg_pix_pck_updated_at
  BEFORE UPDATE ON public.pix_pck
  FOR EACH ROW EXECUTE FUNCTION public.pix_pck_set_updated_at();

-- ============================================================
-- B) FK on k_kut_assets.pix_pck_id → public.pix_pck(id)
--    Migration 20260322000006 added this conditionally; ensure
--    it is present now that pix_pck is defined.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'k_kut_assets_pix_pck_fk'
  ) THEN
    ALTER TABLE public.k_kut_assets
      ADD CONSTRAINT k_kut_assets_pix_pck_fk
      FOREIGN KEY (pix_pck_id) REFERENCES public.pix_pck(id)
      ON DELETE RESTRICT;
  END IF;
END;
$$;

-- ============================================================
-- C) LT-PIX mini-KUT minimum guard trigger
--
-- Rule: every pix_pck row with pck_type = 'LT' must have at
-- least 40 rows in k_kut_assets where status = 'active'.
--
-- The trigger fires AFTER:
--   • DELETE  — an asset row is removed entirely
--   • UPDATE  — status changes away from 'active' (archive/stage)
--
-- Both operations can reduce the active count, so we re-check
-- after the mutation and abort if the LT minimum is violated.
-- ============================================================

CREATE OR REPLACE FUNCTION public.enforce_lt_pix_mkut_minimum()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pix_pck_id  uuid;
  v_pck_type    text;
  v_active_cnt  integer;
BEGIN
  -- Determine which pix_pck_id was affected.
  -- On DELETE, OLD holds the deleted row; on UPDATE, OLD holds the pre-change row.
  v_pix_pck_id := OLD.pix_pck_id;

  -- Only enforce for UPDATE when the asset was previously active and is
  -- being moved out of active status (archive or stage).  If the row was
  -- already inactive, the active count is unchanged.
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
      -- Status did not change — no impact on active count.
      RETURN NEW;
    END IF;
    IF OLD.status <> 'active' THEN
      -- Row was not active before the update — active count unchanged.
      RETURN NEW;
    END IF;
    -- OLD.status = 'active' and NEW.status <> 'active': active count decreases.
  END IF;

  -- Look up the package type.
  SELECT pck_type
  INTO   v_pck_type
  FROM   public.pix_pck
  WHERE  id = v_pix_pck_id;

  -- If the package is not LT, no minimum applies.
  IF v_pck_type IS DISTINCT FROM 'LT' THEN
    RETURN CASE TG_OP WHEN 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  -- Count remaining active assets after this operation completes.
  SELECT COUNT(*)
  INTO   v_active_cnt
  FROM   public.k_kut_assets
  WHERE  pix_pck_id = v_pix_pck_id
    AND  status = 'active'
    AND  (TG_OP = 'DELETE' OR id <> OLD.id);  -- exclude the row being archived/deleted

  IF v_active_cnt < 40 THEN
    RAISE EXCEPTION
      'LT-PIX minimum violated: pix_pck % (LT) would have only % active mini-KUT(s); minimum is 40.',
      v_pix_pck_id, v_active_cnt
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN CASE TG_OP WHEN 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

-- Attach to k_kut_assets (AFTER so the row is already gone/changed when we count)
DROP TRIGGER IF EXISTS trg_lt_pix_mkut_minimum ON public.k_kut_assets;
CREATE TRIGGER trg_lt_pix_mkut_minimum
  AFTER DELETE OR UPDATE OF status
  ON public.k_kut_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_lt_pix_mkut_minimum();

-- ============================================================
-- D) Coverage view: public.v_lt_pix_mkut_coverage
--
-- Returns one row per LT-type pix_pck with:
--   pix_pck_id      — the package UUID
--   title           — human-readable label
--   org_id          — owning organisation
--   active_mkut_cnt — number of active k_kut_assets rows
--   meets_minimum   — true when active_mkut_cnt >= 40
-- ============================================================

CREATE OR REPLACE VIEW public.v_lt_pix_mkut_coverage AS
SELECT
  p.id                                     AS pix_pck_id,
  p.title,
  p.org_id,
  COUNT(a.id)                              AS active_mkut_cnt,
  COUNT(a.id) >= 40                        AS meets_minimum
FROM public.pix_pck p
LEFT JOIN public.k_kut_assets a
       ON a.pix_pck_id = p.id
      AND a.status = 'active'
WHERE p.pck_type = 'LT'
GROUP BY p.id, p.title, p.org_id;

-- Grant read access to authenticated users (admin dashboards) and service_role
GRANT SELECT ON public.v_lt_pix_mkut_coverage TO authenticated, service_role;

-- ============================================================
-- Rollback notes (ALLOW_BIC required to execute these)
-- ============================================================
-- DROP TRIGGER  IF EXISTS trg_lt_pix_mkut_minimum   ON public.k_kut_assets;
-- DROP FUNCTION IF EXISTS public.enforce_lt_pix_mkut_minimum();
-- DROP VIEW     IF EXISTS public.v_lt_pix_mkut_coverage;
-- ALTER TABLE   public.k_kut_assets
--   DROP CONSTRAINT IF EXISTS k_kut_assets_pix_pck_fk; -- ALLOW_BIC
-- DROP TRIGGER  IF EXISTS trg_pix_pck_updated_at    ON public.pix_pck;
-- DROP FUNCTION IF EXISTS public.pix_pck_set_updated_at();
-- DROP TABLE    IF EXISTS public.pix_pck CASCADE; -- ALLOW_BIC
