# The Velaris Residences — Digital Platform

## What This Is

A complete digital platform for The Velaris Residences, the luxury three-tower residential development in Bridgetowne by RHK Land (a joint venture of Hongkong Land and Robinsons Land). It replaces the current WordPress marketing site with two products in one codebase: a cinematic, absolute-luxury public site that builds desire and captures qualified demand, and a heavy operations console that runs inventory, leads, reservations, and client intelligence for the RHK sales and marketing team.

## Core Value

Turn luxury brand desire into qualified, attributable demand — and give the sales team the operational depth to convert it. If everything else fails, a prospect must be able to move from inspiration to a booked tour, and sales must be able to see and act on that lead.

## Business Context

- **Customer**: RHK Land Corporation — the developer behind The Velaris Residences; primary users are the in-house sales and marketing team
- **Buyers**: Philippine high-net-worth buyers, OFWs, and offshore investors (Hongkong Land audience)
- **Revenue model**: Condominium unit sales (preselling and turnover)
- **Success metric**: Qualified leads → booked show-gallery tours → reservations, with full source attribution
- **Strategy notes**: Public pricing is deliberately withheld; the public site sells the brand and the tour, while inventory and pricing live behind sales login

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Public site delivers an absolute-luxury editorial experience across Home, About, Residences, Amenities, Location, Developer, News & Events, Contact
- [ ] Unit-type pages present area breakdowns, floor plans, galleries, and 360 tours for all 12 unit types
- [ ] Every interactive element produces a real outcome — no dead ends, no novelty buttons
- [ ] Qualified lead capture with consent, source/UTM attribution, and immediate sales notification
- [ ] Show-gallery tour booking with calendar holds and confirmation
- [ ] Brochure access gated by lead capture; no dependency on public Google Drive links
- [ ] Sales login gates inventory and price data away from the public site
- [ ] Admin console shows relevant KPIs: leads, tours, reservations, conversion, response time, unit velocity, source ROI
- [ ] Lead inbox and pipeline with scoring, assignment, SLA timers, and activity timeline
- [ ] Unit inventory, availability, holds, reservations, price history, and documents management
- [ ] Content management for pages, units, amenities, news, media, and SEO metadata
- [ ] Client 360 profile with consent ledger, interaction history, and KYC status
- [ ] Consent-based client intelligence: declared-data enrichment, dedupe, company/domain lookup, and KYC/AML screening at reservation
- [ ] English and Filipino public experience
- [ ] Full role-based access control with an append-only audit log
- [ ] SEO and URL parity with the legacy WordPress site, including 301 mapping for 12 unit pages and 58 news posts
- [ ] Resident portal (phased after the sales platform)

### Out of Scope

- Covert OSINT or profiling of prospects — unlawful under PH DPA (RA 10173) and GDPR without a lawful basis; replaced by consented enrichment + KYC
- Public display of unit pricing — business decision; prices remain behind sales login
- Project-level research output — replaced by a direct audit of the existing live site
- Chinese-language launch — launch languages are English and Filipino; revisit post-launch
- Third-party integrations at launch — CRM, payments/e-sign, messaging, and calendar sync are deferred to a later phase
- Online reservation payments — deferred with the integrations phase
- Rebuilding the legacy Pano2VR 360 tours from scratch — reuse existing tour assets initially
- Native mobile apps — responsive web first

## Context

- **Existing site**: `https://thevelarisresidences.com/` — WordPress 7.1.3, Elementor 4.3.4 (+ Pro 3.22.1), Hello Elementor child theme `VelarisXDthree`, Essential Addons, Search & Filter, Yoast SEO
- **Existing design language**: Federo display type, Freight Text serif body, Roboto fallback; palette cream `#F8EDE0`, near-black `#000200`, sage `#43544B`, taupe `#876F53`, peach `#FFE2D5`, amber `#FFBC7D`; editorial full-bleed imagery, uppercase kickers, generous whitespace
- **Existing IA**: Home · About · Residences (North/South, 12 unit types) · Location · Amenities · The Developer · News & Events (58 posts) · Contact
- **Existing tour format**: XML-based Pano2VR-style 360 tours (`tour/1br.xml`), four unit types
- **Current-site defects to fix**: no page caching (TTFB 0.67–0.89 s), ~660 KB CSS across 24 files, ~600 KB JS (jQuery/Swiper/Slick), no lazy-loading on background slides, a 5.3 MB PNG map, missing meta descriptions, no HSTS/CSP/X-Frame-Options, brochure downloads on Google Drive, author email leaked in Article schema
- **SEO risk**: multiple competing domains rank for the brand name; the rebuild must preserve URL equity and redirects
- **Repo**: `/home/carl/velaris/velaris` — Next.js 16.4.2 + React 19.3 + Tailwind 4 App Router scaffold; remote `AgamaOrg/velaris`
- **Runtime**: Node 26.8.2, npm 11.19.1, Docker 29.7.2 available
- **Framework caveat**: this Next.js version has breaking changes; read `node_modules/next/dist/docs/` before writing code. Next 16 renamed Middleware to Proxy (`proxy.ts`)

## Constraints

- **Stack**: Next.js 16.4 App Router, React 19, TypeScript 6 (required by Payload), Tailwind 4
- **CMS**: Payload 3.91 embedded in the Next app, Postgres adapter (documented Next 16.4 support)
- **Hosting**: Vercel — Neon Postgres and Vercel Blob; no long-lived Node server for background work
- **Compliance**: Philippine Data Privacy Act (RA 10173), with GDPR-grade handling for offshore buyers; DPIA required before KYC go-live
- **Accessibility**: WCAG 2.2 AA; respects `prefers-reduced-motion`
- **Performance**: LCP under 2.0 s on 4G, CLS near zero, no render-blocking legacy libraries
- **Timeline**: No fixed launch date; quality-driven sequencing
- **Team**: Small team; build must remain operable by one developer plus client editors
- **Content**: Client supplies photography, unit data, legal copy, and Filipino translations; asset readiness is a dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild on Next.js instead of extending WordPress | Performance, security headers, custom admin depth, long-term maintainability | — Pending |
| Payload 3 self-hosted rather than Sanity or headless WP | Next-native, Postgres, full data ownership, fits heavy custom admin | — Pending |
| Two admin surfaces: Payload `/admin` for content, custom `/ops` for operations | Avoids fighting CMS UI for dashboards; one shared auth/RBAC | — Pending |
| Sales-only pricing and inventory | Client business policy; makes the public site a lead engine and the console the product | — Pending |
| Consent-based intelligence + KYC instead of covert OSINT | Legally defensible under PH DPA/GDPR; still delivers sales advantage | — Pending |
| English + Filipino at launch (no Chinese) | Matches local and OFW audience; narrower QA surface | — Pending |
| Defer CRM/payments/messaging/calendar integrations | Vendors undecided; keeps Phase 0–4 shippable | — Pending |
| Quality-driven, untimed roadmap | Client prioritizes quality over a fixed date | — Pending |
| "Every button earns its place" instead of feature sprawl | Luxury signal is restraint; prevents scope explosion | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Business Context check — customer, revenue model, success metric still accurate?
4. Audit Out of Scope — reasons still valid?
5. Update Context with current state

---
*Last updated: 2026-10-23 after initialization*
