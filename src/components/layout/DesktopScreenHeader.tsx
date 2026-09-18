/**
 * Compact desktop page header shared by the checklist screens (Hospital
 * Bag, Baby Gear, Leaving). The mobile hero (big centered illustration,
 * title, subtitle — see each screen's own markup) stays exactly as-is and
 * mobile-only; this is the desktop-only equivalent the brief asks for: a
 * clear page header that doesn't spend much vertical space, with the
 * illustration kept small and secondary to the actual checklist.
 */
type DesktopScreenHeaderProps = {
  image: string
  title: string
  subtitle: string
  /** "X מתוך Y הושלמו" — omit for a screen with no single overall count. */
  progressLabel?: string
}

export function DesktopScreenHeader({ image, title, subtitle, progressLabel }: DesktopScreenHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
      <div className="flex items-center gap-4">
        <img src={image} alt="" aria-hidden className="h-14 w-14 shrink-0 object-contain" />
        <div>
          <h1 className="text-[26px] font-bold leading-[32px] text-[#6f1e35]">{title}</h1>
          <p className="mt-0.5 text-[15px] leading-5 text-[#544245]">{subtitle}</p>
        </div>
      </div>
      {progressLabel ? <p className="text-[15px] font-medium text-[#544245]">{progressLabel}</p> : null}
    </div>
  )
}
