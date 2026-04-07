-- Renwize: credential password reset (forgot-password flow).
-- Run in Supabase SQL Editor after review. Server uses service_role only.

alter table if exists public.users
add column if not exists password_reset_token_hash text;

alter table if exists public.users
add column if not exists password_reset_expires_at timestamptz;

comment on column public.users.password_reset_token_hash is 'SHA-256 hex of one-time reset token; cleared after successful reset.';
comment on column public.users.password_reset_expires_at is 'UTC expiry for password reset request.';
