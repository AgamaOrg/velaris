# Project Research Summary

**Project:** The Velaris Residences — Digital Platform
**Domain:** Luxury real-estate marketing site + sales operations platform (single Next.js/Payload monolith, Metro Manila / PH market)
**Researched:** 2026-10-25
**Confidence:** HIGH for stack and platform mechanics; MEDIUM for feature scope and PH compliance implementation

## Executive Summary

This is not a website with an admin panel. It is two products with opposite design goals sharing one schema: a restrained, cinematic public site whose only job is to convert brand desire into a **booked show-gallery tour**, and a dense `/ops` console whose job is to convert that tour into a **reservation** under Philippine DPA and AMLC obligations. The research converges on one architecture: a single Next.js 16.4 application with three isolated route groups — `(site)` static/ISR, `(ops)` dynamic and `no-store`, `(payload)` generated admin — one Neon Postgres database, one Payload user collection, one permission model, and one durable Postgres-backed job queue. Microservices, a separate admin app, and a separate API service are explicitly rejected for launch; the workload is hundreds-to-thousands of leads per month and a few dozen staff.

The recommended approach is **schema-boundary enforcement before UI**. Three decisions carry most of the risk and cannot be retrofitted cheaply: (1) price/inventory/KYC data lives in separate collections with field-level access, never in a `units` record that a public page might serialize; (2) consent is an append-only event ledger with policy versions and hashes, not a boolean; (3) audit and consent writes join the business transaction and fail closed. Around those, the build order is fixed by dependency: foundations → content model and public site → identity/RBAC/audit → lead capture and consent → inbox/pipeline/tours → inventory and reservations → Client 360/KYC → reporting → hardening. Auth before PII, inventory invariants before reservation UI, KYC before reservation approval, reporting last.

The dominant risks are all *sequencing* risks, not technology risks. Serverless Postgres connection exhaustion and `autoRun` assumptions are well documented and easily avoided with `attachDatabasePool`, a pooled runtime URL, and a cron-protected job runner. The expensive mistakes are: treating SEO/redirect mapping as a launch task instead of a P0 URL contract; enabling Cache Components with Payload admin; shipping a spec that assumes Pano2VR tours when the live site actually uses Matterport; and assuming the client will deliver photography, unit data, and Filipino copy on time. Each has a cheap early mitigation and an unrecoverable late one.

## Key Findings

### Recommended Stack

The installed versions are already correct for the core: Next.js 16.4.2, React/React DOM 19.3.0, Tailwind 4.3.3 via `@tailwindcss/turbopack`. Payload 3.91.0 sits inside Next's supported peer window (`>=16.3.3 <17.0.0`), and every `@payloadcms/*` package must be pinned to exactly 3.91.0 because their peers are exact. Neon is the system of record, Vercel the host — with functions in `sin1` and Neon in `ap-southeast-1`, Node pinned to `24.x` (Vercel does not offer 26), and `engines.node` set so Vercel cannot drift.

The scaffold is **not** ready. Payload is not installed at all, TypeScript is 5.9.3 against a 6.0.3 requirement, `@types/node` is 20.x against a Node 24 deploy target, and there is no `withPayload` wrapper, no `@payload-config` alias, no `(payload)` route group, no `proxy.ts`, and no migration/typegen scripts. This is a P0 toolchain spike, not feature work.

