import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/site/ContactForm'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { homes, pick, team, units } from '@/lib/content'
import { isLocale, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    title: locale === 'fil' ? 'Makipag-ugnayan' : 'Contact',
    description:
      locale === 'fil'
        ? 'Mag-book ng pribadong pagtingin sa The Velaris Show Gallery sa Bridgetowne, Quezon City.'
        : 'Book a private viewing at The Velaris Show Gallery in Bridgetowne, Quezon City.',
    alternates: {
      canonical: locale === 'fil' ? '/fil/contact' : '/contact',
      languages: {
        'en-PH': '/contact',
        'fil-PH': '/fil/contact',
        'x-default': '/contact',
      },
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw
  const t = ui[locale]
  const fil = locale === 'fil'

  return (
    <>
      <PageHero
        kicker={t.cta.book}
        title={fil ? 'Halina at tingnan nang personal.' : 'Come and see it in person.'}
        intro={
          fil
            ? 'Ang private viewing ay isang oras kasama ang isang advisor, ang mga modelong yunit, at ang mga hardin. Walang presyon, walang obligasyon.'
            : 'A private viewing is an hour with an advisor, the model residences, and the grounds. No pressure, no obligation.'
        }
        tone="cream"
        layout="split-reverse"
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>{fil ? 'Martes–Linggo' : 'Tuesday–Sunday'}</span>
            <span>10:00 — 18:00</span>
            <span>Bridgetowne, Quezon City</span>
          </div>
        }
      />

      <section className="section shell">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <ContactForm
              locale={locale}
              interests={units.map((unit) => pick(unit.name, locale))}
            />
          </div>

          <Reveal delay={140} className="md:col-span-4 md:col-start-9">
            <p className="kicker mb-6 text-taupe">{t.labels.showGallery}</p>
            <address className="body-editorial not-italic text-ink">
              {homes.showGallery.address}
            </address>

            <div className="mt-8 space-y-5 border-t border-ink/12 pt-6">
              <div>
                <p className="field-label">{t.labels.hours}</p>
                <p className="font-display text-lg">{homes.showGallery.hours[locale]}</p>
              </div>
              <div>
                <p className="field-label">{fil ? 'Telepono' : 'Telephone'}</p>
                <a
                  href={`tel:${homes.showGallery.phone.replace(/\s/g, '')}`}
                  className="link-underline font-display text-lg"
                >
                  {homes.showGallery.phone}
                </a>
              </div>
              <div>
                <p className="field-label">Email</p>
                <a
                  href={`mailto:${homes.showGallery.email}`}
                  className="link-underline break-all font-display text-base"
                >
                  {homes.showGallery.email}
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-ink/12 pt-6">
              <p className="body-editorial text-sm text-muted">
                {fil
                  ? 'Para sa mga penthouse at maraming tirahang tanong, maaari kang humiling na makausap ang Private Client Director.'
                  : 'For penthouse and multiple-residence enquiries, you may ask to speak with the Private Client Director.'}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-cream-deep">
        <div className="shell">
          <SectionHeading
            kicker={t.labels.team}
            title={fil ? 'Kilalanin ang team na makakasama mo.' : 'Meet the team you will work with.'}
            intro={
              fil
                ? 'Ang bawat pagtingin ay pinamumunuan ng isang advisor na makakasama mo mula sa unang tanong hanggang sa paghahatid.'
                : 'Every viewing is led by an advisor who stays with you from the first question through handover.'
            }
          />

          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 70} className="border-t border-ink/15 pt-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage font-display text-lg text-cream">
                  {member.initials}
                </span>
                <h3 className="display display-sm mt-5">{member.name}</h3>
                <p className="kicker mt-2 text-[0.5rem] text-taupe">
                  {pick(member.role, locale)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pick(member.line, locale)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <Reveal className="relative overflow-hidden border border-ink/15">
          <div
            className="media-cover aspect-[16/9]"
            style={{ backgroundImage: "url('/dummy_pics/villa-features-1024x690.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-cream md:flex-row md:items-end md:justify-between md:p-10">
            <div>
              <p className="kicker text-amber">{t.labels.showGallery}</p>
              <p className="display display-sm mt-3 max-w-xl text-cream">
                {homes.showGallery.address}
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Bridgetowne+Quezon+City"
              target="_blank"
              rel="noreferrer"
              className="btn btn-cream w-fit"
            >
              {t.labels.directions}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
