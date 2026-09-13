/**
 * Error recovery policy for the whole app: never show the person an error
 * screen. When something breaks, try a full reload first — most failures
 * here are transient (a stale session, a dropped connection, a bad deploy
 * cache) and a reload genuinely fixes them. If reloading keeps not fixing
 * it, stop trying and fail silently instead of ever rendering "something
 * went wrong" or similar.
 *
 * State lives in sessionStorage (not localStorage) on purpose: a loop
 * detected in one tab shouldn't suppress recovery in a fresh tab, and it
 * naturally clears when the browsing session ends.
 */

const KEY = "shem-tov:recovery"
const MAX_RELOADS = 3
/** A reload streak older than this is treated as unrelated to the current problem. */
const WINDOW_MS = 60_000
/** How long the app must run without error before a prior streak is forgiven. */
const HEALTHY_MS = 8_000

type RecoveryState = { count: number; firstAt: number }

function readState(): RecoveryState | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as RecoveryState
    if (typeof parsed.count !== "number" || typeof parsed.firstAt !== "number") return null
    return parsed
  } catch {
    return null
  }
}

function writeState(state: RecoveryState): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — recovery still
    // works, it just can't remember past attempts across this one call.
  }
}

/**
 * Call this wherever the app would otherwise show an error. Triggers a full
 * page reload and returns true — unless the same problem has already
 * exhausted its reload attempts recently, in which case it does nothing and
 * returns false so the caller can render a calm, silent fallback instead.
 */
export function attemptRecoveryReload(): boolean {
  const now = Date.now()
  const existing = readState()
  const state: RecoveryState =
    existing && now - existing.firstAt <= WINDOW_MS ? existing : { count: 0, firstAt: now }

  if (state.count >= MAX_RELOADS) return false

  writeState({ count: state.count + 1, firstAt: state.firstAt })
  window.location.reload()
  return true
}

/** Call once the app has been running fine for a while, so a later, unrelated error gets a fresh set of reload attempts. */
export function scheduleRecoveryStateClear(): void {
  window.setTimeout(() => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      // Nothing to clean up if storage isn't available in the first place.
    }
  }, HEALTHY_MS)
}