**Core technologies:**
- **Next.js 16.4.2 App Router** — the whole product; note Middleware is renamed `proxy.ts`, `next lint` is removed, and `params`/`cookies()`/`headers()` are async.
- **Payload 3.91.0 (all sub-packages exact)** — content, auth, RBAC, Local/REST/GraphQL, jobs. Shared auth and schema are why it beats Sanity/headless WP here.
- **`@payloadcms/db-postgres` + `pg` 8.20.0 + `attachDatabasePool`** — pooled runtime URL, direct URL for migrations, `max: 1–3` per instance. Avoid `@payloadcms/db-vercel-postgres` (second driver model).
- **Neon Postgres (ap-southeast-1)** — system of record for content, inventory, CRM, consent, audit, jobs, sessions.
- **Vercel Blob** — public adapter for marketing media only; **direct `@vercel/blob` with `access: 'private'`** for KYC/reservation documents, because the Payload adapter is public-only.
- **Payload jobs + cron-protected `/api/cron/jobs`** — durable, retryable, idempotent. `jobs.autoRun` is never used.
- **Resend via `@payloadcms/email-resend`** — called from jobs, never inside `afterChange`.
- **Radix UI + Tailwind 4 + CVA + `motion` (small islands only)** — accessible primitives; restrained motion to protect LCP.
- **Vitest 5 + Playwright 1.64 + `eslint .`** — Next 16 has no `next lint`; flat config only.

### Expected Features

The governing rule from PROJECT.md is the correct filter and should be enforced literally: every interactive element must trace to a lead, a tour, a reservation, a compliance obligation, or a decision. Research classifies a large set of plausible features as **theater** — AI concierge, mortgage calculator, 3D unit configurator, VR/AR, pop-ups, live chat, public accounts, ML lead scoring, dynamic pricing, BI dashboard builder, broker portal. The roadmap should carry these on an explicit defer list with triggers, not silently drop them.

**Must have (launch):**
- Eight-page editorial system, 12 unit-type pages (area breakdown, floor plan, gallery, tour, enquiry), floor-plan viewer readable at 360 px — the brand contract and the decision surface.
- 360 tour, click-to-load with poster and non-3D fallback — high desire value, existing assets.
- **Slot-based tour booking with holds, confirmation, ICS, reschedule** — a contact form is not a booking; this is the named conversion event.
- Lead capture with **purpose-specific consent, first/last-touch UTM, server-side capture, instant sales notification**.
- Brochure/dossier gated by lead capture and expiring signed URLs — replaces the live site's Google Drive links.
- SEO foundation + redirect map for 12 unit pages and 58 news posts, **built before cutover**.
- EN + Filipino with per-locale URLs and `hreflang`; human-written Filipino editorial, not machine translation.
- **O1 auth + RBAC + append-only audit** and **O7 consent ledger** — foundation, not compliance cleanup.
- Lead inbox, Client 360, pipeline, assignment/routing, SLA timers, activity log, notifications.
- Inventory (units → floors → towers, status state machine), transactional holds, reservation record.
- Tour management, CMS for all content, fixed KPI dashboard + CSV export with audited exports.
- KYC/AML **case structure** with manual screening, gated by DPIA.

**Should have (competitive, v1.x):**
- Context-carrying enquiry (form pre-filled with unit type, journey, campaign) — highest value-to-cost ratio in the research.
- Residence comparison (2–3 unit types side by side) — converts 12-type confusion into a shortlist.
- Advisor-led payment scenario as an expiring share link + light **digital sales room** — answers "what does this cost per month" without publishing price.
- Multi-touch attribution and source ROI to reservation value; honest velocity panel (trailing 3 months, released-vs-total inventory).
- Next-best-action queue, structured declared-intent capture, dedupe/merge, DSR workflow, compliance pack export.
- Developer provenance module (Hongkong Land + Robinsons Land track record) — trust is the actual purchase barrier.

**Defer (v2+):**
- Juridical/corporate buyer path, broker/channel portal, resident portal, CRM/messaging/calendar/payment/e-sign integrations, ML scoring, multi-project support, Chinese.
- Every anti-feature listed above — explicitly, with the substitute named.

### Architecture Approach

One app, three route groups, three root layouts, no root `app/layout.tsx`. The public site never imports ops modules or `@payloadcms/ui`; `/ops` never touches SQL directly; all business rules live in `modules/*/service.ts`, all authorization in `src/access/*` shared by both surfaces. The mandatory pattern is `requireUser(permission)` on every `/ops` page, Server Action, and route handler, then `payload.find({ user, overrideAccess: false })` — because **Payload's Local API bypasses access control by default**. Proxy does locale rewrite, security headers, and a coarse cookie redirect only; it is never an authorization boundary.

