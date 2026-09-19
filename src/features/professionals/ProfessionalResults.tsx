import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/ui/EmptyState"
import { ProfessionalCard } from "./ProfessionalCard"
import type { Professional } from "@/data/professionals"

type ProfessionalResultsProps = {
  results: Professional[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  loading?: boolean
}

const GRID = "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

/** Responsive results grid for the בעלי מקצוע directory — single column on
 * mobile per the brief, up to four columns on wide desktop. */
export function ProfessionalResults({ results, favorites, onToggleFavorite, loading }: ProfessionalResultsProps) {
  if (loading) {
    return (
      <div className={GRID} aria-busy="true" aria-label="טוען בעלי מקצוע">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="h-[220px] w-full animate-pulse" aria-hidden>
            <span className="sr-only">טוען</span>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return <EmptyState title="לא מצאנו בעלי מקצוע שמתאימים לסינון" description="נסו לשנות או להסיר כמה מהסינונים." />
  }

  return (
    <ul className={GRID}>
      {results.map((p) => (
        <li key={p.id} className="flex">
          <ProfessionalCard professional={p} favorited={favorites.has(p.id)} onToggleFavorite={onToggleFavorite} />
        </li>
      ))}
    </ul>
  )
}
