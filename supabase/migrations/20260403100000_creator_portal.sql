-- =============================================================
-- Creator Portal Schema — GPM 4PE-MSC Submission Layer
-- Migration: 20260403100000_creator_portal.sql
-- Idempotent: uses IF NOT EXISTS / DO $$ throughout
-- =============================================================

-- -----------------------------------------------------------------
-- 1. creator_portals
--    One row per creator brand. Tied to a Supabase auth.users row
--    (creator_auth_id). Stores a WebAuthn credential ID so the
--    creator can authenticate with Face ID / Touch ID only.
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_portals (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  brand                 text        UNIQUE NOT NULL,          -- e.g. 'KLEIGH', 'MSJ', 'ZG', 'LGM', 'PIXIE'
  display_name          text        NOT NULL,
  legal_name            text,
  role                  text,
  creator_auth_id       uuid        UNIQUE,                   -- references auth.users.id after enrollment
  webauthn_credential_id text       UNIQUE,                   -- base64url credential ID from WebAuthn
  webauthn_public_key   text,                                 -- COSE public key (base64url)
  webauthn_counter      bigint      NOT NULL DEFAULT 0,       -- authenticator sign-count
  enrolled_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_portals_brand
  ON public.creator_portals(brand);
CREATE INDEX IF NOT EXISTS idx_creator_portals_auth_id
  ON public.creator_portals(creator_auth_id);

-- -----------------------------------------------------------------
-- 2. creator_assets
--    Every file submitted through a creator portal lands here.
--    Auto-tagged with brand, creator_auth_id, file_type, and
--    uploaded_at so assets are always traceable to their origin.
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_assets (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      uuid        NOT NULL REFERENCES public.creator_portals(id) ON DELETE CASCADE,
  brand           text        NOT NULL,
  creator_auth_id uuid,                                       -- auth.users.id at upload time
  file_url        text        NOT NULL,                       -- Supabase Storage public/signed URL
  storage_path    text        NOT NULL,                       -- Storage bucket path for delete ops
  file_type       text        NOT NULL,                       -- MIME type
  scope           text        NOT NULL,                       -- CreatorScope enum value
  label           text,                                       -- human-readable label / title
  meta            jsonb       NOT NULL DEFAULT '{}',          -- { brand, creator, type, uploaded, ... }
  is_published    boolean     NOT NULL DEFAULT false,
  uploaded_at     timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_assets_creator_id
  ON public.creator_assets(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_assets_brand
  ON public.creator_assets(brand);
CREATE INDEX IF NOT EXISTS idx_creator_assets_scope
  ON public.creator_assets(scope);
CREATE INDEX IF NOT EXISTS idx_creator_assets_auth_id
  ON public.creator_assets(creator_auth_id);

-- -----------------------------------------------------------------
-- 3. webauthn_challenges
--    Ephemeral table. Stores the random challenge issued during
--    registration/authentication so it can be verified server-side.
--    Rows older than 5 minutes are stale and should be ignored.
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webauthn_challenges (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  brand       text        NOT NULL,
  challenge   text        NOT NULL,                           -- base64url challenge
  type        text        NOT NULL CHECK (type IN ('registration', 'authentication')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_brand
  ON public.webauthn_challenges(brand);

-- Auto-expire challenges older than 10 minutes (defensive; app also checks)
CREATE OR REPLACE FUNCTION public.cleanup_expired_challenges()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.webauthn_challenges
  WHERE created_at < now() - interval '10 minutes';
END;
$$;

-- -----------------------------------------------------------------
-- 4. Row Level Security
-- -----------------------------------------------------------------
ALTER TABLE public.creator_portals   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_assets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webauthn_challenges ENABLE ROW LEVEL SECURITY;

-- Revoke broad anonymous access
REVOKE ALL ON TABLE public.creator_portals    FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.creator_assets     FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.webauthn_challenges FROM anon, PUBLIC;

-- creator_portals: each creator can read their own row
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='creator_portals' AND policyname='creator_portals_self_read'
  ) THEN
    CREATE POLICY creator_portals_self_read ON public.creator_portals
      FOR SELECT TO authenticated
      USING (creator_auth_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='creator_portals' AND policyname='creator_portals_self_update'
  ) THEN
    CREATE POLICY creator_portals_self_update ON public.creator_portals
      FOR UPDATE TO authenticated
      USING (creator_auth_id = auth.uid())
      WITH CHECK (creator_auth_id = auth.uid());
  END IF;
END $$;

-- creator_assets: creator can INSERT/SELECT/UPDATE/DELETE only their own rows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='creator_assets' AND policyname='creator_assets_self_read'
  ) THEN
    CREATE POLICY creator_assets_self_read ON public.creator_assets
      FOR SELECT TO authenticated
      USING (creator_auth_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='creator_assets' AND policyname='creator_assets_self_insert'
  ) THEN
    CREATE POLICY creator_assets_self_insert ON public.creator_assets
      FOR INSERT TO authenticated
      WITH CHECK (creator_auth_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='creator_assets' AND policyname='creator_assets_self_update'
  ) THEN
    CREATE POLICY creator_assets_self_update ON public.creator_assets
      FOR UPDATE TO authenticated
      USING (creator_auth_id = auth.uid())
      WITH CHECK (creator_auth_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='creator_assets' AND policyname='creator_assets_self_delete'
  ) THEN
    CREATE POLICY creator_assets_self_delete ON public.creator_assets
      FOR DELETE TO authenticated
      USING (creator_auth_id = auth.uid());
  END IF;
END $$;

-- Public read for published herb-blog + playlist assets (PIXIE only)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='creator_assets' AND policyname='creator_assets_pixie_public_read'
  ) THEN
    CREATE POLICY creator_assets_pixie_public_read ON public.creator_assets
      FOR SELECT TO anon
      USING (brand = 'PIXIE' AND is_published = true);
  END IF;
END $$;

-- webauthn_challenges: service role only (API routes use admin client)
-- No authenticated-role policies needed; all challenge ops go through API routes.

-- -----------------------------------------------------------------
-- 5. Seed canonical creator_portals rows (brands only, no auth yet)
-- -----------------------------------------------------------------
INSERT INTO public.creator_portals (brand, display_name, legal_name, role) VALUES
  ('KLEIGH', 'KLEIGH',         'Michael Clay / Clayton Michael Gunn', 'Vocalist · Songwriter · Pianist · Visual Artist'),
  ('MSJ',    'Michael Scherer','Michael Scherer',                     'Pianist · Performer · Songwriter — The Awesome Squad'),
  ('ZG',     'Zach Garrett',   'Zach Garrett',                       'Songwriter · GPN Vocalist — The Awesome Squad'),
  ('LGM',    'Lloyd G Miller', 'Lloyd G Miller',                      'Visual Artist · Studio Owner'),
  ('PIXIE',  'PIXIE',          'Jane Burton',                         'HERB BLOG Author · GPM FP Playlist Curator')
ON CONFLICT (brand) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  legal_name   = EXCLUDED.legal_name,
  role         = EXCLUDED.role,
  updated_at   = now();
