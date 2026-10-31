import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

type SectionHeadingProps = {
  kicker?: string
  title: React.ReactNode
  intro?: React.ReactNode
  align?: 'left' | 'center'
  light?: boolean
  className?: string
  size?: 'md' | 'lg'
}

export function SectionHeading({
  kicker,
  title,
  intro,
  align = 'left',
  light,
  className,
  size = 'lg',
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'max-w-4xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {kicker ? (
        <p
          className={cn(
            'kicker mb-6',
            light ? 'text-amber' : 'text-taupe',
            align === 'center' && 'eyebrow-rule justify-center',
          )}
        >
          {kicker}
        </p>
      ) : null}
      <h2
        className={cn(
          'display',
          size === 'lg' ? 'display-lg' : 'display-md',
          light ? 'text-cream' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {intro ? (
        <div
          className={cn(
            'body-editorial mt-7 max-w-2xl',
            light ? 'text-cream/72' : 'text-muted',
            align === 'center' && 'mx-auto',
          )}
        >
          {intro}
        </div>
      ) : null}
    </Reveal>
  )
}
