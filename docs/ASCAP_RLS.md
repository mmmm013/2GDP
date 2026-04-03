# ASCAP Event Logging — Auth & RLS Guide

## Overview

`POST /api/log-stream-time` records streaming play-time for ASCAP
performance-rights tracking. Since **2026-03-29** the route uses
**Supabase Auth cookie sessions** instead of the service-role key, making it
safe to call from public browser clients.

---

## Authentication requirement

All requests to `POST /api/log-stream-time` must be made from a browser
context where the user has an active Supabase Auth session. Unauthenticated
requests receive:

```
HTTP 401
{ "error": "Unauthorized" }
```

### How the session is resolved

The endpoint uses `@supabase/ssr` to construct a Supabase client that reads
the session from the Next.js request cookies (`sb-*` cookies set by Supabase
Auth). No service-role key is involved; the client runs with the user's own
JWT and is constrained by RLS policies.

---

## Required database schema

Run the migration below **once** against your Supabase project (or apply
`supabase/migrations/20260329000001_ascap_events_user_id.sql` via
`supabase db push`):

```sql
-- Add user_id column
ALTER TABLE public.ascap_events
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_ascap_events_user_id
  ON public.ascap_events(user_id);
```

---

## Required RLS policies

```sql
ALTER TABLE public.ascap_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events
CREATE POLICY ascap_events_insert_own ON public.ascap_events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own events
CREATE POLICY ascap_events_select_own ON public.ascap_events
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
```

The `accumulate_play_seconds_pix` RPC and `ascap_accumulator_ledger` table
may also need RLS policies if they are not already protected. Grant INSERT /
UPDATE access to `authenticated` with an appropriate `WITH CHECK` clause.

---

## Environment variables

| Variable                     | Required | Purpose                                      |
|------------------------------|----------|----------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`   | ✅       | Supabase project URL                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅    | Public anon key — used by the SSR client     |
| `SUPABASE_SERVICE_ROLE_KEY`  | ❌       | **Not required** for this endpoint           |

---

## Idempotency

- The caller may supply a UUID v4 `idempotencyKey` in the request body.
- If the key is omitted or is not a valid UUID v4, the server generates one.
- The key is stored as `ascap_events.id`; a second insert with the same UUID
  triggers a Postgres `23505` unique-violation and returns
  `{ ok: true, duplicate: true }` without double-counting.

**Future improvement:** add a composite unique constraint
`(user_id, idempotency_key)` on `ascap_events` so each user has an
independent key namespace. See the commented block in the migration file.

---

## Request body

| Field           | Type    | Required | Notes                                   |
|-----------------|---------|----------|-----------------------------------------|
| `seconds`       | integer | ✅       | Positive integer; seconds streamed      |
| `pixPckId`      | string  | ✅/❌    | PIX-PCK path (preferred)                |
| `parentVtId`    | string  | ✅/❌    | Legacy fallback; required if no pixPckId|
| `ascapWorkId`   | string  | ❌       | ASCAP work identifier                   |
| `productId`     | string  | ❌       | Product identifier for audit            |
| `source`        | string  | ❌       | E.g. `'kleigh-player'`                  |
| `idempotencyKey`| UUID v4 | ❌       | Auto-generated if absent or invalid     |

At least one of `pixPckId` or `parentVtId` must be provided.
