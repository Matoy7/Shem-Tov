import { useState } from "react"
import { AccordionItem } from "@/components/ui/Accordion"
import { ChecklistCategoryCard } from "@/components/ui/ChecklistCategoryCard"
import { ChecklistCategoryGrid } from "@/components/ui/ChecklistCategoryGrid"
import { DesktopScreenHeader } from "@/components/layout/DesktopScreenHeader"
import { assets } from "@/lib/assets"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { Check, Bed, Suitcase, Bathtub, TShirt, BowlFood, Lightbulb } from "@phosphor-icons/react"
import type { Icon as PhosphorIconComponent } from "@phosphor-icons/react"

/**
 * One placeholder checklist row: a name plus a personal, per-user checked
 * state. Same shape and behavior as Hospital Bag's own checklist rows —
 * this screen intentionally follows that screen's accordion/checklist
 * convention rather than its earlier tab-based layout.
 */
type GearItem = { id: string; label: string }

type GearCategory = {
  id: string
  icon: PhosphorIconComponent
  title: string
  subtitle: string
  items: GearItem[]
}

/**
 * Placeholder content only — realistic enough to preview the expanded
 * state, trivial to replace. To swap in the real list later: replace the
 * `items` arrays below (and `title`/`subtitle`/`icon` if the categories
 * themselves change) — nothing else in this file needs to change, since
 * the checked-state logic and rendering are generic over whatever items
 * each category holds.
 *
 * "הכנת תיק לידה" (Hospital Bag) used to be its own standalone screen with
 * its own five internal sub-groups (מוצרים לאמא / לתינוק / מסמכים / לבית
 * החולים / לחזרה הביתה). It's merged in here as one flat category — every
 * item below is carried over byte-for-byte from that screen (same ids,
 * same labels, same order, nothing dropped) — just without the extra
 * sub-grouping layer, since no other category here has one either and the
 * brief calls for this to look and behave exactly like its siblings.
 */
const CATEGORIES: GearCategory[] = [
  {
    id: "hospitalBag",
    icon: Suitcase,
    title: "הכנת תיק לידה",
    subtitle: "כל מה שצריך לקחת איתך לבית החולים",
    items: [
      // לאמא
      { id: "mom-1", label: "חלוק או כותונת הנקה" },
      { id: "mom-2", label: "תחתונים חד-פעמיים" },
      { id: "mom-3", label: "פדים לחזה" },
      { id: "mom-4", label: "כפכפים נוחים" },
      { id: "mom-5", label: "מוצרי טיפוח אישיים" },
      // לתינוק
      { id: "baby-1", label: "בגדי גוף (2-3 מידות)" },
      { id: "baby-2", label: "כובע ראש רך" },
      { id: "baby-3", label: "שמיכת עטיפה" },
      { id: "baby-4", label: "בגד ליציאה מבית החולים" },
      // מסמכים חשובים
      { id: "docs-1", label: "תעודת זהות" },
      { id: "docs-2", label: "כרטיס קופת חולים" },
      { id: "docs-3", label: "טופס מעקב הריון" },
      { id: "docs-4", label: "טופס בחירת בית חולים (אם רלוונטי)" },
      // דברים לבית החולים
      { id: "hospital-1", label: "מטען לטלפון" },
      { id: "hospital-2", label: "כרית קטנה מהבית" },
      { id: "hospital-3", label: "חטיפים ומשקה" },
      { id: "hospital-4", label: "אוזניות" },
      // דברים לחזרה הביתה
      { id: "home-1", label: "כיסא בטיחות מותקן ברכב" },
      { id: "home-2", label: "בגדי חזרה לאמא" },
      { id: "home-3", label: "בגד חורף/קיץ לתינוק בהתאם לעונה" },
    ],
  },
  {
    id: "nursery",
    icon: Bed,
    title: "חדר תינוק",
    subtitle: "עריסה, מצעים, מוניטור וארון",
    items: [
      { id: "nursery-1", label: "עריסה או מיטת תינוק (עם מזרן מתאים לגודל)" },
      { id: "nursery-2", label: "סדינים למיטה (כותנה רכה, כמה חלופות)" },
      { id: "nursery-3", label: "מוניטור תינוק (עם או בלי מצלמה)" },
      { id: "nursery-4", label: "ארון או קומודה לאחסון" },
    ],
  },
  {
    id: "travel",
    icon: Suitcase,
    title: "טיול ונסיעה",
    subtitle: "עגלה, כיסא בטיחות ותיק החתלה",
    items: [
      { id: "travel-1", label: "עגלת תינוק (מתאימה מגיל לידה)" },
      { id: "travel-2", label: "כיסא בטיחות לרכב (מותקן ומוכן מראש)" },
      { id: "travel-3", label: "מנשא לתינוק לטיולים קצרים" },
      { id: "travel-4", label: "תיק החתלה ניידת עם ציוד בסיסי" },
    ],
  },
  {
    id: "bath",
    icon: Bathtub,
    title: "החלפה ורחצה",
    subtitle: "שולחן החתלה, אמבטיה ומגבות",
    items: [
      { id: "bath-1", label: "שולחן החתלה עם משטח בטיחות" },
      { id: "bath-2", label: "אמבטיית תינוק עם תמיכה לגב" },
      { id: "bath-3", label: "מגבות רכות (כמה יחידות)" },
      { id: "bath-4", label: "מדחום לבדיקת חום גוף וגם אמבטיה" },
    ],
  },
  {
    id: "clothes",
    icon: TShirt,
    title: "ביגוד",
    subtitle: "חיתולים, בגדי גוף וגרביים",
    items: [
      { id: "clothes-1", label: "חיתולים (כמה גדלים)" },
      { id: "clothes-2", label: "מגבוני ניקוי" },
      { id: "clothes-3", label: "קרם החתלה לעור רגיש" },
      { id: "clothes-4", label: "בגדי גוף (100% כותנה, כמה מידות)" },
      { id: "clothes-5", label: "אוברולים נוחים לסגירה" },
      { id: "clothes-6", label: "גרביים רכים לחום" },
    ],
  },
  {
    id: "food",
    icon: BowlFood,
    title: "האכלה",
    subtitle: "בקבוקים, מוצץ וסטריליזציה",
    items: [
      { id: "food-1", label: "בקבוקי האכלה (כמה גדלים לפי גיל)" },
      { id: "food-2", label: "מוצץ מתאים לגיל התינוק" },
      { id: "food-3", label: "מכשיר סטריליזציה לחיטוי בקבוקים" },
      { id: "food-4", label: "סינר האכלה קל לניקוי" },
    ],
  },
]

