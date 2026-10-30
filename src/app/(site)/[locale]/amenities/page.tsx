import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AmenityCard } from '@/components/site/AmenityCard'
import { CtaBand } from '@/components/site/CtaBand'
import { EditorialSplit } from '@/components/site/EditorialSplit'
import { Gallery } from '@/components/site/Gallery'
import { PageHero } from '@/components/site/PageHero'
import { SectionHeading } from '@/components/site/SectionHeading'
import { amenities } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    title: locale === 'fil' ? 'Mga Pasilidad' : 'Amenities',
    description:
      locale === 'fil'
        ? 'Ang Sento, Sky Club, hardin, fitness atelier, at concierge ng The Velaris Residences.'
        : 'The Sento, Sky Club, grounds, fitness atelier, and concierge at The Velaris Residences.',
    alternates: {
      canonical: locale === 'fil' ? '/fil/amenities' : '/amenities',
      languages: {
        'en-PH': '/amenities',
        'fil-PH': '/fil/amenities',
        'x-default': '/amenities',
      },
    },
  }
}

export default async function AmenitiesPage({
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
        kicker={t.nav.amenities}
        title={fil ? 'Ang hardin, ang tubig, ang langit.' : 'The grounds, the water, the sky.'}
        intro={
          fil
            ? 'Anim na pasilidad na nakaayos sa paligid ng isang ideya: ang luho ay nararamdaman sa tahimik na paraan ng paggamit.'
            : 'Six amenities arranged around one idea: luxury is felt in the quiet way a place is used.'
        }
        art="/art/amenities.svg"
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>{fil ? 'Anim na pasilidad' : 'Six amenities'}</span>
            <span>{fil ? 'Dalawang ektarya ng hardin' : 'Two hectares of grounds'}</span>
            <span>{fil ? 'Para sa mga residente' : 'For residents'}</span>
          </div>
        }
      />

      <section className="section shell">
        <SectionHeading
          kicker={fil ? 'Ang koleksyon' : 'The collection'}
          title={fil ? 'Mga lugar na dinisenyo upang gamitin.' : 'Places designed to be used.'}
          intro={
            fil
              ? 'Hindi display ang bawat pasilidad. Ito ay mga silid na may layunin, sukat, at oras.'
              : 'No amenity is for display. Each is a room with a purpose, a proportion, and an hour.'
          }
        />

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity, index) => (
            <AmenityCard
              key={amenity.number}
              amenity={amenity}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="section bg-cream-deep">
        <div className="shell">
          <EditorialSplit
            kicker={fil ? 'Ang Sento' : 'The Sento'}
            title={fil ? 'Isang silid na nakaayos sa paligid ng tubig.' : 'A room arranged around water.'}
            body={
              <>
                <p>
                  {fil
                    ? 'Ang Sento ay isang bath house na inspirasyon ng Hapon, na may malamig na pasukan, maligamgam na paghuhugas, tahimik na paliguan, at malilim na pahingahan.'
                    : 'The Sento is a Japanese-inspired bath house with a cool entry, a warm wash, a still bath, and a shaded place to sit afterward.'}
                </p>
                <p>
                  {fil
                    ? 'Pinili ang bato dahil sa paghawak nito ng init. Ang silid ay sadya ang dilim upang ang tubig ang pinakamaliwanag na bagay.'
                    : 'The stone was chosen for how it holds heat. The room is deliberately dim so that the water becomes the brightest thing in it.'}
                </p>
              </>
            }
            art="/art/amenities.svg"
            ratio="landscape"
            reverse
            caption={fil ? 'Ang Sento · Paliguan' : 'The Sento · Bath'}
            cta={{ href: localePath(locale, '/contact'), label: t.cta.book }}
          />
        </div>
      </section>

      <section className="section shell">
        <Gallery
          items={[
            { art: '/art/amenities.svg', caption: fil ? 'Pool deck' : 'Pool deck' },
            { art: '/art/residences.svg', caption: fil ? 'Lounge' : 'Lounge' },
            { art: '/art/panorama.svg', caption: fil ? 'Sky Club' : 'Sky Club' },
            { art: '/art/hero.svg', caption: fil ? 'Ang hardin' : 'The grounds' },
            { art: '/art/developer.svg', caption: fil ? 'Fitness atelier' : 'Fitness atelier' },
          ]}
          tall
        />
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Gamitin ang mga pasilidad sa isang pagtingin.' : 'Try the amenities on a viewing.'}
        body={
          fil
            ? 'Ang private viewing ay kasama ang paglalakad sa hardin, pool deck, at Sky Club.'
            : 'A private viewing includes a walk through the grounds, the pool deck, and the Sky Club.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/location', label: t.nav.location }}
        art="/art/amenities.svg"
      />
    </>
  )
}
