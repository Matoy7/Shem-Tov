import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"

/**
 * The one place the app imports Hugeicons through. Every interface icon in
 * the product should render via this component (not a raw <svg>, not a
 * different icon library) so sizing and color stay centrally controlled —
 * per the icon-system brief: Hugeicons only, no mixing libraries.
 *
 * Size scale (brief's own numbers): 16 = small utility, 18–20 = standard
 * UI/buttons, 24–28 = larger feature/card icons. Default color is the
 * brief's default icon color (#6F1E35); pass `color` to use the secondary
 * (#544245) or muted (#877275) tone, or the pink chip colors (#FFD9DE /
 * #FFF0F2) only where a component already has a pink icon background.
 */
export function Icon({
  icon,
  size = 20,
  color = "#6f1e35",
  strokeWidth = 1.6,
  className,
  ...rest
}: HugeiconsIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    />
  )
}
