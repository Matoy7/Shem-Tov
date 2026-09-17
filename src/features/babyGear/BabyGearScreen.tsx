import { useState } from "react"
import { assets } from "@/lib/assets"

type GearItem = { id: string; icon: string; qty: string; title: string; subtitle: string }
type GearCategory = { id: string; icon: string; label: string; items: GearItem[] }

/**
 * Placeholder content only, per the request — realistic enough to preview
 * every tab's expanded state, trivial to replace. To swap in the real list
 * later: replace the `items` arrays below — the tab switching and
 * checked-state logic are generic over whatever items each category holds.
 */
const CATEGORIES: GearCategory[] = [
  {
    id: "nursery",
    icon: "🛏️",
    label: "חדר תינוק",
    items: [
      { id: "nursery-1", icon: "🛏️", qty: "x1", title: "עריסה או מיטת תינוק", subtitle: "עם מזרן מתאים לגודל" },
      { id: "nursery-2", icon: "🛌", qty: "x3", title: "סדינים למיטה", subtitle: "כותנה רכה, כמה חלופות" },
      { id: "nursery-3", icon: "📷", qty: "x1", title: "מוניטור תינוק", subtitle: "עם או בלי מצלמה" },
      { id: "nursery-4", icon: "🧺", qty: "x1", title: "ארון או קומודה", subtitle: "לאחסון בגדים וציוד" },
    ],
  },
  {
    id: "travel",
    icon: "🧳",
    label: "טיול ונסיעה",
    items: [
      { id: "travel-1", icon: "🛒", qty: "x1", title: "עגלת תינוק", subtitle: "מתאימה מגיל לידה" },
      { id: "travel-2", icon: "🚗", qty: "x1", title: "כיסא בטיחות לרכב", subtitle: "מותקן ומוכן מראש" },
      { id: "travel-3", icon: "🎒", qty: "x1", title: "מנשא לתינוק", subtitle: "לטיולים קצרים" },
      { id: "travel-4", icon: "👜", qty: "x1", title: "תיק החתלה ניידת", subtitle: "עם ציוד בסיסי להחלפה" },
    ],
  },
  {
    id: "bath",
    icon: "🛁",
    label: "החלפה ורחצה",
    items: [
      { id: "bath-1", icon: "🧴", qty: "x1", title: "שולחן החתלה", subtitle: "עם משטח בטיחות" },
      { id: "bath-2", icon: "🛁", qty: "x1", title: "אמבטיית תינוק", subtitle: "עם תמיכה לגב" },
      { id: "bath-3", icon: "🧻", qty: "x4", title: "מגבות רכות", subtitle: "עם ברדס לחום נעים" },
      { id: "bath-4", icon: "🌡️", qty: "x1", title: "מדחום", subtitle: "לבדיקת חום גוף וגם אמבטיה" },
    ],
  },
  {
    id: "clothes",
    icon: "👕",
    label: "ביגוד",
    items: [
      { id: "clothes-1", icon: "🩲", qty: "x2", title: "חיתולים", subtitle: "מומלץ לקנות כמה גדלים" },
      { id: "clothes-2", icon: "🧻", qty: "x4", title: "מגבוני ניקוי", subtitle: "לשימוש יומיומי עדין" },
      { id: "clothes-3", icon: "🧴", qty: "x1", title: "קרם החתלה", subtitle: "מומלץ לעור רגיש" },
      { id: "clothes-4", icon: "👕", qty: "x6", title: "בגדי גוף", subtitle: "100% כותנה, כמה מידות" },
      { id: "clothes-5", icon: "🧥", qty: "x4", title: "אוברולים", subtitle: "נוחים ופרקטיים לסגירה" },
      { id: "clothes-6", icon: "🧦", qty: "x6", title: "גרביים", subtitle: "כמה זוגות רכים לחום" },
    ],
  },
  {
    id: "food",
    icon: "🍼",
    label: "האכלה",
    items: [
      { id: "food-1", icon: "🍼", qty: "x3", title: "בקבוקי האכלה", subtitle: "כמה גדלים לפי גיל" },
      { id: "food-2", icon: "🩷", qty: "x2", title: "מוצץ", subtitle: "מתאים לגיל התינוק" },
      { id: "food-3", icon: "♨️", qty: "x1", title: "מכשיר סטריליזציה", subtitle: "לחיטוי בקבוקים" },
      { id: "food-4", icon: "🧷", qty: "x2", title: "סינר האכלה", subtitle: "קל לניקוי" },
    ],
  },
]

type BabyGearScreenProps = {
  onBack: () => void
}

