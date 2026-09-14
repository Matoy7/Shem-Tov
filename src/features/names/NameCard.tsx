import { Card } from "@/components/ui/Card"
import { FavoriteButton } from "./FavoriteButton"
import { originTag, meaningTag, styleTag, type CardTag } from "./tagColors"
import type { Origin, Meaning, Style } from "@/data/names"

export type NameCardData = {
  nameId: string
  text: string
  gender: "boy" | "girl" | "unisex" | null
  origin: string | null
  origins: Origin[]
  meanings: Meaning[]
  styles: Style[]
  meaningHe: string | null
  meaningConfidence: "verified" | "uncertain" | null
}

const GENDER_LABEL: Record<"boy" | "girl" | "unisex", string> = {
  boy: "לבן",
  girl: "לבת",
  unisex: "יוניסקס",
}

// Same soft pastel-per-gender palette as the filter bar's gender tabs, reused
// here so the two surfaces read as one product rather than two shades of it.
const GENDER_TINT: Record<"boy" | "girl" | "unisex", string> = {
  boy: "border-[#b9cdfb] bg-[#eaf1ff] text-[#3054c4]",
  girl: "border-[#f7c3da] bg-[#fdeef4] text-[#c23477]",
  unisex: "border-border-strong bg-surface-muted text-accent",
}

function GenderPill({ gender }: { gender: "boy" | "girl" | "unisex" }) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-caption font-medium ${GENDER_TINT[gender]}`}
    >
      {GENDER_LABEL[gender]}
    </span>
  )
}

function Tag({ tag }: { tag: CardTag }) {
  return (
    <span
      className="inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-caption font-medium"
      style={{ backgroundColor: tag.swatch.bg, color: tag.swatch.text, borderColor: tag.swatch.border }}
    >
      {tag.label}
    </span>
  )
}

type NameCardProps = {
  name: NameCardData
  favorited: boolean
  onToggleFavorite: (nameId: string) => void
}

/**
 * Deliberately minimal: no illustration, no decorative iconography anywhere
 * near the name — the name and its meaning are the entire visual point of
 * the card. The only two elements below the divider are what the person
 * actually needs: what kind of name this is (tags) and whether to save it
 * (the heart) — a private bookmark, not a shared/group action.
 *
 * Tags come straight from the name's real origin/meaning/style flags — one
 * of each, at most, so a card never turns into a wall of pills. Each tag
 * value has its own fixed color (see tagColors.ts): same lightness and
 * saturation across all of them (one coherent "family" of colors), distinct
 * hue per value (so origin/meaning/style stay tellable apart at a glance).
 */
export function NameCard({ name, favorited, onToggleFavorite }: NameCardProps) {
  const tags: CardTag[] = [
    ...name.origins.slice(0, 1).map(originTag),
    ...name.meanings.slice(0, 1).map(meaningTag),
    ...name.styles.slice(0, 1).map(styleTag),
  ].slice(0, 3)

  return (
    <Card
      as="article"
      variant="premium"
      interactive
      padding="lg"
      className="flex h-full min-h-[196px] w-full flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <p
            dir="auto"
            className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-display text-quote font-bold leading-snug text-primary"
          >
            {name.text}
          </p>
          {name.gender ? <GenderPill gender={name.gender} /> : null}
        </div>

        {name.meaningHe ? (
          <p className="mt-2 line-clamp-2 text-body-sm leading-relaxed text-content-muted">
            {name.meaningHe}
            {name.meaningConfidence === "uncertain" ? (
              <span className="ms-1 text-content-muted/70" title="מקור המשמעות אינו ודאי">
                (לא ודאי)
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      <div>
        <div className="mb-4 h-px bg-border-subtle" aria-hidden />
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center justify-start gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag.key} tag={tag} />
            ))}
          </div>

          <FavoriteButton favorited={favorited} onToggle={() => onToggleFavorite(name.nameId)} />
        </div>
      </div>
    </Card>
  )
}
