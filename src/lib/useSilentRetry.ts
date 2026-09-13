import { useEffect, useRef } from "react"

/**
 * Same recovery policy as ErrorBoundary/main.tsx, scaled down for a single
 * data fetch instead of the whole app: when `error` is set, wait briefly
 * and retry once via `reload()`. If it fails again, this does nothing
 * further — the caller is expected to render its ordinary loading
 * skeleton for the error state too, so nothing that says "error" or
 * "something went wrong" ever appears on screen.
 */
export function useSilentRetry(error: string | null, reload: () => void): void {
  const retried = useRef(false)

  useEffect(() => {
    if (!error) {
      retried.current = false
      return
    }
    if (retried.current) return
    retried.current = true

    const id = window.setTimeout(() => reload(), 1200)
    return () => window.clearTimeout(id)
  }, [error, reload])
}
