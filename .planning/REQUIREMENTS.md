# Requirements: The Velaris Residences — Digital Platform

**Defined:** 2026-10-25
**Core Value:** Turn luxury brand desire into qualified, attributable demand — and give the sales team the operational depth to convert it. A prospect must be able to move from inspiration to a booked tour, and sales must be able to see and act on that lead.

## v1 Requirements

Requirements for initial release. Each maps to exactly one roadmap phase.

### Foundation

- [ ] **FOUND-01**: The app boots as one Next.js 16.4 App Router project with Payload 3.91 embedded, TypeScript 6, `withPayload`, the `(site)`, `(ops)`, and `(payload)` route groups, and `proxy.ts` in place
- [ ] **FOUND-02**: Production deploy topology is fixed: Vercel functions in `sin1`, Neon Postgres in `ap-southeast-1` with pooled runtime and direct migration URLs, Node 24 pinned, and Vercel Blob configured for public and private access
- [ ] **FOUND-03**: The URL contract is decided before build: canonical host, locale prefix, the 12 unit-page URLs and 58 news URLs, and the redirect manifest owner
- [ ] **FOUND-04**: Request handling sets HSTS, CSP, X-Frame-Options, and related security headers, and no secret, author email, price, or KYC data reaches a public response
- [ ] **FOUND-05**: Errors and observability are wired: branded error pages, structured server logs, and error tracking with PII scrubbing — no stack traces or env values in responses
- [ ] **FOUND-06**: Database migrations, Payload type generation, lint, typecheck, and production build all run from documented npm scripts

### Public Site

- [ ] **PUB-01**: Visitor can browse the eight-page editorial system — Home, About, Residences, Amenities, Location, Developer, News & Events, Contact — on desktop and mobile
- [ ] **PUB-02**: Every public page carries one quiet, persistent "private consultation / book a viewing" invocation no more than one scroll away
- [ ] **PUB-03**: Visitor can view all 12 unit-type pages, each with tower/type, beds, interior/balcony/total area, ceiling height, outlook, floor plan, gallery, 360 tour, and enquiry entry
- [ ] **PUB-04**: Visitor can zoom and pan floor plans legibly at a 360px viewport and download a high-resolution plan
- [ ] **PUB-05**: Visitor can open a lazy-loaded 360 tour with a poster image and a graceful non-3D fallback that respects `prefers-reduced-motion`
- [ ] **PUB-06**: Visitor can read the News & Events index and article template, preserving author, date, and image integrity for all 58 migrated posts
- [ ] **PUB-07**: Visitor can find the show gallery through address, map, directions, hours, and a named sales-team directory at the legacy contact URL
- [ ] **PUB-08**: Visitor sees branded 404, empty, and error states that offer a way back into the journey
- [ ] **PUB-09**: Visitor can read the privacy notice, grant or refuse analytics/cookie consent, and reach a data-subject-request entry point that reaches a human
- [ ] **PUB-10**: Visitor can switch between English and Filipino on the pages that matter, with per-locale URLs and `hreflang`; no half-translated page ships
- [ ] **PUB-11**: Every public route meets the budgets: LCP under 2.0 s on 4G, CLS near zero, WCAG 2.2 AA, and no render-blocking legacy libraries

### SEO and Migration

- [ ] **SEO-01**: Every public page emits title, meta description, canonical, Open Graph image, and appropriate structured data, including Article schema without author email
- [ ] **SEO-02**: The legacy WordPress content — 12 unit pages, 58 news posts, media, and authors — is extracted and imported without loss of slugs, dates, or images
- [ ] **SEO-03**: A tested 301 map covers every legacy URL, including attachments, categories, tags, feeds, and paginated paths, with no redirect chains and query strings preserved

### Lead Capture and Tours

- [ ] **LEAD-01**: Prospect can submit a qualified enquiry with specific, separate consent and the record carries first-touch and last-touch source, UTM, referrer, and landing page
- [ ] **LEAD-02**: Sales receives an immediate notification for each new qualified lead, with the attribution and context needed to respond
- [ ] **LEAD-03**: Prospect can book a show-gallery tour against real staff/slot availability with timezone handling, double-booking prevention, confirmation email, and an ICS attachment
- [ ] **LEAD-04**: Prospect can reschedule or cancel a booked tour through a confirmed path that updates the calendar and notifies the assigned seller
- [ ] **LEAD-05**: Prospect can request the project dossier only after a consented lead capture; delivery uses expiring signed URLs and no public Google Drive links

### Identity, Access, and Audit

- [ ] **AUTH-01**: Staff can log in to `/ops` with Payload auth, and every request is authorized server-side by role with deny-by-default behavior
- [ ] **AUTH-02**: A seller sees only the leads, clients, tours, and reservations they are permitted to see; role scoping is enforced in queries, not only in the UI
- [ ] **AUTH-03**: Every privileged action, assignment change, status transition, price change, and export writes an append-only audit event that cannot be updated or deleted
- [ ] **AUTH-04**: Admin can create and manage users, teams, and roles, and can revoke a session

