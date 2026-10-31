import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/site/CtaBand'
import { EditorialSplit } from '@/components/site/EditorialSplit'
import { Gallery } from '@/components/site/Gallery'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { philosophy, pick } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    title: locale === 'fil' ? 'Tungkol' : 'About',
    description:
      locale === 'fil'
        ? 'Ang kuwento, pilosopiya, at mga partner sa likod ng The Velaris Residences sa Bridgetowne.'
        : 'The story, philosophy, and partners behind The Velaris Residences in Bridgetowne.',
    alternates: {
      canonical: locale === 'fil' ? '/fil/about' : '/about',
      languages: {
        'en-PH': '/about',
        'fil-PH': '/fil/about',
        'x-default': '/about',
      },
    },
  }
}

export default async function AboutPage({
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
        kicker={fil ? 'Tungkol sa Velaris' : 'About Velaris'}
        title={fil ? 'Isang proyektong sinusukat sa dekada.' : 'A project measured in decades.'}
        intro={
          fil
            ? 'Ang Velaris ay hindi itinayo upang maging pinakamalaki. Ito ay itinayo upang maging tama — sa liwanag, sa sukat, at sa tahimik na paraan ng pagtira.'
            : 'The Velaris was not built to be the largest. It was built to be right — in light, in proportion, and in the quiet way a home should live.'
        }
        tone="cream"
        layout="split"
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>{fil ? 'Itinatag ng RHK Land' : 'Developed by RHK Land'}</span>
            <span>Bridgetowne, Quezon City</span>
            <span>{fil ? 'Tatlong tore' : 'Three towers'}</span>
          </div>
        }
      />

      <section className="section shell">
        <EditorialSplit
          kicker={fil ? 'Ang kuwento' : 'The story'}
          title={fil ? 'Nagsimula sa isang tanong tungkol sa liwanag.' : 'It began with a question about light.'}
          body={
            <>
              <p>
                {fil
                  ? 'Bago ang unang plano, ang RHK Land Design Studio ay nagtanong ng isang bagay: paano kaya kung ang bawat silid ay may tamang liwanag sa tamang oras?'
                  : 'Before the first drawing, the RHK Land Design Studio asked one question: what if every room could have the right light at the right hour?'}
              </p>
              <p>
                {fil
                  ? 'Mula sa tanong na iyon, isang master plan ang nabuo — tatlong tore na nakaayos sa paligid ng isang mataas na hardin, na ang bawat pasukan ay may sariling tahimik na ritwal.'
                  : 'From that question came a master plan — three towers arranged around a raised garden, each arrival with its own quiet ritual.'}
              </p>
              <p>
                {fil
                  ? 'Ang resulta ay isang lugar na hindi nagmamadali. Isang lugar kung saan ang luho ay nararamdaman sa katahimikan, hindi sa dami.'
                  : 'The result is a place that does not hurry. A place where luxury is felt in the quiet, not in the quantity.'}
              </p>
            </>
          }
          art="/dummy_pics/photo-1580587771525-78b9dba3b914.avif"
          caption={fil ? 'North Tower · Sala' : 'North Tower · Living room'}
          ratio="landscape"
          cta={{ href: localePath(locale, '/residences'), label: t.cta.explore }}
        />
      </section>

      <section className="section bg-cream-deep">
        <div className="shell">
          <SectionHeading
            kicker={fil ? 'Ang pilosopiya' : 'The philosophy'}
            title={fil ? 'Apat na prinsipyo, isang tahimik na resulta.' : 'Four principles, one quiet result.'}
            intro={
              fil
                ? 'Bawat desisyon sa Velaris ay sinusukat laban sa apat na prinsipyong ito. Wala sa kanila ang tungkol sa dagdag.'
                : 'Every decision at Velaris is measured against these four principles. None of them are about addition.'
            }
          />

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {philosophy.map((item, index) => (
              <Reveal key={item.title.en} delay={index * 70} className="border-t border-ink/15 pt-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="display display-sm">{pick(item.title, locale)}</h3>
                  <span className="kicker text-[0.5625rem] text-taupe">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="body-editorial mt-4 max-w-lg text-muted">
                  {pick(item.body, locale)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sage-deep text-cream">
        <div className="shell">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="kicker mb-8 text-amber">{fil ? 'Ang aming paniniwala' : 'What we believe'}</p>
            <blockquote className="display display-lg text-cream text-balance">
              {fil
                ? '“Ang tunay na luho ay ang pakiramdam na ang lahat ng kailangan mo ay narito na — at wala nang iba.”'
                : '“True luxury is the feeling that everything you need is already here — and nothing more.”'}
            </blockquote>
            <p className="kicker mt-8 text-[0.5625rem] text-cream/50">
              RHK Land Design Studio
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section shell">
        <Gallery
          items={[
            { art: '/dummy_pics/villa-features-1024x690.jpg', caption: fil ? 'Ang mga tore' : 'The towers' },
            { art: '/dummy_pics/istockphoto-2223376026-612x612.jpg', caption: fil ? 'Ang pool deck' : 'The pool deck' },
            { art: '/dummy_pics/Biet-thu-mini-3-tang-co-tum-1.jpg', caption: fil ? 'Ang sala' : 'The living room' },
            { art: '/dummy_pics/villa-features-1024x690.jpg', caption: fil ? 'Ang distrito' : 'The district' },
            { art: '/dummy_pics/istockphoto-2223376026-612x612.jpg', caption: fil ? 'Ang show gallery' : 'The show gallery' },
          ]}
          tall
        />
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Halina at tingnan nang personal.' : 'Come and see it in person.'}
        body={
          fil
            ? 'Ang bawat detalye ay mas malinaw kapag naroon ka. Mag-book ng pribadong pagtingin sa show gallery.'
            : 'Every detail is clearer when you are there. Book a private viewing at the show gallery.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/developer', label: t.nav.developer }}
      />
    </>
  )
}
