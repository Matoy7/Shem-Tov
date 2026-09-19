import type { ReactNode } from "react"
import { ChecklistItemList, type ChecklistRowItem } from "@/components/ui/ChecklistItemList"

/**
 * Desktop counterpart to `AccordionItem`: same card shell, icon-circle,
 * title and progress-badge language as the mobile accordion header (see
 * Accordion.tsx) — but the items are always visible, never collapsed, and
 * no subtitle under the title (mobile's accordion header keeps its own).
 * Desktop has the room to show the whole checklist at once — up to 5 items;
 * beyond that, the list scrolls inside a fixed-height area (see
 * ChecklistItemList) instead of pushing the whole card grid out of
 * alignment.
 */
export type ChecklistCardItem = ChecklistRowItem

type ChecklistCategoryCardProps = {
  icon: ReactNode
  title: string
  items: ChecklistCardItem[]
  checked: Set<string>
  onToggle: (id: string) => void
}

export function ChecklistCategoryCard({ icon, title, items, checked, onToggle }: ChecklistCategoryCardProps) {
  const doneCount = items.filter((i) => checked.has(i.id)).length
  const total = items.length
  const hasProgress = doneCount > 0

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-[#f0e8e0] bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[rgba(255,217,222,0.4)]">
            {icon}
          </span>
          <div className="flex min-w-0 flex-col items-start text-right">
            <span className="text-[20px] font-semibold leading-6 text-[#1d1b19]">{title}</span>
          </div>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-2 py-0.5 text-[13px] font-semibold leading-[18px] " +
            (hasProgress ? "bg-[#ffd9de] text-[#6f1e35]" : "bg-[#f3ede8] text-[#544245]")
          }
        >
          {doneCount}/{total}
        </span>
      </div>

      <div className="border-t border-[#f0e8e0] pt-2">
        <ChecklistItemList items={items} checked={checked} onToggle={onToggle} variant="desktop" />
      </div>
    </div>
  )
}
