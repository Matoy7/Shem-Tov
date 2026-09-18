import { useEffect } from "react"
import { SidebarFooter } from "./Sidebar"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import type { Icon as PhosphorIconComponent } from "@phosphor-icons/react"
import { cn } from "@/lib/cn"

export type MobileCategoryItem = {
  id: string
  label: string
  icon: PhosphorIconComponent
  onSelect: () => void
  /** Matches the Home screen's own "not wired up yet" cards — shown, not clickable. */
  disabled?: boolean
}

type MobileNavProps = {
  open: boolean
  onClose: () => void
  categories: MobileCategoryItem[]
  activeCategoryId: string
  userName: string
  canUpgrade?: boolean
  onUpgrade?: () => void
  onSignOut: () => void
}

/**
 * Drawer navigation for viewports below `lg`. Content-wise this mirrors the
 * Home screen's own four categories (big, premium-app-style rows) rather
 * than the desktop sidebar's single "browse" nav item — the two surfaces
 * intentionally diverge here, since mobile has real category screens to
 * jump between and desktop doesn't.
 */
export function MobileNav({
  open,
  onClose,
  categories,
  activeCategoryId,
  userName,
  canUpgrade,
  onUpgrade,
  onSignOut,
}: MobileNavProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  return (
    <div
      className={cn("lg:hidden", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-content-primary/35 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="ניווט ראשי"
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-[300px] max-w-[85vw] flex-col gap-6",
          "bg-surface px-4 py-6 shadow-overlay transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav aria-label="קטגוריות" className="flex flex-col gap-1.5">
          {categories.map((category) => {
            const active = category.id === activeCategoryId
            return (
              <button
                key={category.id}
                type="button"
                disabled={category.disabled}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  if (category.disabled) return
                  category.onSelect()
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-2xl px-2.5 py-3 text-start transition-colors duration-150",
                  active ? "bg-[#fff0f2]" : "hover:bg-surface-hover",
                  category.disabled && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full",
                    active ? "bg-[#ffd9de]" : "bg-[#f8f3ee]",
                  )}
                >
                  <PhosphorIcon icon={category.icon} size={22} weight="duotone" color="#6f1e35" />
                </span>
                <span className="min-w-0 truncate text-[21px] font-bold leading-7 text-[#6f1e35]">
                  {category.label}
                </span>
              </button>
            )
          })}
        </nav>

        <SidebarFooter userName={userName} onSignOut={onSignOut} />
      </div>
    </div>
  )
}
