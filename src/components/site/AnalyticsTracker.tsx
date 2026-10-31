'use client'

import { useEffect } from 'react'

function getSessionId() {
  const key = 'velaris-analytics-session'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const sessionId = crypto.randomUUID()
  window.localStorage.setItem(key, sessionId)
  return sessionId
}

function record(eventName: 'page_view' | 'click', path: string, label?: string) {
  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      session_id: getSessionId(),
      path,
      label,
    }),
    keepalive: true,
  })
}

export function AnalyticsTracker() {
  useEffect(() => {
    record('page_view', window.location.pathname)

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest('a,button')
        : null
      if (!target) return
      const label = target.textContent?.trim().slice(0, 160) || target.getAttribute('aria-label') || undefined
      record('click', window.location.pathname, label)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