Side effects go through a **transactional outbox**: the business write, audit event, consent event, and job record commit together, and the worker sends email/revalidates/calls providers afterwards. This is mandatory because `afterChange` hooks run inside the transaction and can email a confirmation for a row that later rolls back.

**Major components:**
1. `(site)/[locale]` — static/ISR Server Components, `generateStaticParams`, cookie-free, public-field DTOs only.
2. `(ops)/ops` — dynamic `no-store`, `requireUser`, row-level scoping in services, fixed opinionated views.
3. `(payload)` — generated admin, isolated; custom components kept minimal.
4. `proxy.ts` — locale rewrite (`/about` → `/en/about`, `/fil/*` explicit), headers, coarse redirect. Never `/api` (body buffering).
5. `src/modules/*` — transactions, state machines, invariants, outbox enqueue, audit/consent writes.
6. `src/jobs/*` + `/api/cron/jobs` — `notify-sales`, `send-tour-confirmation`, `revalidate-content`, `process-webhook`, `sync-kyc`, `retention-purge`.
7. Neon + Blob (public media / private documents) + external providers behind adapters.

**Non-negotiable schema decisions:** money as integer centavos; append-only `audit-events`, `consent-events`, `price-events`, `inventory-events` with `UPDATE`/`DELETE` revoked at the DB role; holds protected by a Postgres exclusion constraint on `(unit_id, tstzrange)`; reservation by a partial unique index; normalized contact fields with `citext`; `legacyUrl` stored on the destination record so the redirect map is generated, not hand-maintained.

### Critical Pitfalls

1. **Pricing leaks through the render/cache/API boundary.** A client component receiving `unit` instead of a `PublicUnit` DTO, a prerendered "logged-in" page, or `/api/units` returning price to an anonymous request. Prevent with separate `unit-prices` collection, field-level access, a server-only DAL with an explicit allowlist, and an e2e crawl asserting no `price`/`₱`/`perSqm` keys in public HTML or RSC payloads.
2. **Consent recorded as a boolean.** Cannot prove what was agreed, when, under which notice version, or for which purpose; withdrawal has no downstream suppression. Prevent with a purpose-specific append-only ledger storing policy version + content hash, collection point, channel, and evidence — built alongside auth, before any lead capture.
3. **Double-selling a unit.** `if (unit.status === 'available') update(...)` races under serverless concurrency. Prevent with DB exclusion constraints + partial unique index + transaction with row locks, a state machine rejecting illegal transitions, price snapshotted on reservation, and a concurrent-reserve test asserting exactly one success.
4. **SEO migration treated as a launch checklist.** URL structure decided during implementation, 58 posts 404, UTM parameters dropped, proxy locale rewrite intercepting legacy paths before the redirect map. Prevent by freezing the URL contract in P0 (English at root, `/fil/` explicit, never `/en`), crawling the live site exhaustively, committing a redirect manifest, and verifying every legacy URL reaches 200 in one hop with `utm_*` intact.
5. **Assuming a background worker exists on Vercel.** `autoRun` never fires or fires twice; SLA timers stay at zero. Prevent with cron-protected `run` + `handle-schedules` endpoints, exactly one scheduling path, idempotent handlers, dead-letter visibility, and SLA state **computed on read** from stored timestamps.
6. **KYC documents in public storage** (the Payload Blob adapter is public-only and access mode is immutable). Prevent by preferring provider custody (store references only), or Private Blob behind an authenticated `no-store` route with short-lived signed URLs and audited views — after a DPIA.
7. **Luxury media destroying Core Web Vitals.** Autoplay hero video, multiple `priority` images, `fill` without `sizes`, 5.3 MB map PNG, 360 tour JS in the initial bundle. Prevent with one LCP candidate per page, poster-as-LCP for video, `next/font/local` with licensing verified, click-to-load tours, and CI-enforced media budgets.
8. **Cache Components + Payload admin.** Payload's admin is not fully compatible; a global flag affects the whole app. Disable `cacheComponents`/`partialPrefetching` for v1 and use static + ISR + tagged invalidation; reverse only with verified route-group isolation.

