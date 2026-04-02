-- =============================================================
-- Jewelry Mirror – G Putnam Music
-- Migration: 20260402000001_jewelry_mirror.sql
--
-- Purpose:
--   Establishes the GPMCC Jewelry Mirror — a derived projection
--   of k_kut_assets that is scoped EXCLUSIVELY to physical jewelry
--   items (charms, lockets, rings, bracelets, pendants) sold as
--   GPM K-KUT or mKUT capsules.
--
--   This is a SEPARATE model from the Canonical Core (k_kut_assets).
--   It mirrors canonical data in near real-time via trigger and
--   adds jewelry-specific fields (item_type, item_sku, locket_theme,
--   engraving, gifting metadata, activation timestamp).
--
--   Policy: records in this table may only be created/linked via
--   org-scoped admin operations (service_role). Receiver-facing
--   functions query it read-only via a secure RLS policy.
--
-- Tables:
--   public.jewelry_capsules  — derived capsule registry
--   public.jewelry_events    — per-capsule open/replay/share telemetry
--
-- Trigger:
--   When a k_kut_assets row is updated to status='active', any
--   linked jewelry_capsule mirror row is automatically synced
--   (storage_path, mime_type, duration_ms, status mirror).
--
-- Rollback (bottom of file).
-- =============================================================

-- ============================================================
-- A) jewelry_capsules
--    One row per physical jewelry item that carries a GPM
--    K-KUT or mKUT digital capsule inside it.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.jewelry_capsules (
  -- Identity
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Canonical link — the actual audio asset this capsule plays.
  -- ON DELETE RESTRICT: cannot orphan a capsule by deleting asset.
  k_kut_asset_id      uuid        NOT NULL
                        REFERENCES public.k_kut_assets(id)
                        ON DELETE RESTRICT,

  -- Physical jewelry type
  item_type           text        NOT NULL
                        CHECK (item_type IN ('charm','locket','ring','bracelet','pendant')),

  -- Physical product SKU (links back to inventory/Shopify/Stripe)
  item_sku            text,

  -- Visual theme for the locket-open animation in /k/[id]
  -- Skin engine will use this to select the correct palette.
  locket_theme        text        NOT NULL DEFAULT 'classic'
                        CHECK (locket_theme IN ('classic','rose','obsidian','moonlit')),

  -- Optional personalization engraved/printed on the item
  engraving_text      text,

  -- Gifting metadata (set at purchase / activation time)
  gifted_to_name      text,
  gifted_by_name      text,
  gift_message        text,

  -- Capsule lifecycle
  activated_at        timestamptz,                   -- set when recipient first opens
  capsule_status      text        NOT NULL DEFAULT 'assigned'
                        CHECK (capsule_status IN ('assigned','active','replayed','retired')),

  -- Mirror fields synced from k_kut_assets (denormalized for fast reads)
  mirrored_path       text,                          -- storage_path from source asset
  mirrored_mime       text,                          -- mime_type from source asset
  mirrored_duration   integer,                       -- duration_ms from source asset
  mirrored_variant    text,                          -- 'K-KUT' | 'K-kut'
  mirrored_structure  text,                          -- 'Verse' | 'BR' | 'Ch'
  last_synced_at      timestamptz,                   -- timestamp of most recent mirror sync

  -- Org scope: must match k_kut_assets.org_id
  org_id              uuid        NOT NULL,

  -- Housekeeping
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_jewelry_capsules_asset
  ON public.jewelry_capsules (k_kut_asset_id);

CREATE INDEX IF NOT EXISTS idx_jewelry_capsules_org
  ON public.jewelry_capsules (org_id);

CREATE INDEX IF NOT EXISTS idx_jewelry_capsules_sku
  ON public.jewelry_capsules (item_sku)
  WHERE item_sku IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_jewelry_capsules_status
  ON public.jewelry_capsules (capsule_status)
  WHERE capsule_status = 'active';

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.jewelry_capsules_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_jewelry_capsules_updated_at ON public.jewelry_capsules;
CREATE TRIGGER trg_jewelry_capsules_updated_at
  BEFORE UPDATE ON public.jewelry_capsules
  FOR EACH ROW EXECUTE FUNCTION public.jewelry_capsules_set_updated_at();

-- ============================================================
-- B) jewelry_events
--    Telemetry for every receiver-facing jewelry capsule action.
--    Kept separate from the canonical audit_log to allow
--    distinct retention policy and analytics access patterns.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.jewelry_events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  capsule_id      uuid        NOT NULL
                    REFERENCES public.jewelry_capsules(id)
                    ON DELETE CASCADE,

  event_type      text        NOT NULL
                    CHECK (event_type IN ('open','replay','share','view','activate')),

  -- Optional correlation — anonymous session fingerprint (not PII)
  session_id      text,

  -- Coarse device signal for analytics (e.g. 'mobile-ios', 'desktop-web')
  device_hint     text,

  -- Geographic coarse signal (country code only — no fine location)
  country_code    text,

  occurred_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jewelry_events_capsule
  ON public.jewelry_events (capsule_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_jewelry_events_type
  ON public.jewelry_events (event_type, occurred_at DESC);

-- ============================================================
-- C) Near real-time mirror sync trigger
--    When k_kut_assets.status is set to 'active' (or storage
--    fields change on an active row), propagate to any linked
--    jewelry_capsule mirror fields.
-- ============================================================

