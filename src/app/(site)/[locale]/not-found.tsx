import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-taupe mb-3">
        404 · Page Not Found
      </p>
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-foreground">
        A quiet sanctuary awaits elsewhere
      </h1>
      <p className="text-muted max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
        The destination you are looking for has moved or does not exist. Allow us to guide you back to our residences.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-near-black text-cream text-sm tracking-wide transition-colors hover:bg-sage"
        >
          Return to Overview
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-near-black/20 text-sm tracking-wide transition-colors hover:bg-near-black/5"
        >
          Book a Viewing
        </Link>
      </div>
    </div>
  )
}
