import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { X } from "@phosphor-icons/react"
import { AREA_OPTIONS, PRICE_OPTIONS, RATING_OPTIONS, AVAILABILITY_OPTIONS, DISTANCE_OPTIONS, SERVICE_MODE_OPTIONS, CATEGORY_FIELDS, type FilterOption } from "./filterOptions"
import { EMPTY_PROFESSIONAL_FILTERS, type ProfessionalFiltersValue } from "./useProfessionals"
import type { ProfessionalCategory } from "@/data/professionals"

type ChipData = { key: string; label: string; onRemove: () => void }

function Chip({ chip }: { chip: ChipData }) {
  return (
    <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-[#f3ede8] ps-1 pe-2.5 text-[13px] font-medium text-[#1d1b19]">
      <button
        type="button"
        onClick={chip.onRemove}
        aria-label={`הסרת הסינון ${chip.label}`}
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-[#877275] transition-colors duration-150 hover:bg-[#e9e1d9] hover:text-[#1d1b19]"
      >
        <PhosphorIcon icon={X} size={10} color="currentColor" weight="bold" />
      </button>
      <span>{chip.label}</span>
    </span>
  )
}

function labelFor(options: FilterOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value
}

type ActiveFiltersRowProps = {
  category: ProfessionalCategory
  value: ProfessionalFiltersValue
  onChange: (value: ProfessionalFiltersValue) => void
}

/** Same "what did I choose" chip row as the name catalogue's own
 * ActiveFiltersRow — separate from the filter bar itself on purpose. */
export function ActiveFiltersRow({ category, value, onChange }: ActiveFiltersRowProps) {
  const chips: ChipData[] = []

  const pushMany = (key: string, selected: string[], options: FilterOption[], remove: (v: string) => ProfessionalFiltersValue) => {
    for (const v of selected) {
      chips.push({ key: `${key}-${v}`, label: labelFor(options, v), onRemove: () => onChange(remove(v)) })
    }
  }

  pushMany("area", value.area, AREA_OPTIONS, (v) => ({ ...value, area: value.area.filter((x) => x !== v) }))
  pushMany("distance", value.distance, DISTANCE_OPTIONS, (v) => ({ ...value, distance: value.distance.filter((x) => x !== v) }))
  pushMany("rating", value.rating, RATING_OPTIONS, (v) => ({ ...value, rating: value.rating.filter((x) => x !== v) }))
  pushMany("price", value.price, PRICE_OPTIONS, (v) => ({ ...value, price: value.price.filter((x) => x !== v) }))
  pushMany("availability", value.availability, AVAILABILITY_OPTIONS, (v) => ({
    ...value,
    availability: value.availability.filter((x) => x !== v),
  }))
  pushMany("serviceMode", value.serviceMode, SERVICE_MODE_OPTIONS, (v) => ({
    ...value,
    serviceMode: value.serviceMode.filter((x) => x !== v),
  }))

  for (const field of CATEGORY_FIELDS[category]) {
    const selected = value.extra[field.id] ?? []
    pushMany(`extra-${field.id}`, selected, field.options, (v) => ({
      ...value,
      extra: { ...value.extra, [field.id]: selected.filter((x) => x !== v) },
    }))
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[13px] font-medium text-[#877275]">סינון פעיל:</span>
      {chips.map((chip) => (
        <Chip key={chip.key} chip={chip} />
      ))}
      <button
        type="button"
        onClick={() => onChange(EMPTY_PROFESSIONAL_FILTERS)}
        className="ms-1 text-[13px] font-medium text-[#6f1e35] hover:underline"
      >
        ניקוי הכל
      </button>
    </div>
  )
}
