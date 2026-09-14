import { supabase } from "@/lib/supabase"

/** Postgres unique-violation: already favorited. */
const UNIQUE_VIOLATION = "23505"

export type FavoriteState = {
  favorited: boolean
}

/**
 * Which of these names the signed-in user has personally favorited.
 * Scoped to just the user — no family, no shared/group state. One person's
 * saved names are theirs alone.
 */
export async function fetchFavorites(nameIds: string[], userId: string | null): Promise<Map<string, FavoriteState>> {
  const unique = [...new Set(nameIds)].filter(Boolean)
  const state = new Map<string, FavoriteState>(unique.map((id) => [id, { favorited: false }]))
  if (unique.length === 0 || !userId) return state

  const { data, error } = await supabase
    .from("name_favorites")
    .select("name_id")
    .eq("user_id", userId)
    .in("name_id", unique)

  if (error) throw error

  for (const row of (data ?? []) as { name_id: string }[]) {
    const entry = state.get(row.name_id)
    if (entry) entry.favorited = true
  }

  return state
}

async function insertFavorite(nameId: string, userId: string): Promise<void> {
  const { error } = await supabase.from("name_favorites").insert({ name_id: nameId, user_id: userId })
  if (error && error.code !== UNIQUE_VIOLATION) throw error
}

async function deleteFavorite(nameId: string, userId: string): Promise<void> {
  const { error } = await supabase.from("name_favorites").delete().eq("name_id", nameId).eq("user_id", userId)
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Serialised writes, keyed by nameId, so a rapid double-click can never race
// itself into the wrong end state — same pattern the old votes queue used.
// ---------------------------------------------------------------------------

const queues = new Map<string, Promise<unknown>>()
const desired = new Map<string, boolean>()
const committed = new Map<string, boolean>()

export function seedFavoriteState(nameId: string, favorited: boolean): void {
  if (!queues.has(nameId)) committed.set(nameId, favorited)
}

export function setFavorited(nameId: string, userId: string, favorited: boolean): Promise<void> {
  desired.set(nameId, favorited)

  const run = async (): Promise<void> => {
    const want = desired.get(nameId)
    if (want === undefined || want === committed.get(nameId)) return

    if (want) await insertFavorite(nameId, userId)
    else await deleteFavorite(nameId, userId)

    committed.set(nameId, want)
  }

  const previous = queues.get(nameId) ?? Promise.resolve()
  const next = previous.then(run, run)
  queues.set(
    nameId,
    next.catch(() => {}),
  )
  return next
}

export function lastCommittedFavorite(nameId: string): boolean | undefined {
  return committed.get(nameId)
}

/** Test seam: forget all queue state. */
export function resetFavoriteQueues(): void {
  queues.clear()
  desired.clear()
  committed.clear()
}
