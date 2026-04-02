-- Create canonical short-code mapping table for K-KUT gateway.
-- Used by /api/k/create and /api/k/resolve/[code].

create table if not exists public.k_kut_codes (
  code text primary key,
  destination text not null,
  item_type text not null check (item_type in ('STI', 'BTI', 'FP')),
  item_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_k_kut_codes_created_at
  on public.k_kut_codes (created_at desc);