### Consent and Privacy

- [ ] **CONS-01**: Consent is recorded as an append-only ledger entry per purpose, policy version, timestamp, channel, and evidence, and withdrawal is a new entry rather than an overwrite
- [ ] **CONS-02**: Every downstream use — contact, dossier, enrichment, KYC, analytics — reads current consent state and fails closed when consent is absent or withdrawn
- [ ] **CONS-03**: Staff can answer "why are we allowed to contact this person?" from the client record, showing the exact purpose, version, and timestamp

### Ops: Leads and Pipeline

- [ ] **OPS-01**: Seller can work a unified lead inbox with saved views, filters (source, stage, owner, SLA state, language, budget), server-side pagination, and bulk assign
- [ ] **OPS-02**: Seller can open a Client 360 record showing contact, consent state, source history, unit interests, notes, tasks, and documents
- [ ] **OPS-03**: Seller can see and act on a chronological activity timeline of calls, emails, meetings, tour outcomes, notes, and logged message excerpts
- [ ] **OPS-04**: Seller can move a lead through a pipeline of admin-configurable stages with stage ageing, next action, and owner
- [ ] **OPS-05**: Leads are routed by round-robin, source, language, team, or manual override, and every assignment change is audited
- [ ] **OPS-06**: Time-to-first-contact, time-in-stage, and tour follow-up SLA timers run and surface visible breaches and escalations
- [ ] **OPS-07**: Staff receive in-app and templated email notifications for new lead, SLA breach, tour booked, hold expiring, reservation created, and KYC pending
- [ ] **OPS-08**: Seller sees a rule-based lead score with its visible factors (source, declared budget/timeline, engagement, SLA risk) and can explain it
- [ ] **OPS-09**: Staff can search across leads, clients, units, and documents using Postgres full-text/trigram search
- [ ] **OPS-10**: A user can export the current filtered lead/client view to CSV, and each export is audit-logged

### Ops: Inventory and Reservations

- [ ] **INV-01**: Staff can browse inventory as towers, floors, and units with attributes, status (`not_released`, `available`, `held`, `reserved`, `sold`), price, currency, and price history
- [ ] **INV-02**: Status transitions are state-machine validated; no free-text status or unchecked write can change a unit's state
- [ ] **INV-03**: Staff can place a hold with expiry, reason, and owner, and the system prevents the same unit being double-sold under concurrency
- [ ] **INV-04**: Staff can create a reservation with buyer and co-buyer, unit, scheme, reservation-fee status, validity window, document checklist, and cancellation/forfeiture reason
- [ ] **INV-05**: Sales can manage tours and appointments — calendar, assignment, outcome, no-show, and reschedule — closing the loop on public bookings
- [ ] **INV-06**: Staff can manage a versioned document library (brochures, price lists, floor plans, reservation forms) with access control and signed URLs; price lists are never public and never silently stale

### Ops: Client Intelligence and Compliance

- [ ] **CLIENT-01**: Staff can record structured declared intent — budget band, timeline, financing route, occupancy intent, decision-makers, citizenship/residency — with a completeness indicator
- [ ] **CLIENT-02**: Consent-gated declared-data enrichment records company/domain lookup on the client, with source and timestamp, and never infers undeclared facts
- [ ] **CLIENT-03**: Duplicate candidates are detected by normalized email/phone, and merge is non-destructive, re-points activities, and preserves both source records in audit
- [ ] **KYC-01**: At reservation, staff can open a KYC/AML case with identity capture, document upload, and beneficial-ownership checklist for juridical buyers
- [ ] **KYC-02**: Screening is recorded as a case with a manual decision and rationale, not a boolean, and is gated by a completed DPIA before go-live
- [ ] **KYC-03**: KYC and reservation documents are stored with private Blob access and retention metadata; access is role-scoped and audited

### Ops: Content, KPIs, and Reporting

- [ ] **CMS-01**: Editor can manage pages, unit types, amenities, news, media, SEO metadata, and translations in Payload with preview and publish workflow
- [ ] **CMS-02**: Content editors can publish without developer involvement and cannot build arbitrary layouts that break the design system
- [ ] **KPI-01**: Dashboard shows leads, tours, reservations, conversion, first-response time, unit velocity, and source ROI, each with a visible definition
- [ ] **KPI-02**: Unit velocity and absorption are calculated against released inventory, with trailing-3-month defaults and launch-quarter exclusion
- [ ] **KPI-03**: Staff can export KPI/report data to CSV, and every export is audit-logged

## v2 Requirements

Deferred until the console is in daily use and leads are measurable.

### Public

- **PUB-V2-01**: Visitor can compare 2–3 residence types side by side
- **PUB-V2-02**: Enquiry form arrives pre-filled with unit type, tower, and page journey
- **PUB-V2-03**: Advisor-delivered payment scenario as an expiring share link
- **PUB-V2-04**: Digital sales room: branded expiring link with unit, plan, indicative schedule, and dossier
- **PUB-V2-05**: Opt-in availability signal on unit pages (status only, never price or buyer identity)
- **PUB-V2-06**: Tour page as a produced visit: what to expect, arrival, parking, what to bring
- **PUB-V2-07**: Progressive profiling for returning known leads