## Implications for Roadmap

The three research documents propose overlapping phase vocabularies that agree on dependency order but differ in granularity. The reconciled structure below follows ARCHITECTURE.md's build order, tightened by PITFALLS.md's "three decisions cannot be retrofitted" rule and FEATURES.md's "auth and consent ledger ship first" rule.

### Phase 1: Foundation & Guardrails
**Rationale:** Every later phase depends on a working schema/migration/deploy loop, and five decisions are cheap now and near-impossible later: URL contract, deploy topology/region/pooling, Blob access modes, the TS6/Payload toolchain spike, and the legal/data-model shape.
**Delivers:** TS 6.0.3 upgrade + `@types/node` 24; Payload 3.91 install, `payload.config.ts`, `(payload)` route group, `withPayload`, `@payload-config` alias, `instrumentation.ts`, `proxy.ts`; Neon pooled/unpooled env split; Vercel `sin1` + Neon `ap-southeast-1`; `engines.node: 24.x`; CI running `payload generate:types` (fail on diff), `eslint .`, `tsc --noEmit`, `payload migrate` before `next build`; design tokens and type system; a crawl-derived redirect manifest stub; a written URL contract; explicit decision on Cache Components (recommend: disabled); content audit with named owners.
**Addresses:** Toolchain gaps in STACK.md; P10 URL contract; P14 performance budget as a design constraint.
**Avoids:** Pitfalls 2 (Postgres/env entanglement), 4 (SEO as launch task), 11 (i18n retrofit), 15 (TS6/toolchain month), 13 (content readiness).
**Exit:** `/admin` loads, one CRUD round-trip works, `migrate` + `build` green in CI, staging deploy repeatable, redirect manifest exists.

### Phase 2: Content Model, Design System & Public Shell
**Rationale:** The public site validates the content model before ops logic hardens around it, and the schema must be right before any localization toggle (toggling `localized` after data exists destroys values).
**Delivers:** Payload collections for `pages`, `unit-types` (exactly 12 records, pricing deliberately absent), `towers`, `amenities`, `news-posts`, `media`, `documents`, `site-settings`, `navigation`, `legal-documents`; localization schema for `en`/`fil` decided before import; Blob public adapter + `remotePatterns`; WordPress extraction via REST/WP-CLI (not raw XML), re-authored into Lexical blocks, Yoast metadata preserved, author byline de-personalized; import contract + admin validation (required fields, reconciled area totals, alt text, translation completeness); public design system, typography, responsive media budgets.
**Addresses:** P1 page system foundation, P11 news migration, P14 media budget, O14 CMS.
**Uses:** Payload 3.91, `@payloadcms/storage-vercel-blob`, neutralized `next/font/local`.
**Avoids:** Pitfall 16 (Elementor HTML migration), 13 (lorem-ipsum CMS), 10 (media budgets decided at design time).
**Research flag:** needs a phase-research pass for the WordPress extraction shape and asset inventory.

### Phase 3: Public Site, Unit Pages & SEO Parity
**Rationale:** This is the brand and demand engine and the largest content dependency. It forces the redirect map to be real before cutover, and it produces the DTO boundary that keeps price out of the public payload.
**Delivers:** Home/About/Residences/Amenities/Location/Developer/News/Contact; 12 unit-type pages via `generateStaticParams` with area breakdown, floor-plan viewer (CSS transform + `<dialog>`, no canvas library), gallery, lazy 360 tour with poster and fallback; comparison-ready normalized attributes; SEO metadata/canonical/sitemap/structured data/OG images; `hreflang` and per-locale canonicals; branded 404/empty/error states; mobile-tappable contact affordances.
**Addresses:** P1–P5, P10–P12, P15, P9 (public half).
**Avoids:** Pitfall 1 (public DTOs only), 10 (CWV), 11 (locale URL correctness), 4 (one-hop redirects).
**Research flag:** **Highest-uncertainty phase.** Tour asset truth is unresolved — PROJECT.md says Pano2VR XML, the live Project Materials page links Matterport embeds for seven suites plus showroom, YouTube AVPs, and locally-hosted pages. Also unresolved: 11 vs 12 unit types, two competing unit URL families (`/residences/<slug>/` and `/units/<slug>/`), and font licensing for Freight Text. Verify all four before planning.

