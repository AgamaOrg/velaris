import { cn } from '@/lib/cn'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'

type Stat = {
  value: string
  label: string
}

export function StatBand({
  stats,
  className,
  light,
}: {
  stats: Stat[]
  className?: string
  light?: boolean
}) {
  return (
    <Reveal
      className={cn(
        'grid grid-cols-2 gap-y-12 border-y md:grid-cols-4',
        light ? 'border-cream/20' : 'border-ink/15',
        className,
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            'px-2 py-10 md:px-6',
            index % 2 === 1 && 'border-l',
            index > 1 && 'border-t md:border-t-0',
            index === 2 && 'md:border-l',
            light ? 'border-cream/20' : 'border-ink/15',
          )}
        >
          <p
            className={cn(
              'display text-4xl md:text-5xl',
              light ? 'text-cream' : 'text-ink',
            )}
          >
            <CountUp value={stat.value} />
          </p>
          <p
            className={cn(
              'kicker mt-3 text-[0.5625rem]',
              light ? 'text-cream/55' : 'text-muted',
            )}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </Reveal>
  )
}
