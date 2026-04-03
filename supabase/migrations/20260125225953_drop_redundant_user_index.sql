-- Drop redundant index on user_profiles.auth_user_id.
-- The column is declared UNIQUE NOT NULL, so Postgres already maintains an
-- implicit unique index for that constraint.  The explicit
-- idx_user_profiles_auth_user index is therefore redundant and wastes space /
-- write overhead.
DROP INDEX IF EXISTS public.idx_user_profiles_auth_user;
