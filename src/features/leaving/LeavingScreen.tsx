import { useMemo, useState } from "react"
import { AccordionItem } from "@/components/ui/Accordion"
import { ChecklistCategoryCard } from "@/components/ui/ChecklistCategoryCard"
import { ChecklistCategoryGrid } from "@/components/ui/ChecklistCategoryGrid"
import { DesktopScreenHeader } from "@/components/layout/DesktopScreenHeader"
import { assets } from "@/lib/assets"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { MultiFilterDropdown, type FilterOption } from "@/features/names/MultiFilterDropdown"
import { Check, X, CarSimple, House, Files, Basket, TShirt, BowlFood, ShieldCheck, Key } from "@phosphor-icons/react"
import type { Icon as PhosphorIconComponent } from "@phosphor-icons/react"

/**
 * Filters here follow the exact same component (`MultiFilterDropdown`) and
 * chip-row convention as "בחירת שם" — no new filter control was invented for
 * this screen, per the request. Each dimension is its own dropdown pill,
 * multi-select, staged in a draft and committed on Apply/close.
 */
type ArrivalMethod = "walk" | "car" | "public_transport" | "taxi" | "flight"
type OutingType = "outdoor" | "indoor"
type Duration = "up_to_hour" | "one_two_hours" | "two_four_hours" | "half_day" | "full_day" | "multiple_days"
type Distance = "near" | "up_to_30" | "up_to_hour" | "up_to_two_hours" | "more_than_two_hours"
type BabyFit = "stroller" | "carrier" | "nursing_feeding"

type LeavingFilters = {
  arrival: ArrivalMethod[]
  outingType: OutingType[]
  duration: Duration[]
  distance: Distance[]
  babyFit: BabyFit[]
}

const EMPTY_FILTERS: LeavingFilters = {
  arrival: [],
  outingType: [],
  duration: [],
  distance: [],
  babyFit: [],
}

const ARRIVAL_OPTIONS: FilterOption<ArrivalMethod>[] = [
  { value: "walk", label: "הליכה" },
  { value: "car", label: "רכב" },
  { value: "public_transport", label: "תחבורה ציבורית" },
  { value: "taxi", label: "מונית" },
  { value: "flight", label: "טיסה" },
]

const OUTING_TYPE_OPTIONS: FilterOption<OutingType>[] = [
  { value: "outdoor", label: "בחוץ" },
  { value: "indoor", label: "בתוך מבנה" },
]

const DURATION_OPTIONS: FilterOption<Duration>[] = [
  { value: "up_to_hour", label: "עד שעה" },
  { value: "one_two_hours", label: "1–2 שעות" },
  { value: "two_four_hours", label: "2–4 שעות" },
  { value: "half_day", label: "חצי יום" },
  { value: "full_day", label: "יום שלם" },
  { value: "multiple_days", label: "כמה ימים" },
]

const DISTANCE_OPTIONS: FilterOption<Distance>[] = [
  { value: "near", label: "קרוב לבית" },
  { value: "up_to_30", label: "עד 30 דקות" },
  { value: "up_to_hour", label: "עד שעה" },
  { value: "up_to_two_hours", label: "עד שעתיים" },
  { value: "more_than_two_hours", label: "יותר משעתיים" },
]

const BABY_FIT_OPTIONS: FilterOption<BabyFit>[] = [
  { value: "stroller", label: "מתאים לעגלה" },
  { value: "carrier", label: "מתאים למנשא" },
  { value: "nursing_feeding", label: "מתאים להנקה / האכלה" },
]

/** One placeholder checklist row — same shape as the other checklist screens. */
type LeavingItem = { id: string; label: string }

type LeavingCategory = {
  id: string
  icon: PhosphorIconComponent
  title: string
  subtitle: string
  items: LeavingItem[]
  /**
   * Whether this category is relevant to the currently active filters —
   * conceptual guidance only (per the brief), used to bring the most useful
   * categories to the top when filters are active. Never used to hide a
   * category outright.
   */
  isRelevant: (filters: LeavingFilters) => boolean
}

