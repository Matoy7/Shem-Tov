import { supabase } from "@/lib/supabase"

/**
 * Logs a search query. Fire-and-forget by design: a failed log write should
 * never interrupt or slow down the actual search the person is doing, so
 * this never throws — callers don't need a try/catch.
 */
export async function logSearch(query: string, userId: string, familyId: string | null): Promise<void> {
  const trimmed = query.trim().slice(0, 100)
  if (!trimmed) return

  const { error } = await supabase
    .from("search_logs")
    .insert({ query: trimmed, user_id: userId, family_id: familyId })

  if (error) console.error("search log failed", error)
}
