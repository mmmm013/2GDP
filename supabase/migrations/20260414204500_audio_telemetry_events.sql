-- Migration: audio_telemetry_events
-- Durable event sink for /api/public/audio-event.
-- Enables fast traffic checks (24h/7d page-view counts) from admin routes.

CREATE TABLE IF NOT EXISTS audio_telemetry_events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event       text        NOT NULL,
  source      text        NOT NULL,
  path        text,
  url         text,
  message     text,
  track       text,
  ua          text,
  ip          text,
  payload     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audio_telemetry_events_created_at_idx
  ON audio_telemetry_events (created_at DESC);

CREATE INDEX IF NOT EXISTS audio_telemetry_events_event_created_idx
  ON audio_telemetry_events (event, created_at DESC);

CREATE INDEX IF NOT EXISTS audio_telemetry_events_path_created_idx
  ON audio_telemetry_events (path, created_at DESC)
  WHERE path IS NOT NULL;

ALTER TABLE audio_telemetry_events ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS. No anon policies are granted.
