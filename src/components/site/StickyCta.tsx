'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { localePath, ui, type Locale } from '@/lib/i18n'

export function StickyCta({ locale }: { locale: Locale }) {
  const t = ui[locale]
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bare = (pathname ?? '/').replace(/^\/(en|fil)(?=\/|$)/, '') || '/'
  if (bare === '/contact') return null
  if (!visible) return null

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:inset-x-auto md:bottom-8 md:right-8">
      <Link
        href={localePath(locale, '/contact')}
        className="group flex items-center justify-between gap-5 rounded-full border border-ink/12 bg-cream/92 px-5 py-3 shadow-[0_18px_50px_-20px_rgba(10,11,9,0.45)] backdrop-blur-xl transition-colors hover:bg-cream md:border-ink md:bg-ink md:px-6 md:py-3.5 md:hover:bg-sage"
      >
        <span className="flex flex-col text-left md:flex-row md:items-center md:gap-4">
          <span className="font-sans text-[0.5rem] uppercase tracking-[0.22em] text-muted md:text-cream/55">
            {locale === 'fil' ? 'Sa pamamagitan ng appointment' : 'By appointment'}
          </span>
          <span className="font-display text-base leading-none text-ink md:text-cream">
            {t.cta.book}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:translate-x-0.5 md:bg-cream md:text-ink"
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
      </Link>
    </div>
  )
}
