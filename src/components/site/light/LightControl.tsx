'use client'

import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { lightPhases, type LightOverride, type LightPhase } from '@/lib/light'
import { ui, type Locale } from '@/lib/i18n'
import { useLight } from './LightProvider'

const dots: Record<LightPhase, string> = {
  dawn: 'bg-peach',
  day: 'bg-amber',
  golden: 'bg-taupe',
  night: 'bg-sage',
}

export function LightControl({
  locale,
  onDark,
}: {
  locale: Locale
  onDark?: boolean
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const { light, override, setOverride } = useLight()
  const copy = ui[locale].light
  const options: LightOverride[] = ['auto', ...lightPhases]

  const choose = (value: LightOverride) => {
    setOverride(value)
    detailsRef.current?.removeAttribute('open')
  }

  return (
    <details
      ref={detailsRef}
      className="light-control relative"
      onClick={(event) => event.stopPropagation()}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-2 font-sans text-[0.625rem] uppercase tracking-[0.2em] transition-colors',
          onDark ? 'text-cream/60 hover:text-cream' : 'text-muted hover:text-ink',
        )}
      >
        <span
          aria-hidden="true"
          className={cn('h-1.5 w-1.5 rounded-full', dots[light.phase])}
        />
        <span className={cn(light.ready ? 'opacity-100' : 'opacity-70')}>
          {light.ready ? light.time : copy.hint}
        </span>
        <span
          className={cn(
            'hidden xl:inline',
            onDark ? 'text-cream/40' : 'text-muted/70',
          )}
        >
          {light.ready ? copy.phases[light.phase] : ''}
        </span>
      </summary>

      <div
        className={cn(
          'absolute right-0 z-50 mt-4 w-60 border p-2 shadow-[0_24px_60px_-24px_rgba(10,11,9,0.5)]',
          onDark
            ? 'border-cream/20 bg-sage-deep text-cream'
            : 'border-ink/12 bg-cream text-ink',
        )}
      >
        <p
          className={cn(
            'px-3 pb-2 pt-2 font-sans text-[0.5rem] uppercase tracking-[0.24em]',
            onDark ? 'text-cream/45' : 'text-muted',
          )}
        >
          {copy.hint}
        </p>
        {options.map((option) => {
          const active = override === option
          const label =
            option === 'auto' ? copy.auto : copy.phases[option]

          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              aria-pressed={active}
              className={cn(
                'flex w-full items-center justify-between gap-4 px-3 py-2.5 text-left font-sans text-[0.625rem] uppercase tracking-[0.18em] transition-colors',
                onDark
                  ? active
                    ? 'bg-cream/10 text-cream'
                    : 'text-cream/60 hover:bg-cream/5 hover:text-cream'
                  : active
                    ? 'bg-ink/5 text-ink'
                    : 'text-muted hover:bg-ink/5 hover:text-ink',
              )}
            >
              <span>{label}</span>
              {option !== 'auto' ? (
                <span
                  aria-hidden="true"
                  className={cn('h-1.5 w-1.5 rounded-full', dots[option])}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-sans text-[0.5rem] tracking-[0.2em]',
                    onDark ? 'text-cream/30' : 'text-muted/50',
                  )}
                >
                  24H
                </span>
              )}
            </button>
          )
        })}
      </div>
    </details>
  )
}
