-- Migration: 20260413000001_k_kut_notify_signups_sovereign
-- Creates two tables required by the k-kut.com production API:
--   1. notify_signups       — email capture for rolling-out plans (/api/notify)
--   2. sovereign_subscriptions — Stripe webhook entitlement records for
--                                Sovereign Pass (/api/stripe/webhook)
-- Idempotent: CREATE TABLE IF NOT EXISTS, ALTER TABLE ADD COLUMN IF NOT EXISTS.

-- ─────────────────────────────────────────────────────────────
-- 1. notify_signups
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notify_signups (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text        NOT NULL,
  note         text,
  source       text        NOT NULL DEFAULT 'k-kut.com',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint on email so duplicate submissions are idempotent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'notify_signups_email_key'
  ) THEN
    ALTER TABLE public.notify_signups
      ADD CONSTRAINT notify_signups_email_key UNIQUE (email);
  END IF;
END $$;

-- RLS: only service-role can read/write; anon has no access
ALTER TABLE public.notify_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notify_signups_service_only" ON public.notify_signups;
CREATE POLICY "notify_signups_service_only"
  ON public.notify_signups
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────
-- 2. sovereign_subscriptions
-- Stores Stripe subscription lifecycle events for Sovereign Pass.
-- The webhook handler at /api/stripe/webhook writes here.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sovereign_subscriptions (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id   text        NOT NULL,
  stripe_subscription_id text      NOT NULL,
  stripe_session_id    text,
  customer_email       text,
  status               text        NOT NULL DEFAULT 'active',
  -- status values: 'active' | 'past_due' | 'canceled' | 'unpaid'
  current_period_start timestamptz,
  current_period_end   timestamptz,
  canceled_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- Unique per Stripe subscription ID
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sovereign_subs_stripe_sub_id_key'
  ) THEN
    ALTER TABLE public.sovereign_subscriptions
      ADD CONSTRAINT sovereign_subs_stripe_sub_id_key
      UNIQUE (stripe_subscription_id);
  END IF;
END $$;

-- Index for customer email lookups
CREATE INDEX IF NOT EXISTS sovereign_subs_email_idx
  ON public.sovereign_subscriptions (customer_email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_sovereign_sub_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sovereign_sub_updated_at_trigger
  ON public.sovereign_subscriptions;

CREATE TRIGGER sovereign_sub_updated_at_trigger
  BEFORE UPDATE ON public.sovereign_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sovereign_sub_updated_at();

-- RLS: only service-role can read/write
ALTER TABLE public.sovereign_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sovereign_subs_service_only" ON public.sovereign_subscriptions;
CREATE POLICY "sovereign_subs_service_only"
  ON public.sovereign_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated users to SELECT their own subscription by email
DROP POLICY IF EXISTS "sovereign_subs_owner_read" ON public.sovereign_subscriptions;
CREATE POLICY "sovereign_subs_owner_read"
  ON public.sovereign_subscriptions
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND customer_email = (auth.jwt() ->> 'email')
  );
