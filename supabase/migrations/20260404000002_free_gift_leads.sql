-- =============================================================================
-- Migration: free_gift_leads
-- Stores email addresses captured after a user claims a free gift.
-- Written by: POST /api/free-gift/capture-email
-- =============================================================================

create table if not exists free_gift_leads (
  id           uuid        primary key default gen_random_uuid(),
  issuance_id  text        not null,   -- FK reference to free_gift_issuances.id (text UUID)
  email        text        not null,
  session_id   text,                   -- optional caller session ID
  captured_at  timestamptz not null default now(),

  -- Prevent the same email being captured twice for the same gift claim
  unique (issuance_id, email)
);

comment on table free_gift_leads is 'Email opt-ins collected on the gift claim page for list-building and re-engagement.';

-- Index for marketing queries by email or issuance
create index if not exists free_gift_leads_email_idx      on free_gift_leads (email);
create index if not exists free_gift_leads_issuance_idx   on free_gift_leads (issuance_id);

-- RLS: only service-role can read (raw email data)
alter table free_gift_leads enable row level security;

-- No select policy for anon/authenticated — only service-role key bypasses RLS
