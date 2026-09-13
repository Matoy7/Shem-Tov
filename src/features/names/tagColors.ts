import type { Origin, Meaning, Style } from "@/data/names"

export type TagSwatch = { bg: string; text: string; border: string }

/**
 * Every tag value gets its own color, but all of them share the same
 * background lightness and saturation — only the hue changes. That's the
 * actual rule being followed here: consistent lightness/saturation reads as
 * "one coherent tag system" (the same visual "family" the product asks
 * for), while distinct hues keep each value tellable apart at a glance.
 * Origins sit in a cool arc, meanings in a warm/nature arc, styles in a
 * muted earthy arc — so even the categories read as related-but-distinct
 * groups, not just 19 random colors.
 */
const ORIGIN_LABELS: Record<Origin, string> = {
  biblical: "מקראי",
  hebrew: "עברי",
  israeli: "ישראלי",
  international: "בינלאומי",
  arabic: "ערבי",
  european: "אירופאי",
  greek: "יווני",
}

const ORIGIN_SWATCH: Record<Origin, TagSwatch> = {
  biblical: { bg: "#eee7f8", text: "#4a257e", border: "#cdbae8" },
  hebrew: { bg: "#e7eef8", text: "#254a7e", border: "#bacde8" },
  israeli: { bg: "#e7f5f8", text: "#25707e", border: "#bae0e8" },
  international: { bg: "#e7e9f8", text: "#252c7e", border: "#babee8" },
  arabic: { bg: "#f8f1e7", text: "#7e5925", border: "#e8d5ba" },
  european: { bg: "#f8e7ed", text: "#7e2543", border: "#e8bac9" },
  greek: { bg: "#e7f8f7", text: "#257e77", border: "#bae8e4" },
}

const MEANING_LABELS: Record<Meaning, string> = {
  love: "אהבה",
  nature: "טבע",
  light: "אור",
  strength: "עוצמה",
  joy: "שמחה",
  freedom: "חופש",
}

const MEANING_SWATCH: Record<Meaning, TagSwatch> = {
  love: { bg: "#f8e7ee", text: "#7e254a", border: "#e8bacd" },
  nature: { bg: "#e7f8ed", text: "#257e43", border: "#bae8c9" },
  light: { bg: "#f8f5e7", text: "#7e6d25", border: "#e8dfba" },
  strength: { bg: "#f8ece7", text: "#7e4025", border: "#e8c8ba" },
  joy: { bg: "#f8e7f8", text: "#7e257e", border: "#e8bae8" },
  freedom: { bg: "#e7f3f8", text: "#25617e", border: "#bad9e8" },
}

const STYLE_LABELS: Record<Style, string> = {
  classic: "קלאסי",
  modern: "מודרני",
  unique: "ייחודי",
  soft: "רך",
  traditional: "מסורתי",
  vintage: "וינטג'",
}

const STYLE_SWATCH: Record<Style, TagSwatch> = {
  classic: { bg: "#f8f3e7", text: "#7e6125", border: "#e8d9ba" },
  modern: { bg: "#e7f0f8", text: "#25527e", border: "#bad1e8" },
  unique: { bg: "#f3e7f8", text: "#61257e", border: "#d9bae8" },
  soft: { bg: "#f8e7ea", text: "#7e2534", border: "#e8bac2" },
  traditional: { bg: "#f8eee7", text: "#7e4a25", border: "#e8cdba" },
  vintage: { bg: "#f8ebe7", text: "#7e3b25", border: "#e8c6ba" },
}

export type CardTag = { label: string; swatch: TagSwatch; key: string }

export function originTag(value: Origin): CardTag {
  return { key: `origin-${value}`, label: ORIGIN_LABELS[value], swatch: ORIGIN_SWATCH[value] }
}
export function meaningTag(value: Meaning): CardTag {
  return { key: `meaning-${value}`, label: MEANING_LABELS[value], swatch: MEANING_SWATCH[value] }
}
export function styleTag(value: Style): CardTag {
  return { key: `style-${value}`, label: STYLE_LABELS[value], swatch: STYLE_SWATCH[value] }
}
