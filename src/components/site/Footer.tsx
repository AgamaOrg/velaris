import Link from 'next/link'
import { localePath, ui, type Locale } from '@/lib/i18n'
import { homes } from '@/lib/content'
import { Reveal } from './Reveal'

export function Footer({ locale }: { locale: Locale }) {
  const t = ui[locale]

  const explore = [
    { label: t.nav.about, href: '/about' },
    { label: t.nav.residences, href: '/residences' },
    { label: t.nav.amenities, href: '/amenities' },
    { label: t.nav.location, href: '/location' },
    { label: t.nav.developer, href: '/developer' },
    { label: t.nav.news, href: '/news' },
  ]

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="shell relative z-10 border-b border-cream/15 py-16 md:py-20">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker mb-5 text-amber">{t.footer.enquiries}</p>
            <p className="display display-md max-w-xl text-cream">
              {locale === 'fil'
                ? 'Magsimula sa isang pribadong pagtingin.'
                : 'Begin with a private viewing.'}
            </p>
          </div>
          <Link
            href={localePath(locale, '/contact')}
            className="btn btn-cream w-fit"
          >
            {t.cta.book}
          </Link>
        </Reveal>
      </div>

      <div className="shell relative z-10 grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <p className="font-display text-2xl tracking-[0.2em]">VELARIS</p>
          <p className="mt-1 font-sans text-[0.5rem] font-medium tracking-[0.34em] text-cream/50">
            THE RESIDENCES
          </p>
          <p className="body-editorial mt-7 max-w-xs text-cream/60">
            {t.footer.tagline}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="kicker mb-6 text-cream/40">{t.footer.explore}</p>
          <ul className="space-y-3 font-sans text-sm">
            {explore.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  className="link-underline text-cream/70 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="kicker mb-6 text-cream/40">{t.footer.visit}</p>
          <address className="body-editorial not-italic text-cream/70">
            {homes.showGallery.address}
          </address>
          <p className="mt-4 font-sans text-xs tracking-wide text-cream/50">
            {homes.showGallery.hours[locale]}
          </p>
          <a
            href={`mailto:${homes.showGallery.email}`}
            className="link-underline mt-4 inline-block font-sans text-xs tracking-wide text-cream/70 hover:text-cream"
          >
            {homes.showGallery.email}
          </a>
        </div>

        <div className="md:col-span-2">
          <p className="kicker mb-6 text-cream/40">{t.footer.enquiries}</p>
          <a
            href={`tel:${homes.showGallery.phone.replace(/\s/g, '')}`}
            className="link-underline block font-sans text-sm text-cream/70 hover:text-cream"
          >
            {homes.showGallery.phone}
          </a>
          <Link
            href={localePath(locale, '/contact')}
            className="link-underline mt-4 block font-sans text-sm text-cream/70 hover:text-cream"
          >
            {t.cta.inquire}
          </Link>
        </div>
      </div>

      <div className="shell relative z-10 flex flex-col gap-4 border-t border-cream/15 py-7 font-sans text-[0.625rem] uppercase tracking-[0.18em] text-cream/40 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {homes.developer}. {t.footer.rights}
        </p>
        <div className="flex items-center gap-5">
          <span>{homes.address}</span>
          <a href="#top" className="transition-colors hover:text-cream">
            {t.footer.backToTop}
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[4vw] left-1/2 w-full -translate-x-1/2 select-none text-center font-display text-[20vw] leading-none tracking-[0.08em] text-cream/[0.035]"
      >
        VELARIS
      </div>
    </footer>
  )
}
