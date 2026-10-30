import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/site/CtaBand'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { UnitCard } from '@/components/site/UnitCard'
import { units } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    title: locale === 'fil' ? 'Mga Tirahan' : 'Residences',
    description:
      locale === 'fil'
        ? 'Labindalawang uri ng tirahan sa The Velaris Residences, mula sa isang silid hanggang sa penthouse.'
        : 'Twelve residence types at The Velaris Residences, from one bedroom to the penthouse.',
    alternates: {
      canonical: locale === 'fil' ? '/fil/residences' : '/residences',
      languages: {
        'en-PH': '/residences',
        'fil-PH': '/fil/residences',
        'x-default': '/residences',
      },
    },
  }
}

export default async function ResidencesPage({
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
        kicker={t.nav.residences}
        title={fil ? 'Labindalawang paraan ng pagtira.' : 'Twelve ways to live.'}
        intro={
          fil
            ? 'Mula sa isang silid na may maluwang na sala hanggang sa buong palapag na penthouse. Ang bawat plano ay nakaayos sa paligid ng liwanag at tanawin.'
            : 'From a one bedroom with a generous living room to a full-floor penthouse. Every plan is arranged around light and outlook.'
        }
        layout="poster"
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>{fil ? 'Labindalawang uri' : 'Twelve residence types'}</span>
            <span>{fil ? 'Dalawang tore' : 'Two residential towers'}</span>
            <span>{fil ? 'Indikasyon ng lawak' : 'Indicative areas'}</span>
          </div>
        }
      />

      <section className="section shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker={fil ? 'Pumili ng tirahan' : 'Choose a residence'}
            title={fil ? 'Hanapin ang tamang plano.' : 'Find the right plan.'}
            size="md"
          />
          <p className="max-w-sm font-sans text-[0.625rem] uppercase leading-relaxed tracking-[0.18em] text-muted">
            {fil
              ? 'Pindutin ang isang tirahan upang makita ang plano, lawak, at 360° na pagtingin.'
              : 'Open a residence to see its plan, areas, and 360° view.'}
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit, index) => (
            <UnitCard key={unit.slug} unit={unit} locale={locale} index={index} />
          ))}
        </div>
      </section>

      <section className="section bg-cream-deep">
        <div className="shell grid gap-12 md:grid-cols-12 md:gap-16">
          <SectionHeading
            className="md:col-span-5"
            kicker={fil ? 'Hindi sigurado?' : 'Not sure yet?'}
            title={fil ? 'Ihambing ang mga plano nang magkatabi.' : 'Compare plans side by side.'}
            size="md"
          />
          <Reveal delay={120} className="md:col-span-6 md:col-start-7">
            <p className="body-editorial text-muted">
              {fil
                ? 'Ang aming private client team ay makakatulong na ihambing ang lawak, tanawin, at plano ng bawat tirahan ayon sa inyong pamumuhay. Walang presyon, walang presyo sa publiko — isang pag-uusap lamang.'
                : 'Our private client team can compare the area, outlook, and plan of each residence against the way you actually live. No pressure, no public pricing — just a conversation.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={localePath(locale, '/contact')} className="btn btn-ink">
                {t.cta.book}
              </Link>
              <Link href={localePath(locale, '/amenities')} className="btn btn-outline">
                {t.nav.amenities}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Ang tamang plano ay mas madaling makita nang personal.' : 'The right plan is easier to see in person.'}
        body={
          fil
            ? 'Maglakad sa mga modelong yunit at tingnan ang tunay na liwanag sa bawat oras ng araw.'
            : 'Walk the model residences and see the real light at every hour of the day.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/residences', label: t.cta.viewAll }}
        art="/dummy_pics/photo-1580587771525-78b9dba3b914.avif"
      />
    </>
  )
}
