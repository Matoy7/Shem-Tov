import type { ReactNode } from "react"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { Check } from "@phosphor-icons/react"

/**
 * Desktop counterpart to `AccordionItem`: same card shell, icon-circle,
 * title/subtitle and progress-badge language as the mobile accordion header
 * (see Accordion.tsx) — but the items are always visible, never collapsed.
 * Desktop has the room to show the whole checklist at once, so there is
 * nothing to expand or collapse here.
 */
export type ChecklistCardItem = { id: string; label: string }

type ChecklistCategoryCardProps = {
  icon: ReactNode
  title: string
  subtitle?: string
  items: ChecklistCardItem[]
  checked: Set<string>
  onToggle: (id: string) => void
}

function DesktopChecklistRow({ item, checked, onToggle }: { item: ChecklistCardItem; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1.5 text-right transition-colors duration-150 hover:bg-[#fef8f3]"
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
      <span className={"text-[15px] leading-5 " + (checked ? "text-[#877275] line-through" : "text-[#1d1b19]")}>
        {item.label}
      </span>
    </button>
  )
}

export function ChecklistCategoryCard({ icon, title, subtitle, items, checked, onToggle }: ChecklistCategoryCardProps) {
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
            {subtitle ? <span className="text-[15px] font-normal leading-5 text-[#544245]">{subtitle}</span> : null}
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

      <div className="flex flex-col gap-0.5 border-t border-[#f0e8e0] pt-2">
        {items.map((item) => (
          <DesktopChecklistRow key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => onToggle(item.id)} />
        ))}
      </div>
    </div>
  )
}
