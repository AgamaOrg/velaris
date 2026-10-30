import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

type PageHeroProps = {
  kicker: string
  title: React.ReactNode
  intro?: React.ReactNode
  art?: string
  tone?: 'cream' | 'sand' | 'peach'
  dark?: boolean
  tall?: boolean
  meta?: React.ReactNode
  children?: React.ReactNode
}

export function PageHero({
  kicker,
  title,
  intro,
  tall = false,
  meta,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'hero-fade relative flex min-h-[68svh] flex-col overflow-hidden bg-sand pt-32 text-ink',
        tall && 'min-h-[88svh]',
      )}
    >
      <div className="relative z-10 shell flex flex-1 flex-col justify-end pb-12">
        <div className="max-w-5xl">
          <Reveal>
            <p className="kicker mb-6 text-taupe">{kicker}</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display display-xl text-balance">{title}</h1>
          </Reveal>
          {intro ? (
            <Reveal delay={180}>
              <p className="lede mt-8 max-w-2xl text-muted">{intro}</p>
            </Reveal>
          ) : null}
          {children ? (
            <Reveal delay={260} className="mt-10">
              {children}
            </Reveal>
          ) : null}
        </div>
      </div>

      {meta ? (
        <div className="relative z-10 shell border-t border-ink/15 pb-7 pt-5 text-muted">
          {meta}
        </div>
      ) : null}
    </section>
  )
}
