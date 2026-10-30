'use client'

import { useEffect, useRef } from 'react'
import { ui, type Locale } from '@/lib/i18n'
import { Reveal } from '../Reveal'
import { useLight } from './LightProvider'

export function HeroOverture({
  locale,
  children,
  footer,
}: {
  locale: Locale
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const { light } = useLight()
  const copy = ui[locale].light
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0

    const update = () => {
      frame = 0
      const height = node.offsetHeight || 1
      const progress = Math.min(1, Math.max(0, window.scrollY / height))
      node.style.setProperty('--hero-progress', progress.toFixed(3))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={ref}
      data-light={light.phase}
      className="hero-overture relative flex min-h-[94svh] flex-col overflow-hidden pt-28"
    >
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-light" aria-hidden="true" />

      <div className="relative z-10 shell flex flex-1 flex-col justify-end pb-16 md:pb-20">
        <Reveal variant="fade">
          <p className="kicker eyebrow-rule text-taupe">
            <span>{copy.status}</span>
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
            <span>
              {light.ready
                ? `${light.time} · ${copy.phases[light.phase]}`
                : copy.hint}
            </span>
          </p>
        </Reveal>
        {children}
      </div>

      {footer ? (
        <div className="relative z-10 shell border-t border-ink/15 py-6">
          {footer}
        </div>
      ) : null}

      <div className="hero-scroll" aria-hidden="true">
        <span>{copy.scroll}</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  )
}