const CATEGORIES: LeavingCategory[] = [
  {
    id: "car",
    icon: CarSimple,
    title: "רכב ונסיעה",
    subtitle: "דלק, כיסא בטיחות ומסלול",
    items: [
      { id: "car-1", label: "לבדוק דלק / טעינה" },
      { id: "car-2", label: "להתקין כיסא בטיחות" },
      { id: "car-3", label: "לוודא שהעגלה בתא המטען" },
      { id: "car-4", label: "לבדוק מסלול" },
      { id: "car-5", label: "לקחת מטען לטלפון" },
    ],
    isRelevant: (f) =>
      f.arrival.includes("car") ||
      f.duration.length > 0 ||
      f.distance.length > 0 ||
      f.babyFit.some((v) => v === "stroller" || v === "carrier"),
  },
  {
    id: "home",
    icon: House,
    title: "בית לפני היציאה",
    subtitle: "חלונות, מכשירים ונעילה",
    items: [
      { id: "home-1", label: "לסגור חלונות" },
      { id: "home-2", label: "לכבות מכשירים" },
      { id: "home-3", label: "לנעול את הדלת" },
      { id: "home-4", label: "לבדוק שהכול מוכן לחזרה" },
    ],
    isRelevant: (f) => f.outingType.length > 0 || f.duration.length > 0 || f.distance.length > 0,
  },
  {
    id: "docs",
    icon: Files,
    title: "מסמכים וחפצים חשובים",
    subtitle: "תעודות, כרטיסים וארנק",
    items: [
      { id: "docs-1", label: "תעודות" },
      { id: "docs-2", label: "כרטיסים" },
      { id: "docs-3", label: "טלפון" },
      { id: "docs-4", label: "ארנק" },
      { id: "docs-5", label: "מפתחות" },
    ],
    isRelevant: (f) => f.arrival.length > 0 || f.duration.length > 0 || f.distance.length > 0,
  },
  {
    id: "baby-gear",
    icon: Basket,
    title: "ציוד לתינוק",
    subtitle: "חיתולים, בקבוק ומוצץ",
    items: [
      { id: "baby-gear-1", label: "חיתולים" },
      { id: "baby-gear-2", label: "מגבונים" },
      { id: "baby-gear-3", label: "בקבוק" },
      { id: "baby-gear-4", label: "מוצץ" },
      { id: "baby-gear-5", label: "בגדים להחלפה" },
    ],
    isRelevant: (f) =>
      f.babyFit.some((v) => v === "stroller" || v === "carrier" || v === "nursing_feeding") ||
      f.duration.length > 0 ||
      f.distance.length > 0,
  },
  {
    id: "clothing",
    icon: TShirt,
    title: "ביגוד ואביזרים",
    subtitle: "שמיכה, כובע ותיק",
    items: [
      { id: "clothing-1", label: "בגדים מתאימים" },
      { id: "clothing-2", label: "שמיכה" },
      { id: "clothing-3", label: "כובע" },
      { id: "clothing-4", label: "תיק" },
      { id: "clothing-5", label: "שקית לבגדים מלוכלכים" },
    ],
    isRelevant: (f) =>
      f.outingType.length > 0 || f.duration.length > 0 || f.babyFit.some((v) => v === "stroller" || v === "carrier"),
  },
  {
    id: "food",
    icon: BowlFood,
    title: "אוכל ושתייה",
    subtitle: "מים, חטיפים וציוד האכלה",
    items: [
      { id: "food-1", label: "מים" },
      { id: "food-2", label: "אוכל" },
      { id: "food-3", label: "חטיפים" },
      { id: "food-4", label: "בקבוק / ציוד האכלה" },
    ],
    isRelevant: (f) => f.duration.length > 0 || f.distance.length > 0 || f.babyFit.includes("nursing_feeding"),
  },
  {
    id: "comfort",
    icon: ShieldCheck,
    title: "נוחות ובטיחות",
    subtitle: "קרם הגנה, מנשא וכיסוי לעגלה",
    items: [
      { id: "comfort-1", label: "קרם הגנה" },
      { id: "comfort-2", label: "כיסוי לעגלה" },
      { id: "comfort-3", label: "מנשא" },
      { id: "comfort-4", label: "משהו נוח לישיבה" },
    ],
    isRelevant: (f) =>
      f.arrival.length > 0 ||
      f.outingType.length > 0 ||
      f.duration.length > 0 ||
      f.babyFit.some((v) => v === "stroller" || v === "carrier"),
  },
  {
    id: "small-things",
    icon: Key,
    title: "דברים קטנים שלא לשכוח",
    subtitle: "מפתחות, מטען ואוזניות",
    items: [
      { id: "small-things-1", label: "מפתחות" },
      { id: "small-things-2", label: "מטען" },
      { id: "small-things-3", label: "אוזניות" },
      { id: "small-things-4", label: "משקפי שמש" },
    ],
    // Relevant to whatever filters are active, per the brief — never hidden.
    isRelevant: () => true,
  },
]

