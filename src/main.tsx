import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { attemptRecoveryReload, scheduleRecoveryStateClear } from "./lib/errorRecovery"
import "./index.css"

/**
 * React's ErrorBoundary only catches errors thrown during render. An error
 * inside an event handler, a timer, or an unhandled promise rejection
 * never reaches it — the app just silently stops working in some smaller
 * way. Same policy here as there: log it for developers, try one reload,
 * and never show the person an error message either way.
 */
window.addEventListener("error", (event) => {
  console.error("Unhandled error:", event.error ?? event.message)
  attemptRecoveryReload()
})
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)
  attemptRecoveryReload()
})

// This boot reached React without the ErrorBoundary having to catch
// anything — once it's been stable for a few seconds, forgive any past
// reload streak so a later, unrelated problem gets its own fresh attempts.
scheduleRecoveryStateClear()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
