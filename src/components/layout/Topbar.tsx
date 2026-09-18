import { IconButton } from "@/components/ui/IconButton"
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { List } from "@phosphor-icons/react"
import { AccountMenu } from "@/features/auth/AccountMenu"

type TopbarProps = {
  /** Provider avatar, or the deterministic generated one. */
  avatarUrl: string
  displayName: string
  isGuest: boolean
  onOpenNav: () => void
  onLinkGoogle: () => void
  onSignOut: () => void
}

/**
 * Sticky application bar — account controls and, below `lg:`, the hamburger
 * that opens the mobile drawer.
 *
 * The brand lockup (mascot, name, tagline) that used to live here moved into
 * the sidebar instead, once the sidebar became the persistent, always-
 * visible home for the brand on desktop; keeping a second copy in the topbar
 * was redundant. Mobile still has no logo mark here either — the brand is
 * established by the Home screen's own hero heading instead (see
 * HomeScreen.tsx and DESIGN_GUIDE.md).
 */
export function Topbar({
  avatarUrl,
  displayName,
  isGuest,
  onOpenNav,
  onLinkGoogle,
  onSignOut,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#f0e8e0] bg-[#fef8f3]/90 backdrop-blur-sm sm:border-border sm:bg-bg/85">
      {/* Mobile-only header: hamburger first in DOM (renders right, RTL
          inline-start) and avatar second (renders left, RTL inline-end) —
          this order is what actually produces "avatar left, menu right" in
          a dir="rtl" flex row; the previous DOM order here had this
          backwards despite its own comment claiming otherwise. */}
      <div className="flex items-center justify-between px-5 py-3 sm:hidden">
        <IconButton label="פתיחת תפריט" variant="ghost" size="md" onClick={onOpenNav}>
          <PhosphorIcon icon={List} size={22} color="currentColor" />
        </IconButton>

        <AccountMenu
          displayName={displayName}
          avatarUrl={avatarUrl}
          isGuest={isGuest}
          onLinkGoogle={onLinkGoogle}
          onSignOut={onSignOut}
        />
      </div>

      {/* Desktop (sm: and up): hamburger (only shown below lg:, once the
          sidebar itself is hidden) plus account controls — no brand lockup
          here any more, since that now lives in the sidebar. */}
      <div className="hidden items-center gap-3 px-4 py-3 sm:flex sm:gap-4 md:gap-5 md:px-6 lg:px-8">
        <IconButton
          label="פתיחת תפריט"
          variant="ghost"
          size="md"
          onClick={onOpenNav}
          className="lg:hidden"
        >
          <PhosphorIcon icon={List} size={22} color="currentColor" />
        </IconButton>

        {/* `ms-auto` pushes account controls to the inline end regardless of
            whether the hamburger button above is present at this width. */}
        <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <AccountMenu
            displayName={displayName}
            avatarUrl={avatarUrl}
            isGuest={isGuest}
            onLinkGoogle={onLinkGoogle}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  )
}
