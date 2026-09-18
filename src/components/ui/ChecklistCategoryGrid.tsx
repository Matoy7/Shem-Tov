import type { ReactNode } from "react"

/**
 * Desktop category grid: 1 column just above the mobile/desktop split
 * (sm–lg, "small desktop/tablet"), 2 from `lg` (1024px, "medium desktop"),
 * 3 from `xl` (1280px, "large desktop") — matching the 1024/1280/1440
 * widths the desktop layout is meant to work at. A `max-w` keeps cards from
 * stretching to an uncomfortable reading width on very wide screens.
 */
export function ChecklistCategoryGrid({ children }: { children: ReactNode }) {
  return <div className="grid max-w-[1200px] grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">{children}</div>
}
