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
 * Mobile: restructured to match the design reference's compact header —
 * a menu button and the account avatar pinned to opposite corners with the
 * new circular footprint logo genuinely centered between them, which a
 * plain flex row can't do once the two side elements have different
 * widths. A 3-column grid with the outer columns sized equally solves
 * that: the center column is always exactly centered on the row,
 * regardless of how wide the menu button or avatar happens to be.
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
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-sm sm:border-b">
      {/* Mobile-only header: 3-column grid, logo genuinely centered. */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:hidden">
        <IconButton label="פתיחת תפריט" variant="ghost" size="md" onClick={onOpenNav} className="justify-self-start">
          <span aria-hidden className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
            <span className="block h-0.5 w-4 rounded-full bg-content-primary" />
          </span>
        </IconButton>

        <div className="flex flex-col items-center gap-1 justify-self-center">
          <img
            src={assets.brainMascot}
            alt=""
            aria-hidden
            width={104}
            height={77}
            className="h-[52px] w-[70px] shrink-0 object-contain"
          />
          <span className="truncate text-body font-black text-[#6f1e35]">{brandName}</span>
        </div>

        <div className="justify-self-end">
          <AccountMenu
            displayName={displayName}
            avatarUrl={avatarUrl}
            isGuest={isGuest}
            onLinkGoogle={onLinkGoogle}
            onSignOut={onSignOut}
          />
        </div>
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
