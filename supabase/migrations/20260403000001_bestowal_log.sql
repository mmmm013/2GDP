-- Migration: 4PE Bestowal Log
-- Audit trail for all K-KUT / mini-KUT bestowals processed by the 4PE engine.
-- Supports: Net Profit tracking (KUB/SHIP/KIDz), Six Sigma process log,
--           Warehouse/SB/Vector Cloud archive lock.

CREATE TABLE IF NOT EXISTS public.bestowal_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger         text        NOT NULL,          -- e.g. VALENTINES_KK, ANNIVERSARY_KK
  asset_id        text        NOT NULL,           -- Disco track ID or internal asset ID
  to_phone        text,                           -- E.164 phone (nullable — email/webhook paths)
  email           text,                           -- recipient email (nullable)
  dry_run         boolean     NOT NULL DEFAULT false,
  dispatch_result jsonb       NOT NULL DEFAULT '{}'::jsonb,  -- send-k-kuts response payload
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Index for per-trigger analytics (Six Sigma process log queries)
CREATE INDEX IF NOT EXISTS idx_bestowal_log_trigger
  ON public.bestowal_log (trigger);

-- Index for date-range profit reporting (KUB/SHIP/KIDz sponsors)
CREATE INDEX IF NOT EXISTS idx_bestowal_log_created_at
  ON public.bestowal_log (created_at DESC);

-- RLS: only service_role can read/write bestowal_log (contains phone/email PII)
ALTER TABLE public.bestowal_log ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (used by the 4PE API route)
CREATE POLICY "service_role_full_access"
  ON public.bestowal_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- No public or anon access
COMMENT ON TABLE public.bestowal_log IS
  '4PE Bestowal Engine audit log. Each row is one K-KUT or mini-KUT delivery event. '
  'Used for Six Sigma process tracking, Net Profit sponsor reporting, '
  'and Warehouse/SB/Vector Cloud storage lock.';