function ChecklistRow({ item, checked, onToggle }: { item: GearItem; checked: boolean; onToggle: () => void }) {
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

type BabyGearScreenProps = {
  onBack: () => void
}

export function BabyGearScreen({ onBack }: BabyGearScreenProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalItems = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0)
  const totalDone = CATEGORIES.reduce((sum, c) => sum + c.items.filter((i) => checked.has(i.id)).length, 0)

  return (
    <div className="px-1 pb-6 pt-2 sm:px-0" dir="rtl">
      {/* Mobile — unchanged: same hero, title and page picture as before. */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={onBack}
          className="mb-2 flex items-center gap-1 self-end text-[14px] font-medium text-[#6f1e35]"
        >
          ← חזרה
        </button>

        <div className="flex flex-col items-center pb-2 pt-1 text-center">
          <img src={assets.homeBabyGear} alt="" aria-hidden className="mb-1 h-28 w-28 object-contain" />
          <h1 className="text-[26px] font-black leading-[34px] text-[#6f1e35]">ציוד לתינוק</h1>
          <p className="mt-1 text-[14px] leading-[22px] text-[#544245]">כל מה שצריך להכין לקראת הגעת הבייבי</p>
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
                defaultOpen={category.id === "hospitalBag"}
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
      </div>

      {/* Desktop: compact header + every category open as its own card in a
          grid — checklist categories are not collapsed on desktop, per the
          workspace-layout brief. */}
      <div className="hidden sm:block">
        <DesktopScreenHeader
          image={assets.homeBabyGear}
          title="ציוד לתינוק"
          subtitle="כל מה שצריך להכין לקראת הגעת הבייבי"
          progressLabel={`הושלמו ${totalDone} מתוך ${totalItems}`}
        />

        <div className="mt-4">
          <ChecklistCategoryGrid>
            {CATEGORIES.map((category) => (
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
      </div>

      <div className="mx-1 mt-4 flex items-start gap-3 rounded-xl bg-[rgba(255,218,214,0.3)] p-3.5 sm:mx-0 sm:max-w-[1200px]">
        <span aria-hidden className="mt-0.5 shrink-0">
          <PhosphorIcon icon={Lightbulb} size={16} weight="duotone" color="#6f1e35" />
        </span>
        <p className="text-right text-[12px] leading-[16.5px] text-[#1d1b19] sm:text-[14px] sm:leading-5">
          <span className="font-bold">טיפ: </span>
          <span className="font-normal">לא חייבים להשיג הכל ביום אחד. קחו נשימה עמוקה, סמנו מה שיש, ואתם מוכנים להמשיך!</span>
        </p>
      </div>
    </div>
  )
}
