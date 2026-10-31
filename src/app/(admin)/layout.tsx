import type { Metadata } from 'next'
import { Geist, Source_Serif_4 } from 'next/font/google'
import '@/styles/globals.css'

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

export const metadata: Metadata = {
  title: 'Velaris Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100">{children}</body>
    </html>
  )
}
