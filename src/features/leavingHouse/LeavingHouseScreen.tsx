import { useState } from "react"
import { assets } from "@/lib/assets"

type ChecklistItem = { id: string; icon: string; title: string; subtitle: string }

/**
 * Placeholder content only, per the same convention as Hospital Bag / Baby
 * Gear — realistic enough to preview the screen, trivial to replace later
 * by editing this one array.
 */
const ITEMS: ChecklistItem[] = [
  { id: "diaper", icon: "🩲", title: "חיתולים", subtitle: "כמה שעות מחוץ לבית" },
  { id: "wipes", icon: "🧻", title: "מגבונים", subtitle: "תמיד שימושי" },
  { id: "clothes", icon: "👕", title: "בגדי החלפה", subtitle: "סט אחד לפחות" },
  { id: "bottle", icon: "🍼", title: "בקבוק / אוכל", subtitle: "למקרה שיהיה רעב" },
  { id: "paci", icon: "🩷", title: "מוצץ", subtitle: "מומלץ לקחת אחד נוסף" },
  { id: "blanket", icon: "🧸", title: "שמיכה קלה", subtitle: "לנוחות בכל מקום" },
  { id: "keys", icon: "🔑", title: "ארנק, טלפון, מפתחות", subtitle: "כמובן שגם אתם 😅" },
]

/**
 * Not per-mode content — the reference this screen was adapted from also
 * keeps one shared checklist regardless of which mode is selected; the
 * control is real (a working, stateful choice), the list underneath it
 * just isn't filtered by it, matching what the reference itself actually
 * does rather than inventing per-mode filtering that wasn't there.
 */
const MODES = [
  { id: "stroller", label: "עם עגלה", icon: "🛒" },
  { id: "walk", label: "ברגל", icon: "🚶" },
  { id: "car", label: "ברכב", icon: "🚗" },
]

type LeavingHouseScreenProps = {
  onBack: () => void
}

export function LeavingHouseScreen({ onBack }: LeavingHouseScreenProps) {
  const [mode, setMode] = useState(MODES[1]!.id) // "walk" — matches the reference's own default
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const doneCount = ITEMS.filter((i) => checked.has(i.id)).length
  const total = ITEMS.length
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

      {/* hero — same convention as the other detail screens. */}
      <div className="flex flex-col items-center pb-2 pt-1 text-center">
        <img src={assets.homeLeaving} alt="" aria-hidden className="mb-1 h-28 w-28 object-contain" />
        <h1 className="text-[26px] font-black leading-[34px] text-[#6f1e35]">יוצאים מהבית</h1>
        <p className="mt-1 text-[14px] leading-[22px] text-[#544245]">רשימת הדברים שכדאי לקחת כשאתם יוצאים</p>
      </div>

      {/* mode segmented control — real, working state; the checklist below
          is intentionally the same regardless of mode, matching the
          reference this was adapted from. */}
      <div className="mb-5 flex items-center justify-between gap-1 rounded-full bg-[#f3ede8] p-1 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        {MODES.map((m) => {
          const active = m.id === mode
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[13px] leading-[18px] transition-colors " +
                (active ? "bg-white font-semibold text-[#6f1e35] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]" : "font-medium text-[#544245]")
              }
            >
              <span>{m.label}</span>
              <span aria-hidden className="text-[13px] leading-none">
                {m.icon}
              </span>
            </button>
          )
        })}
      </div>

      {/* progress */}
      <div className="mb-2 flex items-center justify-between px-0.5">
        <span className="text-[13px] font-semibold leading-4 text-[#6f1e35]">
          {doneCount} מתוך {total} נארזו
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-medium leading-4 text-[#544245]">
          מוכנות ליציאה
          <span aria-hidden className="text-[13px] leading-none">
            🎒
          </span>
        </span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#ede7e2]">
        <div className="h-full rounded-full bg-[#6f1e35] transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      {/* checklist */}
      <div className="flex flex-col gap-2.5">
        {ITEMS.map((item) => {
          const isChecked = checked.has(item.id)
          return (
            <div
              key={item.id}
              className={
                "flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-opacity " +
                (isChecked ? "opacity-50" : "")
              }
            >
              <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f3ede8] text-[15px]">
                {item.icon}
              </span>

              <div className="flex items-center gap-3.5">
                <div className="flex flex-col items-end">
                  <span className={"text-[17px] font-semibold leading-[21px] " + (isChecked ? "text-[#a08080] line-through" : "text-[#1d1b19]")}>
                    {item.title}
                  </span>
                  <span className="text-[12px] font-normal leading-[18px] text-[#544245]">{item.subtitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={isChecked}
                  aria-label="סמן כנארז"
                  className={
                    "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors " +
                    (isChecked ? "bg-[#6f1e35]" : "bg-white shadow-[inset_0_0_0_2px_#ffd9de]")
                  }
                >
                  {isChecked ? (
                    <svg viewBox="0 0 10 8" className="size-2.5">
                      <path d="M1 4 3.5 6.5 9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mx-1 mt-4 flex items-center gap-3 rounded-2xl bg-[rgba(255,217,222,0.4)] p-3.5">
        <span aria-hidden className="shrink-0 text-[15px]">
          🍃
        </span>
        <p className="text-right text-[12px] leading-5 text-[#1d1b19]">
          נשמו עמוק, שכחתם משהו? לא נורא, הכל ניתן לקנות בדרך. צאו בנחת!
        </p>
      </div>
    </div>
  )
}
