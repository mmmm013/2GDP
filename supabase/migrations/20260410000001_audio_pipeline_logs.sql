-- Migration: audio_pipeline_logs
-- Creates the structured log table consumed by GET /api/admin/audio-health
-- and the DMAIC Control Phase dashboard.
--
-- Schema aligns with the log format emitted by stream-audio (and other edge
-- functions that call pipelineLog):
--   { pipeline, trackId, latencyMs, status, retryCount, ts }
--
-- Retention: rows older than 90 days are automatically deleted by the
-- pg_cron job defined at the bottom (requires pg_cron extension).

CREATE TABLE IF NOT EXISTS audio_pipeline_logs (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pipeline      text        NOT NULL,
  track_id      text,
  latency_ms    integer     NOT NULL DEFAULT 0,
  status        text        NOT NULL CHECK (status IN ('ok', 'error')),
  retry_count   integer     NOT NULL DEFAULT 0,
  detail        text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for the 24-hour window query used by the health dashboard
CREATE INDEX IF NOT EXISTS audio_pipeline_logs_created_at_idx
  ON audio_pipeline_logs (created_at DESC);

-- Index for per-pipeline aggregation
CREATE INDEX IF NOT EXISTS audio_pipeline_logs_pipeline_idx
  ON audio_pipeline_logs (pipeline, created_at DESC);

-- Row-level security: only the service role can write; anon cannot read.
ALTER TABLE audio_pipeline_logs ENABLE ROW LEVEL SECURITY;

-- Service role bypass (implicit for service_role key); no anon policy = blocked.

-- Optional: pg_cron 90-day retention (requires pg_cron extension enabled in Supabase)
-- SELECT cron.schedule(
--   'audio-pipeline-logs-retention',
--   '0 3 * * *',
--   $$DELETE FROM audio_pipeline_logs WHERE created_at < now() - interval '90 days'$$
-- );
