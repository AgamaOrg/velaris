import type { Locale } from './i18n'
import type { LightPhase } from './light'

export type Localized = {
  en: string
  fil: string
}

export function pick(value: Localized, locale: Locale): string {
  return value[locale]
}

export type Tone = 'sage' | 'taupe' | 'amber' | 'peach' | 'sand' | 'ink'

export type Unit = {
  slug: string
  name: Localized
  tower: Localized
  beds: number
  interior: number
  balcony: number
  total: number
  ceiling: string
  outlook: Localized
  summary: Localized
  plan: 'a' | 'b' | 'c'
  tone: Tone
  media?: Partial<Record<LightPhase, string>>
}

export const homes = {
  brand: 'The Velaris Residences',
  address: 'Bridgetowne, Quezon City',
  developer: 'RHK Land Corporation',
  showGallery: {
    address: 'The Velaris Show Gallery, Bridgetowne Boulevard, Quezon City',
    hours: {
      en: 'Tuesday to Sunday · 10:00 — 18:00',
      fil: 'Martes hanggang Linggo · 10:00 — 18:00',
    },
    phone: '+63 2 8888 0188',
    email: 'residences@thevelarisresidences.com',
  },
}

export const stats: Array<{ value: string; label: Localized }> = [
  { value: '03', label: { en: 'Towers', fil: 'Tore' } },
  { value: '12', label: { en: 'Residence types', fil: 'Uri ng tirahan' } },
  { value: '01', label: { en: 'Bridgetowne address', fil: 'Address sa Bridgetowne' } },
  { value: '360°', label: { en: 'Outlook', fil: 'Tanawin' } },
]

