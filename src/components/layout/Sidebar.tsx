import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { X, MagnifyingGlass } from "@phosphor-icons/react"
import type { Icon as PhosphorIconComponent } from "@phosphor-icons/react"
import { cn } from "@/lib/cn"
import { assets } from "@/lib/assets"

export type NavItem = {
  id: string
  label: string
  icon: PhosphorIconComponent
  /** Shown as a small "(N)" after the label — omit for items with no count. */
  count?: number
}

type SidebarFooterProps = {
  userName: string
  onSignOut: () => void
}

/** Account block pinned to the bottom of the sidebar. */
export function SidebarFooter({ userName, onSignOut }: SidebarFooterProps) {
  return (
    <div className="mt-auto flex flex-col gap-2 border-t border-[#f0e8e0] pt-4">
      <p className="truncate px-3 text-label text-[#877275]">{userName}</p>

      <Button
        variant="ghost"
        size="md"
        fullWidth
        onClick={onSignOut}
        className="justify-start px-3"
      >
        התנתקות
      </Button>
    </div>
  )
}

type SidebarSearchProps = {
  placeholder: string
  /** The currently active, submitted query — "" when search is inactive. */
  query: string
  onSearch: (query: string) => void
  onClear: () => void
}

/**
 * Search field occupying the sidebar's top slot. The 48px wrapper keeps the
 * navigation below it at the same vertical position regardless of the
 * control's own height.
 *
 * The field itself is uncontrolled draft text: search only actually runs on
 * Enter or the search button, never on every keystroke. `query` is the
 * active/submitted value, so the field stays in sync if the search is
 * cleared from elsewhere (e.g. switching feed tabs).
 */
export function SidebarSearch({
  placeholder,
  query,
  onSearch,
  onClear,
}: SidebarSearchProps) {
  const [draft, setDraft] = useState(query)

  useEffect(() => setDraft(query), [query])

  const submit = () => {
    const trimmed = draft.trim()
    if (trimmed) onSearch(trimmed)
    else onClear()
  }

  return (
    <div className="flex h-12 items-center">
      <div className="relative flex w-full items-center">
        <button
          type="button"
          aria-label="חיפוש"
          onClick={submit}
          className="absolute start-0 z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#6f1e35]/60 transition-colors duration-150 hover:text-[#6f1e35] sm:text-content-muted sm:hover:text-content-primary"
        >
          <PhosphorIcon icon={MagnifyingGlass} size={18} color="currentColor" />
        </button>

        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              submit()
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "h-11 w-full min-w-0 rounded-full border bg-white text-body shadow-[0px_2px_3px_rgba(0,0,0,0.05)]",
            "border-transparent text-[#6f1e35] placeholder:text-[#877275] transition-colors duration-150",
            "focus-visible:border-[#ffd9de]",
            "ps-10 pe-10",
            "sm:h-10 sm:rounded-md sm:border sm:border-border sm:bg-surface sm:text-content-primary",
            "sm:placeholder:text-content-muted sm:shadow-none sm:ps-9 sm:pe-9",
            "sm:hover:border-border-strong sm:focus-visible:border-focus",
          )}
        />

        {draft ? (
          <button
            type="button"
            aria-label="ניקוי חיפוש"
            onClick={() => {
              setDraft("")
              onClear()
            }}
            className="absolute end-0 z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#6f1e35]/60 transition-colors duration-150 hover:text-[#6f1e35] sm:text-content-muted sm:hover:text-content-primary"
          >
            <PhosphorIcon icon={X} size={16} color="currentColor" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

type SidebarNavProps = {
  /** Groups of items, each separated by a thin divider — lets the sidebar
   * read as "product areas" then "names" then account, instead of one flat
   * list, without inventing a new nav visual language. */
  groups: NavItem[][]
  activeId: string
  onSelect?: (id: string) => void
}

/** Navigation list — shared by the desktop sidebar and the mobile drawer. */
export function SidebarNav({ groups, activeId, onSelect }: SidebarNavProps) {
  return (
    <nav aria-label="ניווט ראשי" className="flex flex-col gap-4">
      {groups.map((items, groupIndex) => (
        <div key={groupIndex} className={cn("flex flex-col gap-1", groupIndex > 0 && "border-t border-border pt-4")}>
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = item.id === activeId
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onSelect?.(item.id)}
                    className={cn(
                      "flex h-10 w-full items-center gap-3 rounded-md px-3 transition-colors duration-150",
                      "text-body font-medium",
                      active
                        ? "bg-[#ffd9de] text-[#6f1e35]"
                        : "text-content-secondary hover:bg-surface-hover hover:text-content-primary",
                    )}
                  >
                    <PhosphorIcon icon={item.icon} size={20} color={active ? "#6f1e35" : "currentColor"} />
                    <span className="flex min-w-0 items-baseline gap-1">
                      <span className="truncate">{item.label}</span>
                      {typeof item.count === "number" ? (
                        <span className="shrink-0 text-body-sm font-normal text-content-muted">
                          ({item.count})
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

type SidebarProps = {
  groups: NavItem[][]
  activeId: string
  searchPlaceholder: string
  searchQuery: string
  onSearch: (query: string) => void
  onClearSearch: () => void
  userName: string
  canUpgrade?: boolean
  onSelect: (id: string) => void
  onUpgrade?: () => void
  onSignOut: () => void
}

/** Fixed desktop sidebar. Hidden below the `lg` breakpoint. */
export function Sidebar({
  groups,
  activeId,
  searchPlaceholder,
  searchQuery,
  onSearch,
  onClearSearch,
  userName,
  canUpgrade,
  onSelect,
  onUpgrade,
  onSignOut,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-30 hidden w-[264px] shrink-0 lg:flex",
        "flex-col gap-8 border-e border-border bg-surface px-4 py-6",
      )}
    >
      <img src={assets.logoStacked} alt="טפשת" className="h-9 w-auto self-start object-contain" />

      <SidebarSearch
        placeholder={searchPlaceholder}
        query={searchQuery}
        onSearch={onSearch}
        onClear={onClearSearch}
      />
      <SidebarNav groups={groups} activeId={activeId} onSelect={onSelect} />
      <SidebarFooter userName={userName} onSignOut={onSignOut} />
    </aside>
  )
}
