import { useState } from "react"
import { cn } from "@/lib/cn"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { Check, CaretDown } from "@phosphor-icons/react"

export type ChecklistRowItem = { id: string; label: string }

const VISIBLE_COUNT = 5

/**
 * One checklist row. Same checkbox + label anatomy everywhere — the only
 * thing that differs between where this is used is the row's own text size
 * and whether it gets a hover background, both carried over byte-for-byte
 * from the two call sites this replaces (the mobile accordion's own
 * ChecklistRow, and ChecklistCategoryCard's own DesktopChecklistRow).
 */
function Row({
  item,
  checked,
  onToggle,
  variant,
}: {
  item: ChecklistRowItem
  checked: boolean
  onToggle: () => void
  variant: "mobile" | "desktop"
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-center gap-2.5 text-right",
        variant === "mobile" ? "py-1.5" : "rounded-lg px-1 py-1.5 transition-colors duration-150 hover:bg-[#fef8f3]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked ? "border-[#6f1e35] bg-[#6f1e35]" : "border-[#e0d5cd] bg-white",
        )}
      >
        {checked ? <PhosphorIcon icon={Check} size={10} color="white" weight="bold" /> : null}
      </span>
      <span
        className={cn(
          variant === "mobile" ? "text-[14px] leading-5" : "text-[15px] leading-5",
          checked ? "text-[#877275] line-through" : "text-[#1d1b19]",
        )}
      >
        {item.label}
      </span>
    </button>
  )
}

type ChecklistItemListProps = {
  items: ChecklistRowItem[]
  checked: Set<string>
  onToggle: (id: string) => void
  /**
   * "mobile": show the first 5 items; beyond that, a subtle "הצג עוד X
   * פריטים" toggle expands the rest in place (the card grows, the page
   * itself keeps scrolling — never a scrollbar nested inside the card).
   * "desktop": show the first 5 items; beyond that, the remainder scrolls
   * inside a fixed-height, subtly-scrollbarred area so the card grid stays
   * visually compact and aligned. Both fall back to "show everything, no
   * control at all" the moment a category has 5 items or fewer.
   */
  variant: "mobile" | "desktop"
}

/**
 * The one reusable long-list pattern for every checklist screen (Baby Gear —
 * including its "הכנת תיק לידה" category — and Leaving the House today; any
 * future checklist screen tomorrow). Nothing about content, order, card
 * shell, typography, color or spacing changes here — only how more than 5
 * items are revealed, and that behavior differs by breakpoint per the brief.
 */
export function ChecklistItemList({ items, checked, onToggle, variant }: ChecklistItemListProps) {
  const [expanded, setExpanded] = useState(false)
  const overflow = items.length > VISIBLE_COUNT

  if (variant === "desktop") {
    return (
      <div className={cn("flex flex-col gap-0.5", overflow && "checklist-scroll max-h-[180px] overflow-y-auto pe-1")}>
        {items.map((item) => (
          <Row key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => onToggle(item.id)} variant="desktop" />
        ))}
      </div>
    )
  }

  const visible = expanded || !overflow ? items : items.slice(0, VISIBLE_COUNT)
  const remaining = items.length - VISIBLE_COUNT

  return (
    <div className="flex flex-col gap-1">
      {visible.map((item) => (
        <Row key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => onToggle(item.id)} variant="mobile" />
      ))}

      {overflow ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 flex items-center gap-1 self-start text-[13px] font-medium text-[#6f1e35]/70"
        >
          <span>{expanded ? "הצג פחות" : `הצג עוד ${remaining} פריטים`}</span>
          <PhosphorIcon
            icon={CaretDown}
            size={11}
            color="currentColor"
            className={cn("shrink-0 transition-transform duration-200", expanded && "rotate-180")}
          />
        </button>
      ) : null}
    </div>
  )
}