export const units: Unit[] = [
  {
    slug: 'one-bedroom',
    name: { en: 'One Bedroom', fil: 'Isang Silid' },
    tower: { en: 'North Tower', fil: 'North Tower' },
    beds: 1,
    interior: 58,
    balcony: 4,
    total: 62,
    ceiling: '3.0 m',
    outlook: { en: 'City skyline', fil: 'Tanawin ng lungsod' },
    summary: {
      en: 'A composed first residence, with a wide living room and a balcony held by morning light.',
      fil: 'Isang maayos na unang tirahan, may maluwang na sala at balkonaheng sinisikatan ng umaga.',
    },
    plan: 'a',
    tone: 'sage',
  },
  {
    slug: 'one-bedroom-executive',
    name: { en: 'One Bedroom Executive', fil: 'Isang Silid Executive' },
    tower: { en: 'North Tower', fil: 'North Tower' },
    beds: 1,
    interior: 64,
    balcony: 5,
    total: 69,
    ceiling: '3.0 m',
    outlook: { en: 'Sierra Madre', fil: 'Sierra Madre' },
    summary: {
      en: 'A longer living axis, a dressed study, and a view that reaches the mountains on clear days.',
      fil: 'Mas mahabang sala, may study at tanawin ng bundok kapag maaliwalas ang panahon.',
    },
    plan: 'b',
    tone: 'taupe',
  },
  {
    slug: 'one-bedroom-deluxe',
    name: { en: 'One Bedroom Deluxe', fil: 'Isang Silid Deluxe' },
    tower: { en: 'South Tower', fil: 'South Tower' },
    beds: 1,
    interior: 71,
    balcony: 6,
    total: 77,
    ceiling: '3.0 m',
    outlook: { en: 'The grounds', fil: 'Ang hardin' },
    summary: {
      en: 'A corner residence with two exposures, a deeper balcony, and the gardens held below.',
      fil: 'Isang corner na tirahan na may dalawang tanawin, mas malalim na balkonahe, at hardin sa ibaba.',
    },
    plan: 'c',
    tone: 'amber',
  },
  {
    slug: 'two-bedroom-suite',
    name: { en: 'Two Bedroom Suite', fil: 'Dalawang Silid Suite' },
    tower: { en: 'North Tower', fil: 'North Tower' },
    beds: 2,
    interior: 86,
    balcony: 7,
    total: 93,
    ceiling: '3.0 m',
    outlook: { en: 'Bridgetowne skyline', fil: 'Tanawin ng Bridgetowne' },
    summary: {
      en: 'An open kitchen, a generous dining table, and a quiet second bedroom set apart from the living room.',
      fil: 'Bukas na kusina, maluwang na hapag, at tahimik na ikalawang silid na hiwalay sa sala.',
    },
    plan: 'a',
    tone: 'sand',
  },
  {
    slug: 'two-bedroom',
    name: { en: 'Two Bedroom', fil: 'Dalawang Silid' },
    tower: { en: 'South Tower', fil: 'South Tower' },
    beds: 2,
    interior: 96,
    balcony: 8,
    total: 104,
    ceiling: '3.0 m',
    outlook: { en: 'River park', fil: 'River park' },
    summary: {
      en: 'The everyday residence: two balanced bedrooms, a wide gallery hall, and a balcony for long evenings.',
      fil: 'Ang pang-araw-araw na tirahan: dalawang balanseng silid, maluwang na pasilyo, at balkonahe para sa mahabang gabi.',
    },
    plan: 'b',
    tone: 'sage',
  },
  {
    slug: 'two-bedroom-premium',
    name: { en: 'Two Bedroom Premium', fil: 'Dalawang Silid Premium' },
    tower: { en: 'North Tower', fil: 'North Tower' },
    beds: 2,
    interior: 108,
    balcony: 9,
    total: 117,
    ceiling: '3.15 m',
    outlook: { en: 'Skyline & mountains', fil: 'Tanawin at bundok' },
    summary: {
      en: 'A corner two-bedroom with a raised ceiling, a private foyer, and two distinct outlooks.',
      fil: 'Isang corner na may dalawang silid, mas mataas na kisame, pribadong pasukan, at dalawang tanawin.',
    },
    plan: 'c',
    tone: 'taupe',
  },
  {
    slug: 'three-bedroom-suite',
    name: { en: 'Three Bedroom Suite', fil: 'Tatlong Silid Suite' },
    tower: { en: 'South Tower', fil: 'South Tower' },
    beds: 3,
    interior: 128,
    balcony: 10,
    total: 138,
    ceiling: '3.15 m',
    outlook: { en: 'The grounds', fil: 'Ang hardin' },
    summary: {
      en: 'A family residence arranged around a central living room, with a service kitchen kept out of sight.',
      fil: 'Tirahan para sa pamilya na nakaayos sa paligid ng sala, may service kitchen na nakatago.',
    },
    plan: 'a',
    tone: 'peach',
  },
  {
    slug: 'three-bedroom-premium',
    name: { en: 'Three Bedroom Premium', fil: 'Tatlong Silid Premium' },
    tower: { en: 'North Tower', fil: 'North Tower' },
    beds: 3,
    interior: 146,
    balcony: 12,
    total: 158,
    ceiling: '3.15 m',
    outlook: { en: 'Bridgetowne & beyond', fil: 'Bridgetowne at iba pa' },
    summary: {
      en: 'A corner plan with a formal dining room, an expanded primary suite, and a wrap of glass.',
      fil: 'Corner plan na may pormal na silid-kainan, pinalaking primary suite, at malawak na salamin.',
    },
    plan: 'b',
    tone: 'amber',
  },
  {
    slug: 'four-bedroom-suite',
    name: { en: 'Four Bedroom Suite', fil: 'Apat na Silid Suite' },
    tower: { en: 'South Tower', fil: 'South Tower' },
    beds: 4,
    interior: 168,
    balcony: 14,
    total: 182,
    ceiling: '3.3 m',
    outlook: { en: 'River park & skyline', fil: 'River park at tanawin' },
    summary: {
      en: 'A long, generous residence with a separate family room and a primary suite that occupies its own wing.',
      fil: 'Mahabang tirahan na may hiwalay na family room at primary suite sa sariling bahagi.',
    },
    plan: 'c',
    tone: 'sage',
  },
  {
    slug: 'four-bedroom-penthouse',
    name: { en: 'Four Bedroom Penthouse', fil: 'Apat na Silid Penthouse' },
    tower: { en: 'North Tower', fil: 'North Tower' },
    beds: 4,
    interior: 210,
    balcony: 24,
    total: 234,
    ceiling: '3.6 m',
    outlook: { en: 'Full horizon', fil: 'Buong abot-tanaw' },
    summary: {
      en: 'A penthouse level residence with a double-height living room, a private lift lobby, and a terrace.',
      fil: 'Tirahan sa penthouse level na may doble ang taas na sala, pribadong lift lobby, at terrace.',
    },
    plan: 'a',
    tone: 'ink',
  },
  {
    slug: 'penthouse',
    name: { en: 'The Penthouse', fil: 'Ang Penthouse' },
    tower: { en: 'South Tower', fil: 'South Tower' },
    beds: 3,
    interior: 268,
    balcony: 36,
    total: 304,
    ceiling: '3.6 m',
    outlook: { en: 'The city, entire', fil: 'Ang buong lungsod' },
    summary: {
      en: 'The crown residence: a full-floor apartment, a planted terrace, and a view that holds the whole city.',
      fil: 'Ang korona ng gusali: buong palapag na apartment, terrace na may halaman, at tanawin ng buong lungsod.',
    },
    plan: 'b',
    tone: 'taupe',
  },
  {
    slug: 'garden-suite',
    name: { en: 'Garden Suite', fil: 'Garden Suite' },
    tower: { en: 'South Tower', fil: 'South Tower' },
    beds: 2,
    interior: 104,
    balcony: 28,
    total: 132,
    ceiling: '3.0 m',
    outlook: { en: 'Private garden', fil: 'Pribadong hardin' },
    summary: {
      en: 'A ground-level suite that opens directly onto a private garden court and a shaded outdoor room.',
      fil: 'Suite sa ground level na bukas patungo sa pribadong hardin at malilim na labas.',
    },
    plan: 'c',
    tone: 'amber',
  },
]