### Phase 4: Identity, RBAC, Audit & Ops Shell
**Rationale:** PII cannot be handled safely before auth, and retrofitting access functions into a working console means rewriting every query and re-testing every workflow. Deliberately placed *before* lead capture, not after the console exists.
**Delivers:** `users` collection with `useSessions: true`; `src/access/*` permission matrix (`leads:read`, `pricing:write`, `reservations:approve`, `kyc:review`, `audit:read`, …); `requireUser(permission)` in `src/lib/auth.ts`; `(ops)` route group and shell with `no-store`; `/ops/login` setting the `payload-token` cookie `Path=/`; Postgres-backed login throttling; append-only `audit-events` with DB-level `REVOKE UPDATE, DELETE`; audit writes inside the business transaction; role matrix tests including direct REST/GraphQL.
**Addresses:** O1, O21 (partial), O22 logging.
**Avoids:** Pitfall 8 (over-permissioning), 9 (rewritable audit), Architecture Anti-Patterns 1–2.
**Research flag:** Payload session-revocation behavior and the RBAC matrix need client sign-off; security-critical, sparse tolerance for guessing.

### Phase 5: Lead Capture, Consent & Tour Booking
**Rationale:** Core value — inspiration to a qualified, attributable, actionable lead. Consent ledger must exist before the first form, and the outbox must exist before the first notification.
**Delivers:** `leads`, `clients`, `lead-activities`, `consent-events`/`consent-state`; public forms as Server Actions with Zod validation; purpose-separated consent with notice version + hash; Turnstile server-side verification + Postgres rate limiting; server-side first/last-touch UTM, referrer, landing page; normalized email/phone with idempotency key (email + phone + form + time bucket); `notify-sales` and acknowledgement jobs; tour availability model, slot capacity, double-booking prevention, confirmation email + ICS, `Asia/Manila` display with explicit PHT for OFWs, reschedule/cancel; brochure gate with expiring signed URL; privacy notice, cookie consent, DSR intake.
**Addresses:** P6, P7, P8, P13, P17 (context inheritance comes nearly free here), O7, O8, O9, O13.
**Avoids:** Pitfall 6 (boolean consent), 17 (silent lead loss), 3 (worker assumptions for reminders).
**Research flag:** needs PH DPA consent copy legal review, email provider/DKIM/DMARC verification, and gallery operating hours/capacity — external dependencies, not engineering.

### Phase 6: Lead Inbox, Pipeline, SLA & Notifications
**Rationale:** Sales must be able to act on demand before inventory commitments make sense. SLA state is computed on read, so a missed cron degrades the dashboard but never loses the truth.
**Delivers:** Unified lead inbox with saved views, indexed server-side filters, bulk assign; configurable pipeline stages; round-robin/source/language routing with assignment audit; SLA timers (time-to-first-contact, time-in-stage) derived from timestamps; Client 360 with timeline-first layout; tasks; next-best-action queue on rules (not ML) with plain-language reasons; per-role templated notifications; language-preference routing; CSV export with audit entry.
**Addresses:** O2–O6, O26, O27, O31.
**Avoids:** Pitfall 3 (SLA fiction), and the "dashboard before state machines settle" rework trap.
**Note:** O26/O27 are marked v1.x in FEATURES.md but depend only on this phase's data. Pull forward if capacity allows — they are cheap here and awkward later.

