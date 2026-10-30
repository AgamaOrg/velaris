# The Velaris Residences — URL Contract & Redirect Manifest

**Defined:** Phase 1 (Foundation & Guardrails)  
**Status:** Frozen  
**Governing Rule:** Decisions made here are non-retrofittable; all subsequent content modeling, frontend routing, and SEO migrations conform strictly to this specification.

---

## 1. Host & Protocol Canonicalization

- **Canonical Origin:** `https://thevelarisresidences.com`
- **Apex vs WWW:** Apex domain is canonical. All `www.thevelarisresidences.com/*` requests must 301 redirect in **one hop** to `https://thevelarisresidences.com/*` with query parameters preserved.
- **Protocol:** HTTPS only. Strict-Transport-Security (HSTS) with 2-year `includeSubDomains; preload` header enforced.
- **Trailing Slash Policy:** Strict **no trailing slash** (`trailingSlash: false`). Trailing slash requests redirect to their non-trailing-slash equivalents.

---

## 2. Localization Routing Contract

- **Default Locale (English):** Served at root with **no locale prefix**.
  - Example: `https://thevelarisresidences.com/about`
  - Internal rewrite via Next.js 16 `proxy.ts`: maps `/about` to App Router `/en/about`.
  - **Forbidden Pattern:** Never expose or redirect to `/en/*` in the public URL.
- **Secondary Locale (Filipino):** Explicit `/fil/` prefix.
  - Example: `https://thevelarisresidences.com/fil/about`
- **Hreflang & Canonical Signals:**
  - `en-PH` & `x-default`: `https://thevelarisresidences.com/...`
  - `fil-PH`: `https://thevelarisresidences.com/fil/...`
  - Self-referencing canonical tag per locale.
- **No Automatic Accept-Language Redirect:** Search crawlers and visitors landing from shared links must never receive unexpected redirects. Language toggle is explicitly user-controlled.

---

## 3. Public Editorial IA (8 Core Pages)

| Page | English Canonical URL | Filipino Canonical URL | Notes |
|------|-----------------------|------------------------|-------|
| Home | `/` | `/fil` | Brand overview & primary consultation CTA |
| About | `/about` | `/fil/about` | Story, design philosophy, partnership |
| Residences | `/residences` | `/fil/residences` | Overview of towers & unit selector |
| Amenities | `/amenities` | `/fil/amenities` | Japanese sento, sky club, grounds |
| Location | `/location` | `/fil/location` | Bridgetowne master plan, Victor statue, connectivity |
| The Developer | `/developer` | `/fil/developer` | RHK Land (Hongkong Land × Robinsons Land) |
| News & Events | `/news` | `/fil/news` | Editorial index |
| Contact | `/contact` | `/fil/contact` | Show Gallery address, hours, booking entry |

---

## 4. 12 Unit-Type Pages Contract

All unit-type pages reside canonically under `/residences/[slug]`:

| # | Unit Type | Canonical Slug | Full Canonical Path | Legacy WordPress Paths (301 Mapped) |
|---|-----------|----------------|---------------------|-------------------------------------|
| 1 | One-Bedroom | `one-bedroom` | `/residences/one-bedroom` | `/units/one-bedroom/`, `/residences/one-bedroom/` |
| 2 | One-Bedroom Executive | `one-bedroom-executive` | `/residences/one-bedroom-executive` | `/units/one-bedroom-executive/`, `/residences/one-bedroom-executive/` |
| 3 | One-Bedroom Deluxe | `one-bedroom-deluxe` | `/residences/one-bedroom-deluxe` | `/units/one-bedroom-deluxe/`, `/residences/one-bedroom-deluxe/` |
| 4 | Two-Bedroom Suite | `two-bedroom-suite` | `/residences/two-bedroom-suite` | `/units/two-bedroom-suite/`, `/residences/two-bedroom-suite/` |
| 5 | Two-Bedroom | `two-bedroom` | `/residences/two-bedroom` | `/units/two-bedroom/`, `/residences/two-bedroom/` |
| 6 | Two-Bedroom Premium | `two-bedroom-premium` | `/residences/two-bedroom-premium` | `/units/two-bedroom-premium/`, `/residences/two-bedroom-premium/` |
| 7 | Three-Bedroom Suite | `three-bedroom-suite` | `/residences/three-bedroom-suite` | `/units/three-bedroom-suite/`, `/residences/three-bedroom-suite/` |
| 8 | Three-Bedroom Premium | `three-bedroom-premium` | `/residences/three-bedroom-premium` | `/units/three-bedroom-premium/`, `/residences/three-bedroom-premium/` |
| 9 | Four-Bedroom Suite | `four-bedroom-suite` | `/residences/four-bedroom-suite` | `/units/four-bedroom-suite/`, `/residences/four-bedroom-suite/` |
| 10 | Four-Bedroom Penthouse | `four-bedroom-penthouse` | `/residences/four-bedroom-penthouse` | `/units/four-bedroom-penthouse/`, `/residences/four-bedroom-penthouse/` |
| 11 | Penthouse | `penthouse` | `/residences/penthouse` | `/units/penthouse/`, `/residences/penthouse/` |
| 12 | Garden Suite | `garden-suite` | `/residences/garden-suite` | `/units/garden-suite/`, `/residences/garden-suite/` |

---

## 5. News & Editorial Content Contract (58 Posts)

- **Index:** `/news`
- **Article Pattern:** `/news/[slug]`
- **Preservation Rule:** Original WordPress post slugs, publication dates, and sanitized author bylines are preserved exactly.
- **Legacy URL Mapping:** Legacy date-based permalinks or `/news-and-events/[slug]` redirect in 1 hop with 301 to `/news/[slug]`.
- **WordPress Feeds & Taxonomies:**
  - `/feed`, `/rss`, `/atom` → 301 to `/news`
  - `/category/*`, `/tag/*` → 301 to `/news`
  - `/author/*` → 301 to `/about` (author emails purged for compliance)

---

## 6. Redirect Engine & Query String Preservation

1. **Config-Level Execution:** Defined statically in `src/config/redirects.ts` and loaded by `next.config.ts` `redirects()`.
2. **Hop Guarantee:** Maximum of **1 HTTP hop** from any legacy URL to the canonical destination.
3. **Query String & UTM Continuity:** Next.js `redirects()` preserves query strings automatically (`?utm_source=...&utm_medium=...` preserved during 301).
4. **Proxy Isolation:** `proxy.ts` ignores requests matched by static redirects, avoiding redirect loops or premature locale rewrites.