export type Amenity = {
  number: string
  title: Localized
  body: Localized
  art: string
}

export const amenities: Amenity[] = [
  {
    number: '01',
    title: { en: 'The Sento', fil: 'Ang Sento' },
    body: {
      en: 'A Japanese-inspired bath house in stone and warm water, held at the quietest edge of the grounds.',
      fil: 'Isang bath house na inspirasyon ng Hapon, gawa sa bato at maligamgam na tubig, sa pinakatahimik na bahagi ng hardin.',
    },
    art: '/dummy_pics/istockphoto-2223376026-612x612.jpg',
  },
  {
    number: '02',
    title: { en: 'Sky Club', fil: 'Sky Club' },
    body: {
      en: 'A private lounge and dining room on the thirty-eighth floor, reserved for residents and their guests.',
      fil: 'Pribadong lounge at silid-kainan sa ika-tatlumpu’t walong palapag, para sa mga residente at bisita.',
    },
    art: '/dummy_pics/villa-features-1024x690.jpg',
  },
  {
    number: '03',
    title: { en: 'The Grounds', fil: 'Ang Hardin' },
    body: {
      en: 'Two hectares of planted courts, shaded walks, and a river-facing lawn designed for slow mornings.',
      fil: 'Dalawang ektarya ng hardin, malilim na daan, at lawn na nakaharap sa ilog para sa mahinahong umaga.',
    },
    art: '/dummy_pics/villa-features-1024x690.jpg',
  },
  {
    number: '04',
    title: { en: 'Fitness Atelier', fil: 'Fitness Atelier' },
    body: {
      en: 'A strength and movement studio with natural light, private training rooms, and a lap pool beyond.',
      fil: 'Studio para sa strength at movement na may natural na liwanag, pribadong training room, at lap pool.',
    },
    art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif',
  },
  {
    number: '05',
    title: { en: 'Private Dining', fil: 'Pribadong Kainan' },
    body: {
      en: 'A chef’s kitchen and a twelve-seat table for the evenings that matter, bookable by residents.',
      fil: 'Kusina ng chef at hapag para sa labindalawang tao para sa mahahalagang gabi, maaaring i-book ng residente.',
    },
    art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif',
  },
  {
    number: '06',
    title: { en: 'Concierge', fil: 'Concierge' },
    body: {
      en: 'A resident team that handles the small and large things — arrivals, deliveries, reservations, and travel.',
      fil: 'Team ng residente na humahawak sa maliliit at malalaking bagay — pagdating, delivery, reservation, at paglalakbay.',
    },
    art: '/dummy_pics/istockphoto-2223376026-612x612.jpg',
  },
]

