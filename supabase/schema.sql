-- True U Athletics — Calendar / training log schema.
-- Run this once in the Supabase dashboard: Project -> SQL Editor -> New query -> paste -> Run.

create table if not exists public.calendar_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  entry_date date not null,
  training text,
  supplements jsonb not null default '[]'::jsonb,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists calendar_entries_user_date_idx
  on public.calendar_entries (user_id, entry_date);

-- Row Level Security is enabled with no policies for the anon/authenticated
-- roles. This app doesn't use Supabase Auth — every request goes through
-- Clerk first, and the server only ever talks to Supabase using the service
-- role key (which bypasses RLS), so the table stays locked down against any
-- direct client access.
alter table public.calendar_entries enable row level security;
