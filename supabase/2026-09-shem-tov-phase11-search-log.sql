-- ---------------------------------------------------------------------------
-- טפשת — phase 11: search log.
--
-- Run once in the Supabase SQL Editor, after phase 10.
--
-- What this is: a write-only log of search queries, so you can see what
-- people are actually typing (including names nobody found, which is the
-- most useful signal for deciding what to add to the catalogue next).
--
-- "Write-only" is deliberate: the RLS policy below lets a signed-in user
-- insert their own search rows, but there is no SELECT policy for the
-- client at all — nobody can read anyone's search history back through the
-- app, including their own. Reporting happens the same way as the other
-- queries you've been running: directly in the SQL Editor, which runs with
-- elevated privileges and bypasses RLS entirely. That split (write-only
-- for the client, fully readable for you at the SQL level) is what makes
-- this safe to add without it becoming a place where search history leaks
-- to other users.
--
-- family_id is nullable because browsing (and therefore searching) works
-- without an active family.
-- ---------------------------------------------------------------------------

create table if not exists public.search_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  family_id  uuid references public.families (id) on delete set null,
  query      text not null check (char_length(btrim(query)) between 1 and 100),
  created_at timestamptz not null default now()
);

create index if not exists search_logs_created_at_idx on public.search_logs (created_at desc);
create index if not exists search_logs_query_idx      on public.search_logs (lower(query));
create index if not exists search_logs_user_id_idx    on public.search_logs (user_id);

alter table public.search_logs enable row level security;

grant select, insert on public.search_logs to authenticated;

-- Deliberately insert-only for the client — see the note above. Read access
-- is intentionally left to nobody at the RLS layer; only a bypass-RLS
-- connection (the SQL Editor, an admin API key) can read this table.
drop policy if exists "a user may log their own search" on public.search_logs;
create policy "a user may log their own search"
  on public.search_logs for insert to authenticated
  with check (user_id = (select auth.uid()));
