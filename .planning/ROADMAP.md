# Roadmap: The Velaris Residences

## Overview

A two-product platform built in dependency order: first the toolchain, deploy topology, and URL contract that cannot be retrofitted; then the content model and the cinematic public site that turns brand desire into a booked tour; then identity, consent, and audit before any prospect PII is stored; then the sales console that works that demand; then the inventory, reservation, KYC, and reporting depth that converts a tour into a sale. Every phase ends at a boundary a human can verify from the outside, and three decisions are frozen early because they are unrecoverable later: the URL contract, the append-only consent ledger, and the boundary that keeps price, inventory, and KYC data out of the public layer.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Guardrails** - Working toolchain, production topology, and a frozen URL contract
- [ ] **Phase 2: Design System, Aesthetic Shell & Public Flow** - A fully navigable eight-page public shell that proves the brand's visual language and page flow
- [ ] **Phase 3: Public Site, Unit Pages & SEO Parity** - Eight editorial pages, 12 unit pages, tours, and one-hop legacy redirects
- [ ] **Phase 4: Identity, RBAC, Audit & Ops Shell** - Server-side role enforcement and an append-only audit trail before any PII
- [ ] **Phase 5: Lead Capture, Consent & Tour Booking** - Consented, attributable leads and confirmed show-gallery tours
- [ ] **Phase 6: Lead Inbox, Pipeline, SLA & Notifications** - Sales works inbound demand end to end with ownership and deadlines
- [ ] **Phase 7: Inventory, Pricing, Holds & Reservations** - Unit state machine, concurrency-safe holds, and reservations
- [ ] **Phase 8: Client 360 Depth, KYC, Enrichment & Compliance** - Declared intent, consented enrichment, and KYC cases at reservation
- [ ] **Phase 9: KPIs, Attribution & Source ROI** - Fixed dashboard metrics that reconcile to the operational records
- [ ] **Phase 10: Hardening, Launch & Handover** - Cross-cutting verification, cutover, and client operator handover

## Phase Details

### Phase 1: Foundation & Guardrails
**Goal**: The project runs on a pinned, repeatable production topology with the URL contract frozen, so every later phase builds on decisions that cannot be retrofitted.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. `/admin` loads on the production-shaped deploy and one content CRUD round-trip persists to Neon and survives a redeploy.
  2. A written URL contract fixes the canonical host, locale rules, all 12 unit-page URLs, and all 58 legacy news URLs, with a crawl-derived redirect manifest committed alongside it.
  3. An anonymous request to any route returns HSTS, CSP, X-Frame-Options, and related headers, and no secret, author email, price, or KYC field appears in the response.
  4. A deliberately thrown server error shows a branded page, reaches error tracking scrubbed of PII, and exposes no stack trace or environment value.
  5. `migrate`, `generate:types`, `lint`, `typecheck`, and `build` all run from documented npm scripts and pass from a clean clone in CI, failing on generated-type drift.
**Plans**: TBD

### Phase 2: Design System, Aesthetic Shell & Public Flow
**Goal**: A prospect can move through the entire public journey — Home, About, Residences, a representative unit, Amenities, Location, Developer, News, and Contact — on a fully styled responsive shell that proves the brand's visual language before content migration, so the design system and page flow are approved on sight.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: CMS-01, CMS-02, SEO-02
**Success Criteria** (what must be TRUE):
  1. A reviewer navigates the full eight-page public flow on desktop, tablet, and 360px mobile, and every page shares one header, footer, type scale, spacing rhythm, color token set, and motion language, with the persistent consultation/book-a-viewing invocation never more than one scroll away.
  2. The design system is codified as tokens plus a locked block library — hero, editorial split, full-bleed gallery, amenity grid, unit selector/card, pull quote, CTA band, and contact — and editors can compose pages only from those blocks in Payload, with no layout, type, or spacing value overridable outside the system at any breakpoint.
  3. A representative unit page presents a legible floor plan, a 360-tour poster with a non-3D fallback, and a gallery, and every page passes visual QA at 360/768/1440px with no overflow, no WCAG 2.2 AA contrast failure, near-zero CLS, and no motion under prefers-reduced-motion.
  4. The EN/FIL switch renders the same shell on per-locale URLs with no layout shift, and every content type carries an English and a Filipino value with translation completeness visible per record before publish.
  5. An editor publishes a page, a unit type, an amenity, and a news post in Payload with live preview and zero developer involvement; all 58 legacy news posts and the full unit-type set import with original slugs, dates, de-personalized bylines, and images intact, and the import report shows zero unresolved required fields.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Public Site, Unit Pages & SEO Parity
