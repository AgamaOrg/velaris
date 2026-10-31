'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { lightPhases, type LightPhase } from '@/lib/light'
import { ui, type Locale } from '@/lib/i18n'
import { useLight } from './LightProvider'
import { SunPath } from './SunPath'

const fallbackImages: Record<LightPhase, string> = {
  dawn: '/dummy_pics/Biet-thu-mini-3-tang-co-tum-1.jpg',
  day: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif',
  golden: '/dummy_pics/villa-features-1024x690.jpg',
  night: '/dummy_pics/villa-features-1024x690.jpg',
}

const phaseTime: Record<LightPhase, string> = {
  dawn: '06:10',
  day: '12:30',
  golden: '17:35',
  night: '20:15',
}

export function LightScrubber({
  locale,
  title,
  images,
}: {
  locale: Locale
  title: string
  images?: Partial<Record<LightPhase, string>>
}) {
  const copy = ui[locale].light
  const { light } = useLight()
  const currentIndex = Math.max(0, lightPhases.indexOf(light.phase))
  const [manualIndex, setManualIndex] = useState(currentIndex)
  const [touched, setTouched] = useState(false)

  const index = touched ? manualIndex : currentIndex
  const phase = lightPhases[index]
  const sources = { ...fallbackImages, ...images }
  const labels = lightPhases.map((item) => copy.phases[item])

  const move = (next: number) => {
    setTouched(true)
    setManualIndex(next)
  }

  return (
    <div className="light-scrubber grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <div className="light-stage relative overflow-hidden border border-ink/15 bg-sand">
          <div className="relative aspect-[16/10] md:aspect-[16/9]">
            {lightPhases.map((item, itemIndex) => (
              <div
                key={item}
                className="light-frame"
                data-phase={item}
                data-active={itemIndex === index}
                style={{ backgroundImage: `url(${sources[item]})` }}
                aria-hidden="true"
              />
            ))}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4 md:p-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-ink/30 px-3 py-1.5 font-sans text-[0.5rem] uppercase tracking-[0.22em] text-cream/85 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
                {touched ? copy.preview : copy.live}
              </span>
              <span className="font-sans text-[0.5625rem] uppercase tracking-[0.2em] text-cream/75">
                {phaseTime[phase]} · {copy.phases[phase]}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
              <p className="font-sans text-[0.5rem] uppercase tracking-[0.24em] text-cream/60">
                {title}
              </p>
              <p className="mt-2 max-w-xl font-display text-xl leading-tight text-cream md:text-2xl">
                {copy.lines[phase]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <p className="kicker mb-5 text-taupe">{copy.move}</p>
        <SunPath
          value={index}
          labels={labels}
          label={`${copy.kicker} — ${title}`}
          onChange={move}
        />
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink/12 pt-4">
          <p className="font-sans text-[0.5625rem] uppercase tracking-[0.18em] text-muted">
            {copy.currentAt} {light.ready ? light.time : '--:--'}
          </p>
          <button
            type="button"
            onClick={() => setTouched(false)}
            className={cn(
              'link-underline font-sans text-[0.5625rem] uppercase tracking-[0.18em] transition-colors',
              touched ? 'text-ink' : 'text-muted',
            )}
          >
            {copy.now}
          </button>
        </div>
      </div>
    </div>
  )
}
