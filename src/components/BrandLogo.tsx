/**
 * The Tafsheet brand mark: a friendly brain character with a small hanging
 * name-tag — representing the product's own concept (forgetfulness/mental
 * load during pregnancy, "טפשת"), not a generic baby icon. Drawn as plain
 * overlapping rounded shapes forming a lobed brain silhouette (a cloud-like
 * cluster of circles, the standard simple way to suggest brain "folds"
 * without literal anatomy), a minimal closed-eye smiling face, and a
 * rounded tag shape — an original composition built from primitive shapes,
 * not traced or copied from any specific artwork or character.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Lobed brain silhouette — a cluster of overlapping circles reads as
          "brain folds" at small sizes without needing literal anatomy. */}
      <g>
        <circle cx="34" cy="30" r="16" fill="#f9c9d4" />
        <circle cx="54" cy="22" r="17" fill="#f9c9d4" />
        <circle cx="73" cy="28" r="15" fill="#f9c9d4" />
        <circle cx="26" cy="48" r="15" fill="#f9c9d4" />
        <circle cx="45" cy="55" r="18" fill="#f9c9d4" />
        <circle cx="66" cy="52" r="16" fill="#f9c9d4" />
        <circle cx="30" cy="30" r="14" fill="#f9c9d4" />
      </g>
      {/* A few darker strokes suggesting the folds, kept minimal. */}
      <path
        d="M28 34c4 4 10 4 14 0M46 30c4 5 11 5 15 0M32 52c5 4 12 4 16-1M52 50c4 4 10 4 14 0"
        stroke="#a8395a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <circle cx="34" cy="30" r="16" stroke="#a8395a" strokeWidth="2" fill="none" opacity="0.9" />
      {/* Face */}
      <path d="M32 60q3 3 6 0" stroke="#6f1e35" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M24 55q1.5-2 3 0" stroke="#6f1e35" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M42 55q1.5-2 3 0" stroke="#6f1e35" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Hanging name-tag */}
      <g transform="translate(76,34) rotate(18)">
        <line x1="0" y1="0" x2="6" y2="10" stroke="#a8395a" strokeWidth="1.5" />
        <rect x="-2" y="8" width="26" height="18" rx="4" fill="#fef8f3" stroke="#a8395a" strokeWidth="1.5" />
        <circle cx="4" cy="17" r="1.6" fill="#a8395a" />
      </g>
    </svg>
  )
}
