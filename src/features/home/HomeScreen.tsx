import { assets } from "@/lib/assets"

type HomeCard = {
  key: string
  img: string
  title: string
  /** Only the names card is wired to a real destination — the other three
   * illustrate categories that don't have a screen built yet, so they're
   * shown (matching the design reference) but intentionally not clickable,
   * rather than navigating somewhere that doesn't exist. */
  onNavigate?: () => void
}

type HomeScreenProps = {
  userName: string
  onNavigateToNames: () => void
  onNavigateToBag: () => void
}

/**
 * The app's mobile home screen: a greeting (with the brand mark beside it)
 * plus a 2×2 grid of category cards. Styling reuses the same tokens already
 * established for the name catalogue's mobile pass — same burgundy/cream/
 * pink palette, the same `rounded-[28px]` card radius and near-flat shadow
 * as NameCard, the same Rubik weight scale — rather than introducing
 * anything new, per "the existing implementation is the source of truth."
 */
export function HomeScreen({ userName, onNavigateToNames, onNavigateToBag }: HomeScreenProps) {
  const cards: HomeCard[] = [
    { key: "bag", img: assets.homeBirthBag, title: "הכנת תיק לידה", onNavigate: onNavigateToBag },
    { key: "names", img: assets.homeNames, title: "בחירת שם", onNavigate: onNavigateToNames },
    { key: "leaving", img: assets.homeLeaving, title: "התארגנות לצאת" },
    { key: "gear", img: assets.homeBabyGear, title: "ציוד לתינוק" },
  ]

  return (
    <div className="px-1 pb-6 pt-2" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-[17px] font-bold leading-[23px] text-[#6f1e35]">
          היי {userName}
        </h1>
        <img src={assets.logoStacked} alt="טפשת" className="h-[120px] w-auto shrink-0 object-contain" />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={card.onNavigate}
            disabled={!card.onNavigate}
            className="flex min-h-[152px] flex-col items-center justify-center gap-2 rounded-[28px] bg-white p-4 text-center shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.97] disabled:active:scale-100"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center">
              <img src={card.img} alt="" aria-hidden className="h-14 w-14 object-contain" />
            </div>
            <p className="text-[17px] font-bold leading-[23px] text-[#6f1e35]">{card.title}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
