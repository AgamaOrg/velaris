'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { localePath, ui, type Locale } from '@/lib/i18n'
import { LightControl } from './light/LightControl'

function barePath(pathname: string | null): string {
  if (!pathname) return '/'
  const stripped = pathname.replace(/^\/(en|fil)(?=\/|$)/, '')
  return stripped === '' ? '/' : stripped
}

function Wordmark({ locale, light }: { locale: Locale; light?: boolean }) {
  return (
    <Link
      href={localePath(locale, '/')}
      className="group inline-flex items-center gap-3 leading-none"
      aria-label="The Velaris Residences — home"
    >
      <Image
        src="/dummy_pics/Frame.svg"
        alt=""
        width={73}
        height={131}
        priority
        className="h-10 w-auto md:h-12"
      />
      <span className="inline-grid leading-none">
        <span
          className={cn(
            'col-start-1 row-start-1 font-display text-[1.35rem] tracking-[0.22em] transition-colors md:text-[1.55rem]',
            light ? 'text-cream' : 'text-ink',
          )}
        >
          THE VELARIS
        </span>
        <span
          className={cn(
            'col-start-1 row-start-2 mt-1 flex justify-between font-sans text-[0.5rem] font-medium tracking-[0.34em]',
            light ? 'text-cream/55' : 'text-muted',
          )}
          aria-hidden="true"
        >
          {'RESIDENCES'.split('').map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </span>
      </span>
    </Link>
  )
}

function LocaleSwitch({ locale, light }: { locale: Locale; light?: boolean }) {
  const raw = usePathname()
  const bare = barePath(raw)
  const other: Locale = locale === 'en' ? 'fil' : 'en'
  const otherHref = other === 'fil' ? (bare === '/' ? '/fil' : `/fil${bare}`) : bare
  const currentHref = localePath(locale, bare)

  return (
    <div
      className={cn(
        'flex items-center gap-2 font-sans text-[0.625rem] font-medium tracking-[0.22em]',
        light ? 'text-cream/70' : 'text-muted',
      )}
      aria-label={ui[locale].header.language}
    >
      <Link
        href={currentHref}
        aria-current="true"
        className={cn(
          'transition-colors',
          light ? 'text-cream' : 'text-ink',
        )}
      >
        EN
      </Link>
      <span aria-hidden="true" className="opacity-30">
        /
      </span>
      <Link
        href={otherHref}
        className={cn(
          'transition-colors',
          light ? 'hover:text-cream' : 'hover:text-ink',
        )}
      >
        FIL
      </Link>
    </div>
  )
}

export function Header({ locale }: { locale: Locale }) {
  const t = ui[locale]
  const pathname = usePathname()
  const bare = barePath(pathname)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [landingReady, setLandingReady] = useState(bare !== '/')

  const items = [
    { label: t.nav.about, href: '/about' },
    { label: t.nav.residences, href: '/residences' },
    { label: t.nav.amenities, href: '/amenities' },
    { label: t.nav.location, href: '/location' },
    { label: t.nav.developer, href: '/developer' },
    { label: t.nav.news, href: '/news' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (bare !== '/') return

    if (document.documentElement.dataset.landingLoader === 'done') {
      const frame = window.requestAnimationFrame(() => setLandingReady(true))
      return () => window.cancelAnimationFrame(frame)
    }

    const onLandingReady = () => setLandingReady(true)
    window.addEventListener('landing-loader-done', onLandingReady)
    return () => window.removeEventListener('landing-loader-done', onLandingReady)
  }, [bare])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? bare === '/' : bare === href || bare.startsWith(`${href}/`)

  return (
    <>
      <header
        className={cn(
          bare === '/' && !landingReady && 'opacity-0 pointer-events-none',
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled
            ? 'border-b border-ink/10 bg-cream/88 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="shell flex h-20 items-center justify-between gap-6 md:h-24">
          <Wordmark locale={locale} />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {items.map((item) => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'nav-link font-sans text-[0.625rem] font-medium uppercase tracking-[0.2em] transition-colors',
                  isActive(item.href)
                    ? 'text-ink'
                    : 'text-muted hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <LightControl locale={locale} />
            <LocaleSwitch locale={locale} />
            <Link
              href={localePath(locale, '/contact')}
              className="btn btn-ink !min-h-11 !px-6 !text-[0.5625rem]"
            >
              {t.cta.book}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-ink/20 lg:hidden"
            aria-label={t.header.menu}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <span className="block h-px w-5 bg-ink" />
            <span className="block h-px w-5 bg-ink" />
          </button>
        </div>
      </header>

      {open ? (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.header.menu}
          className="fixed inset-0 z-[65] flex flex-col bg-sage-deep text-cream lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="shell flex h-20 items-center justify-between">
            <Wordmark locale={locale} light />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25"
              aria-label={t.header.close}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>

          <nav
            className="shell no-scrollbar flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-8"
            aria-label="Mobile"
          >
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="animate-fade-rise group flex items-baseline justify-between border-b border-cream/15 py-4"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <span className="display text-[2rem] leading-none">{item.label}</span>
                <span className="kicker text-[0.5625rem] text-cream/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </Link>
            ))}
          </nav>

          <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-cream/15 py-7">
            <div className="flex items-center gap-5">
              <LocaleSwitch locale={locale} light />
              <LightControl locale={locale} onDark />
            </div>
            <Link
              href={localePath(locale, '/contact')}
              className="btn btn-cream !min-h-11 !px-5 !text-[0.5625rem]"
            >
              {t.cta.book}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  )
}
