'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import type { Locale } from '@/lib/i18n'

type Phase = 'loading' | 'leaving' | 'done'

export function LandingLoader({ locale }: { locale: Locale }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [logoReady, setLogoReady] = useState(false)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.dataset.landingLoader = phase

    if (phase === 'done') {
      window.dispatchEvent(new Event('landing-loader-done'))
    }

    return () => {
      delete document.documentElement.dataset.landingLoader
    }
  }, [phase])

  useEffect(() => {
    startedAt.current = performance.now()
    let leaveTimer: ReturnType<typeof setTimeout> | undefined
    let doneTimer: ReturnType<typeof setTimeout> | undefined

    const beginLeave = () => {
      const elapsed = performance.now() - (startedAt.current ?? performance.now())
      const wait = Math.max(0, 1200 - elapsed)
      leaveTimer = setTimeout(() => {
        setPhase('leaving')
        doneTimer = setTimeout(() => setPhase('done'), 900)
      }, wait)
    }

    if (logoReady) beginLeave()
    const fallback = setTimeout(() => setLogoReady(true), 2500)

    return () => {
      clearTimeout(fallback)
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
    }
  }, [logoReady])

  if (phase === 'done') return null

  const label = locale === 'fil' ? 'Naglo-load' : 'Loading'

  return (
    <div
      className={cn('landing-loader', phase === 'leaving' && 'landing-loader--leaving')}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="landing-loader__inner">
        <div className="landing-loader__mark">
          <Image
            src="/dummy_pics/Frame.svg"
            alt=""
            width={73}
            height={131}
            priority
            onLoad={() => setLogoReady(true)}
            onError={() => setLogoReady(true)}
            className="landing-loader__logo"
          />
        </div>
        <p className="landing-loader__word">The Velaris</p>
        <span className="landing-loader__line" aria-hidden="true" />
        <p className="landing-loader__label">{label}</p>
      </div>
    </div>
  )
}
