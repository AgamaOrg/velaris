import Link from 'next/link'
import { cn } from '@/lib/cn'

type ArrowLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  light?: boolean
}

export function ArrowLink({ href, children, className, light }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/arrow inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors',
        light ? 'text-cream hover:text-amber' : 'text-ink hover:text-sage',
        className,
      )}
    >
      <span className="link-underline">{children}</span>
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current transition-transform duration-500 group-hover/arrow:translate-x-1"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      </span>
    </Link>
  )
}
