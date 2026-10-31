import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream text-near-black p-6 font-sans">
      <div className="max-w-md text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-taupe">
          404 · Not Found
        </p>
        <h1 className="text-3xl font-light">The Velaris Residences</h1>
        <p className="text-sm text-muted">
          The requested page does not exist.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-near-black text-cream text-xs tracking-wide transition-colors hover:bg-sage"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
