-- =============================================================
-- MSP Core Schema for FLAGSHIP (gputnammusic.com)
-- Migration: 20260322000001_msp_core_schema.sql
-- Idempotent: uses IF NOT EXISTS / ON CONFLICT throughout
-- =============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- TENANTS
CREATE TABLE IF NOT EXISTS public.tenants (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  domain      text,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id            uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  uuid  UNIQUE NOT NULL,
  tenant_id     uuid  NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email         text  NOT NULL,
  display_name  text,
  phone         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user ON public.user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant    ON public.user_profiles(tenant_id);

-- TENANT MEMBERS
CREATE TABLE IF NOT EXISTS public.tenant_members (
  id          uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid  NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id     uuid  NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role        text  NOT NULL CHECK (role IN ('owner','admin','editor','viewer')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant ON public.tenant_members(tenant_id);

-- ARTISTS
CREATE TABLE IF NOT EXISTS public.artists (
  id            uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid  NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  handle        text  UNIQUE NOT NULL,
  display_name  text  NOT NULL,
  bio           text,
  image_url     text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_artists_tenant ON public.artists(tenant_id);

-- K-KUTS (K-KUT / K-kuts clips + email links)
CREATE TABLE IF NOT EXISTS public.k_kuts (
  id            uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid  NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  artist_id     uuid  REFERENCES public.artists(id) ON DELETE SET NULL,
  title         text  NOT NULL,
  slug          text  UNIQUE NOT NULL,
  clip_url      text,
  email_link    text,
  telegram_link text,
  payload       jsonb NOT NULL DEFAULT '{}',
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_k_kuts_tenant ON public.k_kuts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_k_kuts_artist ON public.k_kuts(artist_id);
CREATE INDEX IF NOT EXISTS idx_k_kuts_active ON public.k_kuts(tenant_id, is_active);

-- APP_PRIVATE schema for STI/BTI
CREATE SCHEMA IF NOT EXISTS app_private;

CREATE TABLE IF NOT EXISTS app_private.sti_slots (
  id           uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_code  text  NOT NULL,
  key          text  NOT NULL UNIQUE,
  title        text  NOT NULL,
  description  text,
  required     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_private.btis (
  id            uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  bti_key       text  NOT NULL UNIQUE,
  domain_code   text  NOT NULL,
  artist_handle text,
  payload       jsonb NOT NULL DEFAULT '{}',
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_private.sti_bindings (
  id          uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id     uuid  NOT NULL REFERENCES app_private.sti_slots(id) ON DELETE CASCADE,
  bti_id      uuid  NOT NULL REFERENCES app_private.btis(id) ON DELETE CASCADE,
  priority    int   NOT NULL DEFAULT 100,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slot_id, bti_id)
);
CREATE INDEX IF NOT EXISTS idx_sti_bindings_slot_priority ON app_private.sti_bindings(slot_id, priority);

-- APP_UTILS tenant resolver
CREATE SCHEMA IF NOT EXISTS app_utils;

CREATE OR REPLACE FUNCTION app_utils.get_user_tenant()
RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT tenant_id FROM public.user_profiles
  WHERE auth_user_id = auth.uid() LIMIT 1;
$$;
REVOKE ALL ON FUNCTION app_utils.get_user_tenant() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_utils.get_user_tenant() TO authenticated;

-- STI resolver view
CREATE OR REPLACE VIEW public.v_sti_resolved AS
WITH ranked AS (
  SELECT sl.key AS slot_key, sl.domain_code, bt.artist_handle, bt.payload, sb.priority,
    ROW_NUMBER() OVER (
      PARTITION BY sl.key, COALESCE(bt.artist_handle,'')
      ORDER BY sb.priority ASC, sb.created_at ASC
    ) AS rn
  FROM app_private.sti_slots sl
  JOIN app_private.sti_bindings sb ON sb.slot_id = sl.id AND sb.is_active
  JOIN app_private.btis bt ON bt.id = sb.bti_id AND bt.is_active
)
SELECT slot_key, domain_code, NULLIF(artist_handle,'') AS artist_handle, payload
FROM ranked WHERE rn = 1;

CREATE OR REPLACE FUNCTION public.get_sti_payload(p_slot_key text, p_artist_handle text DEFAULT NULL)
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT payload FROM public.v_sti_resolved
  WHERE slot_key = p_slot_key
  ORDER BY (artist_handle IS DISTINCT FROM p_artist_handle), artist_handle NULLS LAST
  LIMIT 1;
$$;

-- Rollback notes:
-- DROP TABLE IF EXISTS public.k_kuts CASCADE;
-- DROP TABLE IF EXISTS public.tenant_members CASCADE;
-- DROP TABLE IF EXISTS public.user_profiles CASCADE;
-- DROP TABLE IF EXISTS public.tenants CASCADE;
-- DROP SCHEMA IF EXISTS app_private CASCADE;
-- DROP SCHEMA IF EXISTS app_utils CASCADE;
