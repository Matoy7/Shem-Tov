/**
 * Static asset registry.
 *
 * Paths resolve against Vite's BASE_URL so every asset keeps working when the
 * site is served from a GitHub Pages sub-path (e.g. /Shem-Tov/assets/…).
 * The hashed files are the original Figma Make exports — do not substitute
 * them. The two heart icons are project-authored, drawn on the same 24px grid
 * and in the same flat style, because likes arrived after the Figma export.
 *
 * Their colours are baked into the SVG — as with every icon here, which render
 * as <img> and so cannot be recoloured by CSS: muted grey at rest, the accent
 * token when active.
 */
const base = `${import.meta.env.BASE_URL}assets`

export const assets = {
  heroIllustration: `${base}/b4624.png`,
  profileAvatar: `${base}/02a96.png`,
  /** Tafsheet's actual brand mascot — the real file from the design project, not a recreation. */
  brainMascot: `${base}/brain-mascot.png`,
  /** Hero card lockup on the Home Page — brain + wordmark, the real file. */
  heroBrainLogo: `${base}/hero-brain-logo.png`,
  /** Small inline logo mark next to the Home Page greeting — real file, stacked brain-over-wordmark. */
  logoStacked: `${base}/logo-stacked.png`,
  /** Home Page category illustrations — real files from the design project. */
  homeBirthBag: `${base}/home-birth-bag.png`,
  homeNames: `${base}/home-names.png`,
  homeLeaving: `${base}/home-leaving.png`,
  homeBabyGear: `${base}/home-baby-gear.png`,
  iconPerson: `${base}/8fa3b.svg`,
  iconQuote: `${base}/e9844.svg`,
  iconBell: `${base}/47618.svg`,
  iconHome: `${base}/1f5ca.svg`,
  iconPencil: `${base}/3e727.svg`,
  iconChat: `${base}/a099a.svg`,
  iconHeart: `${base}/heart-outline.svg`,
  iconHeartFilled: `${base}/heart-filled.svg`,
  iconChevronStart: `${base}/chevron-start.svg`,
  /** Project-authored to match the stroke-icon language above (24px grid,
   *  same weight and colour as the heart icons). Vertically symmetric —
   *  needs no RTL mirroring. */
  iconShare: `${base}/share.svg`,
  /** Project-authored to match the stroke-icon language above (24px grid,
   *  same weight and colour as the heart icons), since search predates a
   *  dedicated icon in the Figma Make export. */
  iconSearch: `${base}/search.svg`,
  /** Small status indicator for the currently leading completion (by likes).
   *  Project-authored, since a crown was not part of the original Figma Make
   *  export — a warm gold fill by design, the one icon in this set that
   *  isn't muted grey, since it marks a distinct status rather than a
   *  neutral action. */
  iconCrown: `${base}/crown-status.svg`,
  /** Project-authored to match the stroke-icon language above (24px grid,
   *  same weight and colour as the heart icons), for the "העתק קישור" row. */
  iconLink: `${base}/link.svg`,
} as const

export type AssetKey = keyof typeof assets
