'use client'

import { useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import { FloorPlan } from './FloorPlan'

export function FloorPlanViewer({
  variant,
  label,
  locale,
}: {
  variant: 'a' | 'b' | 'c'
  label: string
  locale: Locale
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [zoom, setZoom] = useState(1)

  const copy =
    locale === 'fil'
      ? {
          open: 'Palakihin ang plano',
          title: 'Indikasyon ng plano',
          zoomIn: 'Palakihin',
          zoomOut: 'Paliitin',
          reset: 'I-reset',
          close: 'Isara',
          download: 'I-download ang high-resolution na plano',
        }
      : {
          open: 'Expand floor plan',
          title: 'Indicative floor plan',
          zoomIn: 'Zoom in',
          zoomOut: 'Zoom out',
          reset: 'Reset',
          close: 'Close',
          download: 'Download high-resolution plan',
        }

  const open = () => {
    setZoom(1)
    dialogRef.current?.showModal()
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="group relative block w-full cursor-zoom-in overflow-hidden border border-ink/15 bg-cream-deep p-6 text-ink md:p-10"
        aria-label={copy.open}
      >
        <FloorPlan variant={variant} label={label} className="max-h-[26rem]" />
        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-cream/80 px-3 py-1.5 font-sans text-[0.5rem] uppercase tracking-[0.2em] backdrop-blur">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" stroke="currentColor" strokeWidth="1" />
          </svg>
          {copy.open}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close()
        }}
        className="m-auto w-[min(94vw,80rem)] bg-cream p-0 text-ink backdrop:bg-ink/80"
        aria-label={`${label} — ${copy.title}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ink/12 px-5 py-4 md:px-8">
          <div>
            <p className="kicker text-[0.5625rem] text-taupe">{copy.title}</p>
            <p className="mt-1 font-display text-lg md:text-xl">{label}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(1, Number((value - 0.25).toFixed(2))))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink/5"
              aria-label={copy.zoomOut}
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(2.5, Number((value + 0.25).toFixed(2))))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink/5"
              aria-label={copy.zoomIn}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="hidden h-9 items-center justify-center rounded-full border border-ink/20 px-4 font-sans text-[0.5rem] uppercase tracking-[0.18em] transition-colors hover:bg-ink/5 sm:flex"
            >
              {copy.reset}
            </button>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream"
              aria-label={copy.close}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-[68vh] overflow-auto p-5 md:p-8">
          <div
            className="mx-auto origin-top transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, width: '100%' }}
          >
            <FloorPlan variant={variant} label={label} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink/12 px-5 py-4 md:px-8">
          <p className="font-sans text-[0.5625rem] uppercase tracking-[0.18em] text-muted">
            {label}
          </p>
          <a
            href={`/art/floorplan-${variant}.svg`}
            download
            className="link-underline font-sans text-[0.5625rem] uppercase tracking-[0.18em] text-ink"
          >
            {copy.download}
          </a>
        </div>
      </dialog>
    </>
  )
}
