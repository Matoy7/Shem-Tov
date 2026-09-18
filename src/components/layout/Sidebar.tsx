import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { X, MagnifyingGlass } from "@phosphor-icons/react"
import type { Icon as PhosphorIconComponent } from "@phosphor-icons/react"
import { cn } from "@/lib/cn"
import { assets } from "@/lib/assets"
import { GoogleIcon } from "@/features/auth/ProviderIcons"

export type NavItem = {
  id: string
  label: string
  icon: PhosphorIconComponent
  /** Shown as a small "(N)" after the label — omit for items with no count. */
  count?: number
}

type SidebarFooterProps = {
  userName: string
  avatarUrl: string
  /** Guests get a "כניסה עם Google" action alongside sign-out — the same
   * upgrade path the account menu used to be the only way to reach. */
  canUpgrade?: boolean
  onUpgrade?: () => void
  onSignOut: () => void
}

/**
 * Account block pinned to the bottom of the sidebar: avatar + name as one
 * row (the same identity treatment the header's account menu uses), then
 * sign-out — the common "who's logged in" convention for a dashboard
 * sidebar, rather than a name-only line.
 */
export function SidebarFooter({
  userName,
  avatarUrl,
  canUpgrade,
  onUpgrade,
  onSignOut,
}: SidebarFooterProps) {
  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-[#f0e8e0] pt-4">
      <div className="flex items-center gap-3 px-3">
        <img
          src={avatarUrl}
          alt=""
          aria-hidden
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full border-2 border-border-strong bg-surface-secondary object-cover"
        />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-medium leading-snug text-content-primary">
            {userName}
          </span>
          {canUpgrade ? (
            <span className="text-caption text-content-muted">אורח</span>
          ) : null}
        </div>
      </div>

      {canUpgrade ? (
        <Button
          variant="secondary"
          size="md"
          fullWidth
          iconStart={<GoogleIcon />}
          onClick={onUpgrade}
          className="justify-start px-3"
        >
          כניסה עם Google
        </Button>
      ) : null}

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

type SidebarBrandProps = {
  brandName: string
}

/**
 * Brand lockup pinned to the sidebar's top slot — moved here from the
 * topbar, where it used to live before the sidebar became the persistent,
 * always-visible home for the brand on desktop. Same mascot as the mobile
 * Home screen's own hero (see HomeScreen.tsx), sized to fit the sidebar's
 * fixed 264px width rather than the topbar's much larger scale. No tagline
 * here (unlike LoginScreen's own brand lockup, which keeps one) — just the
 * name, once the sidebar is a persistent fixture the visitor sees on every
 * screen rather than a one-time introduction.
 */
function SidebarBrand({ brandName }: SidebarBrandProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={assets.brainMascotCheerful}
        alt=""
        aria-hidden
        className="size-14 shrink-0 rounded-full bg-[#fff0f2] object-contain"
      />
      <h1 className="min-w-0 truncate text-[20px] font-bold text-[#6f1e35]">{brandName}</h1>
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
 * Search field — no longer part of the sidebar itself (removed from there
 * since it was the only sidebar control that only ever applied to one of
 * the four screens). Still exported and used directly inside the name-
 * selection screen instead, where a name search actually applies.
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
          className="absolute start-0 z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#6f1e35]/60 transition-colors duration-150 hover:text-[#6f1e35]"
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
            className="absolute end-0 z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#6f1e35]/60 transition-colors duration-150 hover:text-[#6f1e35]"
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
  brandName: string
  groups: NavItem[][]
  activeId: string
  userName: string
  avatarUrl: string
  canUpgrade?: boolean
  onSelect: (id: string) => void
  onUpgrade?: () => void
  onSignOut: () => void
}

/** Fixed desktop sidebar. Hidden below the `lg` breakpoint. */
export function Sidebar({
  brandName,
  groups,
  activeId,
  userName,
  avatarUrl,
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
      <SidebarBrand brandName={brandName} />

      <SidebarNav groups={groups} activeId={activeId} onSelect={onSelect} />
      <SidebarFooter
        userName={userName}
        avatarUrl={avatarUrl}
        canUpgrade={canUpgrade}
        onUpgrade={onUpgrade}
        onSignOut={onSignOut}
      />
    </aside>
  )
}