### Ops

- **OPS-V2-01**: Multi-touch attribution and source ROI to reservation value, net of price
- **OPS-V2-02**: Next-best-action queue ranked by SLA risk, declared intent, and stage ageing
- **OPS-V2-03**: Honest velocity panel with months-to-sellout by tower and unit type
- **OPS-V2-04**: Data-subject-request workflow (access, correction, erasure, portability)
- **OPS-V2-05**: Discount and price-change approval workflow with reason codes
- **OPS-V2-06**: Audit-ready compliance-pack export
- **OPS-V2-07**: Language-preference routing from public site to seller
- **OPS-V2-08**: Reservation risk flags (financing unconfirmed, documents outstanding, KYC pending, hold expiring)
- **OPS-V2-09**: Corporate/juridical buyer path with registry lookup
- **OPS-V2-10**: Full dedupe/merge review UI on top of v1 detection

### Later

- **LATER-01**: Resident portal (separate auth boundary)
- **LATER-02**: CRM, messaging, calendar-sync, payment, and e-sign integrations
- **LATER-03**: Broker channel portal and commissions
- **LATER-04**: ML lead scoring / AI assist once closed-won history exists
- **LATER-05**: Multi-project support
- **LATER-06**: Chinese language

## Out of Scope

| Feature | Reason |
|---------|--------|
| Covert OSINT or profiling of prospects | Unlawful under PH DPA (RA 10173) and GDPR without a lawful basis; replaced by consented enrichment + KYC |
| Public display of unit pricing | Client business policy; pricing stays behind sales login |
| Project-level research output | Replaced by a direct audit of the existing live site |
| Chinese-language launch | Launch languages are English and Filipino; revisit post-launch |
| Third-party CRM/payments/messaging/calendar integrations at launch | Vendors undecided; deferred to a later phase |
| Online reservation payments | Deferred with the integrations phase |
| Rebuilding legacy 360 tours from scratch | Reuse existing assets initially |
| Native mobile apps | Responsive web first |

## Traceability

Which phases cover which requirements. Filled by the roadmapper.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | TBD | Pending |
| FOUND-02 | TBD | Pending |
| FOUND-03 | TBD | Pending |
| FOUND-04 | TBD | Pending |
| FOUND-05 | TBD | Pending |
| FOUND-06 | TBD | Pending |
| PUB-01 | TBD | Pending |
| PUB-02 | TBD | Pending |
| PUB-03 | TBD | Pending |
| PUB-04 | TBD | Pending |
| PUB-05 | TBD | Pending |
| PUB-06 | TBD | Pending |
| PUB-07 | TBD | Pending |
| PUB-08 | TBD | Pending |
| PUB-09 | TBD | Pending |
| PUB-10 | TBD | Pending |
| PUB-11 | TBD | Pending |
| SEO-01 | TBD | Pending |
| SEO-02 | TBD | Pending |
| SEO-03 | TBD | Pending |
| LEAD-01 | TBD | Pending |
| LEAD-02 | TBD | Pending |
| LEAD-03 | TBD | Pending |
| LEAD-04 | TBD | Pending |
| LEAD-05 | TBD | Pending |
| AUTH-01 | TBD | Pending |
| AUTH-02 | TBD | Pending |
| AUTH-03 | TBD | Pending |
| AUTH-04 | TBD | Pending |
| CONS-01 | TBD | Pending |
| CONS-02 | TBD | Pending |
| CONS-03 | TBD | Pending |
| OPS-01 | TBD | Pending |
| OPS-02 | TBD | Pending |
| OPS-03 | TBD | Pending |
| OPS-04 | TBD | Pending |
| OPS-05 | TBD | Pending |
| OPS-06 | TBD | Pending |
| OPS-07 | TBD | Pending |
| OPS-08 | TBD | Pending |
| OPS-09 | TBD | Pending |
| OPS-10 | TBD | Pending |
| INV-01 | TBD | Pending |
| INV-02 | TBD | Pending |
| INV-03 | TBD | Pending |
| INV-04 | TBD | Pending |
| INV-05 | TBD | Pending |
| INV-06 | TBD | Pending |
| CLIENT-01 | TBD | Pending |
| CLIENT-02 | TBD | Pending |
| CLIENT-03 | TBD | Pending |
| KYC-01 | TBD | Pending |
| KYC-02 | TBD | Pending |
| KYC-03 | TBD | Pending |
| CMS-01 | TBD | Pending |
| CMS-02 | TBD | Pending |
| KPI-01 | TBD | Pending |
| KPI-02 | TBD | Pending |
| KPI-03 | TBD | Pending |

**Coverage:**
- v1 requirements: 59 total
- Mapped to phases: 0 pending roadmapper
- Unmapped: 59

---
*Requirements defined: 2026-10-25*