**Goal**: A prospect moves from brand inspiration to a unit enquiry across the full editorial site, every legacy URL lands where it used to, and no price appears anywhere in the public layer.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: PUB-01, PUB-02, PUB-03, PUB-04, PUB-05, PUB-06, PUB-07, PUB-08, PUB-10, PUB-11, SEO-01, SEO-03
**Success Criteria** (what must be TRUE):
  1. A visitor browses Home, About, Residences, Amenities, Location, Developer, News & Events, and Contact on mobile and desktop, and every page carries one persistent consultation/book-a-viewing invocation no more than one scroll away.
  2. A visitor opens any of the 12 unit types, reads the area breakdown, zooms and pans the floor plan at 360px, downloads the high-resolution plan, and click-loads the 360 tour with a poster and a non-3D fallback.
  3. A visitor reads the news index and an article, finds the show gallery at the legacy contact URL with address, map, directions, hours, and named sales team, and lands on a branded 404 or error state that offers a way back.
  4. Every legacy URL in the Phase 1 manifest reaches a 200 in one hop with UTM parameters intact, and every page emits title, meta description, canonical, Open Graph image, and structured data without an author email.
  5. Every public route meets LCP under 2.0 s on throttled 4G, near-zero CLS, WCAG 2.2 AA, no render-blocking legacy library, and the EN/FIL switch works with per-locale URLs and `hreflang`, with no half-translated page published.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Identity, RBAC, Audit & Ops Shell
**Goal**: Staff access is authenticated, role-scoped server-side, and every privileged action is permanently attributable — established before the first prospect record exists.
**Mode:** mvp
**Depends on**: Phase 2 (may run in parallel with Phase 3)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. A staff member logs in to `/ops` with Payload auth and lands in the console shell, while an anonymous request to any `/ops` page, Server Action, or route handler is denied by default.
  2. A seller sees only the leads, clients, tours, and reservations they are permitted to see, verified through direct REST and GraphQL calls rather than the UI alone.
  3. An admin creates a user, assigns a role and team, and revokes an active session that immediately stops working.
  4. Every privileged action, assignment change, status transition, price change, and export writes an append-only audit event that cannot be updated or deleted, even by a database role.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Lead Capture, Consent & Tour Booking
**Goal**: A prospect can move from a public page to a consented, attributable lead with a confirmed show-gallery tour, and staff can prove on what basis they are allowed to contact that person.
**Mode:** mvp
**Depends on**: Phase 3, Phase 4
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, CONS-01, CONS-02, CONS-03, PUB-09
**Success Criteria** (what must be TRUE):
  1. A prospect submits a qualified enquiry with separate per-purpose consent; the record carries first-touch and last-touch source, UTM, referrer, and landing page, and sales receives an immediate notification with that context.
  2. A prospect books a show-gallery tour against real slot availability, cannot double-book a slot, and receives a confirmation email with an ICS attachment in the correct timezone.
  3. A prospect reschedules or cancels an existing tour through a confirmed path that updates the calendar and notifies the assigned seller, and can request the dossier only after consented capture, receiving an expiring signed URL instead of a public Google Drive link.
  4. Staff can show, from a client record, the exact purpose, policy version, and timestamp behind contact permission; withdrawal creates a new ledger entry, and every downstream use — contact, dossier, enrichment, KYC, analytics — fails closed when consent is absent or withdrawn.
  5. A visitor can read the privacy notice, grant or refuse analytics/cookie consent, and reach a data-subject-request entry point that reaches a human.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Lead Inbox, Pipeline, SLA & Notifications
**Goal**: Sales works every inbound lead from one inbox and drives it to a tour outcome, with ownership, deadlines, and full context visible at a glance.
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: OPS-01, OPS-02, OPS-03, OPS-04, OPS-05, OPS-06, OPS-07, OPS-08, OPS-09, OPS-10, INV-05
**Success Criteria** (what must be TRUE):
  1. A seller filters and saves views across source, stage, owner, SLA state, language, and budget with server-side pagination, bulk-assigns leads, searches across leads, clients, units, and documents, and exports the filtered view to CSV with the export audit-logged.
  2. A seller opens a client record showing contact, consent state, source history, unit interests, notes, tasks, and documents, plus a chronological timeline of calls, emails, meetings, tour outcomes, notes, and logged message excerpts.
  3. A lead moves through admin-configurable stages with stage ageing, next action, and owner; routing by round-robin, source, language, team, or manual override is audited, and each lead shows a rule-based score with its visible factors explained in plain language.
  4. Time-to-first-contact, time-in-stage, and tour follow-up timers surface breaches and escalations, and staff receive in-app and templated email notifications for each named event.
  5. A seller records a tour outcome — attended, no-show, rescheduled — from a calendar of assigned appointments, closing the loop on public bookings.
**Plans**: TBD
**UI hint**: yes

