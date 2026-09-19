import { MultiFilterDropdown } from "@/features/names/MultiFilterDropdown"
import { ProfessionalMoreFiltersDropdown } from "./ProfessionalMoreFiltersDropdown"
import { AREA_OPTIONS, PRICE_OPTIONS, RATING_OPTIONS, AVAILABILITY_OPTIONS, DISTANCE_OPTIONS, SERVICE_MODE_OPTIONS, CATEGORY_FIELDS } from "./filterOptions"
import type { ProfessionalFiltersValue } from "./useProfessionals"
import type { ProfessionalCategory, Professional } from "@/data/professionals"

type ProfessionalFiltersProps = {
  category: ProfessionalCategory
  value: ProfessionalFiltersValue
  onChange: (value: ProfessionalFiltersValue) => void
  /** Used only to decide whether the sleep category's "שיטת ייעוץ" field
   * has anything to filter on — it's left out entirely when no professional
   * in view has methodology data, per the brief. */
  categoryResults: Professional[]
}

/**
 * One reusable filter bar for every professional category: the shared
 * fields (אזור/מחיר/דירוג/זמינות) always show as their own pill, one
 * category-specific field shows alongside them as a second top-level pill,
 * and everything else — מרחק, סוג שירות, and the category's remaining
 * fields — lives behind "עוד פילטרים". Every pill is the exact same
 * MultiFilterDropdown already used by the name catalogue's own filter bar,
 * not a new control.
 */
export function ProfessionalFilters({ category, value, onChange, categoryResults }: ProfessionalFiltersProps) {
  const set = <K extends keyof ProfessionalFiltersValue>(key: K, next: ProfessionalFiltersValue[K]) =>
    onChange({ ...value, [key]: next })

  const setExtra = (fieldId: string, next: string[]) => onChange({ ...value, extra: { ...value.extra, [fieldId]: next } })

  const fields = CATEGORY_FIELDS[category].filter((field) => {
    // "שיטת ייעוץ" only exists as a filter when at least one professional
    // currently in view has methodology data — never a dropdown with
    // nothing real behind it.
    if (field.id !== "method") return true
    return categoryResults.some((p) => (p.attrs.method ?? []).length > 0)
  })
  const primaryField = fields.find((f) => f.primary)
  const overflowFields = fields.filter((f) => !f.primary)

  return (
    <div className="scrollbar-none flex flex-wrap items-center gap-1.5 overflow-x-auto sm:flex-wrap">
      <MultiFilterDropdown label="אזור" options={AREA_OPTIONS} values={value.area} onChange={(v) => set("area", v)} />
      <MultiFilterDropdown label="מחיר" options={PRICE_OPTIONS} values={value.price} onChange={(v) => set("price", v)} />
      <MultiFilterDropdown label="דירוג" options={RATING_OPTIONS} values={value.rating} onChange={(v) => set("rating", v)} />
      <MultiFilterDropdown
        label="זמינות"
        options={AVAILABILITY_OPTIONS}
        values={value.availability}
        onChange={(v) => set("availability", v)}
      />

      {primaryField ? (
        <MultiFilterDropdown
          key={primaryField.id}
          label={primaryField.label}
          options={primaryField.options}
          values={value.extra[primaryField.id] ?? []}
          onChange={(v) => setExtra(primaryField.id, v)}
        />
      ) : null}

      <ProfessionalMoreFiltersDropdown
        fields={[
          { id: "distance", label: "מרחק", options: DISTANCE_OPTIONS },
          { id: "serviceMode", label: "סוג שירות", options: SERVICE_MODE_OPTIONS },
          ...overflowFields,
        ]}
        value={{ distance: value.distance, serviceMode: value.serviceMode, ...value.extra }}
        onChange={(next) => {
          const { distance = [], serviceMode = [], ...extra } = next
          onChange({ ...value, distance, serviceMode, extra: { ...value.extra, ...extra } })
        }}
      />
    </div>
  )
}
