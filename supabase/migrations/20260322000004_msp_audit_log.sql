-- =============================================================
-- MSP Audit Log for FLAGSHIP (gputnammusic.com)
-- Migration: 20260322000004_msp_audit_log.sql
-- Idempotent: CREATE TABLE IF NOT EXISTS, DROP/CREATE triggers
-- =============================================================

-- Audit log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id            bigserial   PRIMARY KEY,
  occurred_at   timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id     uuid        REFERENCES public.tenants(id) ON DELETE SET NULL,
  action        text        NOT NULL,  -- INSERT / UPDATE / DELETE
  table_name    text        NOT NULL,
  row_pk        text        NOT NULL,
  before_data   jsonb,
  after_data    jsonb,
  diff          jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_log_tenant     ON public.audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor      ON public.audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_occurred   ON public.audit_log(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_table      ON public.audit_log(table_name);

-- Audit trigger function (shared by all tables)
CREATE OR REPLACE FUNCTION public.fn_audit_row_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tenant  uuid;
  v_pk      text;
  v_diff    jsonb;
BEGIN
  v_tenant := COALESCE(
    (CASE WHEN TG_OP <> 'DELETE' THEN (row_to_json(NEW) ->> 'tenant_id')::uuid ELSE NULL END),
    (CASE WHEN TG_OP <> 'INSERT' THEN (row_to_json(OLD) ->> 'tenant_id')::uuid ELSE NULL END)
  );
  v_pk := COALESCE(
    (CASE WHEN TG_OP <> 'DELETE' THEN (row_to_json(NEW) ->> 'id') ELSE NULL END),
    (CASE WHEN TG_OP <> 'INSERT' THEN (row_to_json(OLD) ->> 'id') ELSE NULL END)
  );
  IF TG_OP = 'UPDATE' THEN
    SELECT jsonb_object_agg(n.key, n.value)
    INTO v_diff
    FROM jsonb_each(to_jsonb(NEW)) n
    LEFT JOIN jsonb_each(to_jsonb(OLD)) o ON o.key = n.key
    WHERE n.value IS DISTINCT FROM o.value
      AND n.key NOT IN ('updated_at');
  END IF;
  INSERT INTO public.audit_log (
    actor_user_id, tenant_id, action, table_name, row_pk,
    before_data, after_data, diff
  ) VALUES (
    auth.uid(),
    v_tenant,
    TG_OP,
    TG_TABLE_NAME,
    v_pk,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    v_diff
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach audit trigger to k_kuts
DROP TRIGGER IF EXISTS trg_k_kuts_audit ON public.k_kuts;
CREATE TRIGGER trg_k_kuts_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.k_kuts
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_row_change();

-- Attach audit trigger to artists
DROP TRIGGER IF EXISTS trg_artists_audit ON public.artists;
CREATE TRIGGER trg_artists_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_row_change();

-- Attach audit trigger to tenant_members
DROP TRIGGER IF EXISTS trg_tenant_members_audit ON public.tenant_members;
CREATE TRIGGER trg_tenant_members_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.tenant_members
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_row_change();

-- Retention helper: delete audit_log rows older than 90 days (call from cron)
CREATE OR REPLACE FUNCTION public.fn_purge_old_audit_log(older_than_days int DEFAULT 90)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  DELETE FROM public.audit_log
  WHERE occurred_at < now() - (older_than_days || ' days')::interval;
$$;

-- Rollback notes:
-- DROP TRIGGER IF EXISTS trg_k_kuts_audit        ON public.k_kuts;
-- DROP TRIGGER IF EXISTS trg_artists_audit        ON public.artists;
-- DROP TRIGGER IF EXISTS trg_tenant_members_audit ON public.tenant_members;
-- DROP FUNCTION IF EXISTS public.fn_audit_row_change();
-- DROP FUNCTION IF EXISTS public.fn_purge_old_audit_log(int);
-- DROP TABLE IF EXISTS public.audit_log CASCADE;
