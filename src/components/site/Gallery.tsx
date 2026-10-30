import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

export type GalleryItem = {
  art: string
  caption?: string
  title?: string
}

export function Gallery({
  items,
  className,
  tall,
}: {
  items: GalleryItem[]
  className?: string
  tall?: boolean
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6',
        className,
      )}
    >
      {items.map((item, index) => {
        const featured = items.length > 3 && index === 0
        return (
          <Reveal
            key={`${item.art}-${index}`}
            delay={index * 70}
            className={cn(
              'group sheen relative overflow-hidden bg-sand',
              featured && 'col-span-2 row-span-2',
              tall ? 'aspect-[3/4]' : 'aspect-square',
              featured && tall && 'aspect-auto',
            )}
          >
            <div
              className="media-cover media-hover absolute inset-0"
              style={{ backgroundImage: `url(${item.art})` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90"
              aria-hidden="true"
            />
            {item.title || item.caption ? (
              <div className="absolute inset-x-0 bottom-0 translate-y-1 p-4 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-6">
                {item.caption ? (
                  <p className="font-sans text-[0.5rem] uppercase tracking-[0.24em] text-cream/70">
                    {item.caption}
                  </p>
                ) : null}
                {item.title ? (
                  <p className="mt-1.5 font-display text-lg leading-tight text-cream md:text-xl">
                    {item.title}
                  </p>
                ) : null}
              </div>
            ) : null}
          </Reveal>
        )
      })}
    </div>
  )
}
