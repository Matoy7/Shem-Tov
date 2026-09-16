import { FavoriteButton } from "./FavoriteButton"
import { originTag, meaningTag, styleTag, type CardTag } from "./tagColors"
import { cn } from "@/lib/cn"
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

// Desktop tint — unchanged. Same soft pastel-per-gender palette as the
// filter bar's gender tabs, so the two surfaces still read as one product.
const GENDER_TINT_DESKTOP: Record<"boy" | "girl" | "unisex", string> = {
  boy: "sm:border-[#b9cdfb] sm:bg-[#eaf1ff] sm:text-[#3054c4]",
  girl: "sm:border-[#f7c3da] sm:bg-[#fdeef4] sm:text-[#c23477]",
  unisex: "sm:border-border-strong sm:bg-surface-muted sm:text-accent",
}

// Mobile tint — from the mobile design reference: soft powder blue for
// boys, soft coral/peach for girls, soft mint for unisex, each with a
// matching deep-navy-tinted text color rather than plain gray.
const GENDER_TINT_MOBILE: Record<"boy" | "girl" | "unisex", string> = {
  boy: "border-transparent bg-[#cfe6f7] text-[#0c4a6e]",
  girl: "border-transparent bg-[#eed5dc] text-[#830e2f]",
  unisex: "border-transparent bg-[#d0fcd1] text-[#081e18]",
}

function GenderPill({ gender }: { gender: "boy" | "girl" | "unisex" }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-caption font-semibold",
        "sm:h-6 sm:px-2.5 sm:font-medium",
        GENDER_TINT_MOBILE[gender],
        GENDER_TINT_DESKTOP[gender],
      )}
    >
      {GENDER_LABEL[gender]}
    </span>
  )
}

function Tag({ tag }: { tag: CardTag }) {
  return (
    <span
      className="inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-caption font-semibold sm:h-6 sm:px-2.5 sm:font-medium"
      style={{ backgroundColor: tag.swatch.bg, color: tag.swatch.text, borderColor: tag.swatch.border }}
    >
      {tag.label}
    </span>
  )
}

// Mobile-only rotating card backgrounds, straight from the design reference
// (its three sample cards each used a different one of these). Picked
// deterministically from the name's own id — same name always gets the
// same color on re-render, no extra state, nothing to keep in sync.
const MOBILE_CARD_TINTS = ["#d7effa", "#eed5dc", "#d0fcd1"]

function mobileCardTint(nameId: string): string {
  let hash = 0
  for (let i = 0; i < nameId.length; i++) hash = (hash * 31 + nameId.charCodeAt(i)) >>> 0
  return MOBILE_CARD_TINTS[hash % MOBILE_CARD_TINTS.length]
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
 * of each, at most, so a card never turns into a wall of pills.
 *
 * Visual styling only is mobile/desktop-split here: every class below
 * without an `sm:` prefix is the mobile design-reference look (rotating
 * pastel background, large radius, soft shadow, bold navy type); every
 * `sm:`-prefixed class reproduces the existing desktop "premium" Card
 * variant exactly, so nothing about the desktop experience changes. This
 * bypasses the shared `Card` component for this one component specifically
 * because its variant system can't express a background that varies per
 * card instance, and because this codebase's `cn()` is plain string
 * concatenation rather than a class-merge utility — trying to override the
 * shared premium variant's fixed radius/shadow/background from outside
 * would risk silently losing depending on generated CSS order. Writing
 * both states explicitly here avoids that risk entirely.
 */
export function NameCard({ name, favorited, onToggleFavorite }: NameCardProps) {
  const tags: CardTag[] = [
    ...name.origins.slice(0, 1).map(originTag),
    ...name.meanings.slice(0, 1).map(meaningTag),
    ...name.styles.slice(0, 1).map(styleTag),
  ].slice(0, 3)

  return (
    <article
      className={cn(
        "flex h-full min-h-[196px] w-full flex-col justify-between rounded-[28px] border border-transparent p-5",
        "shadow-[0px_8px_24px_rgba(0,0,0,0.05)] transition-shadow duration-150",
        "sm:rounded-xl sm:border-border-subtle sm:bg-surface sm:p-6 sm:shadow-name-card sm:hover:shadow-name-card-hover",
      )}
      style={{ backgroundColor: mobileCardTint(name.nameId) }}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <p
            dir="auto"
            className={cn(
              "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-display font-black leading-snug",
              "text-[22px] text-[#131835]",
              "sm:text-quote sm:font-bold sm:text-primary",
            )}
          >
            {name.text}
          </p>
          {name.gender ? <GenderPill gender={name.gender} /> : null}
        </div>

        {name.meaningHe ? (
          <p
            className={cn(
              "mt-2 line-clamp-2 leading-relaxed",
              "text-body-sm text-[#131835]/70",
              "sm:text-content-muted",
            )}
          >
            {name.meaningHe}
            {name.meaningConfidence === "uncertain" ? (
              <span className="ms-1 opacity-70" title="מקור המשמעות אינו ודאי">
                (לא ודאי)
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      <div>
        <div className="mb-4 h-px bg-[#131835]/10 sm:bg-border-subtle" aria-hidden />
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center justify-start gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag.key} tag={tag} />
            ))}
          </div>

          <FavoriteButton favorited={favorited} onToggle={() => onToggleFavorite(name.nameId)} />
        </div>
      </div>
    </article>
  )
}
