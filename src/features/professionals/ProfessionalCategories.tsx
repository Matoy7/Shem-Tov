import { cn } from "@/lib/cn"
import { CATEGORY_TABS } from "./filterOptions"
import type { ProfessionalCategory } from "@/data/professionals"

type ProfessionalCategoriesProps = {
  value: ProfessionalCategory
  onChange: (value: ProfessionalCategory) => void
}

/**
 * Category selector — same segmented-pill convention as the name catalogue's
 * "who it's for" control (NameFiltersBar's GENDER_TABS): individual white
 * pills, the active one filled solid pink/burgundy, never a shared track.
 * Horizontally scrollable with no visible scrollbar on narrow viewports
 * rather than wrapping, so it always reads as one row of tabs.
 */
export function ProfessionalCategories({ value, onChange }: ProfessionalCategoriesProps) {
  return (
    <div
      role="tablist"
      aria-label="קטגוריית בעל מקצוע"
      className="scrollbar-none flex items-center gap-2 overflow-x-auto"
    >
      {CATEGORY_TABS.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex h-10 shrink-0 items-center rounded-full px-4 text-body-sm font-semibold transition-colors duration-150 sm:h-9 sm:px-4",
              active
                ? "bg-[#ffd9de] text-[#6f1e35] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "bg-white text-[#544245] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:text-[#6f1e35]",
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
