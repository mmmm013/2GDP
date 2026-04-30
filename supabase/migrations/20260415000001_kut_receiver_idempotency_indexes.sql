-- Migration: KUT Receiver Idempotency Indexes
-- Created: 2026-04-15T00:00:01Z
-- Purpose: Add partial indexes for fast idempotency + dedupe lookups in kut-receiver Edge Function

-- ===========================================================================
-- 1. Idempotency key index (for /event with idempotency_key)
-- ===========================================================================
-- Speeds up lookup: WHERE send_id=X AND event_type=Y AND session_id=Z AND meta->'idempotency_key'=K
-- Partial index: only rows that have an idempotency_key in meta

CREATE INDEX IF NOT EXISTS k_kut_receiver_events_idem_idx
ON public.k_kut_receiver_events (
  send_id,
  event_type,
  session_id,
  (meta->>'idempotency_key')
)
WHERE meta ? 'idempotency_key';

COMMENT ON INDEX k_kut_receiver_events_idem_idx IS
'Idempotency key lookup index for kut-receiver /event endpoint dedupe';

-- ===========================================================================
-- 2. Opened event dedupe index (for /open)
-- ===========================================================================
-- Speeds up lookup: WHERE send_id=X AND session_id=Y AND event_type='opened'
-- Partial index: only rows with event_type='opened' and non-null session_id

CREATE INDEX IF NOT EXISTS k_kut_receiver_events_opened_session_idx
ON public.k_kut_receiver_events (
  send_id,
  session_id,
  event_type
)
WHERE event_type = 'opened' AND session_id IS NOT NULL;

COMMENT ON INDEX k_kut_receiver_events_opened_session_idx IS
'Opened event dedupe index for kut-receiver /open endpoint';

-- ===========================================================================
-- Performance notes:
-- - Both are partial indexes, so they stay small and fast.
-- - The idempotency index uses an expression (meta->>'idempotency_key') for exact match.
-- - The opened index filters on event_type + session_id to prevent duplicate open events.
-- ===========================================================================