### Phase 7: Inventory, Pricing, Holds & Reservations
**Rationale:** The operational core and the highest data-integrity risk. Invariants must exist in the database before any UI assumes them.
**Delivers:** `units` (status state machine `not-released → available → held → reserved → sold`), `unit-prices` (integer centavos, sales-only read), `price-events`, `inventory-events`, `holds` with `expiresAt` and a `btree_gist` exclusion constraint, `reservations` with partial unique index and 30-day validity/non-refundable-fee modelling, reservation state machine, nightly reconciliation job, price-change approval workflow with reason codes, document checklist, private Blob document route with audited reads.
**Addresses:** O10–O12, O15, O29, O32; P18/P19 pricing prerequisites.
**Avoids:** Pitfall 1 (pricing boundary), 12 (double-selling), 7 (public KYC storage).
**Research flag:** needs unit data quality review, price history policy, and sales/finance sign-off on the approval workflow — highest integrity risk in the project.

### Phase 8: Client 360 Depth, KYC, Enrichment & Compliance
**Rationale:** KYC is triggered at reservation, not at first contact — minimizing PII and conversion friction. It sits behind a DPIA and a private storage topology, which is why it is not earlier.
**Delivers:** `kyc-checks` with reference/status/redacted results only (no raw ID numbers); provider adapter + webhook + polling fallback; consent-gated `enrichment-runs`; dedupe/merge with non-destructive merge and audit; DSAR workflow with identity verification and SLA; `retention-policies` with dry-run purge job; compliance pack export; juridical buyer checklist (v2-ready); MFA for `/admin` and `/ops`; access review.
**Addresses:** O17, O18, O20, O23, O28, O30.
**Avoids:** Pitfalls 6, 7, 8, 9.
**Research flag:** **Blocking external dependency.** KYC vendor selection (Sumsub/Onfido/PH provider), DPIA, AMLA scope and retention period (commonly cited 5 years — confirm with counsel), cross-border transfer documentation. Do not start document ingestion before sign-off.

### Phase 9: KPIs, Attribution & Source ROI
**Rationale:** Reporting is a projection of operational data; building it earlier produces rework when state machines shift. Every metric needs one definition in code.
**Delivers:** KPI dashboard (leads, tours, reservations, conversion, first-response time, unit velocity, source ROI); visible metric-definition tooltips; velocity as trailing 3 months with launch quarter excluded and released-vs-total inventory distinguished; multi-touch attribution to reservation value; campaign cost input; indexed/date-bounded queries, materialized views only when measured.
**Addresses:** O16, O24, O25, P20.
**Avoids:** The "dashboard disagrees with the list view" failure and premature BI.

### Phase 10: Hardening, Launch & Handover
**Rationale:** Cross-cutting verification that the earlier phases' promises are actually true.
**Delivers:** Split CSP (static public / nonce ops), HSTS, `frame-ancestors`, `nosniff`; WCAG 2.2 AA audit including keyboard-only tour booking and 360 fallback; field CWV on throttled mid-tier Android segmented by country; redirect manifest verification (every legacy URL one hop to 200, UTMs intact); `/fil` completeness gate; unauthenticated price-leak crawl; role matrix penetration test; concurrent-reserve load test; backup/PITR restore drill; Sentry PII scrubbing verified; live publish-to-live drill; lead-failure drill; runbooks, client editor training, offboarding procedure; content freeze 2–3 weeks out.
**Addresses:** P14 verification, P10 cutover, O30 audit readiness.
**Avoids:** Every "looks done but isn't" item in PITFALLS.md.

### Phase 11 (later milestone): Resident Portal
Separate auth collection and cookie, resident units, service requests, announcements, facility bookings. Explicitly phased after the sales platform; a resident session must never be interpretable as a staff session.

### Phase Ordering Rationale

- **Auth and audit before PII, not after the console.** The single most expensive rework path in this project. Access functions shape every collection and every server action.
- **Consent ledger before the first form.** A checkbox field cannot be upgraded to an evidence ledger without losing historical proof — the classic rewrite trigger.
- **Content before ops.** Validates the schema, forces SEO/i18n decisions early, and gives sales something to talk about.
- **Invariants before UI.** Exclusion constraints and state machines are designed before screens that assume them.
- **KYC last among data phases.** Triggered by commercial intent, gated by DPIA and vendor procurement.
- **Reporting last.** Clean operational data first; dashboards are a projection.
- **One differentiator per phase.** The anti-sprawl rule from FEATURES.md; each phase's "should-have" must be explicitly chosen, not accumulated.

