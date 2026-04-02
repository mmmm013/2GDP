-- k_kut_codes
-- Stores the short-code → destination mapping created by KKK (K-KUT-Kreator).
-- A code is a 4–10 character alphanumeric token. The destination is the
-- relative URL path (e.g. /gift/songs?track=abc) the gateway should redirect to.

CREATE TABLE IF NOT EXISTS k_kut_codes (
  code         TEXT        PRIMARY KEY,
  destination  TEXT        NOT NULL,       -- relative path, e.g. /gift/songs?track=1
  item_type    TEXT        NOT NULL CHECK (item_type IN ('STI', 'BTI', 'FP')),
  item_id      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: anyone with the code can look it up (it is the access token)
ALTER TABLE k_kut_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kkut_codes_public_read"
  ON k_kut_codes FOR SELECT
  USING (true);

-- Only service role can write (caller goes through /api/k/create)
CREATE POLICY "kkut_codes_service_insert"
  ON k_kut_codes FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
