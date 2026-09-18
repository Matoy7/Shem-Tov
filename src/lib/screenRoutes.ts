/**
 * Maps the mobile app's screens to real URLs and back.
 *
 * Kept as a plain lookup (not a `<Routes>` tree) on purpose: every screen
 * stays mounted at all times (see App.tsx) so its own state — a checked
 * checklist item, an expanded accordion category — survives navigating away
 * and back, exactly like the desktop "browse" section already did before
 * this existed. `<Routes>` would unmount the non-matching screen on every
 * navigation and reset that state, which is the opposite of what "the
 * category is restored correctly" (after Back) requires.
 */
export type MobileView = "home" | "browse" | "bag" | "gear" | "leaving"

export const ROUTE_FOR_VIEW: Record<MobileView, string> = {
  home: "/",
  browse: "/name-selection",
  bag: "/hospital-bag",
  gear: "/baby-equipment",
  leaving: "/before-going-out",
}

const VIEW_FOR_ROUTE: Record<string, MobileView> = Object.fromEntries(
  (Object.entries(ROUTE_FOR_VIEW) as [MobileView, string][]).map(([view, route]) => [route, view]),
)

/** Unrecognised paths (or the router's basename root before it resolves) fall back to Home. */
export function viewForPathname(pathname: string): MobileView {
  return VIEW_FOR_ROUTE[pathname] ?? "home"
}
