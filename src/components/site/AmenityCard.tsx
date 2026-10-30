import { cn } from '@/lib/cn'
import { pick, type Amenity } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { Reveal } from './Reveal'

export function AmenityCard({
  amenity,
  locale,
  index,
  light,
}: {
  amenity: Amenity
  locale: Locale
  index: number
  light?: boolean
}) {
  return (
    <Reveal
      delay={index * 70}
      className={cn('group border-t pt-6', light ? 'border-cream/20' : 'border-ink/15')}
    >
      <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-sand">
        <div
          className="media-cover media-hover absolute inset-0"
          style={{ backgroundImage: `url(${amenity.art})` }}
          aria-hidden="true"
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={cn('display display-sm', light ? 'text-cream' : 'text-ink')}>
          {pick(amenity.title, locale)}
        </h3>
        <span className={cn('kicker text-[0.5625rem]', light ? 'text-amber' : 'text-taupe')}>
          {amenity.number}
        </span>
      </div>
      <p className={cn('body-editorial mt-4', light ? 'text-cream/65' : 'text-muted')}>
        {pick(amenity.body, locale)}
      </p>
    </Reveal>
  )
}