export type NewsPost = {
  slug: string
  title: Localized
  category: Localized
  date: string
  excerpt: Localized
  body: Localized[]
  art: string
}

export const news: NewsPost[] = [
  {
    slug: 'the-art-of-arrival',
    title: {
      en: 'The art of arrival: designing the Velaris lobby',
      fil: 'Ang sining ng pagdating: ang disenyo ng lobby ng Velaris',
    },
    category: { en: 'Design', fil: 'Disenyo' },
    date: '2026-09-18',
    excerpt: {
      en: 'A first room should slow the pulse. Inside the material study behind the Velaris arrival sequence.',
      fil: 'Ang unang silid ay dapat magpabagal ng tibok. Tingnan ang pag-aaral ng materyales sa likod ng pagdating sa Velaris.',
    },
    body: [
      {
        en: 'The lobby is not a threshold. It is the first room of the residence, and it is designed to be read at the pace of a walk rather than a glance.',
        fil: 'Ang lobby ay hindi lamang pintuan. Ito ang unang silid ng tirahan, dinisenyo upang basahin sa bilis ng paglakad, hindi ng sulyap.',
      },
      {
        en: 'Stone, bronze, and a warm plaster were selected together so the room changes with the hour. At noon it is almost white; by six it holds the colour of the sky.',
        fil: 'Bato, bronze, at mainit na plaster ang pinili nang sabay upang magbago ang silid sa bawat oras. Sa tanghali halos puti ito; sa alas-sais, taglay nito ang kulay ng langit.',
      },
      {
        en: 'The arrival sequence ends at a single window, deliberately uncurtained, that frames the towers before the resident turns toward the lifts.',
        fil: 'Nagtatapos ang pagdating sa isang bintanang walang kurtina, na naglalagay sa mga tore sa tanawin bago tumalikod ang residente patungo sa lift.',
      },
    ],
    art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif',
  },
  {
    slug: 'bridgetowne-after-dark',
    title: { en: 'Bridgetowne after dark', fil: 'Ang Bridgetowne pagkalipas ng dilim' },
    category: { en: 'Neighbourhood', fil: 'Kapitbahayan' },
    date: '2026-08-30',
    excerpt: {
      en: 'The district has found its evening rhythm. A short field note on light, river air, and the walk home.',
      fil: 'Natagpuan na ng distrito ang ritmo nito sa gabi. Isang maikling tala sa liwanag, hangin ng ilog, at pag-uwi.',
    },
    body: [
      {
        en: 'Bridgetowne changes after seven. The boulevard slows, the river air moves through the streets, and the towers become a horizon rather than a destination.',
        fil: 'Nagbabago ang Bridgetowne pagkalipas ng alas-siyete. Bumabagal ang boulevard, dumadaan ang hangin ng ilog, at nagiging abot-tanaw ang mga tore.',
      },
      {
        en: 'Our lighting study for the grounds began with a simple rule: no light should be visible as a source. Everything is reflected, washed, or held low.',
        fil: 'Nagsimula ang aming pag-aaral ng ilaw sa hardin sa simpleng tuntunin: walang ilaw na dapat makita bilang pinagmulan. Lahat ay sinasalamin o ibinababa.',
      },
    ],
    art: '/dummy_pics/villa-features-1024x690.jpg',
  },
  {
    slug: 'a-note-on-light',
    title: {
      en: 'A note on light: the north-facing residences',
      fil: 'Tala sa liwanag: ang mga tirahang nakaharap sa hilaga',
    },
    category: { en: 'Residences', fil: 'Mga Tirahan' },
    date: '2026-08-12',
    excerpt: {
      en: 'Why the northern elevations were planned first, and what a steady, indirect light does to a room over a day.',
      fil: 'Bakit unang pinlano ang hilagang bahagi, at ano ang ginagawa ng tuloy-tuloy na indirect na liwanag sa isang silid sa loob ng isang araw.',
    },
    body: [
      {
        en: 'North light is the most forgiving light in the tropics. It arrives without glare and leaves without a hard shadow, so a room can hold deep colour without becoming hot.',
        fil: 'Ang hilagang liwanag ang pinakamapagbigay sa tropiko. Dumarating ito nang walang silaw at umaalis nang walang matigas na anino.',
      },
      {
        en: 'In the one- and two-bedroom plans, the living room is set to the north and the bedrooms to the east, so the day moves through the residence instead of pooling in one room.',
        fil: 'Sa mga planong isa at dalawang silid, ang sala ay nakaharap sa hilaga at ang mga silid sa silangan, kaya gumagalaw ang araw sa buong tirahan.',
      },
    ],
    art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif',
  },
  {
    slug: 'inside-the-sento',
    title: { en: 'Inside the Sento: a ritual of water and stone', fil: 'Sa loob ng Sento: ritwal ng tubig at bato' },
    category: { en: 'Wellness', fil: 'Kalusugan' },
    date: '2026-07-24',
    excerpt: {
      en: 'The bath house is the quietest room on the grounds. A look at the sequence that shapes it.',
      fil: 'Ang bath house ang pinakatahimik na silid sa hardin. Tingnan ang pagkakasunod-sunod na humuhubog dito.',
    },
    body: [
      {
        en: 'The Sento is arranged as a sequence rather than a room: a cool entry, a warm wash, a still bath, and a shaded place to sit afterward.',
        fil: 'Ang Sento ay nakaayos bilang pagkakasunod-sunod, hindi bilang isang silid: malamig na pasukan, maligamgam na paghuhugas, tahimik na paliguan, at malilim na pahingahan.',
      },
      {
        en: 'The stone was chosen for how it holds heat, not for how it looks. The room is deliberately dim so that the water becomes the brightest surface.',
        fil: 'Pinili ang bato dahil sa paghawak nito ng init, hindi sa itsura. Sadya ang dilim ng silid upang ang tubig ang pinakamaliwanag na bahagi.',
      },
    ],
    art: '/dummy_pics/istockphoto-2223376026-612x612.jpg',
  },
  {
    slug: 'the-last-garden-residences',
    title: { en: 'The last garden residences', fil: 'Ang huling garden residences' },
    category: { en: 'Residences', fil: 'Mga Tirahan' },
    date: '2026-06-15',
    excerpt: {
      en: 'Twelve ground-level suites open directly onto the grounds. A note on privacy, planting, and the outdoor room.',
      fil: 'Labindalawang suite sa ground level ang bukas sa hardin. Tala sa privacy, halaman, at silid sa labas.',
    },
    body: [
      {
        en: 'The garden suites were planned last and designed first. Each opens onto a private court, separated from its neighbour by a planted wall rather than a fence.',
        fil: 'Ang garden suites ay huling pinlano ngunit unang dinisenyo. Bawat isa ay bukas sa pribadong patyo, na hinihiwalay ng halamang pader kaysa bakod.',
      },
      {
        en: 'The outdoor room is the point: a shaded place to eat, read, and receive, with the residence held one step behind it.',
        fil: 'Ang silid sa labas ang mahalaga: malilim na lugar para kumain, magbasa, at tumanggap ng bisita, na ang tirahan ay isang hakbang sa likod.',
      },
    ],
    art: '/dummy_pics/villa-features-1024x690.jpg',
  },
  {
    slug: 'meet-the-makers',
    title: { en: 'Meet the makers: the RHK design studio', fil: 'Kilalanin ang mga gumawa: ang RHK design studio' },
    category: { en: 'The Developer', fil: 'Ang Developer' },
    date: '2026-05-08',
    excerpt: {
      en: 'The team behind the residences on how a three-tower master plan is drawn, revised, and held together.',
      fil: 'Ang team sa likod ng mga tirahan kung paano iginuguhit, binabago, at pinagbubuklod ang master plan ng tatlong tore.',
    },
    body: [
      {
        en: 'A master plan is a long argument about light, access, and quiet. The Velaris plan was revised eleven times before the first tower was set.',
        fil: 'Ang master plan ay mahabang talakayan tungkol sa liwanag, daan, at katahimikan. Labing-isang beses binago ang plano ng Velaris bago itinayo ang unang tore.',
      },
      {
        en: 'The studio works as one table: architects, landscape, interiors, and the sales team, so that what is promised in a brochure is what is drawn, and what is drawn is what is built.',
        fil: 'Isang hapag ang studio: arkitekto, landscape, interiors, at sales team, upang ang ipinangako sa brochure ay siyang iginuhit, at ang iginuhit ay siyang itinatayo.',
      },
    ],
    art: '/dummy_pics/photo-1580587771525-78b9dba3b914.avif',
  },
]

