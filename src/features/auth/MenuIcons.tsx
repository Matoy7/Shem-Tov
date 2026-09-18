/**
 * Menu glyphs, rendered through the shared Hugeicons wrapper so the account
 * menu uses the same icon system as the rest of the product.
 */
import { Icon as HugeIcon } from "@/components/ui/HugeIcon"
import { Logout01Icon, Settings01Icon } from "@hugeicons/core-free-icons"

const SIZE = 20

type IconProps = { className?: string }

export function SettingsIcon({ className }: IconProps) {
  return <HugeIcon icon={Settings01Icon} size={SIZE} color="currentColor" className={className} />
}

export function SignOutIcon({ className }: IconProps) {
  return <HugeIcon icon={Logout01Icon} size={SIZE} color="currentColor" className={className} />
}
