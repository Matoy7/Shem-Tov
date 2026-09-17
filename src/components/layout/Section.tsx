import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

type SectionProps = {
  title?: string
  /** Shown instead of `title` below the sm: breakpoint — for a mobile-specific heading without changing desktop's title text or styling. */
  mobileTitle?: string
  /** Shown above mobileTitle, mobile-only — matches the exact hero convention already used by the Hospital Bag / Baby Gear screens (illustration → title → subtitle), so this one screen isn't the odd one out. */
  mobileImage?: string
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
  mobileImage,
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
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-start">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            {/* Mobile-only hero image — same "mb-1 h-28 wXX object-contain"
                shape as Hospital Bag / Baby Gear's own hero illustration,
                hidden entirely on desktop and when no image is supplied. */}
            {mobileImage ? (
              <img src={mobileImage} alt="" aria-hidden className="mb-1 h-28 w-28 object-contain sm:hidden" />
            ) : null}

            <h2 className="text-section-title font-semibold text-content-primary">
              {/* Mobile: same 26px/black/burgundy treatment as the other
                  screens' hero title — same DOM node, just different
                  text/size below sm:, so nothing about the desktop
                  heading's markup or styling changes. */}
              <span className={mobileTitle ? "text-[26px] font-black leading-[34px] text-[#6f1e35] sm:hidden" : "sm:contents"}>
                {mobileTitle ?? title}
              </span>
              <span className={mobileTitle ? "hidden sm:inline" : "sm:contents"}>{title}</span>
            </h2>

            {description ? (
              <p className="mt-1 text-[14px] leading-[22px] text-[#544245] sm:mt-0 sm:hidden">{description}</p>
            ) : null}
            {description ? (
              <p className="hidden text-body-sm text-content-muted sm:block">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="mt-3 flex shrink-0 items-center gap-2 sm:mt-0">{actions}</div>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  )
}