export const team = [
  {
    name: 'Beatriz Salazar',
    initials: 'BS',
    role: { en: 'Senior Sales Advisor', fil: 'Senior Sales Advisor' },
    line: {
      en: 'Bridgetowne, Makati, and offshore buyers',
      fil: 'Bridgetowne, Makati, at mga buyer mula sa labas ng bansa',
    },
  },
  {
    name: 'Marco Villanueva',
    initials: 'MV',
    role: { en: 'Client Relations Lead', fil: 'Client Relations Lead' },
    line: {
      en: 'Private viewings and residence selection',
      fil: 'Pribadong pagtingin at pagpili ng tirahan',
    },
  },
  {
    name: 'Camille Reyes',
    initials: 'CR',
    role: { en: 'Residences Specialist', fil: 'Residences Specialist' },
    line: {
      en: 'Unit plans, areas, and tour arrangements',
      fil: 'Plano ng unit, lawak, at kaayusan ng tour',
    },
  },
  {
    name: 'Antonio Lim',
    initials: 'AL',
    role: { en: 'Private Client Director', fil: 'Private Client Director' },
    line: {
      en: 'Penthouse and multiple-residence enquiries',
      fil: 'Penthouse at maraming tirahang tanong',
    },
  },
]

export const connectivity = [
  { place: 'Ortigas Center', time: '8 min' },
  { place: 'BGC', time: '15 min' },
  { place: 'Makati CBD', time: '20 min' },
  { place: 'NAIA Terminal 3', time: '35 min' },
  { place: 'LRT-2 Marikina–Pasig', time: '6 min' },
  { place: 'Bridgetowne River Park', time: '3 min' },
]

