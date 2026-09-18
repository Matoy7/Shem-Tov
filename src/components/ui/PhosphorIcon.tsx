import type { Icon as PhosphorIconComponent, IconWeight } from "@phosphor-icons/react"

/**
 * The one place the app imports Phosphor Icons through. Every icon in the
 * product — interface controls AND everyday object/category icons — should
 * render via this component (never a raw <svg>, never emoji-as-icon, never
 * a different icon library) so sizing/weight/color stay centrally
 * controlled, per the single-icon-system brief: Phosphor only.
 *
 * Size scale (brief's own numbers): 16–20 = UI/standard actions,
 * 24–32 = category/object icons, 32–48 = large feature/card visuals.
 *
 * Weight carries meaning, not decoration: "regular" is the default for UI
 * icons, "duotone" for an icon acting as a larger visual object inside a
 * card/category/feature block, "light" only for a very subtle secondary
 * icon, "fill" only for an intentional selected/active state (a favorited
 * heart, a selected filter, the active nav item).
 *
 * Default color is the brief's primary icon color (#6F1E35); pass `color`
 * for the secondary (#544245) or muted (#877275) tone, or white when the
 * icon sits on a solid dark/burgundy chip background.
 */
export function Icon({
  icon: IconComponent,
  size = 20,
  color = "#6f1e35",
  weight = "regular",
  className,
}: {
  icon: PhosphorIconComponent
  size?: number
  color?: string
  weight?: IconWeight
  className?: string
}) {
  return <IconComponent size={size} color={color} weight={weight} className={className} />
}
