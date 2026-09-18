import { useId, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/cn"
import { Icon as HugeIcon } from "@/components/ui/HugeIcon"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

export type AccordionItemProps = {
  /** Small icon-circle content — an emoji or a short glyph, matching the app's existing restraint around iconography. */
  icon: ReactNode
  title: string
  subtitle?: string
  /** Small pill on the opposite side of the row from the icon — e.g. a progress count. Optional. */
  badge?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

/**
 * A single expand/collapse row: tap the header, the content below smoothly
 * grows/shrinks open. Built directly on the app's existing mobile card
 * language (white background, the established `rounded-xl` token, the same
 * near-flat shadow already used on NameCard/HomeScreen cards) rather than
 * a new visual style — this is the first place the app needed a genuine
 * accordion, so it's a new component, but not a new *look*.
 *
 * The open/close animation uses a CSS grid-rows trick
 * (`grid-template-rows: 0fr` → `1fr`) instead of measuring pixel heights in
 * JS — it animates smoothly to and from "auto" height without ever needing
 * to know the content's actual height ahead of time, which matters here
 * since the checklist content is meant to be freely editable later.
 */
export function AccordionItem({ icon, title, subtitle, badge, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()
  const headingId = useId()
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <h3 id={headingId} className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 p-3.5 text-right transition-colors active:bg-[#fef8f3]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full text-[20px]",
                "bg-[rgba(255,217,222,0.4)]",
              )}
            >
              {icon}
            </span>
            <div className="flex min-w-0 flex-col items-start text-right">
              <span className="text-[17px] font-semibold leading-6 text-[#1d1b19]">{title}</span>
              {subtitle ? (
                <span className="text-[12px] font-normal leading-[18px] text-[#544245]">{subtitle}</span>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {badge}
            <span className={cn("shrink-0 transition-transform duration-200", open ? "rotate-180" : "")}>
              <HugeIcon icon={ArrowDown01Icon} size={16} color="#6f1e35" strokeWidth={1.8} />
            </span>
          </div>
        </button>
      </h3>

      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div ref={bodyRef} className="overflow-hidden">
          <div className="border-t border-[#f0e8e0] px-3.5 pb-3.5 pt-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
