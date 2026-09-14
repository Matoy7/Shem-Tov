export type DeviceType = "mobile" | "desktop" | "tablet"

/**
 * Best-effort device classification from the browser itself — there is no
 * fully reliable signal for this, so this combines the two available ones:
 *
 * 1. The modern Client Hints API (`navigator.userAgentData`), when present
 *    (Chromium browsers) — its `mobile` flag is set by the browser itself
 *    rather than parsed from a spoofable string.
 * 2. A classic user-agent regex, as the fallback everywhere else (Safari,
 *    Firefox) and to distinguish tablet from phone either way.
 *
 * iPadOS Safari deliberately reports a desktop-like "Macintosh" user agent
 * with no "iPad" token in it — Apple did this on purpose so tablet-unaware
 * sites don't serve it a phone layout. The `maxTouchPoints` check below is
 * the standard way to still catch it: a real Mac has no touch points at
 * all, a Magic-Trackpad-equipped one included, but never more than a
 * handful — an iPad reports many.
 */
export function detectDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop"

  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData
  const ua = navigator.userAgent

  const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  if (isIPadOS) return "tablet"

  if (/iPad/.test(ua)) return "tablet"
  // Android tablets omit "Mobile" from their UA string; Android phones include it.
  if (/Android/.test(ua) && !/Mobile/.test(ua)) return "tablet"

  if (uaData?.mobile === true) return "mobile"
  if (/iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|IEMobile|Opera Mini/.test(ua)) return "mobile"

  return "desktop"
}
