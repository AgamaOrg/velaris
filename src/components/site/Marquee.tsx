import { cn } from '@/lib/cn'

export function Marquee({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const repeated = Array.from({ length: 6 }, (_, index) => (
    <span key={index} className="inline-flex items-center gap-10 pr-10">
      <span>{text}</span>
      <span aria-hidden="true" className="text-amber">
        ✦
      </span>
    </span>
  ))

  return (
    <div
      className={cn(
        'overflow-hidden border-y border-ink/12 py-5 font-display text-xl uppercase tracking-[0.12em] text-ink/70 md:text-2xl',
        className,
      )}
    >
      <div className="flex w-max animate-marquee">
        <div className="flex shrink-0 items-center">{repeated}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {repeated}
        </div>
      </div>
    </div>
  )
}
