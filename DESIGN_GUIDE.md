# Tafsheet — mobile visual design guide (post Home-screen redesign)

This captures the visual language established by the Home screen redesign, so
it can be applied consistently to the other mobile screens (Hospital Bag,
Baby Gear, Leaving the House, and anything built after this) without
re-deriving it each time. This is a **styling reference**, not new logic —
applying it to another screen means restyling that screen's existing
markup/behavior, not rebuilding it.

## Palette

| Role | Value | Usage |
|---|---|---|
| Page background | `#fef8f3` | warm cream, mobile only (`--color-mobile-cream`) |
| Primary / headings | `#6f1e35` | burgundy — hero title, card titles, icons |
| Secondary text | `#8a5a63` / `#544245` | hero subtitle, card subtitles, muted body copy |
| Body text | `#1d1b19` | checklist item labels, primary readable text |
| Placeholder text | `#877275` | |
| Soft pink accent | `rgba(255,217,222, 0.4–0.5)` | icon-circle backgrounds, arrow-button backgrounds, tip boxes |
| Cards | `#ffffff` | always white, never tinted |
| Hairline borders | `#f0e8e0` | header bottom border, dividers |
| Neutral badge bg | `#f3ede8` / `#f8f3ee` | quantity pills, zero-progress badges |

No blue, green, yellow, orange, or rainbow colors anywhere. No gradients.

## Typography

Rubik throughout (weights up to 900 are loaded). Approximate scale, largest to smallest:

- Hero title: `34px` / `font-extrabold` / burgundy, centered
- Hero subtitle: `16px` / regular / secondary color, centered
- Card title: `17px` / `font-bold` / burgundy
- Card subtitle: `13px` / regular / secondary color
- Checklist item label: `14–15px` / semibold / body color
- Checklist item sub-label: `12px` / regular / secondary color
- Small badges/pills: `11–13px` / semibold

## Header

- Two elements only: account avatar (left/end) and hamburger menu (right/start) — no centered logo.
- `bg-[#fef8f3]/90 backdrop-blur-sm`, `border-b border-[#f0e8e0]`.
- Generous padding (`px-5 py-4`), not cramped.
- The header component (`Topbar.tsx`) is shared by every screen automatically — restyling it once updates every screen at once, nothing to repeat per-screen.

## Hero pattern (brand introduction, not a status line)

Used at the top of the Home screen; the same shape (title → subtitle → mascot/illustration, centered, generous whitespace) is the template for other screens' own hero areas (Hospital Bag and Baby Gear already follow a version of this — bring their exact sizing in line with the numbers above when next touched):

1. Large bold burgundy title, centered
2. Smaller secondary-color subtitle, centered
3. An illustration (the mascot on Home; a category illustration on detail screens), centered, generous margin above and below
4. No decorative clutter — no sparkles, no thought bubbles, no extra icons unless functional

## Cards

- White background, always — never tinted, never the old rotating pastel scheme.
- Large radius: `rounded-[28px]` for the big 2×2 grid cards; `rounded-xl` (24px via the app's own token) for denser list-style cards (accordions, checklist rows).
- Shadow: `shadow-[0px_1px_1px_rgba(0,0,0,0.05)]` — deliberately near-flat, never a heavier "floating" shadow.
- Illustration sits inside a soft pink circular backdrop (`rgba(255,217,222,0.4)`), not bare on the white card.
- A small circular arrow (same soft pink, burgundy stroke arrow icon) is a **visual affordance only** — the card itself remains the actual click target (one interactive element, not a button nested inside a button).

## Icons

Small, single-color (burgundy or secondary-brown), no multi-color icon sets. Plain emoji are an acceptable stand-in for checklist/category icons (already used this way on the Bag and Gear screens) rather than commissioning new SVGs for every placeholder item.

## Spacing

Generous over tight. When in doubt on a new screen, prefer more whitespace around hero illustrations and more internal card padding rather than less — the brief for this redesign was explicit that the previous implementation felt cramped.
