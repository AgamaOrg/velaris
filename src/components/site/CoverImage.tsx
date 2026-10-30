import Image from 'next/image'
import { cn } from '@/lib/cn'

export function CoverImage({
  src,
  alt = '',
  sizes = '100vw',
  priority,
  className,
}: {
  src: string
  alt?: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
    />
  )
}
