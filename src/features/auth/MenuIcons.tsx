/**
 * Menu glyphs, rendered through the shared Phosphor wrapper so the account
 * menu uses the same icon system as the rest of the product.
 */
import { Icon as PhosphorIcon } from "@/components/ui/PhosphorIcon"
import { SignOut, GearSix } from "@phosphor-icons/react"

const SIZE = 20

type IconProps = { className?: string }

export function SettingsIcon({ className }: IconProps) {
  return <PhosphorIcon icon={GearSix} size={SIZE} color="currentColor" className={className} />
}

export function SignOutIcon({ className }: IconProps) {
  return <PhosphorIcon icon={SignOut} size={SIZE} color="currentColor" className={className} />
}
