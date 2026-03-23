-- Migration: 20260322000006_msp_kkut_assets_constraints_purchase_guard.sql
-- BIC-Level MSP for G Putnam Music / FLAGSHIP (gputnammusic.com)
-- Covers:
--   A) public.k_kut_assets - canonical asset registry for K-KUT and K-kut audio
--   B) Structural tag whitelist on public.k_kut.label and public.pix_snippets.structure_tag
--   C) One-active-purchase-per-purchaser-per-parent-K-KUT trigger on sb.k_kup
--   D) Helper JWT org function
--   E) RLS on k_kut_assets
-- Rollback notes at bottom of file.

-- ============================================================
-- A) public.k_kut_assets
-- Canonical registry mapping K-KUT / K-kut variants to storage
-- objects. 4PE/KKr ingestion writes here; MSP reads here to
-- generate signed URLs for playback and delivery.
-- ============================================================

create table if not exists public.k_kut_assets (
  id                uuid        primary key default gen_random_uuid(),
  pix_pck_id        uuid        not null,
  variant           text        not null,
  structure_tag     text        not null,
  storage_bucket    text        not null default 'media',
  storage_path      text        not null,
  mime_type         text        not null default 'audio/mpeg',
  duration_ms       integer,
  bitrate_kbps      integer,
  sample_rate_hz    integer,
  checksum_sha256   text,
  status            text        not null default 'staged',
  org_id            uuid        not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Structural integrity: only K-KUT or K-kut variants
  constraint k_kut_assets_variant_check
    check (variant in ('K-KUT', 'K-kut')),

  -- Structural part whitelist: Verse, BR, Ch only
  -- Prevents any path to recreating an exact arrangement
  constraint k_kut_assets_structure_tag_check
    check (structure_tag in ('Verse', 'BR', 'Ch')),

  -- Status lifecycle
  constraint k_kut_assets_status_check
    check (status in ('staged', 'active', 'archived')),

  -- One asset per (pix_pck_id, structure_tag, variant) - idempotent ingestion
  constraint k_kut_assets_unique_slot
    unique (pix_pck_id, structure_tag, variant)
);

-- FK to pix_pck (deferred-safe: only adds if table exists)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'pix_pck'
  ) and not exists (
    select 1 from pg_constraint where conname = 'k_kut_assets_pix_pck_fk'
  ) then
    alter table public.k_kut_assets
      add constraint k_kut_assets_pix_pck_fk
      foreign key (pix_pck_id) references public.pix_pck(id)
      on delete restrict;
  end if;
end;
$$;

-- Performance indexes
create index if not exists idx_k_kut_assets_org_id
  on public.k_kut_assets (org_id);

create index if not exists idx_k_kut_assets_pix_pck_status
  on public.k_kut_assets (pix_pck_id, status);

create index if not exists idx_k_kut_assets_slot_active
  on public.k_kut_assets (pix_pck_id, structure_tag, variant)
  where status = 'active';

-- updated_at auto-stamp
create or replace function public.k_kut_assets_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_k_kut_assets_updated_at on public.k_kut_assets;
create trigger trg_k_kut_assets_updated_at
  before update on public.k_kut_assets
  for each row execute function public.k_kut_assets_set_updated_at();

-- ============================================================
-- B) Structural tag whitelist on existing tables
-- Enforces that user-exposed K-KUT/K-kut records can only be
-- structural parts (Verse, BR, Ch) - no exact arrangement paths
-- ============================================================

-- public.k_kut.label whitelist
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'k_kut' and column_name = 'label'
  ) and not exists (
    select 1 from pg_constraint where conname = 'k_kut_label_structure_check'
  ) then
    alter table public.k_kut
      add constraint k_kut_label_structure_check
      check (label in ('Verse', 'BR', 'Ch'));
  end if;
end;
$$;

-- public.pix_snippets.structure_tag whitelist (only when kk_type is a K-KUT variant)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pix_snippets' and column_name = 'structure_tag'
  ) and not exists (
    select 1 from pg_constraint where conname = 'pix_snippets_structure_tag_check'
  ) then
    alter table public.pix_snippets
      add constraint pix_snippets_structure_tag_check
      check (
        kk_type not in ('K-KUT', 'K-kut')
        or structure_tag in ('Verse', 'BR', 'Ch')
      );
  end if;
end;
$$;

-- Normalize common variants via trigger (chorus->Ch, bridge->BR, verse->Verse)
-- Applied before insert/update so downstream checks always see canonical form
create or replace function public.normalize_structure_tag()
returns trigger language plpgsql as $$
begin
  if tg_table_name = 'k_kut' then
    new.label := case lower(trim(new.label))
      when 'verse'   then 'Verse'
      when 'br'      then 'BR'
      when 'bridge'  then 'BR'
      when 'ch'      then 'Ch'
      when 'chorus'  then 'Ch'
      when 'hook'    then 'Ch'
      else new.label
    end;
  elsif tg_table_name = 'pix_snippets' then
    new.structure_tag := case lower(trim(new.structure_tag))
      when 'verse'   then 'Verse'
      when 'br'      then 'BR'
      when 'bridge'  then 'BR'
      when 'ch'      then 'Ch'
      when 'chorus'  then 'Ch'
      when 'hook'    then 'Ch'
      else new.structure_tag
    end;
  elsif tg_table_name = 'k_kut_assets' then
    new.structure_tag := case lower(trim(new.structure_tag))
      when 'verse'   then 'Verse'
      when 'br'      then 'BR'
      when 'bridge'  then 'BR'
      when 'ch'      then 'Ch'
      when 'chorus'  then 'Ch'
      when 'hook'    then 'Ch'
      else new.structure_tag
    end;
  end if;
  return new;
end;
$$;

