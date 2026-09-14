import { supabase } from "@/lib/supabase"

export const NAME_MAX_LENGTH = 60

export type Gender = "boy" | "girl" | "unisex"
export type Origin = "biblical" | "hebrew" | "israeli" | "international" | "arabic" | "european" | "greek"
export type Meaning = "love" | "nature" | "light" | "strength" | "joy" | "freedom"
export type Style = "classic" | "modern" | "unique" | "soft" | "traditional" | "vintage"
export type Popularity = "popular" | "less_common" | "rare" | "very_rare"
export type MeaningConfidence = "verified" | "uncertain"

export type NameEntry = {
  id: string
  text: string
  gender: Gender | null
  /** Free text, e.g. "Biblical;Hebrew" — for display. Filtering uses the boolean flags below, not this string. */
  origin: string | null
  origins: Origin[]
  meanings: Meaning[]
  styles: Style[]
  popularity: Popularity | null
  length: number | null
  short: boolean
  easyInEnglish: boolean
  worksInternationally: boolean
  startsWith: string | null
  endsWith: string | null
  /** The actual Hebrew meaning, as curated — never AI-generated, never translated or reworded. */
  meaningHe: string | null
  meaningSource: string | null
  meaningConfidence: MeaningConfidence | null
  createdAt: string
}

type NameRow = {
  id: string
  text: string
  gender: Gender | null
  origin: string | null
  created_at: string
  popularity: Popularity | null
  length: number | null
  short: boolean
  easy_in_english: boolean
  works_internationally: boolean
  starts_with: string | null
  ends_with: string | null
  biblical: boolean
  hebrew: boolean
  israeli: boolean
  international: boolean
  arabic: boolean
  european: boolean
  greek: boolean
  meaning_love: boolean
  meaning_nature: boolean
  meaning_light: boolean
  meaning_strength: boolean
  meaning_joy: boolean
  meaning_freedom: boolean
  style_classic: boolean
  style_modern: boolean
  style_unique: boolean
  style_soft: boolean
  style_traditional: boolean
  style_vintage: boolean
  meaning_he: string | null
  meaning_source: string | null
  meaning_confidence: MeaningConfidence | null
}

const SELECT_COLUMNS = `id, text, gender, origin, created_at, popularity, length, short,
  easy_in_english, works_internationally, starts_with, ends_with,
  biblical, hebrew, israeli, international, arabic, european, greek,
  meaning_love, meaning_nature, meaning_light, meaning_strength, meaning_joy, meaning_freedom,
  style_classic, style_modern, style_unique, style_soft, style_traditional, style_vintage,
  meaning_he, meaning_source, meaning_confidence`

const ORIGIN_FLAGS: Origin[] = ["biblical", "hebrew", "israeli", "international", "arabic", "european", "greek"]
const MEANING_FLAGS: Meaning[] = ["love", "nature", "light", "strength", "joy", "freedom"]
const STYLE_FLAGS: Style[] = ["classic", "modern", "unique", "soft", "traditional", "vintage"]

function fromRow(row: NameRow): NameEntry {
  return {
    id: row.id,
    text: row.text,
    gender: row.gender,
    origin: row.origin,
    origins: ORIGIN_FLAGS.filter((o) => row[o]),
    meanings: MEANING_FLAGS.filter((m) => row[`meaning_${m}` as keyof NameRow]),
    styles: STYLE_FLAGS.filter((s) => row[`style_${s}` as keyof NameRow]),
    popularity: row.popularity,
    length: row.length,
    short: row.short,
    easyInEnglish: row.easy_in_english,
    worksInternationally: row.works_internationally,
    startsWith: row.starts_with,
    endsWith: row.ends_with,
    meaningHe: row.meaning_he,
    meaningSource: row.meaning_source,
    meaningConfidence: row.meaning_confidence,
    createdAt: row.created_at,
  }
}

export type NameFilters = {
  /** Single-select — "who the name is for" is one choice, not several. */
  gender?: Gender
  /** Each array is OR'd within itself; every non-empty filter (including across categories) is AND'd with the rest. */
  origins?: Origin[]
  meanings?: Meaning[]
  styles?: Style[]
  popularities?: Popularity[]
  initial?: string
  endsWith?: string
  short?: boolean
  easyInEnglish?: boolean
  worksInternationally?: boolean
  search?: string
  /** "alphabetical" (default) or "popularity" — kept separate from the filter fields, per the sort/filter UI split. */
  sort?: "alphabetical" | "popularity"
}

/**
 * The shared name catalogue. Every `.or()` call below adds one more
 * `or=(...)` query parameter to the PostgREST request; independent `or=`
 * parameters are ANDed together by PostgREST, while the conditions listed
 * inside a single call are ORed — so calling `.or()` once per category
 * (Origin, Meaning, Style) is exactly "Girls AND (Biblical OR Hebrew) AND
 * (Nature)", not one giant OR of everything selected.
 */
export async function fetchNames(filters: NameFilters = {}): Promise<NameEntry[]> {
  let query = supabase.from("names").select(SELECT_COLUMNS)

  if (filters.gender) query = query.eq("gender", filters.gender)

  if (filters.origins?.length) {
    query = query.or(filters.origins.map((o) => `${o}.eq.true`).join(","))
  }
  if (filters.meanings?.length) {
    query = query.or(filters.meanings.map((m) => `meaning_${m}.eq.true`).join(","))
  }
  if (filters.styles?.length) {
    query = query.or(filters.styles.map((s) => `style_${s}.eq.true`).join(","))
  }
  if (filters.popularities?.length) query = query.in("popularity", filters.popularities)

  if (filters.initial) query = query.eq("starts_with", filters.initial)
  if (filters.endsWith) query = query.eq("ends_with", filters.endsWith)
  if (filters.short) query = query.eq("short", true)
  if (filters.easyInEnglish) query = query.eq("easy_in_english", true)
  if (filters.worksInternationally) query = query.eq("works_internationally", true)
  if (filters.search) query = query.ilike("text", `%${filters.search}%`)

  const ordered =
    filters.sort === "popularity"
      ? query.order("popularity_score", { ascending: false, nullsFirst: false }).order("text", { ascending: true })
      : query.order("text", { ascending: true })

  const { data, error } = await ordered
  if (error) throw error
  return (data as NameRow[]).map(fromRow)
}
