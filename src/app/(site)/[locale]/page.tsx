import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AmenityCard } from '@/components/site/AmenityCard'
import { ArrowLink } from '@/components/site/ArrowLink'
import { ArticleCard } from '@/components/site/ArticleCard'
import { CountUp } from '@/components/site/CountUp'
import { CtaBand } from '@/components/site/CtaBand'
import { CoverImage } from '@/components/site/CoverImage'
import { EditorialSplit } from '@/components/site/EditorialSplit'
import { Gallery } from '@/components/site/Gallery'
import { HeroOverture } from '@/components/site/light/HeroOverture'
import { LandingLoader } from '@/components/site/LandingLoader'
import { Marquee } from '@/components/site/Marquee'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { StatBand } from '@/components/site/StatBand'
import { UnitCard } from '@/components/site/UnitCard'
import { amenities, connectivity, homes, news, philosophy, pick, stats, units } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    alternates: {
      canonical: locale === 'fil' ? '/fil' : '/',
      languages: { 'en-PH': '/', 'fil-PH': '/fil', 'x-default': '/' },
    },
  }
}

export default async function HomePage({
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
      <LandingLoader locale={locale} />
      <HeroOverture
        locale={locale}
        footer={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em] text-muted">
            <span>{fil ? 'Tatlong tore' : 'Three towers'}</span>
            <span>{homes.address}</span>
            <span>{homes.developer}</span>
          </div>
        }
      >
        <Reveal variant="clip" delay={100}>
          <h1 className="display display-xl mt-6 max-w-6xl">
            The Velaris
            <br />
            Residences
          </h1>
        </Reveal>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal variant="left" delay={200}>
            <p className="lede max-w-md text-muted">
              {fil
                ? 'Tatlong tore ng ganap na luho sa gitna ng Bridgetowne. Kung saan ang bawat detalye ay isang imbitasyon sa isang buhay na maayos na nabuhay.'
                : 'Three towers of absolute luxury in the heart of Bridgetowne. Where every detail is an invitation to a life well lived.'}
            </p>
          </Reveal>
          <Reveal variant="right" delay={280} className="flex flex-col gap-3 sm:flex-row">
            <Link href={localePath(locale, '/contact')} className="btn btn-ink">
              {t.cta.book}
            </Link>
            <Link href={localePath(locale, '/residences')} className="btn btn-outline">
              {t.cta.explore}
            </Link>
          </Reveal>
        </div>
      </HeroOverture>

      <Marquee
        text={fil ? 'Isang buhay na binubuo ng tatlong tore' : 'A life composed in three towers'}
        className="mt-12"
      />

      {/* Introduction */}
      <section className="section shell">
        <StatBand stats={stats.map((stat) => ({ value: stat.value, label: pick(stat.label, locale) }))} />

        <div className="mt-28 grid gap-14 md:grid-cols-12 md:gap-20">
          <SectionHeading
            className="md:col-span-5"
            kicker={fil ? 'Ang proyekto' : 'The project'}
            title={fil ? 'Isang mas tahimik na ideya ng luho.' : 'A quieter idea of luxury.'}
            size="md"
          />
          <Reveal delay={120} className="md:col-span-6 md:col-start-7">
            <div className="body-editorial space-y-6 text-muted">
              <p>
                {fil
                  ? 'Ang Velaris ay tatlong tore na nakaayos sa paligid ng liwanag, hardin, at ilog. Hindi ito isang koleksyon ng mga yunit; ito ay isang paraan ng pagtira na pinag-isipan bago pa ang unang bato.'
                  : 'The Velaris is three towers arranged around light, garden, and river. It is not a collection of units; it is a way of living considered before the first stone.'}
              </p>
              <p>
                {fil
                  ? 'Bawat tirahan ay pinlano ayon sa landas ng araw. Ang mga pasilyo ay mas maluwang, ang mga kisame ay mas mataas, at ang lungsod ay pinananatiling isang distansya.'
                  : 'Every residence is planned around the path of the sun. Corridors run wider, ceilings sit higher, and the city is kept at a distance.'}
              </p>
            </div>
            <div className="mt-9">
              <ArrowLink href={localePath(locale, '/about')}>
                {fil ? 'Ang aming kuwento' : 'Our story'}
              </ArrowLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-28 grid gap-x-16 gap-y-14 border-t border-ink/15 pt-12 sm:grid-cols-2">
          {philosophy.map((item, index) => (
            <Reveal key={item.title.en} delay={index * 60}>
              <p className="kicker mb-4 text-taupe">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="display display-sm">{pick(item.title, locale)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{pick(item.body, locale)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Feature split */}
      <section className="section bg-cream-deep">
        <div className="shell">
          <EditorialSplit
            kicker={fil ? 'Ang mga tore' : 'The towers'}
            title={fil ? 'Nakatayo sa pagitan ng lungsod at ilog.' : 'Standing between the city and the river.'}
            body={
              <>
                <p>
                  {fil
                    ? 'Dalawang tore ng tirahan at isang tore ng mga pasilidad, na pinag-ugnay ng isang mataas na hardin. Ang bawat tore ay may sariling pasukan, lobby, at pribadong team.'
                    : 'Two residential towers and one amenity tower, linked by a raised garden. Each tower has its own arrival, its own lobby, and its own private team.'}
                </p>
                <p>
                  {fil
                    ? 'Ang arkitektura ay sinadya upang tumanda nang tahimik: bato, kahoy, bronze, at plaster na hindi nagsisigaw ng pansin.'
                    : 'The architecture is intended to age quietly: stone, timber, bronze, and plaster that do not announce themselves.'}
                </p>
              </>
            }
            art="/dummy_pics/photo-1580587771525-78b9dba3b914.avif"
            caption={fil ? 'North Tower · Sala' : 'North Tower · Living room'}
            cta={{ href: localePath(locale, '/residences'), label: t.cta.explore }}
          />
        </div>
      </section>

      {/* Units */}
      <section className="section shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker={t.nav.residences}
            title={fil ? 'Labindalawang paraan ng pagtira.' : 'Twelve ways to live.'}
            size="md"
          />
          <ArrowLink href={localePath(locale, '/residences')} className="shrink-0">
            {t.cta.viewAll}
          </ArrowLink>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {units.slice(0, 3).map((unit, index) => (
            <UnitCard key={unit.slug} unit={unit} locale={locale} index={index} />
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="section bg-sage-deep text-cream">
        <div className="shell">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              kicker={t.nav.amenities}
              title={fil ? 'Ang hardin, ang tubig, ang langit.' : 'The grounds, the water, the sky.'}
              size="md"
              light
            />
            <ArrowLink href={localePath(locale, '/amenities')} light className="shrink-0">
              {t.cta.viewAll}
            </ArrowLink>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
            {amenities.slice(0, 3).map((amenity, index) => (
              <AmenityCard key={amenity.number} amenity={amenity} locale={locale} index={index} light />
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section shell">
        <div className="grid items-center gap-16 md:grid-cols-12 md:gap-20">
          <Reveal className="md:col-span-6">
            <div className="group relative aspect-[5/4] overflow-hidden bg-sand">
              <CoverImage
                src="/dummy_pics/villa-features-1024x690.jpg"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="media-hover"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5 md:col-start-8">
            <p className="kicker mb-6 text-taupe">{t.nav.location}</p>
            <h2 className="display display-md text-balance">
              {fil ? 'Nasa gitna ng lahat, ngunit hiwalay dito.' : 'At the centre of everything, held apart from it.'}
            </h2>
            <p className="body-editorial mt-7 text-muted">
              {fil
                ? 'Ang Bridgetowne ay isang distritong nakaayos sa paligid ng ilog at mga berdeng daan. Mula rito, ang Ortigas, BGC, at Makati ay maikling biyahe lamang.'
                : 'Bridgetowne is a district arranged around the river and green streets. From here, Ortigas, BGC, and Makati are short journeys.'}
            </p>
            <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {connectivity.slice(0, 5).map((item) => (
                <li key={item.place} className="flex items-center justify-between py-3">
                  <span className="font-sans text-xs uppercase tracking-[0.14em] text-muted">{item.place}</span>
                  <span className="font-display text-base">{item.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ArrowLink href={localePath(locale, '/location')}>{t.cta.discover}</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="section shell">
        <Gallery
          items={[
            { art: '/dummy_pics/Biet-thu-mini-3-tang-co-tum-1.jpg', caption: fil ? 'Ang sala' : 'The living room', title: fil ? 'Buong araw na liwanag' : 'All-day light' },
            { art: '/dummy_pics/istockphoto-2223376026-612x612.jpg', caption: fil ? 'Ang pool deck' : 'The pool deck' },
            { art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif', caption: fil ? 'Ang pasukan' : 'The arrival' },
            { art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif', caption: fil ? 'Ang hardin' : 'The garden' },
            { art: '/dummy_pics/istockphoto-2223376026-612x612.jpg', caption: fil ? 'Ang show gallery' : 'The show gallery' },
          ]}
          tall
        />
      </section>

      {/* Developer */}
      <section className="section bg-cream-deep">
        <div className="shell">
          <SectionHeading
            kicker={t.nav.developer}
            title={fil ? 'Itinayo ng dalawa sa pinakamatatag na developer sa Asya.' : 'Built by two of Asia’s most established developers.'}
            intro={
              fil
                ? 'Ang RHK Land ay isang joint venture ng Hongkong Land at Robinsons Land — dalawang kumpanyang may pinagsamang mahigit isang siglo ng pagtatayo ng mga tirahan.'
                : 'RHK Land is a joint venture between Hongkong Land and Robinsons Land — two companies with more than a century of combined residential building.'
            }
          />

          <div className="mt-20 grid gap-10 border-t border-ink/15 pt-12 sm:grid-cols-3">
            {[
              { value: '130+', label: fil ? 'Taon ng Hongkong Land' : 'Years of Hongkong Land' },
              { value: '40+', label: fil ? 'Taon ng Robinsons Land' : 'Years of Robinsons Land' },
              { value: '30', label: fil ? 'Ektarya sa Bridgetowne' : 'Hectares at Bridgetowne' },
            ].map((item, index) => (
              <Reveal key={item.label} delay={index * 70}>
                <p className="display text-5xl">
                  <CountUp value={item.value} />
                </p>
                <p className="kicker mt-3 text-[0.5625rem] text-muted">{item.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160} className="mt-20 max-w-3xl">
            <p className="display display-md text-balance">
              {fil
                ? '“Ang luho ay hindi tungkol sa dagdag. Ito ay tungkol sa pag-alis ng anumang hindi kailangan.”'
                : '“Luxury is not about addition. It is about removing everything that is not necessary.”'}
            </p>
            <p className="kicker mt-6 text-[0.5625rem] text-taupe">
              {fil ? 'Ang RHK Land Design Studio' : 'The RHK Land Design Studio'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* News */}
      <section className="section shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker={t.nav.news}
            title={fil ? 'Mga tala mula sa mga tirahan.' : 'Notes from the residences.'}
            size="md"
          />
          <ArrowLink href={localePath(locale, '/news')} className="shrink-0">
            {t.cta.viewAll}
          </ArrowLink>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {news.slice(0, 3).map((post) => (
            <ArticleCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Ang susunod na hakbang ay isang pribadong pagtingin.' : 'The next move is a private viewing.'}
        body={
          fil
            ? 'Tingnan ang mga modelong yunit, ang mga hardin, at ang show gallery kasama ang isang private client advisor.'
            : 'Walk the model residences, the grounds, and the show gallery with a private client advisor.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/residences', label: t.cta.explore }}
      />
    </>
  )
}
