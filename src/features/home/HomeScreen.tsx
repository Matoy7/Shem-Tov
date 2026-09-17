import { assets } from "@/lib/assets"

type HomeCard = {
  key: string
  img: string
  title: string
  subtitle: string
  /** Only the names card is wired to a real destination — the other three
   * illustrate categories that don't have a screen built yet, so they're
   * shown (matching the design reference) but intentionally not clickable,
   * rather than navigating somewhere that doesn't exist. */
  onNavigate?: () => void
}

type HomeScreenProps = {
  userName: string
  onNavigateToNames: () => void
}

/**
 * The app's mobile home screen: a greeting plus a 2×2 grid of category
 * cards. Styling reuses the same tokens already established for the name
 * catalogue's mobile pass — same burgundy/cream/pink palette, the same
 * `rounded-[28px]` card radius and near-flat shadow as NameCard, the same
 * Rubik weight scale — rather than introducing anything new, per "the
 * existing implementation is the source of truth."
 */
export function HomeScreen({ userName, onNavigateToNames }: HomeScreenProps) {
  const cards: HomeCard[] = [
    { key: "bag", img: assets.homeBirthBag, title: "הכנת תיק לידה", subtitle: "כל מה שכדאי לקחת לבית החולים" },
    { key: "names", img: assets.homeNames, title: "בחירת שם", subtitle: "גלו שמות ומשמעויות", onNavigate: onNavigateToNames },
    { key: "leaving", img: assets.homeLeaving, title: "התארגנות לצאת", subtitle: "רשימה לפני שיוצאים מהבית" },
    { key: "gear", img: assets.homeBabyGear, title: "ציוד לתינוק", subtitle: "רשימת הציוד לימים הראשונים" },
  ]

  return (
    <div className="px-1 pb-6 pt-2" dir="rtl">
      <h1 className="mb-7 text-[24px] font-bold leading-10 tracking-[-0.8px] text-[#6f1e35]">
        היי {userName}
      </h1>

      <div className="grid grid-cols-2 gap-3.5">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={card.onNavigate}
            disabled={!card.onNavigate}
            className="flex min-h-[220px] flex-col items-center rounded-[28px] bg-white p-4 text-center shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.97] disabled:active:scale-100"
          >
            <div className="mb-3 flex h-20 w-20 shrink-0 items-center justify-center">
              <img src={card.img} alt="" aria-hidden className="h-20 w-20 object-contain" />
            </div>
            <p className="mb-1 text-[17px] font-bold leading-[23px] text-[#6f1e35]">{card.title}</p>
            <p className="text-[12px] font-normal leading-[15px] text-[#544245]">{card.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
