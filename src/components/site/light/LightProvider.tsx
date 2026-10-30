'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  initialLight,
  isLightPhase,
  lightPhases,
  readLight,
  type LightOverride,
  type LightState,
} from '@/lib/light'

type LightContextValue = {
  light: LightState
  override: LightOverride
  setOverride: (value: LightOverride) => void
}

const LightContext = createContext<LightContextValue | null>(null)

const STORAGE_KEY = 'velaris-light'

let currentOverride: LightOverride = 'auto'
const listeners = new Set<() => void>()

function readStoredOverride(): LightOverride {
  if (typeof window === 'undefined') return 'auto'

  const query = new URLSearchParams(window.location.search).get('light')
  if (isLightPhase(query)) return query

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLightPhase(stored)) return stored
  } catch {
    return 'auto'
  }

  return 'auto'
}

if (typeof window !== 'undefined') {
  currentOverride = readStoredOverride()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return currentOverride
}

function getServerSnapshot(): LightOverride {
  return 'auto'
}

export function LightProvider({ children }: { children: ReactNode }) {
  const override = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [light, setLight] = useState<LightState>(initialLight)

  useEffect(() => {
    const apply = () => {
      const now = readLight()
      const phase = override === 'auto' ? now.phase : override
      setLight({ ...now, phase })
      document.documentElement.dataset.light = phase
    }

    apply()

    if (override !== 'auto') return

    const timer = window.setInterval(apply, 30000)
    return () => window.clearInterval(timer)
  }, [override])

  const setOverride = useCallback((value: LightOverride) => {
    currentOverride = value
    try {
      if (value === 'auto') window.localStorage.removeItem(STORAGE_KEY)
      else window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      currentOverride = value
    }
    listeners.forEach((listener) => listener())
  }, [])

  const value = useMemo(
    () => ({ light, override, setOverride }),
    [light, override, setOverride],
  )

  return <LightContext.Provider value={value}>{children}</LightContext.Provider>
}

export function useLight() {
  const value = useContext(LightContext)
  if (!value) throw new Error('useLight must be used within LightProvider')
  return value
}

export { lightPhases }
