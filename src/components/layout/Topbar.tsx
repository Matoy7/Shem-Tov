import { IconButton } from "@/components/ui/IconButton"
import { AccountMenu } from "@/features/auth/AccountMenu"
import { assets } from "@/lib/assets"

type TopbarProps = {
  brandName: string
  brandTagline: string
  /** Provider avatar, or the deterministic generated one. */
  avatarUrl: string
  displayName: string
  isGuest: boolean
  onOpenNav: () => void
  onLinkGoogle: () => void
  onSignOut: () => void
}

/**
 * Sticky application bar.
 *
 * Desktop (`sm:` and up): unchanged — the original linear layout, hero
 * illustration, brand lockup at the inline start, account controls pushed
 * to the inline end.
 *
 * Mobile: a simple two-item row — menu button and account avatar pinned to
 * opposite corners, no centered logo mark (the brand is now established by
 * the hero heading below the header instead, per the redesigned Home
 * screen — see HomeScreen.tsx and DESIGN_GUIDE.md).
 */
export function Topbar({
  brandName,
  brandTagline,
  avatarUrl,
  displayName,
  isGuest,
  onOpenNav,
  onLinkGoogle,
  onSignOut,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#f0e8e0] bg-[#fef8f3]/90 backdrop-blur-sm sm:border-border sm:bg-bg/85">
      {/* Mobile-only header: avatar (end/left) and menu button (start/right) only. */}
      <div className="flex items-center justify-between px-5 py-4 sm:hidden">
        <div className="justify-self-end">
          <AccountMenu
            displayName={displayName}
            avatarUrl={avatarUrl}
            isGuest={isGuest}
            onLinkGoogle={onLinkGoogle}
            onSignOut={onSignOut}
          />
        </div>

        <IconButton label="פתיחת תפריט" variant="ghost" size="md" onClick={onOpenNav}>
          <span aria-hidden className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
          </span>
        </IconButton>
      </div>

      {/* Desktop (sm: and up): the original layout, unchanged. */}
      <div className="hidden items-center gap-3 px-4 py-3 sm:flex sm:gap-4 md:gap-5 md:px-6 lg:px-8">
        <IconButton
          label="פתיחת תפריט"
          variant="ghost"
          size="md"
          onClick={onOpenNav}
          className="lg:hidden"
        >
          <span aria-hidden className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
          </span>
        </IconButton>

        <img
          src={assets.heroIllustration}
          alt="איור של יד תינוק שולפת פתק עם סימן שאלה מתוך קערת שמות"
          width={96}
          height={96}
          className="size-12 shrink-0 rounded-full bg-surface-secondary object-cover sm:size-20 md:size-24"
        />

        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate font-display text-page-title font-bold text-content-primary sm:text-display">
            {brandName}
          </h1>
          {/* Wraps rather than truncates: the tagline is the product's one
              line of explanation, so a clipped half of it is worse than a
              second line on narrow screens. */}
          <p className="text-balance text-body-sm text-content-muted sm:truncate sm:text-body-lg">
            {brandTagline}
          </p>
        </div>

        {/* Account controls — `ms-auto` pushes them to the inline end. */}
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
