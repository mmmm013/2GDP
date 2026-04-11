-- =============================================================
-- Commemorative KUT Pre-Order Integration
-- Migration: 20260410000002_commemorative_kut_preorder.sql
-- Idempotent: ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS
-- =============================================================
--
-- Adds pre-order support for Commemorative KUTs integrated into
-- the existing k_kut_assets and pix_pck tables.  Applies to ALL
-- KUT families (K-KUT, mini-KUT, K-kUpId) and is open-ended for
-- future KUT types via the kut_family text column.
--
-- NOT a standalone feature — this is wired directly into the
-- existing audio QC lifecycle:
--   pending pre-order → QC pass + status active → 'ready' → fulfilled
--
-- Tables touched:
--   public.k_kut_assets            — is_commemorative flag
--   public.pix_pck                 — is_commemorative flag
--   public.commemorative_preorders — new pre-order ledger
-- =============================================================

-- ============================================================
-- A) is_commemorative flag on k_kut_assets
-- ============================================================

ALTER TABLE public.k_kut_assets
  ADD COLUMN IF NOT EXISTS is_commemorative boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_k_kut_assets_commemorative
  ON public.k_kut_assets (is_commemorative)
  WHERE is_commemorative = true;

-- ============================================================
-- B) is_commemorative flag on pix_pck
-- ============================================================

ALTER TABLE public.pix_pck
  ADD COLUMN IF NOT EXISTS is_commemorative boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_pix_pck_commemorative
  ON public.pix_pck (is_commemorative)
  WHERE is_commemorative = true;

-- ============================================================
-- C) commemorative_preorders ledger
--
-- kut_family: open text (K-KUT | mini-KUT | K-kUpId | future)
-- item_table: 'k_kut_assets' or 'pix_pck' (extensible set)
-- status lifecycle: pending → ready (item activated) → fulfilled | cancelled
-- ============================================================

CREATE TABLE IF NOT EXISTS public.commemorative_preorders (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  kut_family    text        NOT NULL,
  item_table    text        NOT NULL
                            CHECK (item_table IN ('k_kut_assets', 'pix_pck')),
  item_id       uuid        NOT NULL,
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'ready', 'fulfilled', 'cancelled')),
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  ready_at      timestamptz,
  fulfilled_at  timestamptz,

  -- One pre-order per user per item (idempotent)
  CONSTRAINT commemorative_preorders_unique_user_item
    UNIQUE (item_table, item_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_comem_preorders_user
  ON public.commemorative_preorders (user_id);

CREATE INDEX IF NOT EXISTS idx_comem_preorders_item
  ON public.commemorative_preorders (item_table, item_id);

CREATE INDEX IF NOT EXISTS idx_comem_preorders_status
  ON public.commemorative_preorders (status)
  WHERE status IN ('pending', 'ready');

-- ============================================================
-- D) RLS on commemorative_preorders
-- ============================================================

ALTER TABLE public.commemorative_preorders ENABLE ROW LEVEL SECURITY;

-- Users read their own pre-orders
DROP POLICY IF EXISTS "comem_preorders_user_read" ON public.commemorative_preorders;
CREATE POLICY "comem_preorders_user_read"
  ON public.commemorative_preorders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users create their own pre-orders
DROP POLICY IF EXISTS "comem_preorders_user_insert" ON public.commemorative_preorders;
CREATE POLICY "comem_preorders_user_insert"
  ON public.commemorative_preorders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can cancel their own pending pre-orders
DROP POLICY IF EXISTS "comem_preorders_user_cancel" ON public.commemorative_preorders;
CREATE POLICY "comem_preorders_user_cancel"
  ON public.commemorative_preorders
  FOR UPDATE
  TO authenticated
  USING  (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (status = 'cancelled');

-- Service role full access (admin + fulfilment pipeline)
DROP POLICY IF EXISTS "comem_preorders_service_all" ON public.commemorative_preorders;
CREATE POLICY "comem_preorders_service_all"
  ON public.commemorative_preorders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- E) Trigger: k_kut_assets goes active + is_commemorative=true
--    → auto-advance pending pre-orders to 'ready'
-- ============================================================

CREATE OR REPLACE FUNCTION public.on_k_kut_asset_activated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'active'
     AND (OLD.status IS DISTINCT FROM 'active')
     AND NEW.is_commemorative = true
  THEN
    UPDATE public.commemorative_preorders
    SET    status   = 'ready',
           ready_at = now()
    WHERE  item_table = 'k_kut_assets'
      AND  item_id    = NEW.id
      AND  status     = 'pending';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_k_kut_asset_preorder_ready ON public.k_kut_assets;
CREATE TRIGGER trg_k_kut_asset_preorder_ready
  AFTER UPDATE OF status
  ON public.k_kut_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.on_k_kut_asset_activated();

-- ============================================================
-- F) Trigger: pix_pck goes is_active=true + is_commemorative=true
--    → auto-advance pending pre-orders to 'ready'
-- ============================================================

CREATE OR REPLACE FUNCTION public.on_pix_pck_commemorative_activated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.is_active = true
     AND (OLD.is_active IS DISTINCT FROM true)
     AND NEW.is_commemorative = true
  THEN
    UPDATE public.commemorative_preorders
    SET    status   = 'ready',
           ready_at = now()
    WHERE  item_table = 'pix_pck'
      AND  item_id    = NEW.id
      AND  status     = 'pending';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pix_pck_preorder_ready ON public.pix_pck;
CREATE TRIGGER trg_pix_pck_preorder_ready
  AFTER UPDATE OF is_active
  ON public.pix_pck
  FOR EACH ROW
  EXECUTE FUNCTION public.on_pix_pck_commemorative_activated();

-- ============================================================
-- Rollback notes (ALLOW_BIC required to execute)
-- ============================================================
-- DROP TRIGGER  IF EXISTS trg_k_kut_asset_preorder_ready    ON public.k_kut_assets;
-- DROP TRIGGER  IF EXISTS trg_pix_pck_preorder_ready         ON public.pix_pck;
-- DROP FUNCTION IF EXISTS public.on_k_kut_asset_activated();
-- DROP FUNCTION IF EXISTS public.on_pix_pck_commemorative_activated();
-- DROP TABLE    IF EXISTS public.commemorative_preorders;    -- ALLOW_BIC
-- ALTER TABLE   public.k_kut_assets DROP COLUMN IF EXISTS is_commemorative; -- ALLOW_BIC
-- ALTER TABLE   public.pix_pck      DROP COLUMN IF EXISTS is_commemorative; -- ALLOW_BIC