### Research Flags

Phases likely needing `/gsd-plan-phase --research-phase <N>`:
- **Phase 1 (Foundation):** Payload 3.91 + Next 16.4 install specifics, TS 6 compatibility, Neon migration workflow, Cache Components decision under Payload admin.
- **Phase 2 (Content model):** WordPress REST/WP-CLI extraction shape, Yoast metadata mapping, Lexical block design, import contract.
- **Phase 3 (Public site):** **Critical.** Tour asset truth (Matterport vs Pano2VR), 11-vs-12 unit taxonomy, dual unit URL families, font licensing, legacy URL inventory.
- **Phase 4 (Auth/ops):** Payload session revocation, RBAC matrix sign-off.
- **Phase 5 (Leads/consent):** PH DPA consent copy, purpose taxonomy, email deliverability, dedupe thresholds.
- **Phase 7 (Inventory):** price history policy, reservation approval workflow, unit data reconciliation — highest integrity risk.
- **Phase 8 (KYC):** vendor selection, DPIA, AMLA retention/reporting, private Blob pattern verification.

Standard patterns (skip research-phase):
- **Phase 6 (Inbox/pipeline/SLA):** conventional CRM grammar; rules-based queue needs no novelty research.
- **Phase 9 (KPIs):** fixed metrics; the work is definitional, not exploratory.
- **Phase 10 (Hardening):** established checklists (CSP, WCAG, PITR drill) already enumerated in PITFALLS.md.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** (core) / **MEDIUM** (supporting) | Versions verified against lockfile, `node_modules` manifests, npm registry peers, and version-matched Next docs. MEDIUM on TS 6.0.3 alignment, next-intl + Cache Components interaction, and Tailwind 4 class sorting — all resolvable in the Phase 1 spike. |
| Features | **MEDIUM** | Cross-checked across vendor suites, PH market sources, and a direct audit of the live site. Feature *categories* are solid; the theater/valuable calls are reasoned judgment, explicitly labelled as hypotheses. |
| Architecture | **HIGH** (platform) / **MEDIUM** (domain) | Local Next 16.4.2 docs and Payload/Vercel official docs are authoritative for proxy, Local API, jobs, transactions, Blob, pooling. Data model and RBAC matrix are judgment calls needing sales/finance/client review. |
| Pitfalls | **HIGH** (framework) / **MEDIUM** (compliance) | Framework and platform mechanics verified against installed docs. PH DPA/AMLA implementation details are cross-checked but **not legal advice**; counsel and a DPIA are required. |
| **Overall** | **HIGH** | The technology path is unambiguous. Residual uncertainty is in content/assets, legal scope, and business rules — all external dependencies with named owners, not research gaps. |

### Gaps to Address

