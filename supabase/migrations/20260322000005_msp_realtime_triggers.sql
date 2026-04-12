-- =============================================================
-- MSP Realtime Broadcast Triggers for FLAGSHIP (gputnammusic.com)
-- Migration: 20260322000005_msp_realtime_triggers.sql
-- Uses realtime.broadcast_changes for tenant-scoped channels
-- Topic pattern: tenant:{tenant_id}:{table}
-- =============================================================

-- -------------------------------------------------------
-- k_kuts broadcast (K-KUTs / K-kuts live updates)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_broadcast_k_kuts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'tenant:' || COALESCE(NEW.tenant_id, OLD.tenant_id)::text || ':k_kuts',
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_k_kuts_broadcast ON public.k_kuts;
CREATE TRIGGER trg_k_kuts_broadcast
  AFTER INSERT OR UPDATE OR DELETE ON public.k_kuts
  FOR EACH ROW EXECUTE FUNCTION public.fn_broadcast_k_kuts();

-- -------------------------------------------------------
-- artists broadcast
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_broadcast_artists()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'tenant:' || COALESCE(NEW.tenant_id, OLD.tenant_id)::text || ':artists',
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_artists_broadcast ON public.artists;
CREATE TRIGGER trg_artists_broadcast
  AFTER INSERT OR UPDATE OR DELETE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.fn_broadcast_artists();

-- -------------------------------------------------------
-- tracks broadcast (existing table)
-- -------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='tracks'
  ) THEN
    -- Create the broadcast function
    EXECUTE $f$
      CREATE OR REPLACE FUNCTION public.fn_broadcast_tracks()
      RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $body$
      BEGIN
        PERFORM realtime.broadcast_changes(
          'tenant:' || COALESCE(
            (row_to_json(NEW) ->> 'organization_id'),
            (row_to_json(OLD) ->> 'organization_id'),
            'global'
          ) || ':tracks',
          TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
        );
        RETURN COALESCE(NEW, OLD);
      END;
      $body$;
    $f$;
    -- Attach trigger
    EXECUTE 'DROP TRIGGER IF EXISTS trg_tracks_broadcast ON public.tracks';
    EXECUTE $t$
      CREATE TRIGGER trg_tracks_broadcast
        AFTER INSERT OR UPDATE OR DELETE ON public.tracks
        FOR EACH ROW EXECUTE FUNCTION public.fn_broadcast_tracks()
    $t$;
  END IF;
END $$;

-- -------------------------------------------------------
-- gpm_donations broadcast (Heart-Tap)
-- -------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='gpm_donations'
  ) THEN
    EXECUTE $f$
      CREATE OR REPLACE FUNCTION public.fn_broadcast_donations()
      RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $body$
      BEGIN
        PERFORM realtime.broadcast_changes(
          'flagship:donations',
          TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
        );
        RETURN COALESCE(NEW, OLD);
      END;
      $body$;
    $f$;
    EXECUTE 'DROP TRIGGER IF EXISTS trg_donations_broadcast ON public.gpm_donations';
    EXECUTE $t$
      CREATE TRIGGER trg_donations_broadcast
        AFTER INSERT OR UPDATE ON public.gpm_donations
        FOR EACH ROW EXECUTE FUNCTION public.fn_broadcast_donations()
    $t$;
  END IF;
END $$;

-- Rollback notes:
-- DROP TRIGGER IF EXISTS trg_k_kuts_broadcast    ON public.k_kuts;
-- DROP TRIGGER IF EXISTS trg_artists_broadcast    ON public.artists;
-- DROP TRIGGER IF EXISTS trg_tracks_broadcast     ON public.tracks;
-- DROP TRIGGER IF EXISTS trg_donations_broadcast  ON public.gpm_donations;
-- DROP FUNCTION IF EXISTS public.fn_broadcast_k_kuts();
-- DROP FUNCTION IF EXISTS public.fn_broadcast_artists();
-- DROP FUNCTION IF EXISTS public.fn_broadcast_tracks();
-- DROP FUNCTION IF EXISTS public.fn_broadcast_donations();
