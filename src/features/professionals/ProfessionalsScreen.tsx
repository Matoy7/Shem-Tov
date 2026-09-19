import { SidebarSearch } from "@/components/layout/Sidebar"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { UsersThree } from "@phosphor-icons/react"
import { useProfessionals, type ProfessionalSort } from "./useProfessionals"
import { ProfessionalCategories } from "./ProfessionalCategories"
import { ProfessionalFilters } from "./ProfessionalFilters"
import { ActiveFiltersRow } from "./ActiveFiltersRow"
import { ProfessionalResults } from "./ProfessionalResults"
import { SORT_OPTIONS } from "./filterOptions"
import { PROFESSIONALS } from "@/data/professionals"

type ProfessionalsScreenProps = {
  onBack: () => void
}

/**
 * בעלי מקצוע — a directory of pregnancy/postpartum professionals, following
 * the same screen anatomy as Hospital Bag / Baby Gear / Leaving: a mobile
 * hero (icon in a soft-pink circle standing in for a dedicated illustration
 * — none exists yet for this category, and per the product's icon brief a
 * new icon comes from Phosphor rather than a fabricated PNG) + back button,
 * a compact DesktopScreenHeader on desktop, one Section-less flow of
 * category → search → filters → results shared by both breakpoints. All
 * state (category, search, filters, sort, favorites) lives here, exactly
 * like the checklist screens keep their own state — nothing needs lifting
 * to App.tsx since nothing here is logged or shared across screens.
 */
export function ProfessionalsScreen({ onBack }: ProfessionalsScreenProps) {
  const { category, setCategory, search, setSearch, filters, setFilters, sort, setSort, results, favorites, toggleFavorite } =
    useProfessionals()

  const categoryResults = PROFESSIONALS.filter((p) => p.category === category)

  return (
    <div className="px-1 pb-6 pt-2 sm:px-0" dir="rtl">
      {/* Mobile hero */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={onBack}
          className="mb-2 flex items-center gap-1 self-end text-[14px] font-medium text-[#6f1e35]"
        >
          ← חזרה
        </button>

        <div className="flex flex-col items-center pb-2 pt-1 text-center">
          <span aria-hidden className="mb-1 flex size-28 items-center justify-center rounded-full bg-[rgba(255,217,222,0.4)]">
            <PhosphorIcon icon={UsersThree} size={56} color="#6f1e35" weight="duotone" />
          </span>
          <h1 className="text-[26px] font-black leading-[34px] text-[#6f1e35]">בעלי מקצוע</h1>
          <p className="mt-1 text-[14px] leading-[22px] text-[#544245]">
            אנשים שיכולים לעזור לך בתקופת ההריון, הלידה והחודשים הראשונים
          </p>
        </div>
      </div>

      {/* Desktop header — same compact anatomy as DesktopScreenHeader (used
          by Bag/Gear/Leaving), but with the icon-circle standing in for
          that component's mandatory illustration prop, since no dedicated
          artwork exists for this category yet. */}
      <div className="hidden items-center gap-4 pb-1 sm:flex">
        <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[rgba(255,217,222,0.4)]">
          <PhosphorIcon icon={UsersThree} size={28} color="#6f1e35" weight="duotone" />
        </span>
        <div>
          <h1 className="text-[26px] font-bold leading-[32px] text-[#6f1e35]">בעלי מקצוע</h1>
          <p className="mt-0.5 text-[15px] leading-5 text-[#544245]">
            אנשים שיכולים לעזור לך בתקופת ההריון, הלידה והחודשים הראשונים
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <ProfessionalCategories value={category} onChange={setCategory} />

        <SidebarSearch
          placeholder="חיפוש לפי שם או אזור"
          query={search}
          onSearch={setSearch}
          onClear={() => setSearch("")}
        />

        <ProfessionalFilters category={category} value={filters} onChange={setFilters} categoryResults={categoryResults} />
        <ActiveFiltersRow category={category} value={filters} onChange={setFilters} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[15px] font-medium text-[#544245] sm:text-body-sm sm:text-content-secondary">
            נמצאו {results.length} בעלי מקצוע
          </p>
          <label className="flex items-center gap-1.5 text-[15px] font-medium text-[#6f1e35] sm:text-caption sm:font-normal sm:text-content-muted">
            מיון:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as ProfessionalSort)}
              className="rounded-md border-0 bg-transparent px-1 py-1 text-[15px] font-medium text-[#6f1e35] sm:border sm:border-border sm:bg-surface sm:px-2 sm:text-caption sm:text-content-primary"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ProfessionalResults results={results} favorites={favorites} onToggleFavorite={toggleFavorite} />
      </div>
    </div>
  )
}