CREATE OR REPLACE FUNCTION public.sync_k_kut_asset_to_jewelry()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Only sync when the asset is active and relevant fields changed
  IF NEW.status = 'active' AND (
    NEW.storage_path   IS DISTINCT FROM OLD.storage_path   OR
    NEW.mime_type      IS DISTINCT FROM OLD.mime_type      OR
    NEW.duration_ms    IS DISTINCT FROM OLD.duration_ms    OR
    NEW.status         IS DISTINCT FROM OLD.status
  ) THEN
    UPDATE public.jewelry_capsules
    SET
      mirrored_path      = NEW.storage_path,
      mirrored_mime      = NEW.mime_type,
      mirrored_duration  = NEW.duration_ms,
      mirrored_variant   = NEW.variant,
      mirrored_structure = NEW.structure_tag,
      last_synced_at     = now()
    WHERE k_kut_asset_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_k_kut_asset_to_jewelry ON public.k_kut_assets;
CREATE TRIGGER trg_sync_k_kut_asset_to_jewelry
  AFTER UPDATE ON public.k_kut_assets
  FOR EACH ROW EXECUTE FUNCTION public.sync_k_kut_asset_to_jewelry();

-- ============================================================
-- D) RLS — jewelry_capsules
--    Receivers query read-only.  Admin writes via service_role.
-- ============================================================

ALTER TABLE public.jewelry_capsules ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read capsules in their own org.
DROP POLICY IF EXISTS "jewelry_capsules_org_read" ON public.jewelry_capsules;
CREATE POLICY "jewelry_capsules_org_read"
  ON public.jewelry_capsules
  FOR SELECT
  TO authenticated
  USING (org_id = app_utils.get_user_tenant());

-- service_role bypasses RLS entirely (Supabase default behaviour).
-- No explicit public/anon read policy — jewelry content is gated.

ALTER TABLE public.jewelry_events ENABLE ROW LEVEL SECURITY;

-- Only service_role writes events.
-- Authenticated users may read their own capsule's events.
DROP POLICY IF EXISTS "jewelry_events_capsule_read" ON public.jewelry_events;
CREATE POLICY "jewelry_events_capsule_read"
  ON public.jewelry_events
  FOR SELECT
  TO authenticated
  USING (
    capsule_id IN (
      SELECT id FROM public.jewelry_capsules
      WHERE org_id = app_utils.get_user_tenant()
    )
  );

-- ============================================================
-- E) Helper view for the /k/[id] edge function
--    Returns the mirror fields needed to render the locket
--    without a second k_kut_assets join.
-- ============================================================

CREATE OR REPLACE VIEW public.v_jewelry_capsule_open AS
SELECT
  jc.id                 AS capsule_id,
  jc.k_kut_asset_id,
  jc.item_type,
  jc.locket_theme,
  jc.engraving_text,
  jc.gifted_to_name,
  jc.gifted_by_name,
  jc.gift_message,
  jc.capsule_status,
  jc.mirrored_path,
  jc.mirrored_mime,
  jc.mirrored_duration,
  jc.mirrored_variant,
  jc.mirrored_structure,
  jc.org_id
FROM public.jewelry_capsules jc
WHERE jc.capsule_status IN ('assigned','active','replayed');

-- ============================================================
-- Rollback notes
--
-- DROP VIEW  IF EXISTS public.v_jewelry_capsule_open;
-- DROP TABLE IF EXISTS public.jewelry_events CASCADE;
-- DROP TABLE IF EXISTS public.jewelry_capsules CASCADE;
-- DROP FUNCTION IF EXISTS public.sync_k_kut_asset_to_jewelry();
-- DROP FUNCTION IF EXISTS public.jewelry_capsules_set_updated_at();
-- DROP TRIGGER IF EXISTS trg_sync_k_kut_asset_to_jewelry ON public.k_kut_assets;
-- ============================================================
