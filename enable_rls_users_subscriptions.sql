-- Renwize: enable Row Level Security on app tables (server uses service_role only; it bypasses RLS).
-- Run in Supabase → SQL Editor. Review Step 1 output before applying Step 2.

-- -----------------------------------------------------------------------------
-- Step 1 — Inspect existing policies (read-only)
-- -----------------------------------------------------------------------------
-- After RLS is enabled, default for anon/authenticated is deny unless a policy allows access.
-- Note policy names, roles, and cmd; drop or replace only if something conflicts with your intent.

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('users', 'subscriptions')
order by tablename, policyname;

-- -----------------------------------------------------------------------------
-- Step 2 — Enable RLS (safe for Next.js app using SUPABASE_SERVICE_ROLE_KEY only)
-- -----------------------------------------------------------------------------

alter table public.subscriptions enable row level security;
alter table public.users enable row level security;

-- -----------------------------------------------------------------------------
-- Step 3 — Optional hardening (only if Security Advisor still flags table grants)
-- Uncomment only if you do NOT use anon/authenticated + PostgREST for these tables.
-- -----------------------------------------------------------------------------

-- revoke all on table public.subscriptions from anon, authenticated;
-- revoke all on table public.users from anon, authenticated;

-- Re-grant usage on schema if needed for other objects (usually unchanged for service_role):
-- grant usage on schema public to postgres, anon, authenticated, service_role;
