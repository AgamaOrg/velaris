import Link from 'next/link'
import { cn } from '@/lib/cn'
import { localePath, type Locale } from '@/lib/i18n'
import { CoverImage } from './CoverImage'
import { Reveal } from './Reveal'

type CtaBandProps = {
  locale: Locale
  kicker: string
  title: React.ReactNode
  body?: React.ReactNode
  art?: string
  primary: { href: string; label: string }
  secondary?: { href: string; label: string }
}

export function CtaBand({
  locale,
  kicker,
  title,
  body,
  art = '/dummy_pics/villa-features-1024x690.jpg',
  primary,
  secondary,
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-sage-deep text-cream">
      <CoverImage src={art} sizes="100vw" className="opacity-25" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-sage-deep via-sage-deep/85 to-sage-deep/40"
        aria-hidden="true"
      />
      <div className="shell relative z-10 flex flex-col gap-12 py-24 md:flex-row md:items-end md:justify-between md:py-36">
        <Reveal className="max-w-3xl">
          <p className="kicker mb-6 text-amber">{kicker}</p>
          <h2 className="display display-lg text-cream text-balance">{title}</h2>
          {body ? (
            <p className="lede mt-7 max-w-xl text-cream/70">{body}</p>
          ) : null}
        </Reveal>
        <Reveal delay={140} className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <Link href={localePath(locale, primary.href)} className="btn btn-cream">
            {primary.label}
          </Link>
          {secondary ? (
            <Link
              href={localePath(locale, secondary.href)}
              className={cn('btn', 'btn-outline-light')}
            >
              {secondary.label}
            </Link>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
