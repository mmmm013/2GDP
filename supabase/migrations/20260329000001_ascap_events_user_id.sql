-- =============================================================
-- ascap_events: add user_id for RLS-compatible event logging
-- Migration: 20260329000001_ascap_events_user_id.sql
-- Idempotent: uses IF NOT EXISTS / DO $$ guards
-- =============================================================
--
-- Context
-- -------
-- POST /api/log-stream-time now requires a Supabase Auth session and
-- records the authenticated user's UID in ascap_events.user_id.
-- This allows Row Level Security policies to restrict reads/writes
-- to the owning user without requiring the service-role key.
--
-- Schema change
-- -------------

-- 1. Add user_id column (nullable for backward compat with pre-existing rows)
--    ON DELETE SET NULL is deliberate: audit events are retained for
--    compliance (ASCAP reporting) even if the associated user account
--    is later deleted.
ALTER TABLE public.ascap_events
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Index for RLS + per-user queries
CREATE INDEX IF NOT EXISTS idx_ascap_events_user_id
  ON public.ascap_events(user_id);

-- 3. Composite unique index enabling user-scoped idempotency
--    (future: API can enforce uniqueness on (user_id, idempotency_key) instead
--     of the global id column, giving each user their own key namespace)
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_ascap_events_user_idempotency
--   ON public.ascap_events(user_id, id)
--   WHERE user_id IS NOT NULL;

-- =============================================================
-- RLS policies for ascap_events
-- =============================================================

ALTER TABLE public.ascap_events ENABLE ROW LEVEL SECURITY;

-- Authenticated users may insert their own events
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'ascap_events'
      AND polname    = 'ascap_events_insert_own'
  ) THEN
    CREATE POLICY ascap_events_insert_own ON public.ascap_events
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Authenticated users may read their own events
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'ascap_events'
      AND polname    = 'ascap_events_select_own'
  ) THEN
    CREATE POLICY ascap_events_select_own ON public.ascap_events
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Rollback notes:
-- ALTER TABLE public.ascap_events DISABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS ascap_events_insert_own ON public.ascap_events;
-- DROP POLICY IF EXISTS ascap_events_select_own ON public.ascap_events;
-- DROP INDEX  IF EXISTS idx_ascap_events_user_id;
-- ALTER TABLE public.ascap_events DROP COLUMN IF EXISTS user_id;
