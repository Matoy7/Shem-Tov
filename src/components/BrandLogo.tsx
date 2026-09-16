/**
 * The app's brand mark: two footprint silhouettes on a navy circle. Drawn
 * as plain vector shapes (an oval "heel" plus a small cluster of "toes"
 * ovals, rotated per foot) rather than any traced/copied artwork — the
 * footprints-in-a-circle motif itself is generic enough that any baby-
 * themed product tends to reach for something like it.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <circle cx="48" cy="48" r="48" fill="#131835" />
      {/* Left (blue) foot — slightly higher and larger, matching the reference's offset pair. */}
      <g transform="translate(33,30) rotate(-8)">
        <ellipse cx="0" cy="16" rx="10.5" ry="15" fill="#7dd3fc" />
        <ellipse cx="-8" cy="-6" rx="3.4" ry="4.6" fill="#7dd3fc" />
        <ellipse cx="-2.5" cy="-10" rx="3.6" ry="4.9" fill="#7dd3fc" />
        <ellipse cx="4" cy="-10.5" rx="3.6" ry="4.9" fill="#7dd3fc" />
        <ellipse cx="10" cy="-8" rx="3.2" ry="4.4" fill="#7dd3fc" />
      </g>
      {/* Right (pink) foot — smaller and lower, overlapping slightly. */}
      <g transform="translate(56,44) rotate(10)">
        <ellipse cx="0" cy="13" rx="8.5" ry="12.2" fill="#fbb6ce" />
        <ellipse cx="-6.5" cy="-5" rx="2.8" ry="3.7" fill="#fbb6ce" />
        <ellipse cx="-2" cy="-8.2" rx="2.9" ry="4" fill="#fbb6ce" />
        <ellipse cx="3.2" cy="-8.6" rx="2.9" ry="4" fill="#fbb6ce" />
        <ellipse cx="8" cy="-6.4" rx="2.6" ry="3.6" fill="#fbb6ce" />
      </g>
    </svg>
  )
}
