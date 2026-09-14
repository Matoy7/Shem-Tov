-- ---------------------------------------------------------------------------
-- שם טוב — phase 14: device type on profiles.
--
-- Run once in the Supabase SQL Editor, after phase 13.
--
-- One nullable column: which kind of device the person most recently
-- signed in from — 'mobile', 'desktop', or 'tablet'. Detected client-side
-- (see src/lib/device.ts) and written every time upsertProfile() runs,
-- which is already every sign-in for every user, guest or linked — no new
-- code path needed for either case.
--
-- Existing rows get NULL, not a guessed value: there is no reliable way to
-- infer a past session's device after the fact, and inventing one would be
-- worse than admitting the data doesn't exist yet. Each existing user's
-- device_type fills in naturally the next time they open the app.
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists device_type text
    check (device_type is null or device_type in ('mobile', 'desktop', 'tablet'));

-- Only useful for filtering/grouping by device — a plain index is enough,
-- and pointless on the (very common) null rows before this ships fully.
create index if not exists profiles_device_type_idx
  on public.profiles (device_type)
  where device_type is not null;
