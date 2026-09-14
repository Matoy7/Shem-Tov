-- ---------------------------------------------------------------------------
-- שם טוב — phase 15: raw user agent on profiles.
--
-- Run once in the Supabase SQL Editor, after phase 14.
--
-- device_type (phase 14) is a coarse classification — mobile/desktop/tablet
-- — because that's all that can be reliably detected. Exact hardware model
-- (e.g. "iPhone 7") isn't reliably obtainable at all: iOS deliberately
-- omits it from the user agent and exposes no API that reveals it, by
-- design, to limit device fingerprinting. Android traditionally included a
-- real model string, though browsers have been progressively genericizing
-- that too.
--
-- Rather than build brittle parsing logic that's right for some devices and
-- silently wrong for others, this stores the raw navigator.userAgent string
-- itself — the actual, honest data available — so it can be inspected
-- directly instead of trusting an inferred model name.
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists user_agent text;
