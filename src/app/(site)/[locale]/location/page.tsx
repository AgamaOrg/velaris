import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/site/CtaBand'
import { DistrictMap } from '@/components/site/DistrictMap'
import { EditorialSplit } from '@/components/site/EditorialSplit'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { connectivity, homes } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    title: locale === 'fil' ? 'Lokasyon' : 'Location',
    description:
      locale === 'fil'
        ? 'Ang Bridgetowne, Quezon City: ilog, berdeng daan, at maikling biyahe sa Ortigas, BGC, at Makati.'
        : 'Bridgetowne, Quezon City: river, green streets, and short journeys to Ortigas, BGC, and Makati.',
    alternates: {
      canonical: locale === 'fil' ? '/fil/location' : '/location',
      languages: {
        'en-PH': '/location',
        'fil-PH': '/fil/location',
        'x-default': '/location',
      },
    },
  }
}

export default async function LocationPage({
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
        kicker={t.nav.location}
        title={fil ? 'Nasa gitna ng lahat, ngunit hiwalay dito.' : 'At the centre of everything, held apart from it.'}
        intro={
          fil
            ? 'Ang Bridgetowne ay isang distritong nakaayos sa paligid ng ilog at mga berdeng daan — malapit sa lahat, ngunit may sariling ritmo.'
            : 'Bridgetowne is a district arranged around the river and green streets — close to everything, with a rhythm of its own.'
        }
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>Bridgetowne, Quezon City</span>
            <span>{fil ? '30 ektarya' : '30 hectares'}</span>
            <span>{fil ? 'Nakaharap sa ilog' : 'River-facing'}</span>
          </div>
        }
      />

      <section className="section shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <SectionHeading
            className="md:col-span-5"
            kicker={fil ? 'Ang distrito' : 'The district'}
            title={fil ? 'Isang lugar na may hangin at daan.' : 'A place with air and room.'}
            size="md"
          />
          <Reveal delay={120} className="md:col-span-6 md:col-start-7">
            <div className="body-editorial space-y-6 text-muted">
              <p>
                {fil
                  ? 'Ang Bridgetowne ay binuo sa paligid ng Pasig River at ng mga berdeng daan. Ito ay isang distrito na maaaring lakarin sa umaga at iwanan sa gabi.'
                  : 'Bridgetowne was built around the Pasig River and its green streets. It is a district you can walk in the morning and leave behind at night.'}
              </p>
              <p>
                {fil
                  ? 'Mula sa Velaris, ang Ortigas Center ay walong minuto, ang BGC ay labinlimang minuto, at ang Makati ay dalawampung minuto. Ang NAIA ay tatlumpu’t limang minuto.'
                  : 'From the Velaris, Ortigas Center is eight minutes, BGC is fifteen, and Makati is twenty. NAIA is thirty-five.'}
              </p>
            </div>
            <div className="mt-9">
              <Link href={localePath(locale, '/contact')} className="btn btn-ink">
                {t.cta.book}
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="mt-16 overflow-hidden border border-ink/15">
          <div className="aspect-[16/9]">
            <DistrictMap locale={locale} />
          </div>
        </Reveal>
      </section>

      <section className="section bg-cream-deep">
        <div className="shell">
          <SectionHeading
            kicker={fil ? 'Distansya' : 'Distances'}
            title={fil ? 'Malapit sa lahat ng mahalaga.' : 'Close to what matters.'}
            size="md"
          />
          <div className="mt-12 grid gap-x-12 gap-y-1 sm:grid-cols-2">
            {connectivity.map((item, index) => (
              <Reveal
                key={item.place}
                delay={index * 50}
                className="flex items-center justify-between gap-4 border-b border-ink/12 py-4"
              >
                <span className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-muted">
                  {item.place}
                </span>
                <span className="font-display text-xl">{item.time}</span>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 font-sans text-[0.5625rem] uppercase tracking-[0.18em] text-muted">
            {fil
              ? 'Tantiya sa oras ng biyahe. Maaaring mag-iba ayon sa trapiko.'
              : 'Estimated journey times. May vary with traffic.'}
          </p>
        </div>
      </section>

      <section className="section shell">
        <EditorialSplit
          kicker={t.labels.showGallery}
          title={fil ? 'Bisitahin ang show gallery.' : 'Visit the show gallery.'}
          body={
            <>
              <p>{homes.showGallery.address}</p>
              <p>{homes.showGallery.hours[locale]}</p>
              <p>
                {fil
                  ? 'Ang private viewing ay may kasamang paglalakad sa mga modelong yunit at sa mga hardin. Mag-book bago pumunta.'
                  : 'A private viewing includes a walk through the model residences and the grounds. Book ahead so the team can prepare.'}
              </p>
            </>
          }
          art="/dummy_pics/istockphoto-2223376026-612x612.jpg"
          ratio="landscape"
          reverse
          caption={fil ? 'The Velaris Show Gallery' : 'The Velaris Show Gallery'}
          cta={{ href: localePath(locale, '/contact'), label: t.cta.book }}
        />
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Pumunta at tingnan ang distrito.' : 'Come and see the district.'}
        body={
          fil
            ? 'Ang show gallery ay bukas mula Martes hanggang Linggo, 10:00 hanggang 18:00.'
            : 'The show gallery is open Tuesday to Sunday, 10:00 to 18:00.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/amenities', label: t.nav.amenities }}
        art="/dummy_pics/villa-features-1024x690.jpg"
      />
    </>
  )
}
