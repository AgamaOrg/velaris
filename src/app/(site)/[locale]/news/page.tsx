import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/site/ArticleCard'
import { CtaBand } from '@/components/site/CtaBand'
import { PageHero } from '@/components/site/PageHero'
import { SectionHeading } from '@/components/site/SectionHeading'
import { news } from '@/lib/content'
import { isLocale, ui } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'en'
  return {
    title: locale === 'fil' ? 'Balita at Kaganapan' : 'News & Events',
    description:
      locale === 'fil'
        ? 'Mga tala mula sa The Velaris Residences: disenyo, kapitbahayan, at mga tirahan.'
        : 'Notes from The Velaris Residences: design, neighbourhood, and the residences.',
    alternates: {
      canonical: locale === 'fil' ? '/fil/news' : '/news',
      languages: {
        'en-PH': '/news',
        'fil-PH': '/fil/news',
        'x-default': '/news',
      },
    },
  }
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw
  const t = ui[locale]
  const fil = locale === 'fil'
  const [featured, ...rest] = news

  return (
    <>
      <PageHero
        kicker={t.nav.news}
        title={fil ? 'Mga tala mula sa mga tirahan.' : 'Notes from the residences.'}
        intro={
          fil
            ? 'Mga kuwento tungkol sa disenyo, kapitbahayan, at ang tahimik na paraan ng pagtira sa Velaris.'
            : 'Stories about design, neighbourhood, and the quiet way of living at Velaris.'
        }
        tone="cream"
        layout="top"
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>{fil ? 'Disenyo' : 'Design'}</span>
            <span>{fil ? 'Kapitbahayan' : 'Neighbourhood'}</span>
            <span>{fil ? 'Mga tirahan' : 'Residences'}</span>
          </div>
        }
      />

      <section className="section shell">
        {featured ? <ArticleCard post={featured} locale={locale} featured /> : null}

        <div className="mt-16 border-t border-ink/15 pt-14">
          <SectionHeading
            kicker={fil ? 'Lahat ng tala' : 'All notes'}
            title={fil ? 'Magbasa nang matagal.' : 'Read slowly.'}
            size="md"
          />
          <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <ArticleCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Ang mga kuwento ay mas malinaw nang personal.' : 'The stories are clearer in person.'}
        body={
          fil
            ? 'Mag-book ng pribadong pagtingin at maranasan ang mga silid na nabasa mo.'
            : 'Book a private viewing and experience the rooms you have been reading about.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/residences', label: t.nav.residences }}
        art="/dummy_pics/Biet-thu-mini-3-tang-co-tum-1.jpg"
      />
    </>
  )
}
