-- =============================================================
-- MSP Performance Indexes for FLAGSHIP (gputnammusic.com)
-- Migration: 20260322000003_msp_performance_indexes.sql
-- Idempotent: all use CREATE INDEX IF NOT EXISTS
-- =============================================================

-- tracks table (existing) - covers artist/album/year access patterns
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='tracks') THEN
    CREATE INDEX IF NOT EXISTS idx_tracks_artist         ON public.tracks(artist);
    CREATE INDEX IF NOT EXISTS idx_tracks_album          ON public.tracks(album);
    CREATE INDEX IF NOT EXISTS idx_tracks_year           ON public.tracks(year);
    CREATE INDEX IF NOT EXISTS idx_tracks_genre          ON public.tracks(genre);
    CREATE INDEX IF NOT EXISTS idx_tracks_organization   ON public.tracks(organization_id);
    CREATE INDEX IF NOT EXISTS idx_tracks_org_ext        ON public.tracks(organization_id, external_id);
  END IF;
END $$;

-- k_kuts full-text search via pg_trgm
CREATE INDEX IF NOT EXISTS idx_k_kuts_title_trgm
  ON public.k_kuts USING gin(title gin_trgm_ops);

-- artists full-text
CREATE INDEX IF NOT EXISTS idx_artists_handle_trgm
  ON public.artists USING gin(handle gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artists_display_trgm
  ON public.artists USING gin(display_name gin_trgm_ops);

-- tenants slug lookup
CREATE INDEX IF NOT EXISTS idx_tenants_slug
  ON public.tenants(slug);

-- user_profiles email lookup (for magic-link flow)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email
  ON public.user_profiles(email);

-- audit_log (if exists from later migration, safe no-op if not)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='audit_log') THEN
    CREATE INDEX IF NOT EXISTS idx_audit_log_tenant      ON public.audit_log(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_actor       ON public.audit_log(actor_user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_occurred    ON public.audit_log(occurred_at DESC);
  END IF;
END $$;

-- gpm_donations (existing Heart-Tap table)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='gpm_donations') THEN
    CREATE INDEX IF NOT EXISTS idx_gpm_donations_status  ON public.gpm_donations(status);
    CREATE INDEX IF NOT EXISTS idx_gpm_donations_created ON public.gpm_donations(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_gpm_donations_email   ON public.gpm_donations(donor_email);
  END IF;
END $$;

-- Rollback notes:
-- DROP INDEX IF EXISTS idx_tracks_artist;
-- DROP INDEX IF EXISTS idx_tracks_album;
-- DROP INDEX IF EXISTS idx_tracks_year;
-- DROP INDEX IF EXISTS idx_tracks_genre;
-- DROP INDEX IF EXISTS idx_tracks_organization;
-- DROP INDEX IF EXISTS idx_tracks_org_ext;
-- DROP INDEX IF EXISTS idx_k_kuts_title_trgm;
-- DROP INDEX IF EXISTS idx_artists_handle_trgm;
-- DROP INDEX IF EXISTS idx_artists_display_trgm;
-- DROP INDEX IF EXISTS idx_tenants_slug;
-- DROP INDEX IF EXISTS idx_user_profiles_email;
-- DROP INDEX IF EXISTS idx_audit_log_tenant;
-- DROP INDEX IF EXISTS idx_audit_log_actor;
-- DROP INDEX IF EXISTS idx_audit_log_occurred;
-- DROP INDEX IF EXISTS idx_gpm_donations_status;
-- DROP INDEX IF EXISTS idx_gpm_donations_created;
-- DROP INDEX IF EXISTS idx_gpm_donations_email;
