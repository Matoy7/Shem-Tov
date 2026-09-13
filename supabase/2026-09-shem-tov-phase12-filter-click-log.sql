-- ---------------------------------------------------------------------------
-- שם טוב — phase 12: filter-click log.
--
-- Run once in the Supabase SQL Editor, after phase 11.
--
-- Same write-only pattern as search_logs (phase 11): a signed-in user can
-- insert their own click rows; there is no SELECT policy for the client at
-- all, so nobody can read anyone's filter activity back through the app.
-- Reporting happens directly in the SQL Editor, which bypasses RLS.
--
-- One row per actual click on a filter option — a checkbox turning on and
-- the same checkbox turning back off are two separate rows (`selected`
-- distinguishes them), because "people keep toggling X on and off" is
-- itself a useful signal, not noise to collapse away.
--
-- `category` is a fixed vocabulary matching every clickable filter in the
-- UI today: gender, origin, meaning, style, popularity, and the five
-- "more filters" options. `value` is the specific option clicked within
-- that category (e.g. category='origin', value='biblical').
-- ---------------------------------------------------------------------------

create table if not exists public.filter_click_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  family_id  uuid references public.families (id) on delete set null,
  category   text not null check (category in (
    'gender', 'origin', 'meaning', 'style', 'popularity',
    'short', 'easy_in_english', 'works_internationally', 'starts_with', 'ends_with'
  )),
  value      text not null check (char_length(btrim(value)) between 1 and 40),
  selected   boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists filter_click_logs_created_at_idx on public.filter_click_logs (created_at desc);
create index if not exists filter_click_logs_category_value_idx on public.filter_click_logs (category, value);
create index if not exists filter_click_logs_user_id_idx on public.filter_click_logs (user_id);

alter table public.filter_click_logs enable row level security;

grant select, insert on public.filter_click_logs to authenticated;

drop policy if exists "a user may log their own filter clicks" on public.filter_click_logs;
create policy "a user may log their own filter clicks"
  on public.filter_click_logs for insert to authenticated
  with check (user_id = (select auth.uid()));
