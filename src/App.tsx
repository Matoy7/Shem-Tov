import { useCallback, useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Section } from "@/components/layout/Section"
import { EmptyState } from "@/components/ui/EmptyState"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { LoginScreen } from "@/features/auth/LoginScreen"
import { GuestNameOnboarding } from "@/features/auth/GuestNameOnboarding"
import { useSession } from "@/features/auth/useSession"
import {
  canUpgradeAccount,
  displayNameFor,
  isGuest,
  providerAvatarUrl,
} from "@/features/auth/profile"
import { useGeneratedAvatar } from "@/lib/avatar"
import {
  beginAccountLink,
  consumeAccountLinkOutcome,
  type LinkResult,
} from "@/features/auth/linkAccount"
import { assets } from "@/lib/assets"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

import { useNames } from "@/features/names/useNames"
import { NameGrid } from "@/features/names/NameGrid"
import { NameFiltersBar, EMPTY_NAME_FILTERS, type NameFiltersValue } from "@/features/names/NameFiltersBar"
import { ActiveFiltersRow } from "@/features/names/ActiveFiltersRow"
import { logSearch } from "@/data/searchLogs"
import { logFilterClick } from "@/data/filterClickLogs"
import { useSilentRetry } from "@/lib/useSilentRetry"

const PRODUCT_NAME = "שם טוב"
const TAGLINE = "מגלים ובוחרים את השם המושלם."
const PRIVACY_NOTE = "השמות שאתם שומרים גלויים רק לכם."

const NAV_ITEMS = [{ id: "browse", label: "עיון בשמות", icon: assets.iconHome }]

