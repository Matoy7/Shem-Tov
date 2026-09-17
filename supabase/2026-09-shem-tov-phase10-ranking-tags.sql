-- ---------------------------------------------------------------------------
-- טפשת — phase 10: category tags on the ranking view too.
--
-- Run once in the Supabase SQL Editor, after phase 9.
--
-- The name-card redesign shows origin/meaning/style tags on every card.
-- Browse already had this data (fetchNames selects the boolean columns
-- directly), but family_name_rankings never exposed them — the ranking
-- screen's cards would have shown no tags at all. Same CREATE OR REPLACE
-- VIEW pattern as phase 5's meaning_he addition: existing columns keep
-- their position, nothing that already reads this view breaks.
-- ---------------------------------------------------------------------------

create or replace view public.family_name_rankings
with (security_invoker = true) as
select
  v.family_id,
  n.id                       as name_id,
  n.text,
  n.gender,
  n.origin,
  n.family_id                as suggested_for_family_id,
  count(distinct v.user_id)  as vote_count,
  max(v.created_at)          as last_voted_at,
  n.meaning_he,
  n.meaning_confidence,
  n.biblical, n.hebrew, n.israeli, n.international, n.arabic, n.european, n.greek,
  n.meaning_love, n.meaning_nature, n.meaning_light, n.meaning_strength, n.meaning_joy, n.meaning_freedom,
  n.style_classic, n.style_modern, n.style_unique, n.style_soft, n.style_traditional, n.style_vintage
from public.name_votes v
join public.names n on n.id = v.name_id
group by
  v.family_id, n.id, n.text, n.gender, n.origin, n.family_id, n.meaning_he, n.meaning_confidence,
  n.biblical, n.hebrew, n.israeli, n.international, n.arabic, n.european, n.greek,
  n.meaning_love, n.meaning_nature, n.meaning_light, n.meaning_strength, n.meaning_joy, n.meaning_freedom,
  n.style_classic, n.style_modern, n.style_unique, n.style_soft, n.style_traditional, n.style_vintage;

grant select on public.family_name_rankings to authenticated;