-- Apply normalizer to k_kut_assets
drop trigger if exists trg_k_kut_assets_normalize_tag on public.k_kut_assets;
create trigger trg_k_kut_assets_normalize_tag
  before insert or update on public.k_kut_assets
  for each row execute function public.normalize_structure_tag();

-- Apply normalizer to public.k_kut if table exists
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'k_kut'
  ) then
    execute '
      drop trigger if exists trg_k_kut_normalize_label on public.k_kut;
      create trigger trg_k_kut_normalize_label
        before insert or update on public.k_kut
        for each row execute function public.normalize_structure_tag();
    ';
  end if;
end;
$$;

-- Apply normalizer to public.pix_snippets if table exists
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'pix_snippets'
  ) then
    execute '
      drop trigger if exists trg_pix_snippets_normalize_tag on public.pix_snippets;
      create trigger trg_pix_snippets_normalize_tag
        before insert or update on public.pix_snippets
        for each row execute function public.normalize_structure_tag();
    ';
  end if;
end;
$$;

-- ============================================================
-- C) One-active-purchase per purchaser x parent K-KUT guard
-- Enforces via BEFORE INSERT trigger on sb.k_kup
-- Resolves parent_k_kut_id from sb.k_kut_variants.k_kut_id
-- Blocks if an active purchase (PENDING or COMPLETED) already
-- exists for the same purchaser_id x parent_k_kut_id
-- ============================================================

create or replace function sb.enforce_one_active_kkut_per_purchaser()
returns trigger
language plpgsql
security definer
as $$
declare
  v_parent_k_kut_id uuid;
  v_existing_count  integer;
begin
  -- Resolve parent K-KUT from the variant being purchased
  select k_kut_id
  into v_parent_k_kut_id
  from sb.k_kut_variants
  where id = new.k_kut_variant_id
  limit 1;

  -- If we can't resolve the parent, allow insert (variant may not exist yet - let FK handle it)
  if v_parent_k_kut_id is null then
    return new;
  end if;

  -- Count existing active purchases for this purchaser x parent K-KUT
  select count(*)
  into v_existing_count
  from sb.k_kup kup
  join sb.k_kut_variants kv on kv.id = kup.k_kut_variant_id
  where kup.purchaser_id = new.purchaser_id
    and kv.k_kut_id = v_parent_k_kut_id
    and kup.status in ('PENDING', 'COMPLETED')
    and kup.id is distinct from new.id; -- exclude self on update

  if v_existing_count > 0 then
    raise exception
      'One active K-KUT purchase per purchaser per title (purchaser=%, parent_k_kut=%)',
      new.purchaser_id, v_parent_k_kut_id
      using errcode = 'unique_violation';
  end if;

  return new;
end;
$$;

-- Apply guard trigger if sb.k_kup exists
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'sb' and table_name = 'k_kup'
  ) then
    execute '
      drop trigger if exists trg_k_kup_one_per_purchaser on sb.k_kup;
      create trigger trg_k_kup_one_per_purchaser
        before insert on sb.k_kup
        for each row execute function sb.enforce_one_active_kkut_per_purchaser();
    ';
  end if;
end;
$$;

-- Index for the guard lookup (purchaser_id + status)
create index if not exists idx_k_kup_purchaser_status
  on sb.k_kup (purchaser_id, status)
  where status in ('PENDING', 'COMPLETED');

create index if not exists idx_k_kut_variants_k_kut_id
  on sb.k_kut_variants (k_kut_id);

-- ============================================================
-- D) JWT org helper (SECURITY DEFINER - stable lookup)
-- ============================================================

create or replace function public.get_jwt_org_id()
returns uuid
language sql
stable
security definer
as $$
  select nullif(
    current_setting('request.jwt.claims', true)::jsonb ->> 'org_id',
    ''
  )::uuid;
$$;

revoke all on function public.get_jwt_org_id() from public, anon;
grant execute on function public.get_jwt_org_id() to authenticated;

-- ============================================================
-- E) RLS on public.k_kut_assets
-- Org-scoped: authenticated users see only their org's active assets
-- Service role bypasses (for 4PE/KKr ingestion)
-- ============================================================

alter table public.k_kut_assets enable row level security;

-- Drop existing policies before recreating (idempotent)
drop policy if exists "k_kut_assets_authenticated_read" on public.k_kut_assets;
drop policy if exists "k_kut_assets_service_write" on public.k_kut_assets;

create policy "k_kut_assets_authenticated_read"
  on public.k_kut_assets
  for select
  to authenticated
  using (
    org_id = public.get_jwt_org_id()
    and status = 'active'
  );

-- Service role write policy (4PE/KKr ingestion)
create policy "k_kut_assets_service_write"
  on public.k_kut_assets
  for all
  to service_role
  using (true)
  with check (true);

-- ============================================================
-- Rollback notes (ALLOW_BIC required to execute these)
-- ============================================================
-- drop trigger if exists trg_k_kup_one_per_purchaser on sb.k_kup;
-- drop function if exists sb.enforce_one_active_kkut_per_purchaser();
-- drop trigger if exists trg_k_kut_assets_normalize_tag on public.k_kut_assets;
-- drop trigger if exists trg_k_kut_normalize_label on public.k_kut;
-- drop trigger if exists trg_pix_snippets_normalize_tag on public.pix_snippets;
-- drop function if exists public.normalize_structure_tag();
-- alter table public.k_kut drop constraint if exists k_kut_label_structure_check; -- ALLOW_BIC
-- alter table public.pix_snippets drop constraint if exists pix_snippets_structure_tag_check; -- ALLOW_BIC
-- drop table if exists public.k_kut_assets; -- ALLOW_BIC
-- drop function if exists public.get_jwt_org_id();
