'use client'

import { useEffect, useState } from 'react'
import AdminLoading from './loading'

const minimumDisplayTime = 1800

export default function AdminTransitionGate({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = window.setTimeout(() => setReady(true), 0)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => setReady(true), minimumDisplayTime)
    return () => window.clearTimeout(timer)
  }, [])

  if (!ready) return <AdminLoading />

  return <>{children}</>
}