export default function App() {
  const { session, loading: sessionLoading, profileLoading, displayName, setDisplayName } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<NameFiltersValue>(EMPTY_NAME_FILTERS)
  const [sort, setSort] = useState<"alphabetical" | "popularity">("alphabetical")
  const [linkResult, setLinkResult] = useState<LinkResult | null>(null)
  const [confirmGuestSignOut, setConfirmGuestSignOut] = useState(false)

  const providerAvatar = session ? providerAvatarUrl(session.user) : null
  const generatedAvatar = useGeneratedAvatar(
    session && !providerAvatar ? session.user.id : null,
  )

  useEffect(() => {
    consumeAccountLinkOutcome()
      .then((result) => {
        if (result && result.outcome !== "cancelled") setLinkResult(result)
      })
      .catch(() => {})
  }, [])

  const startAccountLink = useCallback(async () => {
    const failure = await beginAccountLink()
    if (failure) setLinkResult({ outcome: "failed", detail: failure })
  }, [])

  const userId = session?.user.id

  // Logged after a short pause in typing, not on every keystroke — the
  // actual search itself stays instant either way, this only debounces
  // what gets written to search_logs.
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!userId || trimmed.length < 2) return
    const id = window.setTimeout(() => {
      void logSearch(trimmed, userId)
    }, 600)
    return () => window.clearTimeout(id)
  }, [searchQuery, userId])

  const {
    names,
    favorites,
    loading: namesLoading,
    error: namesError,
    reload: reloadNames,
    toggleFavorite,
  } = useNames(userId, {
    search: searchQuery || undefined,
    sort,
    gender: filters.gender,
    origins: filters.origins,
    meanings: filters.meanings,
    styles: filters.styles,
    popularities: filters.popularities,
    initial: filters.more.initial,
    endsWith: filters.more.endsWith,
    short: filters.more.short,
    easyInEnglish: filters.more.easyInEnglish,
    worksInternationally: filters.more.worksInternationally,
  })

  useSilentRetry(namesError, reloadNames)

  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="w-full max-w-[480px]">
          <EmptyState
            title="החיבור ל-Supabase לא מוגדר"
            description="חסרים המשתנים VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY. ראו את קובץ README."
          />
        </div>
      </main>
    )
  }

  if (sessionLoading || (session && isGuest(session.user) && profileLoading)) {
    return (
      <main
        aria-busy="true"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4"
      >
        <img
          src={assets.heroIllustration}
          alt=""
          aria-hidden
          width={96}
          height={96}
          className="size-24 animate-pulse rounded-full bg-surface-secondary object-cover"
        />
        <p className="text-body text-content-secondary">טוען…</p>
      </main>
    )
  }

  if (!session) {
    return (
      <LoginScreen
        brandName={PRODUCT_NAME}
        brandTagline={TAGLINE}
        privacyNote={PRIVACY_NOTE}
      />
    )
  }

  // A brand-new guest has a session but no display_name yet — asked for
  // directly, once, rather than ever auto-generated. Returning guests keep
  // whatever they chose the first time (see profile.ts), so this only ever
  // shows once per guest identity. The profileLoading check above already
  // ruled out "still fetching" as the reason displayName is null here.
  if (isGuest(session.user) && displayName === null) {
    return (
      <GuestNameOnboarding
        brandName={PRODUCT_NAME}
        userId={session.user.id}
        onChosen={setDisplayName}
      />
    )
  }

  const userName = displayName ?? displayNameFor(session.user)
  const avatarUrl = providerAvatar ?? generatedAvatar ?? assets.heroIllustration

  return (
    <>
      <DashboardLayout
        brandName={PRODUCT_NAME}
        brandTagline={TAGLINE}
        navItems={NAV_ITEMS}
        activeNavId="browse"
        searchPlaceholder="חיפוש שם"
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        userName={userName}
        avatarUrl={avatarUrl}
        canUpgrade={canUpgradeAccount(session.user)}
        onSelectNav={() => {}}
        onUpgrade={startAccountLink}
        onSignOut={() => {
          if (canUpgradeAccount(session.user)) setConfirmGuestSignOut(true)
          else void supabase.auth.signOut()
        }}
      >
        <Section
          title="כל השמות"
          description="עיינו, חפשו וסננו מתוך הקטלוג המשותף של שם טוב, ושמרו את השמות שאהבתם."
        >
          <div className="flex flex-col gap-4">
            <NameFiltersBar
              value={filters}
              onChange={setFilters}
              onFilterClick={(category, value, selected) => {
                if (userId) void logFilterClick(userId, category, value, selected)
              }}
            />
            <ActiveFiltersRow value={filters} onChange={setFilters} />

            {!namesLoading && !namesError ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-body-sm font-medium text-content-secondary sm:gap-0">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[#10b981] sm:hidden" />
                  {names.length} שמות נמצאו
                </p>
                <label className="flex items-center gap-1.5 text-caption text-content-muted">
                  מיון:
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "alphabetical" | "popularity")}
                    className="rounded-md border border-border bg-surface px-2 py-1 text-caption font-medium text-content-primary"
                  >
                    <option value="alphabetical">לפי א-ב</option>
                    <option value="popularity">לפי פופולריות</option>
                  </select>
                </label>
              </div>
            ) : null}

            <NameGrid
              names={names}
              favorites={favorites}
              loading={namesLoading}
              error={namesError}
              searchQuery={searchQuery}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </Section>
      </DashboardLayout>

      <Modal
        open={confirmGuestSignOut}
        onClose={() => setConfirmGuestSignOut(false)}
        title="לצאת מחשבון האורח?"
        footer={
          <>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setConfirmGuestSignOut(false)}
            >
              ביטול
            </Button>
            <Button
              variant="destructive"
              size="md"
              onClick={() => {
                setConfirmGuestSignOut(false)
                void supabase.auth.signOut()
              }}
            >
              צא בכל זאת
            </Button>
          </>
        }
      >
        <p className="text-body text-content-secondary">
          חשבון האורח קיים רק בדפדפן הזה. אם תצאו, לא נוכל לשחזר אותו — והשמות
          ששמרתם לא יהיו נגישים יותר.
        </p>
        <p className="text-body-sm text-content-muted">
          כדי לשמור אותם, סגרו את החלון ובחרו "כניסה עם Google" בתפריט החשבון.
        </p>
      </Modal>

      <Modal
        open={linkResult !== null}
        onClose={() => setLinkResult(null)}
        title={
          linkResult?.outcome === "linked"
            ? "החשבון נשמר 🎉"
            : "שמירת החשבון לא הושלמה"
        }
        footer={
          <Button
            variant="primary"
            size="md"
            onClick={() => setLinkResult(null)}
          >
            סגירה
          </Button>
        }
      >
        <p className="text-body text-content-secondary">
          {linkResult?.outcome === "linked"
            ? "השמות ששמרתם איתכם גם בפעם הבאה."
            : linkResult?.outcome === "conflict"
              ? "חשבון Google הזה כבר משויך למשתמש אחר. התחברו איתו ישירות, או נסו חשבון Google אחר. הנתונים שלכם כאן לא נפגעו."
              : "לא הצלחנו לשמור את החשבון, ונשארתם מחוברים כאורח. שום דבר לא אבד — אפשר לנסות שוב."}
        </p>
        {linkResult?.detail && linkResult.outcome !== "linked" ? (
          <p dir="ltr" className="text-caption text-content-muted">
            {linkResult.detail}
          </p>
        ) : null}
      </Modal>
    </>
  )
}
