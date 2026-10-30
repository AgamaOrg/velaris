export const locales = ['en', 'fil'] as const

export type Locale = (typeof locales)[number]

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
    light: {
      hint: 'Live light in Bridgetowne',
      auto: 'Auto',
      now: 'Now',
      live: 'Live',
      preview: 'Preview',
      move: 'Move the sun',
      currentAt: 'Current light',
      scroll: 'Scroll to move the sun',
      kicker: 'Light through the day',
      title: 'The residence, at every hour',
      intro:
        'Move the sun across the room. The light in Bridgetowne is the same light that will be yours.',
      status: 'RHK Land · Bridgetowne',
      phases: {
        dawn: 'Dawn',
        day: 'Midday',
        golden: 'Golden hour',
        night: 'Night',
      },
      lines: {
        dawn: 'First light arrives cool and low, and the room holds its edges.',
        day: 'At midday the room is even and bright, with the city held outside.',
        golden: 'In the late afternoon the west light warms the stone and the timber.',
        night: 'After dark the room is lit from within, and the city becomes a horizon.',
      },
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
    light: {
      hint: 'Tunay na liwanag sa Bridgetowne',
      auto: 'Awtomatiko',
      now: 'Ngayon',
      live: 'Live',
      preview: 'Preview',
      move: 'Igalaw ang araw',
      currentAt: 'Kasalukuyang liwanag',
      scroll: 'I-scroll upang igalaw ang araw',
      kicker: 'Liwanag sa buong araw',
      title: 'Ang tirahan, sa bawat oras',
      intro:
        'Igalaw ang araw sa silid. Ang liwanag sa Bridgetowne ay ang parehong liwanag na magiging sa iyo.',
      status: 'RHK Land · Bridgetowne',
      phases: {
        dawn: 'Bukang-liwayway',
        day: 'Tanghali',
        golden: 'Gintong oras',
        night: 'Gabi',
      },
      lines: {
        dawn: 'Dumarating ang unang liwanag na malamig at mababa, at hinahawakan ng silid ang mga gilid nito.',
        day: 'Sa tanghali, pantay at maliwanag ang silid, at nasa labas ang lungsod.',
        golden: 'Sa hapon, iniinit ng kanlurang liwanag ang bato at kahoy.',
        night: 'Pagkatapos ng dilim, liwanag mula sa loob ang silid, at abot-tanaw ang lungsod.',
      },
    },
  },
} as const