function ChecklistRow({ item, checked, onToggle }: { item: LeavingItem; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex w-full items-center gap-2.5 py-1.5 text-right"
    >
      <span
        aria-hidden
        className={
          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors " +
          (checked ? "border-[#6f1e35] bg-[#6f1e35]" : "border-[#e0d5cd] bg-white")
        }
      >
        {checked ? <PhosphorIcon icon={Check} size={10} color="white" weight="bold" /> : null}
      </span>
      <span className={"text-[14px] leading-5 " + (checked ? "text-[#877275] line-through" : "text-[#1d1b19]")}>
        {item.label}
      </span>
    </button>
  )
}

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

type LeavingScreenProps = {
  onBack: () => void
}

export function LeavingScreen({ onBack }: LeavingScreenProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<LeavingFilters>(EMPTY_FILTERS)

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const hasActiveFilters =
    filters.arrival.length > 0 ||
    filters.outingType.length > 0 ||
    filters.duration.length > 0 ||
    filters.distance.length > 0 ||
    filters.babyFit.length > 0

  // Bring the categories most relevant to the active filters to the top —
  // conceptual guidance only, per the brief; nothing is ever hidden.
  const orderedCategories = useMemo(() => {
    if (!hasActiveFilters) return CATEGORIES
    const relevant = CATEGORIES.filter((c) => c.isRelevant(filters))
    const rest = CATEGORIES.filter((c) => !c.isRelevant(filters))
    return [...relevant, ...rest]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, hasActiveFilters])

  const totalItems = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0)
  const totalDone = CATEGORIES.reduce((sum, c) => sum + c.items.filter((i) => checked.has(i.id)).length, 0)

  const chips: ChipData[] = []
  for (const opt of ARRIVAL_OPTIONS) {
    if (filters.arrival.includes(opt.value)) {
      chips.push({
        key: `arrival-${opt.value}`,
        label: opt.label,
        onRemove: () => setFilters((v) => ({ ...v, arrival: v.arrival.filter((x) => x !== opt.value) })),
      })
    }
  }
  for (const opt of OUTING_TYPE_OPTIONS) {
    if (filters.outingType.includes(opt.value)) {
      chips.push({
        key: `outing-${opt.value}`,
        label: opt.label,
        onRemove: () => setFilters((v) => ({ ...v, outingType: v.outingType.filter((x) => x !== opt.value) })),
      })
    }
  }
  for (const opt of DURATION_OPTIONS) {
    if (filters.duration.includes(opt.value)) {
      chips.push({
        key: `duration-${opt.value}`,
        label: opt.label,
        onRemove: () => setFilters((v) => ({ ...v, duration: v.duration.filter((x) => x !== opt.value) })),
      })
    }
  }
  for (const opt of DISTANCE_OPTIONS) {
    if (filters.distance.includes(opt.value)) {
      chips.push({
        key: `distance-${opt.value}`,
        label: opt.label,
        onRemove: () => setFilters((v) => ({ ...v, distance: v.distance.filter((x) => x !== opt.value) })),
      })
    }
  }
  for (const opt of BABY_FIT_OPTIONS) {
    if (filters.babyFit.includes(opt.value)) {
      chips.push({
        key: `babyFit-${opt.value}`,
        label: opt.label,
        onRemove: () => setFilters((v) => ({ ...v, babyFit: v.babyFit.filter((x) => x !== opt.value) })),
      })
    }
  }

  return (
    <div className="px-1 pb-6 pt-2 sm:px-0" dir="rtl">
      {/* Mobile hero — unchanged. */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={onBack}
          className="mb-2 flex items-center gap-1 self-end text-[14px] font-medium text-[#6f1e35]"
        >
          ← חזרה
        </button>

        <div className="flex flex-col items-center pb-2 pt-1 text-center">
          <img src={assets.homeLeaving} alt="" aria-hidden className="mb-1 h-28 w-28 object-contain" />
          <h1 className="text-[26px] font-black leading-[34px] text-[#6f1e35]">לפני שיוצאים</h1>
          <p className="mt-1 text-[14px] leading-[22px] text-[#544245]">
            רשימת הדברים שכדאי לבדוק לפני היציאה מהבית, כדי לצאת בראש שקט
          </p>
        </div>
      </div>

      {/* Desktop header — compact, illustration secondary to the checklist. */}
      <div className="hidden sm:block">
        <DesktopScreenHeader
          image={assets.homeLeaving}
          title="לפני שיוצאים"
          subtitle="רשימת הדברים שכדאי לבדוק לפני היציאה מהבית, כדי לצאת בראש שקט"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <MultiFilterDropdown
            label="אמצעי הגעה"
            options={ARRIVAL_OPTIONS}
            values={filters.arrival}
            onChange={(v) => setFilters((prev) => ({ ...prev, arrival: v }))}
          />
          <MultiFilterDropdown
            label="סוג הבילוי"
            options={OUTING_TYPE_OPTIONS}
            values={filters.outingType}
            onChange={(v) => setFilters((prev) => ({ ...prev, outingType: v }))}
          />
          <MultiFilterDropdown
            label="משך נסיעה / שהייה"
            options={DURATION_OPTIONS}
            values={filters.duration}
            onChange={(v) => setFilters((prev) => ({ ...prev, duration: v }))}
          />
          <MultiFilterDropdown
            label="מרחק מהבית"
            options={DISTANCE_OPTIONS}
            values={filters.distance}
            onChange={(v) => setFilters((prev) => ({ ...prev, distance: v }))}
          />
          <MultiFilterDropdown
            label="מתאים עם תינוק"
            options={BABY_FIT_OPTIONS}
            values={filters.babyFit}
            onChange={(v) => setFilters((prev) => ({ ...prev, babyFit: v }))}
          />
        </div>

        {chips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[13px] font-medium text-[#877275]">סינון פעיל:</span>
            {chips.map((chip) => (
              <Chip key={chip.key} chip={chip} />
            ))}
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="ms-1 text-[13px] font-medium text-[#6f1e35] hover:underline"
            >
              ניקוי הכל
            </button>
          </div>
        ) : null}

        <p className="text-[14px] font-medium text-[#544245]">
          הושלמו {totalDone} מתוך {totalItems}
        </p>
      </div>

      {/* Mobile: collapsible accordion, ordered by relevance — unchanged. */}
      <div className="mt-3 flex flex-col gap-2.5 sm:hidden">
        {orderedCategories.map((category) => {
          const doneCount = category.items.filter((i) => checked.has(i.id)).length
          const total = category.items.length
          const hasProgress = doneCount > 0
          return (
            <AccordionItem
              key={category.id}
              icon={<PhosphorIcon icon={category.icon} size={22} weight="duotone" color="#6f1e35" />}
              title={category.title}
              subtitle={category.subtitle}
              badge={
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[13px] font-semibold leading-[18px] " +
                    (hasProgress ? "bg-[#ffd9de] text-[#6f1e35]" : "bg-[#f3ede8] text-[#544245]")
                  }
                >
                  {doneCount}/{total}
                </span>
              }
            >
              <div className="flex flex-col gap-1">
                {category.items.map((item) => (
                  <ChecklistRow key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} />
                ))}
              </div>
            </AccordionItem>
          )
        })}
      </div>

      {/* Desktop: every category open as its own card in a grid, ordered by
          the same relevance logic — categories are not collapsed on
          desktop, per the workspace-layout brief. */}
      <div className="mt-3 hidden sm:block">
        <ChecklistCategoryGrid>
          {orderedCategories.map((category) => (
            <ChecklistCategoryCard
              key={category.id}
              icon={<PhosphorIcon icon={category.icon} size={22} weight="duotone" color="#6f1e35" />}
              title={category.title}
              items={category.items}
              checked={checked}
              onToggle={toggle}
            />
          ))}
        </ChecklistCategoryGrid>
      </div>

      <div className="mx-1 mt-4 flex items-start gap-3 rounded-xl bg-[rgba(255,218,214,0.3)] p-3.5 sm:mx-0 sm:max-w-[1200px]">
        <span aria-hidden className="mt-0.5 shrink-0">
          <PhosphorIcon icon={ShieldCheck} size={16} weight="duotone" color="#6f1e35" />
        </span>
        <p className="text-right text-[12px] leading-[16.5px] text-[#1d1b19] sm:text-[14px] sm:leading-5">
          <span className="font-bold">טיפ: </span>
          <span className="font-normal">
            עדיף להכין מראש כדי לצאת בנחת ולהינות מהרגע. גם אם שכחתם משהו — את עדיין עושה את זה מעולה.
          </span>
        </p>
      </div>
    </div>
  )
}
