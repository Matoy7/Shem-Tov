import { cn } from "@/lib/cn"
import { MultiFilterDropdown } from "./MultiFilterDropdown"
import { MoreFiltersDropdown, type MoreFilters } from "./MoreFiltersDropdown"
import { ORIGIN_OPTIONS, MEANING_OPTIONS, STYLE_OPTIONS, POPULARITY_OPTIONS } from "./filterOptions"
import type { Gender, Origin, Meaning, Style, Popularity } from "@/data/names"
import type { FilterCategory } from "@/data/filterClickLogs"

const GENDER_TABS: { value: Gender | undefined; label: string }[] = [
  { value: undefined, label: "כל השמות" },
  { value: "boy", label: "בנים" },
  { value: "girl", label: "בנות" },
  { value: "unisex", label: "יוניסקס" },
]

// Mobile-only: each gender tab's own pastel when active, from the design
// reference (same hues as NameCard's gender pill). "All names" has no
// reference color of its own, so it gets a neutral navy-on-cream treatment
// instead of picking one gender's color arbitrarily.
const GENDER_TAB_MOBILE_ACTIVE: Record<string, string> = {
  all: "bg-[#131835] text-white",
  boy: "bg-[#cfe6f7] text-[#0c4a6e]",
  girl: "bg-[#eed5dc] text-[#830e2f]",
  unisex: "bg-[#d0fcd1] text-[#081e18]",
}

export type NameFiltersValue = {
  gender: Gender | undefined
  origins: Origin[]
  meanings: Meaning[]
  styles: Style[]
  popularities: Popularity[]
  more: MoreFilters
}

export const EMPTY_NAME_FILTERS: NameFiltersValue = {
  gender: undefined,
  origins: [],
  meanings: [],
  styles: [],
  popularities: [],
  more: { short: false, easyInEnglish: false, worksInternationally: false, initial: undefined, endsWith: undefined },
}

type NameFiltersBarProps = {
  value: NameFiltersValue
  onChange: (value: NameFiltersValue) => void
  onFilterClick?: (category: FilterCategory, value: string, selected: boolean) => void
}

/**
 * Two visibly different kinds of control, on purpose:
 *
 * "Who it's for" is a segmented control — one shared pill-shaped track,
 * the active choice filled solid. Segmented controls read as "pick exactly
 * one of these" at a glance, which is exactly what gender is here.
 *
 * "What characteristics" (Origin/Meaning/Style/Popularity) are dropdown
 * pills with a chevron — each opens a checklist, because more than one can
 * be true at once. They never fill solid when active; a small count badge
 * is the only in-bar signal, since the real "what's active" answer lives in
 * the chip row below, not in this bar.
 */
export function NameFiltersBar({ value, onChange, onFilterClick }: NameFiltersBarProps) {
  const set = <K extends keyof NameFiltersValue>(key: K, next: NameFiltersValue[K]) =>
    onChange({ ...value, [key]: next })

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div
        role="radiogroup"
        aria-label="למי מיועד השם"
        className="flex shrink-0 items-center gap-1.5 sm:gap-0.5 sm:rounded-full sm:bg-surface-hover sm:p-1"
      >
        {GENDER_TABS.map((tab) => {
          const active = value.gender === tab.value
          const mobileKey = tab.value ?? "all"
          return (
            <button
              key={tab.label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                if (tab.value) onFilterClick?.("gender", tab.value, true)
                set("gender", tab.value)
              }}
              className={cn(
                "h-9 shrink-0 rounded-full px-4 text-body-sm font-semibold transition-colors duration-150",
                "sm:h-7 sm:px-3 sm:font-medium",
                active
                  ? cn(GENDER_TAB_MOBILE_ACTIVE[mobileKey], "sm:bg-surface sm:text-content-primary sm:shadow-panel")
                  : "bg-white text-[#131835]/70 sm:bg-transparent sm:text-content-secondary sm:hover:text-content-primary",
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <span aria-hidden className="mx-0.5 hidden h-5 w-px shrink-0 bg-border sm:block" />

      <div className="flex flex-wrap items-center gap-1.5">
        <MultiFilterDropdown
          label="מקור"
          options={ORIGIN_OPTIONS}
          values={value.origins}
          onChange={(v) => set("origins", v)}
          category="origin"
          onOptionClick={onFilterClick}
        />
        <MultiFilterDropdown
          label="משמעות"
          options={MEANING_OPTIONS}
          values={value.meanings}
          onChange={(v) => set("meanings", v)}
          category="meaning"
          onOptionClick={onFilterClick}
        />
        <MultiFilterDropdown
          label="סגנון"
          options={STYLE_OPTIONS}
          values={value.styles}
          onChange={(v) => set("styles", v)}
          category="style"
          onOptionClick={onFilterClick}
        />
        <MultiFilterDropdown
          label="פופולריות"
          options={POPULARITY_OPTIONS}
          values={value.popularities}
          onChange={(v) => set("popularities", v)}
          category="popularity"
          onOptionClick={onFilterClick}
        />
        <MoreFiltersDropdown value={value.more} onChange={(v) => set("more", v)} onOptionClick={onFilterClick} />
      </div>
    </div>
  )
}
