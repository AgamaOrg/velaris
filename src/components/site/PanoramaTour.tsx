'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import type { Locale } from '@/lib/i18n'

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function PanoramaTour({
  poster,
  panorama,
  title,
  locale,
}: {
  poster: string
  panorama: string
  title: string
  locale: Locale
}) {
  const [active, setActive] = useState(false)
  const [offset, setOffset] = useState(50)
  const [fallback, setFallback] = useState(false)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ startX: number; startOffset: number } | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const copy =
    locale === 'fil'
      ? {
          badge: '360° na pagtingin',
          play: 'Simulan ang 360° tour',
          hint: 'I-drag upang tumingin sa paligid',
          left: 'Tumingin sa kaliwa',
          right: 'Tumingin sa kanan',
          fallback: 'Gumamit ng still images',
          back: 'Bumalik sa 360° tour',
          stills: 'Mga still image ng tirahan',
          close: 'Isara',
        }
      : {
          badge: '360° tour',
          play: 'Open the 360° tour',
          hint: 'Drag to look around',
          left: 'Look left',
          right: 'Look right',
          fallback: 'Use still images instead',
          back: 'Return to the 360° tour',
          stills: 'Still views of the residence',
          close: 'Close',
        }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { startX: event.clientX, startOffset: offset }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const width = viewportRef.current?.clientWidth ?? window.innerWidth
    const delta = ((event.clientX - drag.current.startX) / width) * 100
    setOffset(clamp(drag.current.startOffset - delta, 0, 100))
  }

  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setOffset((value) => clamp(value - 5, 0, 100))
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setOffset((value) => clamp(value + 5, 0, 100))
    }
  }

  return (
    <div className="overflow-hidden border border-ink/15 bg-ink text-cream">
      <div className="relative aspect-[16/10] md:aspect-[21/9]">
        {!active ? (
          <>
            <div
              className="media-cover absolute inset-0"
              style={{ backgroundImage: `url(${poster})` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/25"
              aria-hidden="true"
            />
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-cream/30 bg-ink/35 px-3 py-1.5 font-sans text-[0.5rem] uppercase tracking-[0.22em] text-cream/85 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
              {copy.badge}
            </span>
            <button
              type="button"
              onClick={() => setActive(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-5"
              aria-label={`${copy.play} — ${title}`}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-cream/45 bg-cream/10 backdrop-blur transition-all duration-500 group-hover:scale-105 group-hover:bg-cream/20 md:h-24 md:w-24">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M9 6.5 20 13 9 19.5V6.5Z" fill="currentColor" />
                </svg>
              </span>
              <span className="font-sans text-[0.5625rem] uppercase tracking-[0.24em] text-cream/80">
                {copy.play}
              </span>
            </button>
            <p className="absolute bottom-5 left-5 right-5 font-display text-xl leading-tight text-cream md:text-2xl">
              {title}
            </p>
          </>
        ) : (
          <div
            ref={viewportRef}
            role="img"
            tabIndex={0}
            aria-label={`${copy.badge} — ${title}. ${copy.hint}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onKeyDown={onKeyDown}
            className={cn(
              'absolute inset-0 select-none overflow-hidden outline-none',
              dragging ? 'cursor-grabbing' : 'cursor-grab',
            )}
            style={{ touchAction: 'none' }}
          >
            <div
              className="absolute inset-y-0 left-0 w-[200%]"
              style={{
                backgroundImage: `url(${panorama})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translateX(-${offset / 2}%)`,
                transition: dragging ? 'none' : 'transform 250ms ease-out',
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-ink/20"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-ink/80 to-transparent p-4 md:p-5">
              <span className="font-sans text-[0.5625rem] uppercase tracking-[0.22em] text-cream/70">
                {copy.hint}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOffset((value) => clamp(value - 8, 0, 100))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 transition-colors hover:bg-cream/15"
                  aria-label={copy.left}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M11 6H1M5.5 1.5 1 6l4.5 4.5" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setOffset((value) => clamp(value + 8, 0, 100))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 transition-colors hover:bg-cream/15"
                  aria-label={copy.right}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setActive(false)}
                  className="ml-1 hidden h-9 items-center rounded-full border border-cream/30 px-4 font-sans text-[0.5rem] uppercase tracking-[0.18em] transition-colors hover:bg-cream/15 sm:flex"
                >
                  {copy.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-cream/15 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-[0.5625rem] uppercase tracking-[0.22em] text-cream/50">
          {fallback ? copy.stills : copy.hint}
        </p>
        <button
          type="button"
          onClick={() => setFallback((value) => !value)}
          className="link-underline w-fit font-sans text-[0.5625rem] uppercase tracking-[0.18em] text-cream/80 transition-colors hover:text-cream"
        >
          {fallback ? copy.back : copy.fallback}
        </button>
      </div>

      {fallback ? (
        <div className="grid grid-cols-3 gap-px bg-cream/15">
          {[poster, panorama, '/art/residences.svg'].map((image) => (
            <div key={image} className="relative aspect-[4/3] bg-ink">
              <div
                className="media-cover absolute inset-0"
                style={{ backgroundImage: `url(${image})` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
