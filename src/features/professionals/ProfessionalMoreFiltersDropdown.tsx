import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/cn"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { Funnel, Check } from "@phosphor-icons/react"
import type { CategoryFieldDef } from "./filterOptions"

type Draft = Record<string, string[]>

function activeCountOf(draft: Draft): number {
  return Object.values(draft).reduce((sum, values) => sum + values.length, 0)
}

/**
 * Overflow filter dropdown for בעלי מקצוע — same draft + Apply/Clear
 * pattern, same popover-on-desktop/bottom-sheet-on-mobile split, as
 * MoreFiltersDropdown in the name catalogue (see that file's own comment
 * for why a bottom sheet rather than an anchored popover on mobile). The
 * one difference: this one renders any number of labelled checkbox groups
 * (one per overflow field) instead of a fixed set of booleans + letter
 * pickers, since the fields bundled here vary by professional category.
 */
export function ProfessionalMoreFiltersDropdown({
  fields,
  value,
  onChange,
}: {
  fields: CategoryFieldDef[]
  value: Draft
  onChange: (next: Draft) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(value)
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== "undefined" && !window.matchMedia("(min-width: 640px)").matches,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const activeCount = activeCountOf(value)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)")
    const sync = () => setIsCompact(!query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!open) setDraft(value)
  }, [open, value])

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

  function toggle(fieldId: string, optionValue: string) {
    setDraft((prev) => {
      const current = prev[fieldId] ?? []
      const next = current.includes(optionValue) ? current.filter((v) => v !== optionValue) : [...current, optionValue]
      return { ...prev, [fieldId]: next }
    })
  }

  if (fields.length === 0) return null

  const body = (
    <div className={cn("flex flex-col gap-4", isCompact ? "max-h-[60vh] overflow-y-auto px-4" : "max-h-96 overflow-y-auto p-3")}>
      {fields.map((field) => (
        <div key={field.id}>
          <p className="px-1 pb-1.5 text-caption font-semibold text-[#877275]">{field.label}</p>
          <div className="flex flex-col gap-0.5">
            {field.options.map((opt) => {
              const checked = (draft[field.id] ?? []).includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(field.id, opt.value)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start text-body-sm transition-colors duration-150 hover:bg-[#fef8f3]"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
                      checked ? "border-[#6f1e35] bg-[#6f1e35] text-white" : "border-[#e0d5cd] bg-white",
                    )}
                  >
                    {checked ? <PhosphorIcon icon={Check} size={10} color="currentColor" weight="bold" /> : null}
                  </span>
                  <span className={checked ? "font-medium text-[#1d1b19]" : "text-[#544245]"}>{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  const footer = (
    <div className="flex items-center justify-between gap-2 border-t border-border-subtle px-3 py-2.5">
      <button
        type="button"
        onClick={() => setDraft({})}
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
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 shrink-0 items-center gap-1.5 rounded-full border-0 bg-white px-4 text-body-sm font-semibold text-[#6f1e35]",
          "shadow-[0px_2px_3px_rgba(0,0,0,0.05)] transition-colors duration-150 whitespace-nowrap",
          "sm:h-9 sm:px-3.5 sm:font-medium",
        )}
      >
        <span className="shrink-0 text-[#6f1e35]/60">
          <PhosphorIcon icon={Funnel} size={16} color="currentColor" />
        </span>
        <span>עוד פילטרים</span>
        {activeCount > 0 ? (
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#6f1e35] text-[10px] font-semibold leading-none text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open && !isCompact ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="עוד פילטרים"
          className={cn(
            "absolute end-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border-subtle",
            "bg-surface shadow-overlay animate-notifications-in",
          )}
        >
          {body}
          {footer}
        </div>
      ) : null}

      {open && isCompact
        ? createPortal(
            <div data-filter-dropdown-sheet>
              <div onClick={commitAndClose} className="fixed inset-0 z-40 bg-content-primary/35" aria-hidden />
              <div
                id={panelId}
                role="dialog"
                aria-label="עוד פילטרים"
                dir="rtl"
                className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-lg border border-border-subtle bg-surface pb-6 shadow-overlay"
              >
                <span aria-hidden className="mx-auto mb-2 mt-3 block h-1 w-10 shrink-0 rounded-full bg-[#e0d5cd]/50" />
                <p className="px-4 pb-2 text-body font-semibold text-[#1d1b19]">עוד פילטרים</p>
                {body}
                {footer}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
