import { assets } from "@/lib/assets"

type HomeCard = {
  key: string
  img: string
  title: string
  subtitle: string
  /** Only names/bag/gear are wired to a real destination — "leaving the
   * house" doesn't have a screen built yet, so it's shown (matching the
   * design reference) but intentionally not clickable, rather than
   * navigating somewhere that doesn't exist. */
  onNavigate?: () => void
}

type HomeScreenProps = {
  onNavigateToNames: () => void
  onNavigateToBag: () => void
  onNavigateToGear: () => void
}

/**
 * The app's home screen: a brand-introduction hero (heading, subtitle, the
 * cheerful brain mascot) plus a 2×2 grid of category cards — no greeting,
 * no extra sections, per the redesign brief. See DESIGN_GUIDE.md for the
 * full token reference this and future screens should draw from.
 */
export function HomeScreen({ onNavigateToNames, onNavigateToBag, onNavigateToGear }: HomeScreenProps) {
  const cards: HomeCard[] = [
    { key: "bag", img: assets.homeBirthBag, title: "הכנת תיק לידה", subtitle: "מה כבר ארזת?", onNavigate: onNavigateToBag },
    { key: "names", img: assets.homeNames, title: "בחירת שם", subtitle: "מצאתם כבר שם?", onNavigate: onNavigateToNames },
    { key: "gear", img: assets.homeBabyGear, title: "ציוד לתינוק", subtitle: "מה עדיין חסר?", onNavigate: onNavigateToGear },
    { key: "leaving", img: assets.homeLeaving, title: "לפני שיוצאים", subtitle: "לא לשכוח כלום." },
  ]

  return (
    <div className="px-1 pb-6 pt-2" dir="rtl">
      {/* hero — brand introduction, not a dashboard status line: no
          greeting, generous whitespace, the mascot as the visual anchor. */}
      <div className="flex flex-col items-center px-4 pb-6 pt-4 text-center">
        <h1 className="font-display text-[34px] font-extrabold leading-[42px] tracking-[-0.5px] text-[#6f1e35]">
          טפשת
        </h1>
        <p className="mt-1.5 text-[16px] leading-6 text-[#8a5a63]">המוח בהולד? אנחנו פה לעזור</p>

        <img
          src={assets.brainMascotCheerful}
          alt=""
          aria-hidden
          className="mt-5 h-[180px] w-[180px] object-contain"
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={card.onNavigate}
            disabled={!card.onNavigate}
            className="flex min-h-[220px] flex-col items-center justify-center gap-1 rounded-[28px] bg-white p-5 text-center shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.97] disabled:active:scale-100"
          >
            <div className="mb-1 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[rgba(255,217,222,0.4)]">
              <img src={card.img} alt="" aria-hidden className="h-14 w-14 object-contain" />
            </div>
            <p className="text-[17px] font-bold leading-[23px] text-[#6f1e35]">{card.title}</p>
            <p className="text-[13px] leading-[18px] text-[#8a5a63]">{card.subtitle}</p>

            {/* Purely visual — the whole card is already the real tap
                target (its onClick above), so this isn't a second nested
                interactive element, just the arrow affordance from the
                design reference. */}
            <span
              aria-hidden
              className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(255,217,222,0.5)]"
            >
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                <path
                  d="M1 6h12M8 1l5 5-5 5"
                  stroke="#6f1e35"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
