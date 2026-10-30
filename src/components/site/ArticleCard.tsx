import Link from 'next/link'
import { cn } from '@/lib/cn'
import { pick, type NewsPost } from '@/lib/content'
import { localePath, ui, type Locale } from '@/lib/i18n'

function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fil' ? 'fil-PH' : 'en-PH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export function ArticleCard({
  post,
  locale,
  featured,
}: {
  post: NewsPost
  locale: Locale
  featured?: boolean
}) {
  const t = ui[locale]

  return (
    <Link
      href={localePath(locale, `/news/${post.slug}`)}
      className={cn('group flex flex-col', featured && 'md:flex-row md:items-center md:gap-12')}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-sand',
          featured ? 'aspect-[5/4] md:w-1/2' : 'aspect-[4/3]',
        )}
      >
        <div
          className="media-cover media-hover absolute inset-0"
          style={{ backgroundImage: `url(${post.art})` }}
          aria-hidden="true"
        />
      </div>
      <div className={cn('flex flex-1 flex-col pt-5', featured && 'md:py-2')}>
        <div className="flex items-center gap-4 font-sans text-[0.5625rem] uppercase tracking-[0.22em] text-taupe">
          <span>{pick(post.category, locale)}</span>
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
          <span className="text-muted">{formatDate(post.date, locale)}</span>
        </div>
        <h3
          className={cn(
            'display mt-4 text-balance',
            featured ? 'display-md' : 'display-sm',
          )}
        >
          {pick(post.title, locale)}
        </h3>
        <p className="body-editorial mt-4 text-muted">
          {pick(post.excerpt, locale)}
        </p>
        <span className="mt-6 inline-flex items-center gap-3 font-sans text-[0.5625rem] uppercase tracking-[0.2em] text-ink/60 transition-colors group-hover:text-ink">
          {t.cta.readMore}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
