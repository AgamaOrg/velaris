import { cn } from '@/lib/cn'
import { ArrowLink } from './ArrowLink'
import { Reveal } from './Reveal'

type EditorialSplitProps = {
  kicker: string
  title: React.ReactNode
  body: React.ReactNode
  art: string
  reverse?: boolean
  cta?: { href: string; label: string }
  caption?: string
  ratio?: 'portrait' | 'square' | 'landscape'
  light?: boolean
}

export function EditorialSplit({
  kicker,
  title,
  body,
  art,
  reverse,
  cta,
  caption,
  ratio = 'portrait',
  light,
}: EditorialSplitProps) {
  const ratioClass =
    ratio === 'portrait'
      ? 'aspect-[4/5]'
      : ratio === 'square'
        ? 'aspect-square'
        : 'aspect-[5/4]'

  return (
    <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
      <Reveal
        className={cn(
          'md:col-span-6',
          reverse ? 'md:order-2 md:col-start-7' : 'md:order-1',
        )}
      >
        <div className={cn('group relative overflow-hidden bg-sand', ratioClass)}>
          <div
            className="media-cover media-hover absolute inset-0"
            style={{ backgroundImage: `url(${art})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
            aria-hidden="true"
          />
          {caption ? (
            <p className="absolute bottom-5 left-5 right-5 font-sans text-[0.5625rem] uppercase tracking-[0.22em] text-cream/80">
              {caption}
            </p>
          ) : null}
        </div>
      </Reveal>

      <Reveal
        delay={120}
        className={cn(
          'md:col-span-5',
          reverse ? 'md:order-1 md:col-start-1' : 'md:order-2 md:col-start-8',
        )}
      >
        <p className={cn('kicker mb-6', light ? 'text-amber' : 'text-taupe')}>
          {kicker}
        </p>
        <h2
          className={cn(
            'display display-md text-balance',
            light ? 'text-cream' : 'text-ink',
          )}
        >
          {title}
        </h2>
        <div
          className={cn(
            'body-editorial mt-7 space-y-5',
            light ? 'text-cream/70' : 'text-muted',
          )}
        >
          {body}
        </div>
        {cta ? (
          <div className="mt-9">
            <ArrowLink href={cta.href} light={light}>
              {cta.label}
            </ArrowLink>
          </div>
        ) : null}
      </Reveal>
    </div>
  )
}
