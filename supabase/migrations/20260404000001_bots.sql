-- =============================================================================
-- Migration: bots table + seed
-- Creates the `bots` table and seeds all five GPM BOT personas.
--
-- BOT roster (from components/GpmBot.tsx BOT_CONFIG):
--   MC-BOT     — KLEIGH, AUS     — #C8A882 — 🎛️  — /audio/mc_intro.m4a
--   LF-BOT     — Lisa Farmer, IL — #f9a8d4 — 💌  — /audio/lcf_intro.m4a
--   GD-BOT     — Founder, USA    — #6ee7b7 — 📊  — /audio/gpm_intro.m4a
--   PIXIE-BOT  — Jane Burton     — #a78bfa — ✨  — /audio/pixie_intro.m4a
--   OPS-BOT    — Ops & Admin     — #93c5fd — ⚙️  — NULL (vocal pending)
-- =============================================================================

create table if not exists bots (
  id            uuid        primary key default gen_random_uuid(),

  -- Canonical slug — matches BotName type in GpmBot.tsx
  bot_name      text        not null unique,

  -- Display metadata
  label         text        not null,
  color         text        not null,      -- hex colour for bot chip / ring
  ring_color    text        not null,      -- Tailwind ring class
  emoji         text        not null,

  -- Persona voice descriptor
  voice         text        not null,

  -- TTS tuning
  tts_pitch     numeric(4,2) not null default 1.0,
  tts_rate      numeric(4,2) not null default 1.0,
  tts_lang      text        not null default 'en-US',

  -- Greeting audio file path (null = TTS fallback until file is uploaded)
  greeting_audio text,

  -- Long-form greeting text (displayed + narrated on first expand)
  greeting      text        not null,

  -- First-visit cue line (one bold sentence shown on very first page load)
  first_visit_cue text      not null,

  -- Soft-delete / active flag
  is_active     boolean     not null default true,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table bots is 'GPM BOT personas powering the GpmBot guided-journey component.';

-- Updated-at trigger
create or replace function bots_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists bots_updated_at on bots;
create trigger bots_updated_at
  before update on bots
  for each row execute procedure bots_set_updated_at();

-- RLS: read-only for all authenticated & anon users (no writes from client)
alter table bots enable row level security;

create policy "bots_select_all"
  on bots for select
  using (is_active = true);

-- =============================================================================
-- Seed — upsert so re-running migration is safe
-- =============================================================================

insert into bots (
  bot_name, label, color, ring_color, emoji, voice,
  tts_pitch, tts_rate, tts_lang,
  greeting_audio, greeting, first_visit_cue
) values
(
  'MC-BOT', 'MC-BOT', '#C8A882', 'ring-amber-500/60', '🎛️',
  'Your guide · KLEIGH, AUS',
  1.1, 1.0, 'en-AU',
  '/audio/mc_intro.m4a',
  'G''day — MC-BOT here, your KLEIGH guide from AUS. Stream live right now, or tap → to become one of the first people on Earth to hold a K-KUT. No hard sell — just the good stuff.',
  'G''day, mate! I''m MC-BOT — KLEIGH, AUS. You''ve just stumbled onto something real: K-KUTs, mini-KUTs, and K-kUpIds — GPM''s own inventions. Stream now, or make history. Say "NEXT" or tap → and I''ll show you everything.'
),
(
  'LF-BOT', 'LF-BOT', '#f9a8d4', 'ring-pink-400/60', '💌',
  'Lisa Farmer · IL, USA',
  1.0, 0.95, 'en-US',
  '/audio/lcf_intro.m4a',
  'Hi there — I''m LF-BOT, Lisa Farmer from Illinois. I''ll walk you through every step nice and clear. Licensing, rights, deal questions — I turn all the complex stuff into plain English. Your work and your buyer''s needs are fully respected here. Let''s go!',
  'Hi! I''m LF-BOT — Lisa Farmer from IL. Say "NEXT" or tap → and I''ll guide you through every step with warmth and clarity. Nothing complicated, I promise!'
),
(
  'GD-BOT', 'GD-BOT', '#6ee7b7', 'ring-emerald-400/60', '📊',
  'Founder · Normal, USA',
  0.9, 1.1, 'en-US',
  '/audio/gpm_intro.m4a',
  'GD-BOT online. Direct. Energetic. ALIVE! I''m the Founder — Normal, USA. I find the next best move for you right now: pricing, campaigns, K-KUT focus. Customer is always right, and the right move is always forward. Let''s GO.',
  'GD-BOT online. ALIVE! I''m the Founder. Say "NEXT" or tap → and we level this up together. Direct, fast, and always rooting for you.'
),
(
  'PIXIE-BOT', 'PIXIE-BOT', '#a78bfa', 'ring-violet-400/60', '✨',
  'PIXIE · Creative Stylist',
  1.15, 1.0, 'en-GB',
  '/audio/pixie_intro.m4a',
  'Hi, I''m PIXIE-BOT ✨ Jane Burton, creative stylist and your guide to perfect music moments. I shape K-KUT experiences, curate PIXIE''s PIX playlist, and help you find the exact note that speaks. Say "NEXT" or tap → and let''s create something beautiful.',
  'I''m PIXIE-BOT ✨ Say "NEXT" or tap → and I''ll shape your perfect music moment — personal, curated, exactly right.'
),
(
  'OPS-BOT', 'OPS-BOT', '#93c5fd', 'ring-blue-400/60', '⚙️',
  'OPS-BOT · Ops & Admin',
  1.0, 1.05, 'en-US',
  NULL, -- Vocal recording pending; TTS fallback active
  'OPS-BOT here. Let''s keep things moving — I handle the admin side: accounts, order status, workflow questions, and anything that keeps the engine running. No fuss, just results. What do you need?',
  'OPS-BOT online. I''m your operations guide — accounts, orders, workflow. Say "NEXT" or tap → and let''s get it sorted.'
)
on conflict (bot_name) do update set
  label           = excluded.label,
  color           = excluded.color,
  ring_color      = excluded.ring_color,
  emoji           = excluded.emoji,
  voice           = excluded.voice,
  tts_pitch       = excluded.tts_pitch,
  tts_rate        = excluded.tts_rate,
  tts_lang        = excluded.tts_lang,
  greeting_audio  = excluded.greeting_audio,
  greeting        = excluded.greeting,
  first_visit_cue = excluded.first_visit_cue,
  is_active       = true,
  updated_at      = now();
