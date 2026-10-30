export const locales = ['en', 'fil'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/**
 * Public URL helper. English is served at the root, Filipino under /fil.
 * Never emits /en.
 */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  if (locale === 'fil') return `/fil${clean}` || '/fil'
  return clean || '/'
}

export const ui = {
  en: {
    nav: {
      about: 'About',
      residences: 'Residences',
      amenities: 'Amenities',
      location: 'Location',
      developer: 'Developer',
      news: 'News & Events',
      contact: 'Contact',
    },
    cta: {
      book: 'Book a Private Viewing',
      explore: 'Explore the Residences',
      discover: 'Discover',
      viewAll: 'View all',
      readMore: 'Read more',
      inquire: 'Make an enquiry',
      back: 'Back',
    },
    header: {
      menu: 'Menu',
      close: 'Close',
      language: 'Language',
    },
    footer: {
      tagline: 'Three towers of absolute luxury in the heart of Bridgetowne.',
      explore: 'Explore',
      visit: 'Visit',
      enquiries: 'Enquiries',
      rights: 'All rights reserved.',
      backToTop: 'Back to top',
    },
    labels: {
      bedrooms: 'Bedrooms',
      interior: 'Interior',
      balcony: 'Balcony',
      total: 'Total area',
      ceiling: 'Ceiling height',
      outlook: 'Outlook',
      residence: 'Residence',
      showGallery: 'Show Gallery',
      hours: 'Viewing hours',
      team: 'Your private team',
      directions: 'Get directions',
      language: 'Language',
    },
  },
  fil: {
    nav: {
      about: 'Tungkol',
      residences: 'Mga Tirahan',
      amenities: 'Mga Pasilidad',
      location: 'Lokasyon',
      developer: 'Ang Developer',
      news: 'Balita at Kaganapan',
      contact: 'Makipag-ugnayan',
    },
    cta: {
      book: 'Mag-book ng Pribadong Pagtingin',
      explore: 'Tuklasin ang mga Tirahan',
      discover: 'Tuklasin',
      viewAll: 'Tingnan lahat',
      readMore: 'Magbasa pa',
      inquire: 'Magtanong',
      back: 'Bumalik',
    },
    header: {
      menu: 'Menu',
      close: 'Isara',
      language: 'Wika',
    },
    footer: {
      tagline: 'Tatlong tore ng ganap na luho sa gitna ng Bridgetowne.',
      explore: 'Tuklasin',
      visit: 'Bisitahin',
      enquiries: 'Mga Tanong',
      rights: 'Nakalaan ang lahat ng karapatan.',
      backToTop: 'Bumalik sa itaas',
    },
    labels: {
      bedrooms: 'Mga Silid',
      interior: 'Loob',
      balcony: 'Balkonahe',
      total: 'Kabuuang lawak',
      ceiling: 'Taas ng kisame',
      outlook: 'Tanawin',
      residence: 'Tirahan',
      showGallery: 'Show Gallery',
      hours: 'Oras ng pagtingin',
      team: 'Ang inyong pribadong team',
      directions: 'Kumuha ng direksyon',
      language: 'Wika',
    },
  },
} as const

export type Dictionary = (typeof ui)[Locale]