### Phase 7: Inventory, Pricing, Holds & Reservations
**Goal**: Staff can move a unit from available to reserved without ever double-selling it, and every price on a reservation is provable against its history.
**Mode:** mvp
**Depends on**: Phase 6
**Requirements**: INV-01, INV-02, INV-03, INV-04, INV-06
**Success Criteria** (what must be TRUE):
  1. Staff browse inventory as towers → floors → units with attributes, status, price, currency, and price history, and price is returned only to permitted roles.
  2. An illegal status transition is rejected by the state machine, and no free-text or unchecked write can change a unit's state.
  3. Two staff placing a hold on the same unit concurrently produce exactly one success and one expiry-bound hold with reason and owner.
  4. Staff create a reservation with buyer and co-buyer, unit, scheme, reservation-fee status, validity window, document checklist, and cancellation/forfeiture reason, with the price snapshotted at creation.
  5. Staff manage a versioned document library with access control and signed URLs, and a price list can neither be served publicly nor be silently stale.
**Plans**: TBD
**UI hint**: yes

### Phase 8: Client 360 Depth, KYC, Enrichment & Compliance
**Goal**: Sales knows what the buyer actually declared and can open a defensible KYC case at reservation, with every enrichment and document access consented, role-scoped, and audited.
**Mode:** mvp
**Depends on**: Phase 7
**Requirements**: CLIENT-01, CLIENT-02, CLIENT-03, KYC-01, KYC-02, KYC-03
**Success Criteria** (what must be TRUE):
  1. Staff record structured declared intent — budget band, timeline, financing route, occupancy intent, decision-makers, citizenship/residency — and see a completeness indicator.
  2. A consented enrichment run records the company/domain lookup with source and timestamp, never infers undeclared facts, and is blocked outright when consent is absent or withdrawn.
  3. Duplicate candidates surface by normalized email and phone, and a merge re-points activities, preserves both source records in audit, and is non-destructive.
  4. At reservation, staff open a KYC/AML case with identity capture, document upload, and a beneficial-ownership checklist for juridical buyers, and screening is recorded as a case with a manual decision and rationale rather than a boolean.
  5. KYC and reservation documents live in private storage with retention metadata, access is role-scoped and audited on every view, and KYC go-live remains blocked until the DPIA is signed.
**Plans**: TBD
**UI hint**: yes

### Phase 9: KPIs, Attribution & Source ROI
**Goal**: Leadership sees leads, tours, reservations, conversion, response time, unit velocity, and source ROI — each with one definition that reconciles to the underlying records.
**Mode:** mvp
**Depends on**: Phase 8
**Requirements**: KPI-01, KPI-02, KPI-03
**Success Criteria** (what must be TRUE):
  1. The dashboard shows leads, tours, reservations, conversion, first-response time, unit velocity, and source ROI, and each metric exposes its definition in place.
  2. Unit velocity and absorption compute against released inventory with trailing-3-month defaults and launch-quarter exclusion, and reconcile exactly to the unit list for the same filters.
  3. Staff export KPI and report data to CSV, and every export writes an audit event.
**Plans**: TBD
**UI hint**: yes

### Phase 10: Hardening, Launch & Handover
**Goal**: Everything the previous phases promised is verified under production conditions, and the client can operate the platform without the build team.
**Mode:** mvp
**Depends on**: Phase 9
**Requirements**: None new — this phase adds no v1 requirement; it verifies the cross-cutting promises of Phases 1–9 under production conditions.
**Success Criteria** (what must be TRUE):
  1. An unauthenticated crawl of every public route and its RSC/API payloads returns no price, buyer identity, or KYC data, and a role-matrix penetration test on `/ops` holds for direct REST and GraphQL calls.
  2. Every legacy URL resolves in one hop, `/fil` shows no untranslated page, and field CWV on a throttled mid-tier Android device meets the Phase 3 budgets.
  3. Keyboard-only tour booking and the 360 fallback pass a WCAG 2.2 AA audit, and split CSP, HSTS, `frame-ancestors`, and `nosniff` are live in production.
  4. A concurrent-reserve load test yields exactly one success, and a backup/PITR restore drill restores production data within the agreed window.
  5. Using only the handed-over runbooks, a client editor publishes a page live and a new lead is captured, assigned, notified, and visible inside the SLA.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Guardrails | 0/TBD | Not started | - |
| 2. Design System, Aesthetic Shell & Public Flow | 0/TBD | Not started | - |
| 3. Public Site, Unit Pages & SEO Parity | 0/TBD | Not started | - |
| 4. Identity, RBAC, Audit & Ops Shell | 0/TBD | Not started | - |
| 5. Lead Capture, Consent & Tour Booking | 0/TBD | Not started | - |
| 6. Lead Inbox, Pipeline, SLA & Notifications | 0/TBD | Not started | - |
| 7. Inventory, Pricing, Holds & Reservations | 0/TBD | Not started | - |
| 8. Client 360 Depth, KYC, Enrichment & Compliance | 0/TBD | Not started | - |
| 9. KPIs, Attribution & Source ROI | 0/TBD | Not started | - |
| 10. Hardening, Launch & Handover | 0/TBD | Not started | - |
