import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import { assets } from "@/lib/assets"
import { attemptRecoveryReload } from "@/lib/errorRecovery"

type Props = { children: ReactNode }
type State = { error: Error | null; giveUp: boolean }

/**
 * Without this, any error thrown during render unmounts the whole tree and
 * leaves a blank page with nothing to go on. The policy here is: never show
 * that failure to the person as an error screen. Reload the page first —
 * most render-time crashes here are transient (stale cached bundle after a
 * deploy, a bad session, a race on first load) and a reload genuinely
 * clears them. Only if reloading keeps not helping (see errorRecovery.ts's
 * loop guard) does this render anything at all, and even then it's the
 * same calm "loading" look used everywhere else in the app — never the
 * words "error" or "something went wrong".
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, giveUp: false }

  static getDerivedStateFromError(error: Error): State {
    return { error, giveUp: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Logged for developers only — never surfaced to the person using the app.
    console.error("Unhandled error:", error, info.componentStack)
    const reloaded = attemptRecoveryReload()
    if (!reloaded) this.setState({ giveUp: true })
  }

  render() {
    const { error, giveUp } = this.state
    if (!error) return this.props.children

    // Either a reload is already underway (render nothing that would flash
    // before navigation completes) or recovery gave up — in both cases,
    // the same quiet, branded loading state, never an error message.
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
        {giveUp ? null : <p className="text-body text-content-secondary">טוען…</p>}
      </main>
    )
  }
}