- **Tour asset truth (blocking Phase 3).** PROJECT.md describes Pano2VR XML for four unit types; the live Project Materials page uses Matterport embeds for seven suites plus a showroom. Re-audit the actual inventory before planning P5. If Matterport, the plan must address embed consent, performance, third-party availability, and licensing.
- **Unit taxonomy and URL inventory (blocking Phase 3 and the redirect manifest).** Nav presents North (6) + South (5) = 11 types, PROJECT.md says 12, and there are two crawlable URL families per unit. Confirm the canonical set and 301 the rest.
- **Pricing model shape (blocking Phase 7 and P18).** Per-sqm vs per-unit, tower premiums, discount rules, payment schemes (spot cash/deferred/bank/in-house). O10 and the payment-scenario engine cannot be specified without it.
- **KYC vendor and DPIA (blocking Phase 8).** Vendor choice drives data residency, webhook shape, cost, and DPIA scope. AMLA covered-transaction thresholds and retention must be confirmed with counsel — do not hard-code assumptions.
- **Filipino editorial capacity (highest schedule risk).** Who writes it, and how many pages for launch? Independent of translation tooling; machine translation is explicitly rejected.
- **Actual lead volume and team size.** Every "is this theater?" call shifts if the team handles 30 or 300 leads per month. Affects O26/O27 and the chatbot verdict.
- **Client content ownership and dates.** Photography, reconciled unit areas, legal copy, and 58 posts' images. Express as a workstream with named owners, not a dependency to chase.
- **Retention schedule per data class.** Needed for consent, DSR, compliance export, and a defensible DPIA.
- **Whether any public availability signal is permitted.** Business decision; default off, status only, never price.
- **Analytics/consent tooling.** Must record consent evidence, not merely block scripts; must not ship before the consent ledger.
- **Video approach.** Mux vs optimized MP4 depends on final asset inventory; affects cost and the media pipeline.
- **Cache Components decision.** Scaffold enables it; ARCHITECTURE.md recommends disabling for v1. Phase 1 must test the admin both ways and record the decision explicitly.
- **Private Blob pattern.** Verify token-authenticated private reads against `@vercel/blob@2.3.1` and track `payloadcms/payload#16319`; confirm the CVE-2026-93363 fix in the installed adapter.

## Sources

### Primary (HIGH confidence)
- Installed `package-lock.json` and `node_modules` manifests — exact versions, peers, engines.
- `node_modules/next/dist/docs/` (version-matched Next 16.4.2) — `proxy`, `cacheComponents`, `authentication`, `images`, `turbopack`, version-16 upgrade, ISR, CSP, i18n, redirects.
- npm registry (`npm view`) — Payload 3.91.0 peers/dependencies, adapter pins, GraphQL/Next peer ranges.
- Payload official docs — access control (Local API bypass), authentication/sessions, transactions/hooks, jobs queue (`autoRun` unsupported on serverless), Postgres adapter, localization field-shape warning, migrations, upload adapters.
- Vercel docs — Functions limits/runtimes/regions, Cron limits and precision, Blob public vs private (immutable access mode), `attachDatabasePool`, Queues/Workflows.
- Neon docs — PgBouncer transaction-mode pooling, `-pooler` vs direct connections, `max_connections`.
- TypeScript 6.0 release notes — changed defaults and deprecations.
- The Velaris Residences live site (direct audit, 2026-10-23) — observed IA, unit URLs, tour embeds, Drive brochures, consent copy.

### Secondary (MEDIUM confidence)
- PH DPA RA 10173; NPC Circular 2023-04 (consent) and 2023-07 (legitimate interest); NPC breach-notification rules (72-hour window — verify current text with counsel).
- AMLC / RA 9160 as amended by RA 10927 — developers as covered persons, CIP/CVP/BOV, reporting thresholds, retention.
- DHSUD PD 957, RA 4726 — License to Sell, condominium buyer protections.
- HBR, Oldroyd et al., "The Short Life of Online Sales Leads" (2011) — response-time evidence (old, directionally replicated).
- Wharton, "The Exclusivity Paradox" (2025); luxury-brand practitioner writing — exclusivity, restraint, gated access.
- PH market sources (Respicio & Co., MLS.ph, fng.ph, Taft Properties, 1Kalayaan) — reservation fee norms, 30-day validity, payment schemes, 40% foreign quota.
- Vendor feature inventories (Sell.Do, ArchiNord, BRIQ, Funderful, UnitFinder/Plyo, Matterport) — treated as marketing material, corroborated across suites.
- Ayala Land Premier, Rockwell Land, Shang Properties — PH luxury positioning benchmarks.

### Tertiary (LOW confidence — validate before relying)
- GSD `classify-confidence` seam returned LOW/SUS for some official npm packages; local lockfile and tarballs treated as higher authority.
- Tailwind 4 + Next guide and Vercel Blob access-control docs — package behavior verified locally, docs pages not re-fetched in session.
- "Feature theater" verdicts — reasoned positions, not measured outcomes.

---
*Research completed: 2026-10-25*
*Ready for roadmap: yes*
