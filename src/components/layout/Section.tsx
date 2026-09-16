import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

type SectionProps = {
  title?: string
  /** Shown instead of `title` below the sm: breakpoint — for a mobile-specific heading without changing desktop's title text or styling. */
  mobileTitle?: string
  description?: string
  actions?: ReactNode
  className?: string
  children: ReactNode
}

/**
 * A page section: optional heading row plus content, separated by the
 * standard 16px rhythm. Sections are stacked by the page at 32px.
 */
export function Section({
  title,
  mobileTitle,
  description,
  actions,
  className,
  children,
}: SectionProps) {
  const labelled = Boolean(title)

  return (
    <section
      aria-label={labelled ? title : undefined}
      className={cn("flex flex-col gap-4", className)}
    >
      {labelled ? (
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-section-title font-semibold text-content-primary">
              {/* Mobile: a larger/bolder heading when one is supplied — same
                  DOM node, just different text/size below sm:, so nothing
                  about the desktop heading's markup or styling changes. */}
              <span className={mobileTitle ? "text-[32px] font-black text-[#6f1e35] sm:hidden" : "sm:contents"}>
                {mobileTitle ?? title}
              </span>
              <span className={mobileTitle ? "hidden sm:inline" : "sm:contents"}>{title}</span>
            </h2>
            {description ? (
              <p className="hidden text-body-sm text-content-muted sm:block">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  )
}
