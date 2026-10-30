import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/site/CtaBand'
import { EditorialSplit } from '@/components/site/EditorialSplit'
import { Gallery } from '@/components/site/Gallery'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { provenance } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    title: locale === 'fil' ? 'Ang Developer' : 'The Developer',
    description:
      locale === 'fil'
        ? 'Ang RHK Land, isang joint venture ng Hongkong Land at Robinsons Land, sa likod ng The Velaris Residences.'
        : 'RHK Land, a joint venture of Hongkong Land and Robinsons Land, behind The Velaris Residences.',
    alternates: {
      canonical: locale === 'fil' ? '/fil/developer' : '/developer',
      languages: {
        'en-PH': '/developer',
        'fil-PH': '/fil/developer',
        'x-default': '/developer',
      },
    },
  }
}

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw
  const t = ui[locale]
  const fil = locale === 'fil'

  const partners = [
    {
      name: 'Hongkong Land',
      since: fil ? 'Mahigit 130 taon' : 'More than 130 years',
      body: fil
        ? 'Isang developer ng prime property sa Asia, na kilala sa mga landmark na tirahan at komersyal na distrito sa Hong Kong, Singapore, at Shanghai.'
        : 'A developer of prime property across Asia, known for landmark residential and commercial districts in Hong Kong, Singapore, and Shanghai.',
    },
    {
      name: 'Robinsons Land',
      since: fil ? 'Mahigit 40 taon' : 'More than 40 years',
      body: fil
        ? 'Isa sa pinakamalaking developer sa Pilipinas, na may malawak na karanasan sa mga tirahan, mall, at mixed-use na komunidad.'
        : 'One of the largest developers in the Philippines, with deep experience in residences, malls, and mixed-use communities.',
    },
  ]

  return (
    <>
      <PageHero
        kicker={t.nav.developer}
        title={fil ? 'Isang joint venture ng dalawang pangalan.' : 'A joint venture of two names.'}
        intro={
          fil
            ? 'Ang RHK Land ay pinagsama ang Hongkong Land at Robinsons Land upang itayo ang Velaris sa Bridgetowne.'
            : 'RHK Land brings together Hongkong Land and Robinsons Land to build the Velaris at Bridgetowne.'
        }
        dark
        layout="poster"
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>Hongkong Land</span>
            <span>Robinsons Land</span>
            <span>RHK Land Corporation</span>
          </div>
        }
      />

      <section className="section shell">
        <EditorialSplit
          kicker={fil ? 'Bakit ito mahalaga' : 'Why it matters'}
          title={fil ? 'Ang nagtayo ay kasinghalaga ng itinayo.' : 'Who builds it matters as much as what is built.'}
          body={
            <>
              <p>
                {fil
                  ? 'Sa isang preselling na tirahan, ang pinakamalaking tanong ay hindi ang layout. Ito ay kung sino ang maghahatid ng pangako.'
                  : 'In a preselling residence, the largest question is not the layout. It is who will deliver the promise.'}
              </p>
              <p>
                {fil
                  ? 'Ang Hongkong Land at Robinsons Land ay may pinagsamang mahigit isang siglo ng pagtatayo. Ang kanilang joint venture, ang RHK Land, ay nagdadala ng parehong disiplina sa Bridgetowne.'
                  : 'Hongkong Land and Robinsons Land share more than a century of building between them. Their joint venture, RHK Land, brings that same discipline to Bridgetowne.'}
              </p>
            </>
          }
          art="/dummy_pics/villa-features-1024x690.jpg"
          caption="Bridgetowne, Quezon City"
          cta={{ href: localePath(locale, '/contact'), label: t.cta.book }}
        />
      </section>

      <section className="section bg-cream-deep">
        <div className="shell">
          <SectionHeading
            kicker={fil ? 'Ang mga partner' : 'The partners'}
            title={fil ? 'Dalawang kumpanya, isang pamantayan.' : 'Two companies, one standard.'}
          />
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {partners.map((partner, index) => (
              <Reveal key={partner.name} delay={index * 80} className="border-t border-ink/15 pt-7">
                <p className="kicker text-[0.5625rem] text-taupe">{partner.since}</p>
                <h3 className="display display-md mt-4">{partner.name}</h3>
                <p className="body-editorial mt-5 max-w-lg text-muted">{partner.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-8 border-t border-ink/15 pt-10 sm:grid-cols-3">
            {provenance.map((item, index) => (
              <Reveal key={item.label.en} delay={index * 60}>
                <p className="display text-5xl">{item.value}</p>
                <p className="kicker mt-3 text-[0.5625rem] text-muted">
                  {item.label[locale]}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sage-deep text-cream">
        <div className="shell grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <p className="kicker mb-6 text-amber">{fil ? 'Ang pamantayan' : 'The standard'}</p>
            <h2 className="display display-md text-cream">
              {fil ? 'Ang bawat detalye ay may dahilan.' : 'Every detail has a reason.'}
            </h2>
          </Reveal>
          <Reveal delay={120} className="md:col-span-6 md:col-start-7">
            <div className="body-editorial space-y-6 text-cream/70">
              <p>
                {fil
                  ? 'Ang mga materyales ay pinili dahil sa pagtanda nila, hindi sa unang impresyon. Ang bato, kahoy, bronze, at plaster ay magkakasamang bumubuo ng isang silid na mas maganda sa ika-sampung taon.'
                  : 'Materials are chosen for how they age, not for first impression. Stone, timber, bronze, and plaster combine into a room that is better in its tenth year.'}
              </p>
              <p>
                {fil
                  ? 'Ang parehong disiplina ay inilalapat sa pagpaplano, sa pagtatayo, at sa paghahatid. Ito ang pamantayan ng RHK Land.'
                  : 'The same discipline applies to planning, construction, and handover. That is the RHK Land standard.'}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section shell">
        <Gallery
          items={[
            { art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif', caption: fil ? 'Ang pasukan' : 'The arrival' },
            { art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif', caption: fil ? 'Ang sala' : 'The living room' },
            { art: '/dummy_pics/istockphoto-2223376026-612x612.jpg', caption: fil ? 'Ang hardin' : 'The grounds' },
            { art: '/dummy_pics/villa-features-1024x690.jpg', caption: fil ? 'Ang mga tore' : 'The towers' },
          ]}
        />
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Tingnan ang pamantayan nang personal.' : 'See the standard for yourself.'}
        body={
          fil
            ? 'Ang pinakamahusay na paraan upang maunawaan ang pagkakaiba ay ang paglalakad sa loob ng tirahan.'
            : 'The best way to understand the difference is to walk through the residence.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/about', label: t.nav.about }}
        art="/dummy_pics/photo-1580587771525-78b9dba3b914.avif"
      />
    </>
  )
}