export const philosophy = [
  {
    title: { en: 'Light', fil: 'Liwanag' },
    body: {
      en: 'Every residence is planned around the path of the sun, not the shape of the floor plate.',
      fil: 'Bawat tirahan ay pinlano ayon sa landas ng araw, hindi sa hugis ng palapag.',
    },
  },
  {
    title: { en: 'Proportion', fil: 'Proporsyon' },
    body: {
      en: 'Ceilings are raised, corridors are widened, and rooms are held to a human scale.',
      fil: 'Itinaas ang kisame, pinalawak ang pasilyo, at pinanatili ang silid sa sukat ng tao.',
    },
  },
  {
    title: { en: 'Material', fil: 'Materyales' },
    body: {
      en: 'Stone, timber, bronze, and plaster — chosen to age quietly rather than announce themselves.',
      fil: 'Bato, kahoy, bronze, at plaster — pinili upang tumanda nang tahimik kaysa magpakilala.',
    },
  },
  {
    title: { en: 'Quiet', fil: 'Katahimikan' },
    body: {
      en: 'Acoustic separation, planted buffers, and a plan that keeps the city at a distance.',
      fil: 'Paghiwalay ng tunog, halamang harang, at planong naglalayo sa lungsod.',
    },
  },
]

export const provenance = [
  { value: '130+', label: { en: 'Years of Hongkong Land', fil: 'Taon ng Hongkong Land' } },
  { value: '40+', label: { en: 'Years of Robinsons Land', fil: 'Taon ng Robinsons Land' } },
  { value: '30', label: { en: 'Hectares at Bridgetowne', fil: 'Ektarya sa Bridgetowne' } },
]
