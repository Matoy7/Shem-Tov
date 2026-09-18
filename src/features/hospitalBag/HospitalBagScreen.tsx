import { useState } from "react"
import { AccordionItem } from "@/components/ui/Accordion"
import { assets } from "@/lib/assets"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { Check, User, Baby, Files, Hospital, House, Lightbulb } from "@phosphor-icons/react"
import type { Icon as PhosphorIconComponent } from "@phosphor-icons/react"

/**
 * One placeholder checklist row: a name plus a personal, per-user checked
 * state. This is example content only — see the module comment below for
 * how to swap it for the real list later.
 */
type ChecklistItem = { id: string; label: string }

type Category = {
  id: string
  icon: PhosphorIconComponent
  title: string
  subtitle: string
  items: ChecklistItem[]
}

/**
 * Placeholder content only, per the request — realistic enough to preview
 * the expanded state, trivial to replace. To swap in the real list later:
 * replace the `items` arrays below (and `title`/`subtitle`/`icon` if the
 * categories themselves change) — nothing else in this file needs to
 * change, since the checked-state logic and rendering are generic over
 * whatever items each category holds.
 */
const CATEGORIES: Category[] = [
  {
    id: "mom",
    icon: User,
    title: "לאמא",
    subtitle: "בגדים נוחים, תחתונים, גרביים ועוד",
    items: [
      { id: "mom-1", label: "חלוק או כותונת הנקה" },
      { id: "mom-2", label: "תחתונים חד-פעמיים" },
      { id: "mom-3", label: "פדים לחזה" },
      { id: "mom-4", label: "כפכפים נוחים" },
      { id: "mom-5", label: "מוצרי טיפוח אישיים" },
    ],
  },
  {
    id: "baby",
    icon: Baby,
    title: "לתינוק",
    subtitle: "בגדי גוף, אוברולים, כובע, גרביים",
    items: [
      { id: "baby-1", label: "בגדי גוף (2-3 מידות)" },
      { id: "baby-2", label: "כובע ראש רך" },
      { id: "baby-3", label: "שמיכת עטיפה" },
      { id: "baby-4", label: "בגד ליציאה מבית החולים" },
    ],
  },
  {
    id: "docs",
    icon: Files,
    title: "מסמכים חשובים",
    subtitle: "תעודות, טפסים, כרטיס קופת חולים",
    items: [
      { id: "docs-1", label: "תעודת זהות" },
      { id: "docs-2", label: "כרטיס קופת חולים" },
      { id: "docs-3", label: "טופס מעקב הריון" },
      { id: "docs-4", label: "טופס בחירת בית חולים (אם רלוונטי)" },
    ],
  },
  {
    id: "hospital",
    icon: Hospital,
    title: "דברים לבית החולים",
    subtitle: "מטען, כרית, חטיפים ודברים שעושים טוב",
    items: [
      { id: "hospital-1", label: "מטען לטלפון" },
      { id: "hospital-2", label: "כרית קטנה מהבית" },
      { id: "hospital-3", label: "חטיפים ומשקה" },
      { id: "hospital-4", label: "אוזניות" },
    ],
  },
  {
    id: "home",
    icon: House,
    title: "דברים לחזרה הביתה",
    subtitle: "כיסא בטיחות, בגדים לחזרה",
    items: [
      { id: "home-1", label: "כיסא בטיחות מותקן ברכב" },
      { id: "home-2", label: "בגדי חזרה לאמא" },
      { id: "home-3", label: "בגד חורף/קיץ לתינוק בהתאם לעונה" },
    ],
  },
]

function ChecklistRow({ item, checked, onToggle }: { item: ChecklistItem; checked: boolean; onToggle: () => void }) {
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
        {checked ? (
          <PhosphorIcon icon={Check} size={10} color="white" weight="bold" />
        ) : null}
      </span>
      <span className={"text-[14px] leading-5 " + (checked ? "text-[#877275] line-through" : "text-[#1d1b19]")}>
        {item.label}
      </span>
    </button>
  )
}

type HospitalBagScreenProps = {
  onBack: () => void
}

export function HospitalBagScreen({ onBack }: HospitalBagScreenProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="px-1 pb-6 pt-2" dir="rtl">
      <button
        type="button"
        onClick={onBack}
        className="mb-2 flex items-center gap-1 self-end text-[14px] font-medium text-[#6f1e35]"
      >
        ← חזרה
      </button>

      {/* hero — same title treatment as "בחירת שם" (32px black burgundy via
          Section's mobileTitle), same illustration already used for this
          category's Home Page card, so the two screens read as one flow. */}
      <div className="flex flex-col items-center pb-2 pt-1 text-center">
        <img src={assets.homeBirthBag} alt="" aria-hidden className="mb-1 h-28 w-32 object-contain" />
        <h1 className="text-[26px] font-black leading-[34px] text-[#6f1e35]">הכנת תיק לידה</h1>
        <p className="mt-1 text-[14px] leading-[22px] text-[#544245]">כל מה שצריך לקחת איתך לבית החולים</p>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {CATEGORIES.map((category) => {
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

      <div className="mx-1 mt-4 flex items-start gap-3 rounded-xl bg-[rgba(255,218,214,0.3)] p-3.5">
        <span aria-hidden className="mt-0.5 shrink-0">
          <PhosphorIcon icon={Lightbulb} size={16} weight="duotone" color="#6f1e35" />
        </span>
        <p className="text-right text-[12px] leading-[16.5px] text-[#1d1b19]">
          <span className="font-bold">טיפ של אמהות: </span>
          <span className="font-normal">שימו את התיק ליד הדלת או בתא המטען כבר מתחילת חודש תשיעי.</span>
        </p>
      </div>
    </div>
  )
}
