export type RedirectRule = {
  source: string
  destination: string
  permanent: boolean
}

/**
 * Static redirect manifest for legacy WordPress routes.
 *
 * Guarantees:
 * 1. Exactly 1 hop to the canonical destination.
 * 2. Permanent 301/308 redirects.
 * 3. Preserves query string parameters (UTM tracking) automatically via Next.js engine.
 */
export const legacyRedirects: RedirectRule[] = [
  // ---------------------------------------------------------------------------
  // Core Legacy Pages
  // ---------------------------------------------------------------------------
  { source: '/home', destination: '/', permanent: true },
  { source: '/about-us', destination: '/about', permanent: true },
  { source: '/the-developer', destination: '/developer', permanent: true },
  { source: '/news-and-events', destination: '/news', permanent: true },
  { source: '/news-events', destination: '/news', permanent: true },
  { source: '/show-gallery', destination: '/contact', permanent: true },

  // ---------------------------------------------------------------------------
  // Competing legacy unit URL families -> canonical /residences/:slug
  // ---------------------------------------------------------------------------
  { source: '/units/one-bedroom', destination: '/residences/one-bedroom', permanent: true },
  { source: '/units/one-bedroom-executive', destination: '/residences/one-bedroom-executive', permanent: true },
  { source: '/units/one-bedroom-deluxe', destination: '/residences/one-bedroom-deluxe', permanent: true },
  { source: '/units/two-bedroom-suite', destination: '/residences/two-bedroom-suite', permanent: true },
  { source: '/units/two-bedroom', destination: '/residences/two-bedroom', permanent: true },
  { source: '/units/two-bedroom-premium', destination: '/residences/two-bedroom-premium', permanent: true },
  { source: '/units/three-bedroom-suite', destination: '/residences/three-bedroom-suite', permanent: true },
  { source: '/units/three-bedroom-premium', destination: '/residences/three-bedroom-premium', permanent: true },
  { source: '/units/four-bedroom-suite', destination: '/residences/four-bedroom-suite', permanent: true },
  { source: '/units/four-bedroom-penthouse', destination: '/residences/four-bedroom-penthouse', permanent: true },
  { source: '/units/penthouse', destination: '/residences/penthouse', permanent: true },
  { source: '/units/garden-suite', destination: '/residences/garden-suite', permanent: true },

  // ---------------------------------------------------------------------------
  // Feeds & Taxonomies
  // ---------------------------------------------------------------------------
  { source: '/feed', destination: '/news', permanent: true },
  { source: '/rss', destination: '/news', permanent: true },
  { source: '/category/:slug*', destination: '/news', permanent: true },
  { source: '/tag/:slug*', destination: '/news', permanent: true },
  { source: '/author/:slug*', destination: '/about', permanent: true },
]
