'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ui, type Locale } from '@/lib/i18n'
import { Reveal } from '../Reveal'
import { useLight } from './LightProvider'

export function HeroOverture({
  locale,
  image,
  imageAlt = '',
  children,
  footer,
}: {
  locale: Locale
  image: string
  imageAlt?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const { light } = useLight()
  const copy = ui[locale].light
  const ref = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)

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

  useEffect(() => {
    if (document.documentElement.dataset.landingLoader === 'done') {
      const frame = window.requestAnimationFrame(() => setReady(true))
      return () => window.cancelAnimationFrame(frame)
    }

    const onLandingReady = () => setReady(true)
    window.addEventListener('landing-loader-done', onLandingReady)
    return () => window.removeEventListener('landing-loader-done', onLandingReady)
  }, [])

  return (
    <section
      ref={ref}
      data-light={light.phase}
      data-ready={ready ? 'true' : 'false'}
      className="hero-overture hero-fade relative flex min-h-[100svh] flex-col overflow-hidden pt-28"
    >
      <div className="hero-art" aria-hidden="true">
        <Image
          src={image}
          alt={imageAlt}
          fill
          preload
          sizes="100vw"
          className="hero-art__img"
        />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-light" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="relative z-10 shell flex flex-1 flex-col justify-end pb-12 md:pb-16">
        <Reveal variant="fade">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="kicker eyebrow-rule text-cream/75">
              <span>{copy.status}</span>
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-ink/25 px-3 py-1.5 font-sans text-[0.5rem] uppercase tracking-[0.22em] text-cream/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
              <span>
                {light.ready
                  ? `${light.time} · ${copy.phases[light.phase]}`
                  : copy.hint}
              </span>
            </p>
          </div>
        </Reveal>
        {children}
      </div>

      {footer ? (
        <div className="hero-footer relative z-10">
          <div className="shell pb-8 pt-20">{footer}</div>
        </div>
      ) : null}

      <div className="hero-scroll" aria-hidden="true">
        <span>{copy.scroll}</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  )
}
