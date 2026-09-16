import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/cn"
import { MORE_FILTER_LABELS } from "./filterOptions"
import type { FilterCategory as FilterCategoryLog } from "@/data/filterClickLogs"

const HEBREW_ALPHABET = [
  "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ",
  "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת",
]

export type MoreFilters = {
  short: boolean
  easyInEnglish: boolean
  worksInternationally: boolean
  initial: string | undefined
  endsWith: string | undefined
}

const EMPTY_MORE: MoreFilters = {
  short: false,
  easyInEnglish: false,
  worksInternationally: false,
  initial: undefined,
  endsWith: undefined,
}

export function moreFiltersActiveCount(v: MoreFilters): number {
  return [v.short, v.easyInEnglish, v.worksInternationally, v.initial, v.endsWith].filter(Boolean).length
}

type MoreFiltersDropdownProps = {
  value: MoreFilters
  onChange: (value: MoreFilters) => void
  onOptionClick?: (category: FilterCategoryLog, value: string, selected: boolean) => void
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
        checked
          ? "border-[#6f1e35] bg-[#6f1e35] text-white sm:border-accent sm:bg-accent sm:text-content-inverse"
          : "border-border-strong bg-surface",
      )}
    >
      {checked ? (
        <svg viewBox="0 0 10 8" className="size-2.5">
          <path d="M1 4 3.5 6.5 9 1" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  )
}

function LetterPicker({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: string | undefined
  onSelect: (letter: string | undefined) => void
}) {
  return (
    <div>
      <p className="px-1 pb-1.5 text-caption font-medium text-content-muted">{label}</p>
      <div className="flex flex-wrap gap-1">
        {HEBREW_ALPHABET.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => onSelect(letter === selected ? undefined : letter)}
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border text-caption font-medium transition-colors duration-150",
              selected === letter
                ? "border-[#6f1e35] bg-[#6f1e35] text-white sm:border-accent sm:bg-accent sm:text-content-inverse"
                : "border-border bg-surface text-content-secondary hover:bg-surface-hover",
            )}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Same draft + Apply/Clear pattern as MultiFilterDropdown, and the same
 * mobile-bottom-sheet-instead-of-anchored-popover treatment — see that
 * file's comment for why: an absolutely positioned popover anchored to a
 * small pill can open partially off-screen on mobile, a bottom sheet
 * cannot. All five options here are backed by real columns on `names`.
 */
export function MoreFiltersDropdown({ value, onChange, onOptionClick }: MoreFiltersDropdownProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<MoreFilters>(value)
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== "undefined" && !window.matchMedia("(min-width: 640px)").matches,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const activeCount = moreFiltersActiveCount(value)

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

  const CATEGORY_BY_KEY: Record<"short" | "easyInEnglish" | "worksInternationally", FilterCategoryLog> = {
    short: "short",
    easyInEnglish: "easy_in_english",
    worksInternationally: "works_internationally",
  }

  const body = (
    <div className={isCompact ? "max-h-[55vh] overflow-y-auto px-4" : "max-h-80 overflow-y-auto p-3"}>
      <div className="flex flex-col gap-1">
        {(["short", "easyInEnglish", "worksInternationally"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              onOptionClick?.(CATEGORY_BY_KEY[key], key, !draft[key])
              setDraft((d) => ({ ...d, [key]: !d[key] }))
            }}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-start text-body-sm transition-colors duration-150 hover:bg-surface-hover"
          >
            <Checkbox checked={draft[key]} />
            <span className={draft[key] ? "font-medium text-content-primary" : "text-content-secondary"}>
              {MORE_FILTER_LABELS[key]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-border-subtle pt-3">
        <LetterPicker
          label="מתחיל באות"
          selected={draft.initial}
          onSelect={(l) => {
            onOptionClick?.("starts_with", l ?? draft.initial ?? "", Boolean(l))
            setDraft((d) => ({ ...d, initial: l }))
          }}
        />
        <LetterPicker
          label="מסתיים באות"
          selected={draft.endsWith}
          onSelect={(l) => {
            onOptionClick?.("ends_with", l ?? draft.endsWith ?? "", Boolean(l))
            setDraft((d) => ({ ...d, endsWith: l }))
          }}
        />
      </div>
    </div>

  )

  const footer = (
    <div className="flex items-center justify-between gap-2 border-t border-border-subtle px-3 py-2.5">
      <button
        type="button"
        onClick={() => setDraft(EMPTY_MORE)}
        className="text-caption font-medium text-content-muted hover:text-content-secondary"
      >
        ניקוי
      </button>
      <button
        type="button"
        onClick={commitAndClose}
        className="rounded-md bg-[#6f1e35] px-3 py-1.5 text-caption font-semibold text-white hover:opacity-90 sm:bg-accent sm:text-content-inverse"
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
          "sm:h-9 sm:rounded-full sm:border sm:bg-surface sm:px-3.5 sm:font-medium sm:text-content-secondary sm:shadow-none sm:hover:bg-surface-hover",
          activeCount > 0 ? "sm:border-accent/40" : "sm:border-border",
        )}
      >
        <svg aria-hidden viewBox="0 0 14 14" className="size-3.5 shrink-0 text-[#6f1e35]/60 sm:text-content-muted">
          <path d="M1 3.5h12M3.5 7h7M6 10.5h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span>עוד פילטרים</span>
        {activeCount > 0 ? (
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#6f1e35] text-[10px] font-semibold leading-none text-white sm:bg-accent sm:text-content-inverse">
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
                <span aria-hidden className="mx-auto mb-2 mt-3 block h-1 w-10 shrink-0 rounded-full bg-border-strong/50" />
                <p className="px-4 pb-2 text-body font-semibold text-content-primary">עוד פילטרים</p>
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
