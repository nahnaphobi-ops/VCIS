import { useEffect, useRef } from 'react'

/** Sign out after this long without interaction. Clerk sessions otherwise last until their dashboard lifetime. */
const IDLE_LIMIT_MS = 30 * 60 * 1000
const CHECK_EVERY_MS = 30 * 1000
const WRITE_THROTTLE_MS = 5 * 1000
const STORAGE_KEY = 'vcis:last-activity'
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const
// Clerk redirects land signed in with no interaction on this page.
const AUTH_CALLBACK = /(__clerk|[?&]code=)/

// localStorage is shared across tabs and survives a closed browser, so a
// returning admin after a long gap is signed out too. It can throw (private
// mode), in which case idle tracking falls back to this tab's memory.
let memoryLastActive = Date.now()

function readLastActive(): number {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY))
    if (Number.isFinite(stored) && stored > 0) return stored
  } catch {
    /* storage unavailable */
  }
  return memoryLastActive
}

function writeLastActive(at: number = Date.now()) {
  memoryLastActive = at
  try {
    localStorage.setItem(STORAGE_KEY, String(at))
  } catch {
    /* storage unavailable */
  }
}

/**
 * Calls onIdle once the signed-in user has been inactive for IDLE_LIMIT_MS.
 * Activity is tracked even while signed out, so a fresh sign-in always follows
 * recent interaction and is never cut short by an old timestamp.
 */
export function useIdleLogout(signedIn: boolean, onIdle: () => void | Promise<void>) {
  const onIdleRef = useRef(onIdle)
  useEffect(() => {
    onIdleRef.current = onIdle
  })

  useEffect(() => {
    if (AUTH_CALLBACK.test(window.location.hash + window.location.search)) writeLastActive()

    let lastWrite = 0
    const touch = () => {
      const now = Date.now()
      if (now - lastWrite < WRITE_THROTTLE_MS) return
      lastWrite = now
      writeLastActive(now)
    }
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, touch, { passive: true }))
    return () => ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, touch))
  }, [])

  useEffect(() => {
    if (!signedIn) return

    let done = false
    const check = () => {
      if (done || Date.now() - readLastActive() < IDLE_LIMIT_MS) return
      done = true
      void onIdleRef.current()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') check()
    }

    check()
    document.addEventListener('visibilitychange', onVisible)
    const timer = window.setInterval(check, CHECK_EVERY_MS)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.clearInterval(timer)
    }
  }, [signedIn])
}
