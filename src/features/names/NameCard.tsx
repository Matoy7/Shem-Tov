import { Card } from "@/components/ui/Card"
import { VoteButton } from "./VoteButton"
import type { VoteState } from "@/data/votes"

/** Shared shape both the catalogue view (NameEntry) and the ranked view (RankedName) reduce to. */
export type NameCardData = {
  nameId: string
  text: string
  gender: "boy" | "girl" | "unisex" | null
  origin: string | null
  meaningHe: string | null
  meaningConfidence: "verified" | "uncertain" | null
  /** Non-null when this row is one family's private suggestion. */
  suggestedForFamilyId: string | null
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

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center rounded-full border border-border bg-surface-muted px-2.5 text-caption font-medium text-content-secondary">
      {children}
    </span>
  )
}

type NameCardProps = {
  name: NameCardData
  vote: VoteState | undefined
  disabled?: boolean
  disabledReason?: string
  onToggleVote: (nameId: string) => void
}

/**
 * Deliberately minimal: no illustration, no avatar stack, no decorative
 * iconography anywhere near the name — the name and its meaning are the
 * entire visual point of the card. The only two interactive/informational
 * elements below the divider are what the person actually needs: what kind
 * of name this is (tags) and whether to vote for it (the heart).
 *
 * Tags are derived from data the card already receives — the free-text
 * `origin` field, split on its own `;` separators, plus a family-suggestion
 * marker — rather than fetching anything new, so this stays a pure visual
 * pass over the existing data flow.
 */
export function NameCard({
  name,
  vote,
  disabled = false,
  disabledReason = "צרו משפחה כדי להצביע",
  onToggleVote,
}: NameCardProps) {
  const tags = [
    ...(name.origin ? name.origin.split(";").map((s) => s.trim()).filter(Boolean) : []),
    ...(name.suggestedForFamilyId ? ["הצעת המשפחה"] : []),
  ]

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
            className="font-display text-card-title font-bold leading-snug text-primary [word-break:break-word]"
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
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <VoteButton
            voted={vote?.votedByMe ?? false}
            count={vote?.count ?? 0}
            disabled={disabled}
            disabledReason={disabledReason}
            onToggle={() => onToggleVote(name.nameId)}
          />
        </div>
      </div>
    </Card>
  )
}
