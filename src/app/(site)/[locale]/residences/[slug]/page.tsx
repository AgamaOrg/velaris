import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/site/CtaBand'
import { FloorPlanViewer } from '@/components/site/FloorPlanViewer'
import { Gallery } from '@/components/site/Gallery'
import { PageHero } from '@/components/site/PageHero'
import { PanoramaTour } from '@/components/site/PanoramaTour'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { UnitCard } from '@/components/site/UnitCard'
import { pick, units } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale = isLocale(raw) ? raw : 'en'
  const unit = units.find((item) => item.slug === slug)
  if (!unit) return {}
  return {
    title: pick(unit.name, locale),
    description: pick(unit.summary, locale),
    alternates: {
      canonical: locale === 'fil' ? `/fil/residences/${slug}` : `/residences/${slug}`,
      languages: {
        'en-PH': `/residences/${slug}`,
        'fil-PH': `/fil/residences/${slug}`,
        'x-default': `/residences/${slug}`,
      },
    },
  }
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw
  const unit = units.find((item) => item.slug === slug)
  if (!unit) notFound()

  const t = ui[locale]
  const fil = locale === 'fil'
  const name = pick(unit.name, locale)

  const specs = [
    { label: t.labels.interior, value: `${unit.interior} m²` },
    { label: t.labels.balcony, value: `${unit.balcony} m²` },
    { label: t.labels.total, value: `${unit.total} m²` },
    { label: t.labels.ceiling, value: unit.ceiling },
    { label: t.labels.outlook, value: pick(unit.outlook, locale) },
  ]

  const related = units.filter((item) => item.slug !== unit.slug).slice(0, 3)

  return (
    <>
      <PageHero
        kicker={`${pick(unit.tower, locale)} · ${unit.beds} ${t.labels.bedrooms.toLowerCase()}`}
        title={name}
        intro={pick(unit.summary, locale)}
        art="/art/panorama.svg"
        tall
        meta={
          <div className="grid grid-cols-2 gap-y-4 font-sans text-[0.5625rem] uppercase tracking-[0.2em] sm:grid-cols-5">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="text-muted/70">{spec.label}</p>
                <p className="mt-1 text-ink">{spec.value}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="section shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Reveal>
              <p className="kicker mb-6 text-taupe">{fil ? 'Ang plano' : 'The plan'}</p>
            </Reveal>
            <Reveal delay={100}>
              <FloorPlanViewer
                variant={unit.plan}
                label={name}
                locale={locale}
              />
            </Reveal>
            <p className="mt-4 font-sans text-[0.5625rem] uppercase tracking-[0.18em] text-muted">
              {fil
                ? 'Indikasyon lamang. Ang aktwal na plano ay maaaring mag-iba.'
                : 'Indicative only. Actual plans may vary.'}
            </p>
          </div>

          <Reveal delay={150} className="md:col-span-4 md:col-start-9">
            <p className="kicker mb-6 text-taupe">{fil ? 'Mga detalye' : 'Details'}</p>
            <dl className="divide-y divide-ink/10 border-y border-ink/10">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="font-sans text-[0.5625rem] uppercase tracking-[0.18em] text-muted">
                    {spec.label}
                  </dt>
                  <dd className="font-display text-base">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 space-y-3">
              <Link href={localePath(locale, '/contact')} className="btn btn-ink w-full">
                {t.cta.book}
              </Link>
              <Link href={localePath(locale, '/residences')} className="btn btn-outline w-full">
                {t.cta.viewAll}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-cream-deep">
        <div className="shell">
          <SectionHeading
            kicker={fil ? '360° na pagtingin' : '360° view'}
            title={fil ? 'Lumakad sa loob ng tirahan.' : 'Step inside the residence.'}
            intro={
              fil
                ? 'I-drag upang tumingin sa paligid. Kung mas gusto mo ng mga still image, may fallback din.'
                : 'Drag to look around. If you prefer still images, there is a fallback.'
            }
            size="md"
          />
          <Reveal delay={120} className="mt-12">
            <PanoramaTour
              poster="/art/residences.svg"
              panorama="/art/panorama.svg"
              title={name}
              locale={locale}
            />
          </Reveal>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading
          kicker={fil ? 'Mga tanawin' : 'Views'}
          title={fil ? 'Liwanag sa buong araw.' : 'Light through the day.'}
          size="md"
        />
        <div className="mt-12">
          <Gallery
            items={[
              { art: '/art/residences.svg', caption: fil ? 'Umaga' : 'Morning' },
              { art: '/art/panorama.svg', caption: fil ? 'Tanghali' : 'Midday' },
              { art: '/art/amenities.svg', caption: fil ? 'Hapon' : 'Afternoon' },
              { art: '/art/hero.svg', caption: fil ? 'Takipsilim' : 'Dusk' },
            ]}
          />
        </div>
      </section>

      <section className="section-tight shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker={t.nav.residences}
            title={fil ? 'Mga katulad na tirahan.' : 'Nearby residences.'}
            size="md"
          />
          <Link href={localePath(locale, '/residences')} className="btn btn-outline w-fit">
            {t.cta.viewAll}
          </Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item, index) => (
            <UnitCard key={item.slug} unit={item} locale={locale} index={index} />
          ))}
        </div>
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? `Tingnan ang ${name} nang personal.` : `See the ${name} in person.`}
        body={
          fil
            ? 'Ang bawat tirahan ay may sariling liwanag at ritmo. Mag-book ng pagtingin upang maranasan ito.'
            : 'Every residence has its own light and rhythm. Book a viewing to experience it.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/residences', label: t.cta.viewAll }}
        art="/art/panorama.svg"
      />
    </>
  )
}
