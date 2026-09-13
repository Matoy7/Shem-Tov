import { supabase } from "@/lib/supabase"

export type FilterCategory =
  | "gender"
  | "origin"
  | "meaning"
  | "style"
  | "popularity"
  | "short"
  | "easy_in_english"
  | "works_internationally"
  | "starts_with"
  | "ends_with"

/**
 * Logs a single filter-option click. Fire-and-forget, same as logSearch:
 * a failed log write never interrupts the filter interaction itself.
 */
export async function logFilterClick(
  userId: string,
  familyId: string | null,
  category: FilterCategory,
  value: string,
  selected: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("filter_click_logs")
    .insert({ user_id: userId, family_id: familyId, category, value, selected })

  if (error) console.error("filter click log failed", error)
}
