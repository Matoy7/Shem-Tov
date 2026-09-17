-- ---------------------------------------------------------------------------
-- טפשת — phase 13: remove the Family feature entirely.
--
-- Run once in the Supabase SQL Editor, after phase 12.
--
-- The product no longer has families, family membership, invitations,
-- family-scoped voting, family-suggested names, or family-vote
-- notifications — this migration drops every table, view, function and
-- trigger that existed only to support those, and replaces family-scoped
-- voting with a plain personal favorites table (name_favorites): one
-- person, one name, no group context.
--
-- What is NOT dropped: the actual name rows. A name a family once
-- suggested stays in the catalogue as a normal name — only the columns
-- that marked it as "this family's private suggestion" (family_id,
-- suggested_by) are removed from `names`, per "keep all existing baby name
-- data intact." Nothing in `names` itself is deleted.
--
-- This is irreversible — families, their membership, invitations, and
-- every vote ever cast are gone once this runs. If you need that data for
-- any reason, export it first.
--
-- Corrected from the first version of this file: that one tried to drop
-- is_family_member()/is_family_owner() while `names`' own RLS policies
-- still called them — Postgres correctly refused ("other objects depend on
-- it"). This version drops every policy that references those functions
-- BEFORE dropping the functions themselves, and — the part the first
-- version genuinely missed — replaces the old family-scoped SELECT policy
-- on `names` with a plain "any signed-in user can read the catalogue"
-- policy. Without that, this migration would have left `names` with no
-- SELECT policy at all once the family-only one was dropped, which means
-- RLS would silently return zero rows to everyone — exactly the "blank
-- cards" symptom, just moved one step earlier.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- names: drop the three family-scoped policies first — nothing later in
-- this file can drop is_family_member()/is_family_owner() while these still
-- reference them — then immediately add back a plain, family-free SELECT
-- policy so the catalogue is never left with zero read access in between.
-- ---------------------------------------------------------------------------

drop policy if exists "the catalogue is readable, suggestions are family-only" on public.names;
drop policy if exists "a member may suggest a name to their own family" on public.names;
drop policy if exists "the suggester or an owner may remove a suggestion" on public.names;

drop policy if exists "the catalogue is readable to any signed-in user" on public.names;
create policy "the catalogue is readable to any signed-in user"
  on public.names for select to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Dependency order for everything else: triggers/functions that reference a
-- table before the table itself, working from the most-dependent objects
-- (name_notifications, the ranking view, name_votes) down to families
-- itself, and only dropping is_family_member/is_family_owner at the very
-- end, once nothing references them any more.
-- ---------------------------------------------------------------------------

drop trigger if exists on_name_suggestion_voted on public.name_votes;
drop function if exists public.notify_name_suggestion_voted();
drop table if exists public.name_notifications;

drop view if exists public.family_name_rankings;

drop table if exists public.name_votes;

drop function if exists public.create_invitation(uuid, interval);
drop function if exists public.redeem_invitation(text);
drop function if exists public.revoke_invitation(uuid);
drop table if exists public.family_invitations;

drop trigger if exists on_family_created on public.families;
drop function if exists public.handle_new_family();
drop table if exists public.family_members;

-- names/search_logs/filter_click_logs each hold a family_id foreign key
-- pointing at families — those columns must go before the table they
-- reference does, or Postgres refuses the drop the same way it refused
-- dropping is_family_member() while a policy still called it.
--
-- names: drop only the family-suggestion columns. The rows, and every other
-- column (meaning, style, popularity, all the filter flags), are untouched.
alter table public.names
  drop column if exists family_id,
  drop column if exists suggested_by;

-- Analytics tables lose their family_id column — nothing left to scope it
-- to. The rest of each table (who searched/clicked what, and when) is
-- unaffected.
alter table public.search_logs       drop column if exists family_id;
alter table public.filter_click_logs drop column if exists family_id;

drop table if exists public.families;

drop function if exists public.is_family_member(uuid);
drop function if exists public.is_family_owner(uuid);

-- ---------------------------------------------------------------------------
-- name_favorites — the replacement for name_votes. A personal save/bookmark:
-- one row per (user, name), no family, no shared count, nothing to
-- coordinate with anyone else.
-- ---------------------------------------------------------------------------

create table if not exists public.name_favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name_id    uuid not null references public.names (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, name_id)
);

create index if not exists name_favorites_user_id_idx on public.name_favorites (user_id);
create index if not exists name_favorites_name_id_idx on public.name_favorites (name_id);

alter table public.name_favorites enable row level security;

grant select, insert, delete on public.name_favorites to authenticated;

drop policy if exists "a user may see their own favorites" on public.name_favorites;
create policy "a user may see their own favorites"
  on public.name_favorites for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "a user may favorite a name for themselves" on public.name_favorites;
create policy "a user may favorite a name for themselves"
  on public.name_favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "a user may remove their own favorite" on public.name_favorites;
create policy "a user may remove their own favorite"
  on public.name_favorites for delete to authenticated
  using ((select auth.uid()) = user_id);
