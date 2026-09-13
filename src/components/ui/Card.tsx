import type { HTMLAttributes, ReactNode, Ref } from "react"
import { cn } from "@/lib/cn"

export type CardVariant = "default" | "accent" | "premium"
export type CardPadding = "md" | "lg"

const variantStyles: Record<CardVariant, string> = {
  default: "rounded-lg bg-surface border-border-subtle shadow-card",
  accent: "rounded-lg bg-surface-secondary border-transparent shadow-panel",
  // Extra-large radius and a diffuse, low-contrast shadow — the "clean and
  // premium" name-card redesign's look, kept as its own variant rather than
  // a className override so it can never silently lose a specificity fight
  // with the default radius/shadow (cn() here is plain concatenation, not
  // a merge utility — see lib/cn.ts).
  premium: "rounded-xl bg-surface border-border-subtle shadow-name-card",
}

const hoverShadowStyles: Record<CardVariant, string> = {
  default: "hover:shadow-card-hover",
  accent: "hover:shadow-card-hover",
  premium: "hover:shadow-name-card-hover",
}

const paddingStyles: Record<CardPadding, string> = {
  md: "p-4",
  lg: "p-6",
}

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
  padding?: CardPadding
  interactive?: boolean
  as?: "div" | "article" | "section"
  /** Forwarded to the rendered element, for measuring or anchoring. */
  ref?: Ref<HTMLElement>
  children: ReactNode
}

/**
 * The single card specification for the product. Radius, border, background,
 * shadow and padding all come from tokens — never restyle a card inline.
 */
export function Card({
  variant = "default",
  padding = "lg",
  interactive = false,
  as: Tag = "div",
  className,
  ref,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      ref={ref as Ref<HTMLDivElement>}
      className={cn(
        "border",
        variantStyles[variant],
        paddingStyles[padding],
        interactive && cn("transition-shadow duration-150", hoverShadowStyles[variant]),
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Card header: title block plus optional trailing actions. */
export function CardHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-card-title font-semibold text-content-primary">
          {title}
        </h3>
        {description ? (
          <p className="text-body-sm text-content-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

/** Card footer: separated from body by the standard 16px rhythm. */
export function CardFooter({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 pt-4", className)}
    >
      {children}
    </div>
  )
}
