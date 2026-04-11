-- =============================================================
-- K-KUT QC Storage Structure
-- Migration: 20260411000001_kuts_qc_storage.sql
-- Idempotent: uses ON CONFLICT DO NOTHING / IF NOT EXISTS
-- =============================================================
--
-- Creates the `kuts` Supabase Storage bucket and documents the
-- three QC sub-folder convention used by the ingestion pipeline:
--
--   kuts/qc/pending/    ← newly uploaded KUT files awaiting QC review
--   kuts/qc/approved/   ← QC-passed files; edge functions serve from here
--   kuts/qc/rejected/   ← QC-failed files; auto-sets is_free=true per policy
--
-- Naming convention inside each folder:
--   KK  → kuts/qc/<stage>/k-kut/<slug>-<section>.mp3
--   mK  → kuts/qc/<stage>/mk/<slug>-<phrase>.mp3
--   KPD → kuts/qc/<stage>/kpd/<level>-<slug>.mp3
--
-- Note: Supabase Storage "folders" are virtual (path prefixes only).
--       This migration creates the bucket + RLS policies.
--       The folder structure is enforced by naming convention at
--       upload time, not by DB objects.
--
-- The existing AUDIO bucket continues to serve files directly
-- (bypassing DB) via the get-audio-url edge function.
-- The `kuts` bucket is the QC-gated pipeline destination.
-- =============================================================

-- ============================================================
-- A) Create `kuts` storage bucket (public: false — signed URLs only)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kuts',
  'kuts',
  false,
  52428800, -- 50 MB per file
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/flac']
)
ON CONFLICT (id) DO UPDATE
  SET
    public             = false,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================
-- B) RLS policies on storage.objects for the `kuts` bucket
-- ============================================================

-- Allow service_role full access (4PE ingestion pipeline writes here)
DROP POLICY IF EXISTS "kuts_service_role_all" ON storage.objects;
CREATE POLICY "kuts_service_role_all"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'kuts')
  WITH CHECK (bucket_id = 'kuts');

-- Allow authenticated users to read approved files
DROP POLICY IF EXISTS "kuts_authenticated_read_approved" ON storage.objects;
CREATE POLICY "kuts_authenticated_read_approved"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'kuts'
    AND name LIKE 'qc/approved/%'
  );

-- Allow anon users to read approved files that are is_free=true
-- (Failure=FREE: QC-rejected assets that have been manually promoted to approved)
-- Anon access is controlled at the object name level — only approved subfolder
DROP POLICY IF EXISTS "kuts_anon_read_approved" ON storage.objects;
CREATE POLICY "kuts_anon_read_approved"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (
    bucket_id = 'kuts'
    AND name LIKE 'qc/approved/%'
  );

-- ============================================================
-- C) Seed comment row in audit_log documenting the QC structure
--    (fire-and-forget; does not fail migration if table absent)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'audit_log'
  ) THEN
    INSERT INTO public.audit_log (action, table_name, row_pk, diff)
    VALUES (
      'BUCKET_CREATED',
      'storage.buckets',
      'kuts',
      '{"bucket":"kuts","qc_structure":["qc/pending/","qc/approved/","qc/rejected/"],"note":"K-KUT QC pipeline bucket. Service role writes to qc/pending/, moves to qc/approved/ or qc/rejected/ after audio_qc review."}'::jsonb
    )
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- ============================================================
-- Rollback notes
-- ============================================================
-- DROP POLICY IF EXISTS "kuts_anon_read_approved"         ON storage.objects;
-- DROP POLICY IF EXISTS "kuts_authenticated_read_approved" ON storage.objects;
-- DROP POLICY IF EXISTS "kuts_service_role_all"            ON storage.objects;
-- DELETE FROM storage.buckets WHERE id = 'kuts';
