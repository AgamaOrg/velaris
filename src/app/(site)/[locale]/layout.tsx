import type { Metadata } from 'next'
import { Federo, Geist, Source_Serif_4 } from 'next/font/google'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { LightProvider } from '@/components/site/light/LightProvider'
import { StickyCta } from '@/components/site/StickyCta'
import { isLocale, locales, type Locale } from '@/lib/i18n'
import { lightBootstrap } from '@/lib/light'

const federo = Federo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-federo',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'en'
  const isFil = locale === 'fil'
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    metadataBase: new URL(base),
    title: {
      template: '%s — The Velaris Residences',
      default: isFil
        ? 'The Velaris Residences — Ganap na Luho sa Bridgetowne'
        : 'The Velaris Residences — Absolute Luxury in Bridgetowne',
    },
    description: isFil
      ? 'Tatlong tore ng ganap na luho sa Bridgetowne, Quezon City, ng RHK Land. Tuklasin ang mga tirahan, pasilidad, at lokasyon.'
      : 'Three towers of absolute luxury in Bridgetowne, Quezon City, by RHK Land. Discover the residences, amenities, and address.',
    alternates: {
      canonical: isFil ? '/fil' : '/',
      languages: {
        'en-PH': '/',
        'fil-PH': '/fil',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'The Velaris Residences',
      images: [{ url: '/dummy_pics/villa-features-1024x690.jpg', width: 1024, height: 690, alt: 'The Velaris Residences' }],
    },
  }
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  return (
    <html
      lang={locale === 'fil' ? 'fil' : 'en'}
      className={`${federo.variable} ${sourceSerif.variable} ${geist.variable} h-full antialiased`}
    >
      <body id="top" className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: lightBootstrap }} />
        <LightProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-sans focus:text-[0.625rem] focus:uppercase focus:tracking-[0.2em] focus:text-cream"
          >
            {locale === 'fil' ? 'Lumaktaw sa nilalaman' : 'Skip to content'}
          </a>
          <Header locale={locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} />
          <StickyCta locale={locale} />
          <div className="grain" aria-hidden="true" />
        </LightProvider>
      </body>
    </html>
  )
}