export function BabyGearScreen({ onBack }: BabyGearScreenProps) {
  const [activeTab, setActiveTab] = useState(CATEGORIES[3]!.id) // "clothes" — matches the reference's default active tab
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const category = CATEGORIES.find((c) => c.id === activeTab) ?? CATEGORIES[0]!
  const doneCount = category.items.filter((i) => checked.has(i.id)).length
  const total = category.items.length
  const progressPct = total > 0 ? (doneCount / total) * 100 : 0

  return (
    <div className="px-1 pb-6 pt-2" dir="rtl">
      <button
        type="button"
        onClick={onBack}
        className="mb-2 flex items-center gap-1 self-end text-[14px] font-medium text-[#6f1e35]"
      >
        ← חזרה
      </button>

      {/* hero — same treatment as the other detail screens (Hospital Bag),
          so the whole app reads as one flow. */}
      <div className="flex flex-col items-center pb-2 pt-1 text-center">
        <img src={assets.homeBabyGear} alt="" aria-hidden className="mb-1 h-28 w-28 object-contain" />
        <h1 className="text-[26px] font-black leading-[34px] text-[#6f1e35]">ציוד לתינוק</h1>
        <p className="mt-1 text-[14px] leading-[22px] text-[#544245]">כל מה שצריך להכין לקראת הגעת הבייבי</p>
      </div>

      {/* category tabs — horizontal scroll, matches the reference's own
          structure for this screen (unlike Hospital Bag, which used
          accordions — this screen genuinely calls for one active category
          view at a time, per its own Figma reference). */}
      <div className="scrollbar-none -mx-1 flex gap-2.5 overflow-x-auto px-1 py-2">
        {CATEGORIES.map((cat) => {
          const active = cat.id === activeTab
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={
                "flex h-[72px] min-w-[68px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2.5 transition-colors " +
                (active
                  ? "bg-[#6f1e35] shadow-[0px_6px_8px_rgba(111,30,53,0.2)]"
                  : "bg-white shadow-[0px_2px_4px_rgba(111,30,53,0.04)]")
              }
            >
              <span
                aria-hidden
                className={
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-[15px] " +
                  (active ? "bg-[#8d354b]" : "bg-[#ede7e2]")
                }
              >
                {cat.icon}
              </span>
              <span className={"whitespace-nowrap text-[13px] leading-[18px] " + (active ? "font-semibold text-white" : "font-medium text-[#544245]")}>
                {cat.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* shopping-list header + progress */}
      <div className="pb-2 pt-4">
        <div className="mb-1.5 flex items-center justify-between px-0.5">
          <span className="flex items-center gap-1 rounded-full bg-[#f8f3ee] px-2.5 py-1">
            <span className="text-[13px] font-bold leading-[18px] text-[#6f1e35]">{doneCount}</span>
            <span className="text-[13px] font-medium leading-[18px] text-[#544245]">/ {total} נרכשו</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-[#ffd9de]" />
            <span className="text-[20px] font-bold leading-7 text-[#6f1e35]">רשימת קניות</span>
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#ede7e2]">
          <div className="h-full rounded-full bg-[#6f1e35] transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* checklist for the active category */}
      <div className="flex flex-col gap-2.5 py-2">
        {category.items.map((item) => {
          const isChecked = checked.has(item.id)
          return (
            <div
              key={item.id}
              className={
                "flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0px_3px_6px_rgba(111,30,53,0.03)] transition-opacity " +
                (isChecked ? "opacity-50" : "")
              }
            >
              <div className="flex shrink-0 items-center gap-2.5">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f8f3ee] text-[15px]">
                  {item.icon}
                </span>
                <span className="rounded-full bg-[#f3ede8] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#544245]">
                  {item.qty}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className={"text-[15px] font-semibold leading-5 " + (isChecked ? "text-[#a08080] line-through" : "text-[#1d1b19]")}>
                    {item.title}
                  </span>
                  <span className="mt-0.5 text-[12px] font-normal leading-3 text-[#544245]">{item.subtitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={isChecked}
                  aria-label="סמן כנרכש"
                  className={
                    "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors " +
                    (isChecked ? "bg-[#6f1e35]" : "bg-[#f8f3ee]")
                  }
                >
                  {isChecked ? (
                    <svg viewBox="0 0 10 8" className="size-2.5">
                      <path d="M1 4 3.5 6.5 9 1" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mx-1 mt-2 flex items-center gap-2.5 rounded-2xl bg-[rgba(255,217,222,0.4)] p-3">
        <span aria-hidden className="shrink-0 text-[15px]">
          🍃
        </span>
        <p className="text-right text-[12px] leading-5 text-[#1d1b19]">
          לא חייבים להספיק הכל ביום אחד. קחו נשימה עמוקה, סמנו מה שיש, ואתם מוכנים להמשיך!
        </p>
      </div>
    </div>
  )
}
