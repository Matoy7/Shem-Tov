import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/cn"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { CaretDown, Check } from "@phosphor-icons/react"
import type { FilterCategory as FilterCategoryLog } from "@/data/filterClickLogs"

export type FilterOption<T extends string> = { value: T; label: string }

type MultiFilterDropdownProps<T extends string> = {
  label: string
  options: FilterOption<T>[]
  values: T[]
  onChange: (values: T[]) => void
  className?: string
  /** For click logging only — which filter category this dropdown represents. */
  category?: FilterCategoryLog
  onOptionClick?: (category: FilterCategoryLog, value: string, selected: boolean) => void
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <PhosphorIcon
      icon={CaretDown}
      size={13}
      color="currentColor"
      className={cn("shrink-0 transition-transform duration-150", className)}
    />
  )
}

/**
 * A category dropdown: pill trigger with a chevron (never filled solid,
 * even when active — an active filter here is a thin border + a small
 * count badge, never a background change alone; the active-filter chip row
 * elsewhere is what actually signals "this is on"). Selections are staged
 * in a local draft and only committed to the parent on Apply, so opening a
 * dropdown and closing it without deciding never silently changes results.
 * Clicking outside or Escape still applies the draft — the common "didn't
 * click Apply but clearly made a choice" case shouldn't discard it.
 *
 * On desktop this opens as a small popover anchored to the trigger. On
 * mobile it opens as a bottom sheet instead — the same pattern already used
 * by NameNotificationsBell — because an anchored popover on a narrow screen
 * can open partially off-screen whenever its trigger sits near an edge of a
 * wrapped filter row. A bottom sheet has nowhere to overflow to.
 */
export function MultiFilterDropdown<T extends string>({
  label,
  options,
  values,
  onChange,
  className,
  category,
  onOptionClick,
}: MultiFilterDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<T[]>(values)
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== "undefined" && !window.matchMedia("(min-width: 640px)").matches,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const active = values.length > 0

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)")
    const sync = () => setIsCompact(!query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!open) setDraft(values)
  }, [open, values])

  function commitAndClose() {
    onChange(draft)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") commitAndClose()
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target)) return
      if ((target as HTMLElement).closest?.("[data-filter-dropdown-sheet]")) return
      commitAndClose()
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", onPointerDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draft])

  function toggle(value: T) {
    const nextSelected = !draft.includes(value)
    if (category) onOptionClick?.(category, value, nextSelected)
    setDraft((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const optionsList = (
    <div className={isCompact ? "max-h-[50vh] overflow-y-auto" : "max-h-64 overflow-y-auto px-1.5 pb-1.5"}>
      {options.map((opt) => {
        const checked = draft.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={checked}
            onClick={() => toggle(opt.value)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-start text-body-sm transition-colors duration-150",
              "hover:bg-[#fef8f3]",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
                checked
                  ? "border-[#6f1e35] bg-[#6f1e35] text-white"
                  : "border-[#e0d5cd] bg-white",
              )}
            >
              {checked ? (
                <PhosphorIcon icon={Check} size={10} color="currentColor" weight="bold" />
              ) : null}
            </span>
            <span className={checked ? "font-medium text-[#1d1b19]" : "text-[#544245]"}>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )

  const footer = (
    <div className="flex items-center justify-between gap-2 border-t border-border-subtle px-3 py-2.5">
      <button
        type="button"
        onClick={() => setDraft([])}
        className="text-caption font-medium text-[#877275] hover:text-[#544245]"
      >
        ניקוי
      </button>
      <button
        type="button"
        onClick={commitAndClose}
        className="rounded-md bg-[#6f1e35] px-3 py-1.5 text-caption font-semibold text-white hover:opacity-90"
      >
        החלה
      </button>
    </div>
  )

  return (
    <div ref={containerRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 shrink-0 items-center gap-1.5 rounded-full border-0 bg-white px-4 text-body-sm font-semibold text-[#6f1e35]",
          "shadow-[0px_2px_3px_rgba(0,0,0,0.05)] transition-colors duration-150 whitespace-nowrap",
          "sm:h-9 sm:px-3.5 sm:font-medium sm:hover:bg-[#fff0f2]",
        )}
      >
        <span>{label}</span>
        {active ? (
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#6f1e35] text-[10px] font-semibold leading-none text-white">
            {values.length}
          </span>
        ) : null}
        <ChevronDown className={cn("text-[#877275]", open ? "-scale-y-100" : undefined)} />
      </button>

      {open && !isCompact ? (
        <div
          id={panelId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className={cn(
            "absolute end-0 top-full z-20 mt-2 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border-subtle",
            "bg-surface shadow-overlay animate-notifications-in",
          )}
        >
          <p className="px-3 pt-3 pb-1 text-caption font-semibold text-[#877275]">{label}</p>
          {optionsList}
          {footer}
        </div>
      ) : null}

      {open && isCompact
        ? createPortal(
            <div data-filter-dropdown-sheet>
              <div onClick={commitAndClose} className="fixed inset-0 z-40 bg-content-primary/35" aria-hidden />
              <div
                id={panelId}
                role="listbox"
                aria-multiselectable="true"
                aria-label={label}
                dir="rtl"
                className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] flex-col rounded-t-lg border border-border-subtle bg-surface pb-6 shadow-overlay"
              >
                <span aria-hidden className="mx-auto mb-2 mt-3 block h-1 w-10 shrink-0 rounded-full bg-[#e0d5cd]/50" />
                <p className="px-4 pb-2 text-body font-semibold text-[#1d1b19]">{label}</p>
                <div className="px-2.5">{optionsList}</div>
                {footer}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
