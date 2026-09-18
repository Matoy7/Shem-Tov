import { useEffect, useState } from "react"

/**
 * Tracks the same `sm:` (640px) breakpoint the rest of the app already uses
 * to split mobile/desktop layout (see AccountMenu's and MultiFilterDropdown's
 * own `isCompact` state) — kept here once so App.tsx's "no desktop Home
 * screen" redirect uses the exact same cutover as the CSS does, instead of a
 * second, possibly-inconsistent breakpoint.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches,
  )

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)")
    const sync = () => setIsDesktop(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return isDesktop
}
