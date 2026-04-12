-- =============================================================
-- MSP RLS Policies for FLAGSHIP (gputnammusic.com)
-- Migration: 20260322000002_msp_rls_policies.sql
-- Idempotent: policies guarded by IF NOT EXISTS checks
-- =============================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE public.tenants        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.k_kuts         ENABLE ROW LEVEL SECURITY;

-- Revoke anon/public access from all sensitive tables
REVOKE ALL ON TABLE public.user_profiles  FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.tenant_members FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.artists        FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.k_kuts         FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.tenants        FROM anon, PUBLIC;

-- k_kuts: allow anon SELECT on active records (public browsing for FLAGSHIP)
GRANT SELECT ON TABLE public.k_kuts TO anon;
GRANT SELECT ON TABLE public.artists TO anon;

-- -------------------------------------------------------
-- user_profiles policies
-- -------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_profiles' AND polname='profiles_self_read'
  ) THEN
    CREATE POLICY profiles_self_read ON public.user_profiles
      FOR SELECT TO authenticated
      USING (auth.uid() = auth_user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_profiles' AND polname='profiles_self_update'
  ) THEN
    CREATE POLICY profiles_self_update ON public.user_profiles
      FOR UPDATE TO authenticated
      USING (auth.uid() = auth_user_id)
      WITH CHECK (auth.uid() = auth_user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_profiles' AND polname='profiles_tenant_read'
  ) THEN
    CREATE POLICY profiles_tenant_read ON public.user_profiles
      FOR SELECT TO authenticated
      USING (tenant_id = app_utils.get_user_tenant());
  END IF;
END $$;

-- -------------------------------------------------------
-- tenant_members policies
-- -------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='tenant_members' AND polname='members_tenant_read'
  ) THEN
    CREATE POLICY members_tenant_read ON public.tenant_members
      FOR SELECT TO authenticated
      USING (tenant_id = app_utils.get_user_tenant());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='tenant_members' AND polname='members_tenant_insert'
  ) THEN
    CREATE POLICY members_tenant_insert ON public.tenant_members
      FOR INSERT TO authenticated
      WITH CHECK (tenant_id = app_utils.get_user_tenant());
  END IF;
END $$;

-- -------------------------------------------------------
-- artists policies
-- -------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='artists' AND polname='artists_public_read'
  ) THEN
    CREATE POLICY artists_public_read ON public.artists
      FOR SELECT TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='artists' AND polname='artists_tenant_write'
  ) THEN
    CREATE POLICY artists_tenant_write ON public.artists
      FOR ALL TO authenticated
      USING (tenant_id = app_utils.get_user_tenant())
      WITH CHECK (tenant_id = app_utils.get_user_tenant());
  END IF;
END $$;

-- -------------------------------------------------------
-- k_kuts policies (K-KUTs / K-kuts)
-- -------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='k_kuts' AND polname='k_kuts_public_read'
  ) THEN
    CREATE POLICY k_kuts_public_read ON public.k_kuts
      FOR SELECT TO anon, authenticated
      USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='k_kuts' AND polname='k_kuts_tenant_write'
  ) THEN
    CREATE POLICY k_kuts_tenant_write ON public.k_kuts
      FOR ALL TO authenticated
      USING (tenant_id = app_utils.get_user_tenant())
      WITH CHECK (tenant_id = app_utils.get_user_tenant());
  END IF;
END $$;

-- -------------------------------------------------------
-- tenants: authenticated users can read their own tenant
-- -------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='tenants' AND polname='tenants_self_read'
  ) THEN
    CREATE POLICY tenants_self_read ON public.tenants
      FOR SELECT TO authenticated
      USING (id = app_utils.get_user_tenant());
  END IF;
END $$;

-- Rollback notes:
-- ALTER TABLE public.tenants        DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_profiles  DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.tenant_members DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.artists        DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.k_kuts         DISABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS profiles_self_read        ON public.user_profiles;
-- DROP POLICY IF EXISTS profiles_self_update      ON public.user_profiles;
-- DROP POLICY IF EXISTS profiles_tenant_read      ON public.user_profiles;
-- DROP POLICY IF EXISTS members_tenant_read       ON public.tenant_members;
-- DROP POLICY IF EXISTS members_tenant_insert     ON public.tenant_members;
-- DROP POLICY IF EXISTS artists_public_read       ON public.artists;
-- DROP POLICY IF EXISTS artists_tenant_write      ON public.artists;
-- DROP POLICY IF EXISTS k_kuts_public_read        ON public.k_kuts;
-- DROP POLICY IF EXISTS k_kuts_tenant_write       ON public.k_kuts;
-- DROP POLICY IF EXISTS tenants_self_read         ON public.tenants;
