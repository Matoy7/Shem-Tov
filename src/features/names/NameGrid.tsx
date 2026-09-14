import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/ui/EmptyState"
import { NameCard, type NameCardData } from "./NameCard"

type NameGridProps = {
  names: NameCardData[]
  favorites: Map<string, boolean>
  loading: boolean
  error: string | null
  searchQuery?: string
  onToggleFavorite: (nameId: string) => void
}

const GRID = "grid w-full grid-cols-1 gap-4 md:grid-cols-4 xl:grid-cols-6"

/** Responsive name grid for browsing/searching/filtering the catalogue. */
export function NameGrid({ names, favorites, loading, error, searchQuery, onToggleFavorite }: NameGridProps) {
  if (loading || error) {
    return (
      <div className={GRID} aria-busy="true" aria-label={searchQuery ? "מחפש" : "טוען שמות"}>
        {Array.from({ length: 6 }, (_, index) => (
          <Card key={index} className="h-[164px] w-full animate-pulse" aria-hidden>
            <span className="sr-only">טוען</span>
          </Card>
        ))}
      </div>
    )
  }

  if (names.length === 0) {
    const copy = searchQuery
      ? { title: "לא מצאנו שמות מתאימים", description: "נסו לחפש מילה אחרת" }
      : { title: "לא מצאנו שמות", description: "נסו לשנות את הסינון." }
    return <EmptyState title={copy.title} description={copy.description} />
  }

  return (
    <ul className={GRID}>
      {names.map((name) => (
        <li key={name.nameId} className="flex">
          <NameCard
            name={name}
            favorited={favorites.get(name.nameId) ?? false}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}
