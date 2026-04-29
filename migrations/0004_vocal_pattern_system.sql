CREATE TABLE IF NOT EXISTS app.vocal_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern text NOT NULL,
  pattern_type text,
  description text,
  example_usage text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app.vocal_pattern_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern text NOT NULL,
  pix_id uuid,
  source_title text,
  matched_text text,
  position_note text,
  created_at timestamptz DEFAULT now()
);
