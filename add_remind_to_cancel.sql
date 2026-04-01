alter table if exists public.subscriptions
add column if not exists remind_to_cancel boolean not null default false;
