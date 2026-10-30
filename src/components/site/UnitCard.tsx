import Link from 'next/link'
import { cn } from '@/lib/cn'
import { pick, type Tone, type Unit } from '@/lib/content'
import { localePath, ui, type Locale } from '@/lib/i18n'
import { FloorPlan } from './FloorPlan'

const tones: Record<Tone, { className: string; dark: boolean }> = {
  sage: { className: 'bg-sage text-cream', dark: true },
  taupe: { className: 'bg-taupe text-cream', dark: true },
  amber: { className: 'bg-amber text-ink', dark: false },
  peach: { className: 'bg-peach text-ink', dark: false },
  sand: { className: 'bg-sand text-ink', dark: false },
  ink: { className: 'bg-ink text-cream', dark: true },
}

export function UnitCard({
  unit,
  locale,
  index,
}: {
  unit: Unit
  locale: Locale
  index: number
}) {
  const t = ui[locale]
  const tone = tones[unit.tone]

  return (
    <Link
      href={localePath(locale, `/residences/${unit.slug}`)}
      className={cn(
        'group sheen relative flex min-h-[25rem] flex-col justify-between overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1 md:p-7',
        tone.className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.18] transition-transform duration-700 group-hover:scale-105"
        aria-hidden="true"
      >
        <FloorPlan
          variant={unit.plan}
          compact
          className="w-[88%] max-w-[22rem]"
        />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-sans text-[0.5625rem] uppercase tracking-[0.22em] opacity-65">
          {pick(unit.tower, locale)}
        </span>
        <span className="font-sans text-[0.5625rem] uppercase tracking-[0.22em] opacity-55">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative">
        <h3 className="display display-sm">{pick(unit.name, locale)}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-sans text-[0.625rem] uppercase tracking-[0.16em] opacity-70">
          <span>
            {unit.beds} {t.labels.bedrooms.toLowerCase()}
          </span>
          <span>
            {unit.total} m²
          </span>
          <span>{pick(unit.outlook, locale)}</span>
        </div>
        <div
          className={cn(
            'mt-5 flex items-center justify-between border-t pt-4',
            tone.dark ? 'border-cream/20' : 'border-ink/15',
          )}
        >
          <span className="font-sans text-[0.5625rem] uppercase tracking-[0.2em] opacity-60">
            {t.cta.discover}
          </span>
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current/40 transition-transform duration-500 group-hover:translate-x-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
