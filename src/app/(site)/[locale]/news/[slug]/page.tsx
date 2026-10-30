import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/site/ArticleCard'
import { CtaBand } from '@/components/site/CtaBand'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { SectionHeading } from '@/components/site/SectionHeading'
import { news, pick } from '@/lib/content'
import { isLocale, localePath, ui } from '@/lib/i18n'

function formatDate(date: string, locale: 'en' | 'fil'): string {
  return new Intl.DateTimeFormat(locale === 'fil' ? 'fil-PH' : 'en-PH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale = isLocale(raw) ? raw : 'en'
  const post = news.find((item) => item.slug === slug)
  if (!post) return {}
  return {
    title: pick(post.title, locale),
    description: pick(post.excerpt, locale),
    alternates: {
      canonical: locale === 'fil' ? `/fil/news/${slug}` : `/news/${slug}`,
      languages: {
        'en-PH': `/news/${slug}`,
        'fil-PH': `/fil/news/${slug}`,
        'x-default': `/news/${slug}`,
      },
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw
  const post = news.find((item) => item.slug === slug)
  if (!post) notFound()

  const t = ui[locale]
  const fil = locale === 'fil'
  const related = news.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <PageHero
        kicker={`${pick(post.category, locale)} · ${formatDate(post.date, locale)}`}
        title={pick(post.title, locale)}
        intro={pick(post.excerpt, locale)}
        art={post.art}
        meta={
          <div className="flex flex-wrap items-center justify-between gap-4 font-sans text-[0.5625rem] uppercase tracking-[0.22em]">
            <span>The Velaris Journal</span>
            <Link href={localePath(locale, '/news')} className="link-underline hover:text-ink">
              {fil ? 'Bumalik sa lahat ng tala' : 'Back to all notes'}
            </Link>
          </div>
        }
      />

      <article className="section shell">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="space-y-7">
              {post.body.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? 'lede text-ink'
                      : 'body-editorial text-muted'
                  }
                >
                  {pick(paragraph, locale)}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-14 border-y border-ink/15 py-10">
            <p className="display display-md text-balance">
              {fil
                ? '“Ang pinakamagandang silid ay ang hindi mo kailangang ipaliwanag.”'
                : '“The best room is the one you do not have to explain.”'}
            </p>
            <p className="kicker mt-6 text-[0.5625rem] text-taupe">
              RHK Land Design Studio
            </p>
          </Reveal>

          <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href={localePath(locale, '/contact')} className="btn btn-ink">
              {t.cta.book}
            </Link>
            <Link href={localePath(locale, '/news')} className="btn btn-outline">
              {fil ? 'Lahat ng tala' : 'All notes'}
            </Link>
          </Reveal>
        </div>
      </article>

      <section className="section-tight shell border-t border-ink/15">
        <SectionHeading
          kicker={fil ? 'Magpatuloy' : 'Continue reading'}
          title={fil ? 'Mga kaugnay na tala.' : 'Related notes.'}
          size="md"
        />
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {related.map((item) => (
            <ArticleCard key={item.slug} post={item} locale={locale} />
          ))}
        </div>
      </section>

      <CtaBand
        locale={locale}
        kicker={t.cta.book}
        title={fil ? 'Bisitahin ang Velaris.' : 'Visit the Velaris.'}
        body={
          fil
            ? 'Ang bawat tala ay nagsisimula sa isang pagtingin. Mag-book ng pribadong pagbisita.'
            : 'Every note begins with a viewing. Book a private visit.'
        }
        primary={{ href: '/contact', label: t.cta.book }}
        secondary={{ href: '/residences', label: t.nav.residences }}
        art="/art/news.svg"
      />
    </>
  )
}
