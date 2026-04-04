-- =============================================================================
-- Migration: contact_inquiries
-- Stores contact form submissions from /contact → POST /api/contact.
-- =============================================================================

create table if not exists contact_inquiries (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  email        text        not null,
  subject      text        not null,
  message      text        not null,
  submitted_at timestamptz not null default now()
);

comment on table contact_inquiries is 'Contact form submissions from gputnammusic.com/contact.';

-- Index for admin triage by email or recency
create index if not exists contact_inquiries_email_idx on contact_inquiries (email);
create index if not exists contact_inquiries_date_idx  on contact_inquiries (submitted_at desc);

-- RLS: service-role only (admin reads via Supabase Studio / service key)
alter table contact_inquiries enable row level security;

-- No anon/authenticated select policy — only service-role key bypasses RLS
