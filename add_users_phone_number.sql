alter table if exists public.users
add column if not exists phone_number text;
