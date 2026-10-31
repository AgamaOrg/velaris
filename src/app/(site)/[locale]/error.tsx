'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production, scrubbed error digest is forwarded to observability
    if (process.env.NODE_ENV !== 'production') {
      console.error('Unhandled route error:', error)
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-taupe mb-3">
        Experience Interrupted
      </p>
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-foreground">
        Something unexpected occurred
      </h1>
      <p className="text-muted max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
        Our team has been discreetly notified. Please try reloading the page or return to the main residences overview.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          type="button"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-near-black text-cream text-sm tracking-wide transition-colors hover:bg-sage cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-near-black/20 text-sm tracking-wide transition-colors hover:bg-near-black/5"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
