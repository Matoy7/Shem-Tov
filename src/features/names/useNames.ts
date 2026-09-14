import { useCallback, useEffect, useState } from "react"
import { fetchNames, type NameFilters, type NameEntry } from "@/data/names"
import { fetchFavorites, setFavorited, seedFavoriteState, lastCommittedFavorite } from "@/data/favorites"
import type { NameCardData } from "./NameCard"

function fromEntry(n: NameEntry): NameCardData {
  return {
    nameId: n.id,
    text: n.text,
    gender: n.gender,
    origin: n.origin,
    origins: n.origins,
    meanings: n.meanings,
    styles: n.styles,
    meaningHe: n.meaningHe,
    meaningConfidence: n.meaningConfidence,
  }
}

type NamesState = {
  names: NameCardData[]
  favorites: Map<string, boolean>
  loading: boolean
  error: string | null
  reload: () => void
  toggleFavorite: (nameId: string) => void
}

/**
 * Loads the shared name catalogue for the current filters/search/sort, plus
 * which of the visible names the signed-in person has personally favorited.
 * No family, no group state — everything here is either public catalogue
 * data or this one person's own saved names.
 */
export function useNames(userId: string | undefined, filters: NameFilters = {}): NamesState {
  const [names, setNames] = useState<NameCardData[]>([])
  const [favorites, setFavorites] = useState<Map<string, boolean>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  const filterKey = JSON.stringify(filters)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    fetchNames(filters)
      .then((rows) => rows.map(fromEntry))
      .then((rows) => {
        if (!active) return
        setNames(rows)
        return fetchFavorites(
          rows.map((r) => r.nameId),
          userId ?? null,
        )
      })
      .then((favMap) => {
        if (!active || !favMap) return
        const asBool = new Map<string, boolean>()
        for (const [nameId, state] of favMap) {
          asBool.set(nameId, state.favorited)
          seedFavoriteState(nameId, state.favorited)
        }
        setFavorites(asBool)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "שגיאה לא צפויה")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
    // filterKey stands in for filters, which is a fresh object every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filterKey, nonce])

  const toggleFavorite = useCallback(
    (nameId: string) => {
      if (!userId) return
      const wasFavorited = favorites.get(nameId) ?? lastCommittedFavorite(nameId) ?? false
      const nextFavorited = !wasFavorited

      setFavorites((prev) => {
        const next = new Map(prev)
        next.set(nameId, nextFavorited)
        return next
      })

      setFavorited(nameId, userId, nextFavorited).catch(() => {
        const committed = lastCommittedFavorite(nameId) ?? wasFavorited
        setFavorites((prev) => {
          const next = new Map(prev)
          next.set(nameId, committed)
          return next
        })
      })
    },
    [userId, favorites],
  )

  return { names, favorites, loading, error, reload, toggleFavorite }
}
