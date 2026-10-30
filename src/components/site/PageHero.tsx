import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

type PageHeroLayout =
  | 'editorial'
  | 'split'
  | 'split-reverse'
  | 'center'
  | 'poster'
  | 'top'

type PageHeroProps = {
  kicker: string
  title: React.ReactNode
  intro?: React.ReactNode
  tone?: 'cream' | 'sand' | 'peach'
  dark?: boolean
  tall?: boolean
  meta?: React.ReactNode
  children?: React.ReactNode
  layout?: PageHeroLayout
}

export function PageHero({
  kicker,
  title,
  intro,
  tone = 'sand',
  dark = false,
  tall = false,
  meta,
  children,
  layout = 'editorial',
}: PageHeroProps) {
  const centered = layout === 'center'
  const compact = layout === 'top' || layout === 'poster'
  const split = layout === 'split' || layout === 'split-reverse'

  const toneClass = dark
    ? 'bg-ink text-cream'
    : tone === 'cream'
      ? 'bg-cream text-ink'
      : tone === 'peach'
        ? 'bg-peach text-ink'
        : 'bg-sand text-ink'

  const titleSize =
    layout === 'split' || layout === 'split-reverse' || layout === 'top'
      ? 'display-lg'
      : 'display-xl'

  const kickerEl = (
    <Reveal variant="fade">
      <p
        className={cn(
          'kicker mb-6',
          dark ? 'text-amber' : 'text-taupe',
          centered && 'eyebrow-rule justify-center',
        )}
      >
        {kicker}
      </p>
    </Reveal>
  )

  const titleEl = (
    <Reveal variant="clip" delay={90}>
      <h1 className={cn('display text-balance', titleSize)}>{title}</h1>
    </Reveal>
  )

  const introEl = intro ? (
    <Reveal delay={180}>
      <p
        className={cn(
          'lede',
          dark ? 'text-cream/70' : 'text-muted',
          centered && 'mx-auto mt-8 max-w-2xl',
          layout === 'editorial' && 'mt-8 max-w-2xl',
          split && 'max-w-md',
          compact && 'mt-5 max-w-xl',
        )}
      >
        {intro}
      </p>
    </Reveal>
  ) : null

  const childrenEl = children ? (
    <Reveal delay={260} className="mt-8">
      {children}
    </Reveal>
  ) : null

  const renderContent = () => {
    if (layout === 'split' || layout === 'split-reverse') {
      const reverse = layout === 'split-reverse'
      return (
        <div className="relative z-10 shell flex flex-1 items-end pb-12">
          <div className="grid w-full gap-10 md:grid-cols-12 md:gap-12">
            <div
              className={cn(
                'md:col-span-7',
                reverse && 'md:order-2 md:col-start-6',
              )}
            >
              {kickerEl}
              {titleEl}
            </div>
            <div
              className={cn(
                'flex flex-col justify-end md:col-span-4 md:border-current/15',
                reverse
                  ? 'md:order-1 md:col-start-1 md:border-r md:pr-8'
                  : 'md:col-start-9 md:border-l md:pl-8',
              )}
            >
              {introEl}
              {childrenEl}
            </div>
          </div>
        </div>
      )
    }

    if (layout === 'center') {
      return (
        <div className="relative z-10 shell flex flex-1 flex-col items-center justify-center pb-14 pt-6 text-center">
          <div className="max-w-5xl">
            {kickerEl}
            {titleEl}
            {introEl}
            {childrenEl}
          </div>
        </div>
      )
    }

    if (layout === 'poster') {
      return (
        <div className="relative z-10 shell flex flex-1 flex-col justify-between gap-12 pb-10 pt-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {kickerEl}
            <div className="max-w-sm md:text-right">
              {introEl}
              {childrenEl}
            </div>
          </div>
          <div>{titleEl}</div>
        </div>
      )
    }

    if (layout === 'top') {
      return (
        <div className="relative z-10 shell flex flex-1 flex-col justify-start pb-12 pt-2">
          <div className="w-full max-w-5xl border-t border-current/15 pt-8">
            {kickerEl}
            {titleEl}
            {introEl}
            {childrenEl}
          </div>
        </div>
      )
    }

    return (
      <div className="relative z-10 shell flex flex-1 flex-col justify-end pb-12">
        <div className="max-w-5xl">
          {kickerEl}
          {titleEl}
          {introEl}
          {childrenEl}
        </div>
      </div>
    )
  }

  return (
    <section
      className={cn(
        'page-hero relative flex min-h-[68svh] flex-col overflow-hidden pt-32',
        toneClass,
        tall && 'min-h-[88svh]',
        layout === 'top' && 'min-h-[54svh]',
      )}
    >
      <div
        className={cn(
          'page-hero-scrim',
          dark ? 'page-hero-scrim-dark' : 'page-hero-scrim-light',
        )}
        aria-hidden="true"
      />

      {renderContent()}

      {meta ? (
        <div
          className={cn(
            'relative z-10 shell border-t pb-7 pt-5',
            dark
              ? 'border-cream/15 text-cream/60'
              : 'border-ink/15 text-muted',
          )}
        >
          <div
            className={cn(
              centered && 'flex [&>*]:w-full [&>*]:justify-center',
            )}
          >
            {meta}
          </div>
        </div>
      ) : null}
    </section>
  )
}
