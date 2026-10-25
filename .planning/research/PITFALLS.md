# Pitfalls Research

**Domain:** Luxury real-estate digital platform — cinematic public site + sales operations console (Metro Manila, Philippines)
**Researched:** 2026-10-23
**Confidence:** HIGH for framework/platform mechanics (verified against installed Next 16.4.2 docs and official Payload/Vercel/Neon docs); MEDIUM for compliance implementation details; LOW only where flagged "counsel required"

**Scope of this document:** failure modes specific to a Next.js 16.4 + Payload 3.91 rebuild on Vercel with Neon Postgres, a WordPress→Next SEO migration (12 unit pages, 58 posts), PH Data Privacy Act (RA 10173) consent/KYC handling, English + Filipino launch, and sales-only pricing. Generic web advice is deliberately omitted.

> **How to use this file:** the phase mapping is the actionable part. Phase numbers are provisional working names — renumber when the roadmap is written, but do not move the *prevention work* earlier or later without reading why it is placed there. Three pitfalls (URL contract, consent data model, price/private data boundary) are Phase 0 decisions that cannot be retrofitted cheaply.

## Phase vocabulary used in this document

| # | Working name | Purpose |
|---|--------------|---------|
| P0 | Foundations & Guardrails | Repo/toolchain, deploy topology, region/pooling, URL contract, legal/data-model decisions, content audit, observability skeleton |
| P1 | Design System & Public Shell | Tokens, type, motion, media budget, layout, accessibility baseline |
| P2 | CMS, Content Model & Migration Intake | Payload collections, localization schema, roles, Blob topology, WordPress extraction/import |
| P3 | Public Site & Unit Pages | Home/About/Residences/Amenities/Location/Developer/News/Contact, 12 unit pages, 360 tours, SEO metadata/schema |
| P4 | Lead Intake, Consent & Tour Booking | Forms, consent ledger, attribution, notifications, calendar holds |
| P5 | Sales Console, Inventory & RBAC | `/ops`, lead inbox, pipeline, inventory/reservations, KPI dashboards, audit log |
| P6 | Client 360 & KYC | Consented enrichment, dedupe, KYC/AML screening, private document handling, retention |
| P7 | SEO Parity, i18n & Launch | Redirect manifest verification, sitemap/hreflang, translation completeness, content freeze, cutover |
| P8 | Hardening, Observability & Handover | Penetration test, access review, audit verification, load tests, runbooks, client training, field CWV |

## The five decisions that prevent most of the damage

1. **Freeze the URL contract before the first page is built.** English stays at root; Filipino gets `/fil/`; no `/en` prefix; trailing-slash and host canonicalization decided once. SEO migration is a P0 architecture decision, not a P7 task.
2. **Split public and private data at the schema boundary, not the UI.** Price, cost, commission, KYC state, and internal notes live in separate collections/fields with field-level access. The public site cannot accidentally serialize what it never queries.
3. **Treat consent as an append-only event ledger and KYC documents as radioactive.** A boolean checkbox is not evidence; a public Blob URL is a breach waiting for a support ticket.
4. **Never rely on serverless `autoRun`, `after()`, or a Hobby cron for business-critical work.** Notifications, SLA timers, and KYC callbacks need a durable queue with retries, idempotency, and dead-letter alerting.
5. **Make content readiness and media budget launch gates.** "The client will send it" is the most common cause of a beautiful site launching with lorem ipsum and a 4-second LCP.

---

## Critical Pitfalls

### Pitfall 1: Hidden pricing leaks through the rendering, cache, or API boundary

**What goes wrong:**
Unit prices, inventory status, or price history appear in public HTML, the React Server Component (RSC) flight payload, a Payload REST/GraphQL response, an Open Graph image, a public brochure PDF, or a sitemap. Even when price is not rendered, passing a full `unit` object into a client component serializes it to the browser. A competitor scrapes the entire price list; the client's commercial policy is breached; sales loses its information advantage.

**Why it happens:**
Payload's access control is collection- and field-level, and the Local API **skips access control by default** (`overrideAccess: true`). Teams implement the gate in the UI ("sales users see this table"), not in the data layer. A single `units` collection mixes marketing fields and price fields. `use cache`, ISR, and `generateStaticParams` make one render shared across users. A "logged-in unit page" gets prerendered with price included. Public REST stays enabled because the frontend uses it.

**How to avoid:**
- Split `units` (public marketing data) from `unit_pricing` (price, status, terms, commission) and `unit_documents` (private). Use a `PublicUnit` DTO built by a server-only Data Access Layer with an explicit field allowlist — never `payload.find` straight into a component.
- Enforce auth before the first query on gated routes (`await requireSalesUser()`), and render them dynamically. Do not put `use cache` above an auth check; cached scopes cannot read `cookies()`/`headers()` and the workaround usually hoists auth out of the cached function.
- In Payload, set `access.read` on private collections to a role check and add field-level `access.read` on sensitive fields. Treat `hidden: true` as UI only, never security.
- Disable or tightly scope public REST/GraphQL for private collections. Test `/api/units?depth=3` and `/api/unit-pricing` unauthenticated.
- Private brochures/price sheets go in a **private** Blob store behind an authenticated route, not `public/` and not a public Blob URL.
- `robots.txt` disallow `/ops` and `/api`; send `X-Robots-Tag: noindex` on ops responses and all preview deployments; exclude `/ops` from sitemaps.
- Add a CI/e2e test that crawls every public route unauthenticated and asserts no price-like keys (`price`, `php`, `₱`, `perSqm`) and no private collection names in the RSC payload/network responses.

**Warning signs:**
- A client component receives `unit` instead of `publicUnit`.
- `overrideAccess` appears in a public code path without a comment.
- "We hide it with CSS" or "it's behind a login page" is the stated control.
- `/api/units` returns price fields to an anonymous request.
- Preview deployment URLs are indexed or shared with prospects.
- A PDF in `public/` or a public Blob store contains a price list.

**Phase to address:**
P2 (schema split + access rules), P3 (public rendering/DTOs), P5 (ops enforcement), P8 (adversarial verification).

---

### Pitfall 2: Serverless Postgres exhaustion and environment entanglement

**What goes wrong:**
Intermittent `too many connections`, `remaining connection slots are reserved`, or query timeouts under traffic and during builds. Worse: a Vercel Preview deployment writes to the production database, or a developer runs Payload's dev `push` against a shared branch and drops columns/content.

**Why it happens:**
Each Vercel function instance creates its own `pg` pool; concurrency scales horizontally and multiplies connections. A Neon 0.25 CU compute allows 104 connections total (97 usable). Builds prerender many pages in parallel, each worker with its own pool. Teams copy one `DATABASE_URL` into every Vercel environment. Payload's Postgres adapter enables Drizzle `push` in development by default, and it can generate destructive changes.

**How to avoid:**
- Runtime uses the **pooled** Neon string (hostname contains `-pooler`); migrations, `pg_dump`, and admin tooling use the **direct** string (`DATABASE_URL_UNPOOLED`). Neon's PgBouncer runs in transaction mode, which does not support session-level `SET`, session advisory locks, or SQL-level `PREPARE` — migration tooling often needs the direct connection.
- Set a small pool per instance (`max: 1–3`), `idleTimeoutMillis: 10_000`, `connectionTimeoutMillis: 5_000`, and reuse the pool across invocations via `globalThis` in development. Do not create a pool inside a request handler.
- Put Vercel Functions and Neon in the same region (Singapore `sin1` is the sensible default for PH traffic; Vercel's default is `iad1`, Washington DC). Hobby allows only one function region.
- Give Preview its own Neon branch and its own `DATABASE_URL`; never share production. Block destructive scripts when `VERCEL_ENV === 'production'` unless explicitly confirmed.
- Set `push: false` everywhere except local disposable databases; run `payload migrate` as an explicit release step with an advisory lock, not concurrently from every deploy/build.
- Load-test with 50 concurrent form submissions and watch `pg_stat_activity` and the Neon pooler graphs. Test a cold build with the DB reachable and note build-time connection count.

**Warning signs:**
- Connection graph is a sawtooth that tracks deploy/traffic spikes.
- "Works locally, times out on Preview."
- Preview and Production environment variables are identical.
- `payload migrate:create` output contains destructive warnings nobody reads.
- Content disappears after a deploy or a branch switch.
- p95 latency spikes every time a new function instance scales up.

**Phase to address:**
P0 (topology, regions, env scoping), P2 (migration policy), P8 (load test, restore drill).

---

### Pitfall 3: Assuming a background worker exists on Vercel

**What goes wrong:**
Tour reminders never send. SLA timers never fire, so "response time" is always zero. Enrichment and KYC jobs sit in `queued` forever. Or `autoRun` is configured, jobs run twice, and functions time out mid-workflow.

**Why it happens:**
Payload's Jobs Queue is capable, but its `autoRun` mode is for long-lived servers — the official docs say **never use it on serverless platforms**. Vercel Cron on Hobby runs at most once per day (a more frequent expression fails deployment); Pro allows per-minute. `after()`/`waitUntil` only extend the current invocation and die at the function's maximum duration (300 s Hobby, 800 s Pro); they provide no durability, retry, or dead-letter. Teams test the happy path once and never test provider failure.

**How to avoid:**
- Use Payload Jobs with two protected endpoints — `GET /api/payload-jobs/handle-schedules?queue=...` and `GET /api/payload-jobs/run?queue=...` — triggered by Vercel Cron (Pro) or an external scheduler. Protect both with `CRON_SECRET` or Vercel's cron header; an unauthenticated job drain is a denial-of-service and cost vector.
- Choose **one** scheduling path. Running the `handle-schedules` bin script and `autoRun` for the same queue duplicates jobs.
- For time-critical work (new lead → sales notification, booking confirmation), persist the lead/booking first, then enqueue; send through a transactional provider with retries and an idempotency key. Alert if delivery does not occur within 60 seconds.
- Derive SLA "overdue" state in queries (`now() > first_response_due_at`) so a missed cron degrades the dashboard but never loses the truth. A cron is a notifier, not the source of truth.
- Set per-route `maxDuration`, chunk large batches, and make job handlers idempotent (they will be retried).
- Store timestamps in UTC; schedule and render in `Asia/Manila`. Cron expressions are UTC — a "9am reminder" is `0 1 * * *` UTC.

**Warning signs:**
- `jobs.autoRun` in the Payload config.
- `payload-jobs` table growing with `status: queued` or `failed` and no one looking.
- Cron expression more frequent than daily on a Hobby plan (deployment fails).
- Duplicate reminder emails or duplicate enrichment charges.
- No dead-letter view and no alert on job failure.
- A "real-time" SLA dashboard that only updates when a job happens to run.

**Phase to address:**
P0 (plan tier + scheduler topology), P4 (notifications/reminders), P5 (SLA computation), P8 (failure drills).

---

### Pitfall 4: Treating SEO migration as a launch checklist

**What goes wrong:**
The new site launches with different URLs. Redirects cover the home page and 12 unit pages, but the 58 posts 404. UTM parameters vanish. The locale redirect rewrites legacy paths before the redirect map sees them. Brand searches land on a competing domain. Rankings and lead volume collapse for months.

**Why it happens:**
URL structure is decided during implementation, not before. The redirect map is built from the client's memory rather than a crawl. WordPress permalinks may be date-based or nested, and attachment/category/tag/feed/search URLs are forgotten. Next's `proxy` (formerly middleware) locale logic can intercept and redirect before `next.config` redirects. Teams use 308 (Next's `permanent: true`) while an SEO audit expects 301, or hand-build redirects that drop query strings.

**How to avoid:**
- Freeze the URL contract in P0: English at root, Filipino at `/fil/`, lowercase, no trailing slash, stable slugs, one canonical host (apex vs `www`), HTTPS only.
- Crawl the live site exhaustively (sitemap + full spider) including `/tour/*.xml`, `/feed`, `/wp-json`, `/xmlrpc.php`, attachment pages, paginated archives, category/tag/author pages, and every media URL. Produce a redirect manifest checked into the repo with source → destination → status → owner.
- Implement bulk redirects from the manifest in `next.config.ts`. Config redirects **do** preserve query strings; hand-built `NextResponse.redirect(new URL(...))` calls do not unless you copy `request.nextUrl.search`. Use `statusCode: 301` where the SEO tooling or client requires 301; Google treats 308 as permanent, but audits often flag it.
- Ensure proxy locale handling excludes legacy paths and never runs before the redirect map for those paths. Avoid redirect chains: every legacy URL should reach a 200 in **one** hop.
- Redirect the losing host to the winner; keep old media paths alive or 301 them to new Blob/CDN paths.
- Add `hreflang` (`en-PH`, `fil`, `x-default`), self-referencing canonicals per locale, and locale-specific sitemaps.
- Automate verification: fetch every manifest source, assert 301/308 → 200 in one hop, assert `utm_*` survives, assert no legacy URL returns 200 with different content.

**Warning signs:**
- Redirects live in a spreadsheet with no tests.
- `curl -I` on an old post returns 200 (soft 404) or 404.
- Two-hop chains (`/old` → `/new` → `/newer`).
- Analytics shows direct/none instead of campaign traffic after launch.
- Search Console shows "Page with redirect" spike followed by impressions collapse.
- Sitemap contains only new URLs, with no legacy coverage report.

**Phase to address:**
P0 (URL contract + crawl), P2 (manifest + content slugs), P7 (verification/cutover). Moving this to P7 is the failure.

---

### Pitfall 5: Cache Components + Payload Local API — build coupling, stale content, and poisoned caches

**What goes wrong:**
`next build` fails because CI cannot reach the database. Or editors publish and nothing changes for hours. Or a cached component renders one user's data for another. Or `use cache` reads `cookies()` and the build passes but the route fails under `next start`.

**Why it happens:**
Next 16's `cacheComponents` makes data dynamic by default and `use cache` opt-in. Cached functions **cannot** access `cookies()`, `headers()`, or `searchParams`; the restriction follows the call stack, and on a dynamically rendered route the error can surface only at runtime. Payload Local API calls during prerender require a DB at build. Payload `afterChange` hooks do not automatically invalidate Next's cache. `revalidateTag` now requires a `cacheLife` profile as a second argument, and teams tag by collection but forget entity/locale dimensions.

**How to avoid:**
- Write a cache policy table per route before coding: public marketing (static/ISR, tagged), unit pages (static, tagged by `unit:<slug>` + `locale:<locale>`), news index (tagged `posts`), `/ops` and KYC (dynamic, never cached).
- Put all Payload access behind a `server-only` DAL. Wrap only the data function in `use cache` with explicit serializable args (`slug`, `locale`), call `cacheTag` for entity + listing + locale, and set `cacheLife` deliberately.
- In Payload `afterChange`/`afterDelete` hooks, call `revalidateTag('unit:'+slug, 'max')` and the listing tag; use `updateTag` in server actions for read-your-writes. Verify the hook fires for Local API writes, REST writes, and seeded imports — if imports run in a standalone script, they cannot reach the Next cache; expose a revalidation route or run imports through the app.
- Never put `use cache` above `cookies()`/auth. Read session outside and pass a boolean/ID into the cached function if truly needed — but for gated data, don't cache at all.
- Preview: use `draftMode()` + Payload `draft: true` on a dynamic route; do not cache; noindex.
- Keep build behavior explicit: either build against a read replica/snapshot with a documented dependency, or make the build fail fast with an actionable message. Do not let a transient DB outage produce a half-static site.
- CI checks: build once with the DB unreachable to expose accidental static/DB coupling; e2e edit a page in Payload and assert the public page updates within the documented window.

**Warning signs:**
- `use cache` on a helper that eventually calls `getUser()` or `cookies()`.
- Single-argument `revalidateTag('x')` (TypeScript error on Next 16).
- Publishing requires a redeploy.
- A commit titled "disable caching, fix later."
- Build time grows linearly with posts × locales and starts timing out.
- Preview shows stale draft content or leaks a draft to the public.

**Phase to address:**
P2 (cache policy + hooks), P3 (implementation), P7 (publish-to-live drill).

---

### Pitfall 6: Consent recorded as a boolean instead of evidence

**What goes wrong:**
The site has a checkbox and a privacy-policy link, but cannot prove what a lead agreed to, when, under which notice version, or for which purposes. Marketing continues after withdrawal. Enrichment and KYC proceed on a basis the notice never disclosed. A data-subject request or NPC inquiry cannot be answered with evidence.

**Why it happens:**
Consent is treated as a form-validation field. Legal copy is written last. Teams conflate contract necessity (booking a tour) with marketing consent, and bundle everything into one checkbox. Notices are unversioned PDFs. Withdrawal has no downstream suppression. Under RA 10173, consent must be freely given, specific, informed, and evidenced; sensitive personal information (which includes government-issued IDs, age, and marital status) has stricter requirements under Section 13.

**How to avoid:**
- Model consent as an append-only ledger: subject, purpose code, lawful basis, action (grant/withdraw), notice version + content hash, collection point/URL, timestamp UTC, channel (web/phone/walk-in), evidence, actor (self/agent), and IP/UA only if actually relied upon.
- Separate purposes: `tour_booking`, `marketing_email`, `marketing_sms`, `analytics`, `enrichment`, `kyc_screening`, `profiling`. Do not pre-tick, do not bundle, and make "reject all" as prominent as "accept all."
- Publish a notice that names processors (Vercel, Neon, email provider, KYC vendor), retention periods, cross-border transfers, DPO contact, and rights. Version it; store the version with every consent.
- Build withdrawal as a first-class write that creates a suppression record checked by every outbound channel. Deletion requests must respect statutory retention (e.g., AML records) by restricting processing rather than silently deleting the audit trail.
- Implement a DSAR workflow (access, correction, erasure, portability) with identity verification, SLA tracking, and a response export.
- Run a DPIA before enrichment/KYC go-live and assess NPC registration obligations. Legal review is a gate, not a phase-end formality.

**Warning signs:**
- `consent: boolean` in the schema.
- No notice version stored anywhere.
- Marketing sends originate from a system that never reads the consent ledger.
- Copy says "by submitting, you agree to receive marketing…"
- Client 360 cannot list a client's consents and withdrawals.
- A deletion request is handled by `DELETE FROM leads` and the audit trail disappears.
- KYC vendor receives PII with no signed DPA or documented subprocessors.

**Phase to address:**
P0 (legal basis + data model), P4 (capture/proof), P6 (enforcement for enrichment/KYC), P8 (DSAR/withdrawal drill).

---

### Pitfall 7: Putting KYC documents in a public object store

**What goes wrong:**
Passport/ID scans, proof of income, and signed reservation forms are stored as public Vercel Blob objects (or in `public/`), then leak via a shared link, an export, a support ticket, or a search engine. This is a notifiable breach involving sensitive personal information, with real risk of serious harm.

**Why it happens:**
Payload's upload-collection access control protects the API, not the blob URL. Vercel Blob's access mode is chosen at store creation and **cannot be changed**. Most examples use `access: 'public'`. A developer tests the direct URL, sees it work, and assumes it is protected. KYC is added late, reusing the marketing media store.

**How to avoid:**
- Create a **separate private Blob store before any KYC upload**. Use signed URLs or an authenticated streaming route; store only a reference in Postgres.
- Enforce upload-collection `read` access by role and record ownership; audit every read, download, and export.
- Encrypt at rest and restrict decryption to the ops service. Never expose raw storage keys. Watermark previews.
- Define retention: delete or restrict after the decision plus statutory retention, with a legal-hold flag and a documented schedule. Build the deletion job with dry-run and audit.
- Scrub PII from logs, error tracking, analytics, and email. Never put ID numbers in audit payloads; log the document ID and action.
- Require vendor DPAs and record subprocessors. Choose Blob/Neon regions deliberately; document cross-border transfers in the notice.
- Require step-up authentication for document access and log impersonation.

**Warning signs:**
- The Blob store is public, or `access: 'public'` appears in the upload config.
- ID images open directly at `*.blob.vercel-storage.com`.
- The download button links to the blob, not an authenticated route.
- No `kyc_document_access` audit events.
- No retention job, or a retention policy only in a document.
- Screenshots of IDs in Slack/email/WhatsApp.

**Phase to address:**
P0 (storage topology + DPIA), P6 (implementation), P8 (access review and breach drill).

---

### Pitfall 8: Admin over-permissioning by default

**What goes wrong:**
Every sales agent can read every lead, price, commission, KYC status, and export the database. A content editor can change prices. A former employee still logs in. The `/ops` console hides buttons, but the server action still executes when called directly.

**Why it happens:**
Payload's default access is "any authenticated user." Adding a `role` field enforces nothing unless every collection, field, and operation checks it. The Local API skips access by default. Access-control functions are also invoked by the admin "access" operation with `id`, `data`, and `doc` undefined — naive checks throw or accidentally grant broad access, and `where` queries returned in that context are treated as deny. Two admin surfaces (`/admin`, `/ops`) drift into different role models. UI hiding is mistaken for authorization.

**How to avoid:**
- One policy module exporting `can(user, action, resource, doc)` used by Payload collection/field access **and** every server action/route handler.
- In request paths, call the Local API with `overrideAccess: false, user`. Reserve `overrideAccess: true` for trusted system jobs, with an explicit reason and no user input.
- Define roles: `super_admin`, `content_editor`, `sales_agent`, `sales_manager`, `finance`, `kyc_reviewer`, `auditor`. Scope reads: agents see assigned leads; managers see their team; finance sees reservations/pricing; KYC reviewer sees documents; auditor is read-only.
- Field-level access for `price`, `cost`, `commission`, `internalNotes`, `kyc*`. `hidden` is cosmetic only.
- Separate auth collections if content editors and sales users have different lifecycles, or at minimum separate role assignment and session policy.
- MFA for `/admin` and `/ops`, short sessions, deactivation revokes sessions, quarterly access review, and an offboarding runbook.
- Test the matrix: role × collection × operation × field, including direct REST/GraphQL calls and server actions. Protect preview deployments with Vercel Authentication.

**Warning signs:**
- `read: () => true` anywhere.
- `overrideAccess` in application code without a comment explaining why.
- A single "admin" role in the dropdown.
- No access tests; authorization verified by clicking around.
- Shared logins; no MFA; no offboarding checklist.
- `/ops` role checks live in client components.
- A sales agent can open `/admin` and see collections they never use.

**Phase to address:**
P2 (base roles/access), P5 (ops enforcement), P6 (KYC roles), P8 (access review/pen test).

---

### Pitfall 9: An "append-only" audit log the application can rewrite

**What goes wrong:**
Audit rows live in the same Postgres schema, written by the same DB role that serves the app. A bug, a migration, or an insider can `UPDATE`/`DELETE` them. The log records writes but not reads/exports, so "who viewed the KYC file" or "who exported the lead list" is unanswerable. Timestamps are local and ambiguous.

**Why it happens:**
"Append-only" is implemented as "we never call update." There is no DB-level constraint, and ORM migrations can alter the table. Read auditing is seen as noise. The log is designed after the features, usually in the last phase.

**How to avoid:**
- Write via a dedicated DB role with `INSERT`/`SELECT` only; `REVOKE UPDATE, DELETE`; add a trigger that rejects mutation. Ensure migrations cannot silently drop the trigger.
- Hash-chain rows (`prev_hash`, `hash`) and periodically anchor the head to an external append-only sink (WORM bucket, signed digest, or log service). Provide a verification job that recomputes the chain and alerts on gaps.
- Capture: event ID, `occurred_at` UTC, actor ID + role at the time, action, resource type/ID, before/after (redacted), reason (required for overrides/cancellations), request ID, IP/UA, impersonator.
- Log reads/exports of sensitive resources (KYC docs, price lists, lead exports) and all auth events (login, failure, MFA, role change, impersonation, deactivation).
- Make the audit write part of the business transaction for high-risk actions (price change, reservation transition, consent change); use an outbox for low-risk events so a logging outage doesn't block marketing edits — but alert on outbox lag.
- Define retention and legal hold (AML-related records commonly require 5 years — confirm with counsel). Give auditors a read-only UI.
- The audit log must not become a PII swamp: log field names and redacted values, not raw ID numbers or document contents.

**Warning signs:**
- A migration includes `ALTER TABLE audit_log`.
- No DB grants; the app user owns the table.
- No `prev_hash`/verification job.
- Only `created` events are logged.
- Timestamps without timezone, or `timestamp without time zone`.
- Deleting a lead cascades to audit rows.
- No alert when an audit insert fails.

**Phase to address:**
P5 (schema + write path), P6 (sensitive reads/exports), P8 (tamper test + auditor walkthrough).

---
### Pitfall 10: Luxury media destroying Core Web Vitals

**What goes wrong:**
A 4K hero video autoplays, three `priority` images compete for bandwidth, a 12 MB photograph is the LCP element, fonts flash, the 360 tour loads on page load, and the 5.3 MB map PNG ships. LCP exceeds 4 seconds on 4G; CLS comes from the cookie banner and late fonts; tour bookings drop on mobile.

**Why it happens:**
"Cinematic" is interpreted as "autoplay everything." Designers deliver 6000 px TIFFs. Developers use `next/image` with `fill` but no `sizes`, so thumbnails download viewport-width images. Video is treated as an image. Next 16 changed image defaults (`minimumCacheTTL` now 4 hours, `qualities` defaults to `[75]` only, `imageSizes` drops 16 px), so a `quality={90}` request is silently coerced. Performance is tested on a laptop on fiber, not a mid-tier Android on Philippine mobile data.

**How to avoid:**
- Set a per-page media budget and enforce it in review: initial payload target, LCP image ≤ ~200 KB AVIF/WebP, total JS budget. Track it in CI with a bundle/size check, not a one-off audit.
- Exactly one LCP candidate per page: `priority` + `fetchPriority="high"`, preload it, and ensure it is discoverable in the initial HTML (not injected by client JS). Everything else lazy-loads with explicit width/height and accurate `sizes`.
- Hero video: the **poster image is the LCP**, `preload="none"`, `muted`, `playsInline`, and load on interaction or after idle. Disable autoplay for `prefers-reduced-motion`, `saveData`, slow connections, and mobile by default. Provide a static fallback.
- Self-host licensed fonts with `next/font/local`; subset to Latin + Filipino diacritics; preload only the LCP face; use metric-adjusted fallbacks to control CLS. Confirm the Freight Text web license — copying WOFF files from the WordPress site is not a license.
- Replace the map PNG with vector/tiles, or serve a responsive AVIF/WebP with `sizes`.
- 360 tours: click-to-load with a poster, sandboxed iframe, static floor-plan fallback, and no tour JS in the initial bundle. Keep the existing Pano2VR XML assets at stable paths.
- Configure `images.qualities` and `minimumCacheTTL` deliberately; test direct `/_next/image` requests because unsupported `q` values return 400.
- Defer analytics/chat/pixel behind consent and `next/script` `lazyOnload`.
- Measure field data (CrUX/RUM) segmented by country and device, plus Lighthouse mobile with throttling on a real mid-tier Android. A green desktop Lighthouse score is not evidence.

**Warning signs:**
- `<video autoplay>` in the first viewport.
- More than one `priority` image on a page.
- `fill` without `sizes`.
- The LCP element is a CSS background image.
- Font files > 100 KB each, or 5+ weights loaded.
- `/_next/image?...&w=3840` requests for thumbnails.
- CLS > 0.1 after the cookie banner appears.
- Lighthouse mobile < 70 while desktop is 95+.

**Phase to address:**
P1 (media budget + design system constraints), P3 (implementation), P8 (field verification).

---

### Pitfall 11: Retrofitting i18n after the URL and content model are set

**What goes wrong:**
Adding Filipino forces an `/en` prefix that breaks every legacy URL, or localized fields are toggled after data exists and existing values are lost, or Filipino pages silently show English fallback and look unfinished to the exact audience they were built for.

**Why it happens:**
i18n is scoped as "translation" rather than architecture. The URL strategy is deferred to launch. Payload localization is **per field**, and changing a field to or from `localized: true` changes the stored data shape — the docs explicitly warn existing data for that field is lost. Locale `fallback` defaults to `true`, so missing translations are invisible in QA. UI strings are hardcoded in JSX.

**How to avoid:**
- Decide in P0: English at root, Filipino at `/fil/...`. Do **not** introduce `/en` — it invalidates the legacy URL equity you are trying to preserve.
- Set `lang` correctly, self-referencing canonicals per locale, `hreflang` (`en-PH`, `fil`, `x-default`), localized sitemaps, and translated metadata/OG images.
- Decide which fields are localized before the first import: title, body, meta title/description, alt text, labels. Keep **slugs shared** initially; localized slugs multiply the redirect matrix and are rarely worth it at launch.
- Build a typed dictionary for UI strings. No literals in components. Add a key-coverage check in CI.
- Format currency with `Intl.NumberFormat('en-PH', { currency: 'PHP' })` and dates in `Asia/Manila`; do not hand-format.
- Add a translation-completeness dashboard in Payload and a launch gate for key pages (home, residences, each unit type, contact, booking, privacy notice). Review Filipino copy for register — luxury editorial Filipino, not colloquial Taglish — with a native reviewer.
- Do not auto-redirect based on `Accept-Language` (Googlebot crawls from the US and may never see the Filipino site). Provide an explicit, persistent switcher.
- Include locale in every cache key/tag and CDN `Vary` decision.
- Test that no `/fil` page contains untranslated English body copy (allow brand names, addresses, and legal proper nouns).

**Warning signs:**
- `/en` appears in newly generated URLs.
- A later migration toggles `localized`.
- Fallback hides missing translations; QA only checks that the page loads.
- The language switcher resets to the home page or loses the current path.
- `lang="en"` on `/fil` pages.
- Mixed English paragraphs on Filipino pages.
- `hreflang` missing, self-referential to the wrong locale, or pointing at 404s.
- UI strings visible in JSX during code review.

**Phase to address:**
P0 (URL/locale decision), P2 (localized schema before import), P4 (UI strings), P7 (completeness gate).

---

### Pitfall 12: Double-selling a unit (and holds that never expire)

**What goes wrong:**
Two agents reserve the same unit. Both see "available," both write, both get confirmations. Or a hold expires but nobody releases it, so inventory is blocked for weeks. Or a release job races a confirmation and cancels a real reservation.

**Why it happens:**
Check-then-write in application code (`if (unit.status === 'available') update(...)`) with no DB constraint. Payload hooks are validation, not locking. Side effects run outside the transaction. There is no state machine, so illegal transitions are possible. Holds have no expiry job, or expiry is computed differently in the UI and the database.

**How to avoid:**
- Model reservations as a state machine: `available → held → reserved → sold`, `held → expired/cancelled`, `reserved → cancelled`. Encode allowed transitions in one function and reject everything else.
- Enforce mutual exclusion in Postgres: `SELECT ... FOR UPDATE` on the unit row inside a transaction, or a unique partial index on active reservations per unit, or an exclusion constraint for date ranges. Application-level checks alone will fail under concurrency.
- Use optimistic concurrency (`version` column) for edits. Add an idempotency key to reserve/confirm/cancel.
- Store `hold_expires_at` in UTC, derive `is_expired` in queries, and treat expired holds as available even if a cleanup job is late. The cleanup job is hygiene, not correctness.
- Snapshot price and terms on the reservation; never join live price later. Price history is append-only.
- Emit audit events for every transition with actor and reason. Reconcile nightly: active reservations vs unit status; report drift.
- Load-test with concurrent reserve attempts on one unit and assert exactly one success.

**Warning signs:**
- `if (unit.status === 'available')` in a server action.
- No transaction and no unique constraint.
- Two browser tabs can hold the same unit.
- Expired holds still shown as held.
- Dashboard counts differ from the list view.
- Manual DB fixes after a double-sale.
- Status changes with no audit row.

**Phase to address:**
P5.

---

### Pitfall 13: Assuming the client will deliver content on time

**What goes wrong:**
Launch slips because photography is not shot, unit areas conflict across brochure/site/sales sheets, 8 of 12 unit types have no 360 tour, legal copy is unapproved, Filipino translations arrive late, and 58 posts have missing images. The team ships lorem ipsum or hides incomplete pages, then forgets to unhide them.

**Why it happens:**
Content is treated as a dependency to chase rather than a workstream. There is no schema or import format early, no named owners, and no definition of "content complete." The agency assumes existing WordPress content is usable — it is often outdated, inconsistent, or legally stale.

**How to avoid:**
- P0 content audit: inventory every page, unit, post, image, floor plan, tour, and legal document; record owner, approval state, rights/license, and due date. Include the 58 posts and all 12 unit types.
- Define a per-collection CSV/JSON import contract in P2 and import **real** content early. Building the CMS against lorem hides modeling errors.
- Build admin validation: required fields, area totals that reconcile, alt text, SEO fields, translation completeness, and a preview that resembles production.
- Set a content freeze 2–3 weeks before launch, a legal-review SLA, and a translation glossary/memory. Name a single client content owner with authority.
- Use draft status + `noindex` for incomplete pages. Never publish placeholders to indexed URLs. Keep a launch checklist per page type.
- If content is genuinely not ready, reduce scope explicitly (e.g., 4 unit types fully built, the rest editorial teasers) rather than fake completeness. Write the tradeoff down.

**Warning signs:**
- The content spreadsheet is older than the design.
- "We'll fill it in the CMS later."
- Unit areas disagree between sources.
- No asset license documentation.
- "Translations after launch."
- Placeholder images in staging with no owner.
- Legal copy still in a Google Doc with unresolved comments.

**Phase to address:**
P0 (audit + owners), P2 (import + validation), P7 (freeze + launch gate).

---
### Pitfall 14: Feature sprawl dressed as "unique value"

**What goes wrong:**
An AI concierge, mortgage calculator, VR walkthrough, referral gamification, dynamic pricing, Chinese localization, and the resident portal all enter launch scope. Each adds states, permissions, analytics, legal review, and performance cost. The core funnel — inspiration → tour → reservation — is underbuilt, and the luxury signal is diluted by novelty buttons that go nowhere.

**Why it happens:**
Luxury brands attract "wow" requests. Stakeholders equate more features with more value. There is no cost model for a feature (design + build + test + legal + support + CWV). Demos are persuasive. "Every button earns its place" is a slogan, not a gate. Nobody is empowered to say no in writing.

**How to avoid:**
- Require a one-page feature contract: hypothesis, target metric, owner, review date, kill criteria, and explicit non-goals. No contract, no build.
- One differentiator per phase. Everything else is table stakes or deferred.
- Enforce a "button earns its place" checklist: the outcome it produces, instrumentation, empty/loading/error states, permission model, accessibility, legal basis, and performance budget. If any box is blank, it does not ship.
- Maintain a defer list with triggers ("revisit when 100 tours/month", "after 90 days of funnel data"). Deferral is a decision, not a failure.
- Instrument every CTA and review the funnel weekly; kill features below threshold at the review date.
- Prefer depth in the 12 unit pages, the tour booking flow, and inventory accuracy over breadth. Luxury is restraint, and restraint is also performance.

**Warning signs:**
- Requirement count grows faster than qualified leads.
- No feature has a metric or owner.
- "A competitor has it" is the rationale.
- Every stakeholder request becomes a phase.
- Features exist in analytics with near-zero usage.
- Scope is added during design review or after the roadmap is signed.
- Launch-date pressure with no corresponding cuts.

**Phase to address:**
P0 (governance + defer list), P3/P4 (gate per feature), P8 (post-launch review).

---

### Pitfall 15: TypeScript 6 + generated Payload types blocking the first month

**What goes wrong:**
The upgrade produces hundreds of errors (`process`/`fs` missing, path aliases broken, deprecation errors), Payload generated types drift from collections, `as any` spreads, and the build is green while runtime data shapes are wrong. The team spends the first month on toolchain archaeology instead of the product.

**Why it happens:**
TypeScript 6 changes defaults: `strict` is on, `types` defaults to `[]`, `module` defaults to `esnext`, `target` floats to the current ES version, `rootDir` defaults to the tsconfig directory. It deprecates `baseUrl`, `moduleResolution: node`, `target: es5`, `outFile`, and `module: amd/umd/systemjs`. Payload requires TS 6 and generates types from config. Next 16 removes synchronous `params`/`cookies()`/`headers()`, removes `next lint`, and requires `next typegen` for the typed route helpers.

**How to avoid:**
- Run a P0 toolchain spike before feature work: install the exact Next 16.4.x, React 19.3.x, TypeScript 6.x, and Payload 3.91.x set; build the admin; create/read/update/delete one collection; run a production build.
- Set `"types": ["node"]` explicitly, keep `paths` without `baseUrl`, use `moduleResolution: "bundler"`, set an explicit modern `target`, and keep `strict: true`. The current scaffold's `target: "ES2017"` is a mismatch worth fixing at the same time.
- Generate Payload types in CI (`payload generate:types`) and fail on diff. Import generated types; never hand-write collection shapes. Ban `as any` with an ESLint rule and require a reason for `@ts-expect-error`.
- Use `next typegen` and the `PageProps`/`LayoutProps` helpers; await `params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` everywhere.
- Migrate to ESLint flat config (Next 16 removed `next lint`).
- Keep `skipLibCheck` if needed for third-party noise, but add targeted type tests for your own boundaries. Do not let `skipLibCheck` mask Payload/Drizzle mismatches.
- Pin versions and upgrade deliberately; do not mix TS 5 and TS 6 across ESLint parser, ts-node/tsx, and the Payload CLI in one workspace.
- Add a smoke test that boots Payload admin and exercises one CRUD path against a disposable DB — type-checking alone will not catch runtime config errors.

**Warning signs:**
- `skipLibCheck` is used to hide real Payload errors.
- Generated types are not committed or are stale.
- `@ts-expect-error` count rising release over release.
- `baseUrl` still present; `moduleResolution: "node"`; `next lint` script.
- Node below 20.9, or mismatched React/React DOM versions.
- Build passes but `/admin` crashes at runtime.

**Phase to address:**
P0 (mandatory spike + pinned toolchain).

---

### Pitfall 16: Migrating WordPress HTML instead of content

**What goes wrong:**
The 58 posts arrive as Elementor markup with inline styles, shortcodes, and broken embeds. Yoast titles/descriptions are lost. Slugs change. Images 404. A personal author email leaks in Article schema. Category, tag, and paginated URLs 404.

**Why it happens:**
The WordPress export XML is treated as the migration format. `post_content` looks like HTML, so it is pasted into a rich-text field. Elementor stores layout in JSON/meta; Yoast metadata is in postmeta. Nobody diffs rendered text or checks `post_status`. The migration is judged by "the post exists," not by parity.

**How to avoid:**
- Extract structured content via the WP REST API/WP-CLI, not raw XML alone. Map `post_title`, `post_name`, `post_date`, `post_excerpt`, body blocks (heading/paragraph/image/quote/embed), featured image + alt, categories/tags, Yoast title/description/canonical/OG, and `post_status`.
- Re-author body content into Payload blocks/Lexical. Never ship Elementor markup or inline styles. Do not port visual builders; rebuild with the design system.
- Replace personal author identity with an organizational byline ("RHK Editorial"). Do not carry the leaked author email into the new schema.
- Rewrite internal links to new URLs; copy or 301 old media paths (`/wp-content/uploads/YYYY/MM/...`) to Blob/CDN with stable paths.
- Respect Yoast `noindex`/canonical; do not migrate private/draft posts. Check for duplicate H1s and broken embeds (YouTube, Maps).
- Run a rendered-text diff (old vs new) and a link checker across all 58 posts; validate structured data and metadata. Keep a migration manifest with source → new URL → status.
- Handle encoding issues (smart quotes, `&nbsp;`), tables, and galleries deliberately.

**Warning signs:**
- `<div class="elementor...">` in the CMS.
- Inline `style=` attributes or visible shortcodes (`[vc_*]`).
- Yoast meta empty in the new CMS.
- Byline shows a personal email.
- Images still pointing at `wp-content`.
- Category/tag pages 404 with no redirect.
- Duplicate H1s or missing featured images.

**Phase to address:**
P2 (extraction + import + validation), P7 (parity/link check).

---

### Pitfall 17: Leads that vanish without an error

**What goes wrong:**
A prospect submits. The server action sends email first and writes to the DB second. The email provider times out. The user sees a spinner, then a generic error. The lead is gone. Or double-submit creates duplicates, the notification lands in spam, and nobody notices for a week. Attribution is blank because a redirect dropped the UTMs.

**Why it happens:**
Synchronous side effects in the request path; no outbox or queue; no idempotency; no delivery monitoring; SPF/DKIM/DMARC misconfigured; form validation rejects international phone formats; analytics is consent-gated so source data is never persisted anywhere else. The worst outcome for this product — a qualified lead lost silently — is also the easiest to miss in QA.

**How to avoid:**
- Persist first, then notify. One INSERT with an idempotency key derived from normalized email + phone + form + a short time bucket. Return a reference number and a success state only after commit.
- Use a transactional outbox or a durable job for notification; retry with exponential backoff; dead-letter with an alert. Do not send email inside the request path as the only path.
- Verify SPF/DKIM/DMARC and monitor bounces/complaints. Test deliverability to the actual sales mailbox, not just a personal Gmail.
- Rate-limit by IP/fingerprint, add Turnstile or a honeypot, but do not block legitimate VPN/OFW traffic. Validate PH phone formats (`+63`, `09`, landlines) and store E.164 plus raw input.
- Persist UTMs/referrer/first-touch and last-touch **before** any redirect; test that 301 chains preserve `utm_*`.
- Run a synthetic lead through the real form daily to an internal channel; alert if it does not arrive. Dashboard the funnel: view → form start → submit → persisted → notified → tour booked.
- Scrub PII from error tracking and logs; alert on form error rate and on empty-result submissions.

**Warning signs:**
- No lead row after a failed email.
- Duplicate leads with the same email/phone.
- "The contact form is broken" from sales before monitoring notices.
- 200 response but empty DB.
- UTMs blank in the CRM/console.
- Sales finds enquiries in spam.
- No synthetic monitoring and no alert on server-action failures.

**Phase to address:**
P4 (capture/outbox/validation), P8 (synthetic monitoring + funnel alerts).

---

## Technical Debt Patterns

Shortcuts that look reasonable at the time and become expensive in this specific build.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keeping price fields in the public `units` collection and hiding them in the UI | One collection, faster CRUD | Every new render path is a potential leak; field-level access becomes whack-a-mole | Never |
| `overrideAccess: true` in ops code "because we already checked the role" | Less boilerplate | Authorization drift between `/admin` and `/ops`; one missed check exposes all leads | Never in request paths |
| Boolean consent column | Fast form build | No proof, no versioning, no withdrawal propagation; indefensible in a DPA inquiry | Never |
| Audit log in the app schema with the app DB role | No extra infrastructure | Rewritable history; fails tamper-evidence expectations | Never for price/consent/KYC events |
| `after()` for email/notification | No queue needed | Work dies at function timeout; no retry; silent lead loss | Only for best-effort analytics/logging |
| `autoRun` jobs on Vercel | Simple config | Official "never on serverless"; duplicate/missed jobs, timeouts | Never |
| Public Blob store for all uploads | Simple media pipeline | KYC leak; access mode cannot be changed later | Never for KYC/contracts; acceptable for marketing imagery |
| One shared `DATABASE_URL` across Preview/Production | Less env setup | Preview writes/deletes production data; dev `push` can drop columns | Never |
| Hardcoded English strings | Faster first page | i18n retrofit touches every component; translation keys drift | Only for a throwaway prototype |
| Deferring the redirect manifest | Launch sooner | Permanent ranking/lead loss; emergency redirect work under pressure | Never |
| `as any` around Payload/Drizzle types | Unblocks a compile error | Runtime shape mismatches in ops/finance calculations | Only with a linked issue and a removal date |
| One shared admin login for the sales team | No user management | No accountability, no audit attribution, no offboarding | Never |
| Disabling caching globally when stale content appears | Immediate fix | Reintroduces the legacy site's TTFB problem and DB load | Only as a temporary incident measure with an owner/date |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Neon Postgres | Using the direct connection string in serverless functions | Use the `-pooler` hostname at runtime; direct string only for migrations/`pg_dump` |
| Neon Postgres | Running Drizzle/Payload migrations through PgBouncer transaction mode | Use the direct connection; session `SET`/advisory locks are unsupported on the pooler |
| Neon Postgres | Assuming `max_connections` scales with traffic | Size the compute; cap the client pool at 1–3 per function instance; monitor pooler graphs |
| Vercel Functions | Default region `iad1` with a Singapore/Manila audience | Set `regions: ["sin1"]` (Hobby allows one region); co-locate Neon and Blob |
| Vercel Cron | Hobby plan with a per-minute SLA/reminder job | Hobby is daily-only and imprecise; use Pro or an external scheduler with a durable queue |
| Payload Jobs | `autoRun` on serverless, or both `autoRun` and `handle-schedules` | Serverless: protected `handle-schedules` + `run` endpoints called by one external scheduler |
| Payload Local API | Assuming access control runs | Pass `overrideAccess: false, user`; default is bypass |
| Payload access functions | Reading `doc.id` during the admin access operation | `id`/`data`/`doc` are undefined there; guard and return a safe default |
| Payload localization | Toggling `localized` after data exists | Decide before import; toggling changes the stored shape and loses existing values |
| Payload Postgres adapter | Leaving dev `push` enabled against a shared branch | `push: false` outside disposable local DBs; explicit migrations |
| Vercel Blob | Creating one public store for everything | Separate private store for KYC/contracts; access mode is immutable after creation |
| Vercel Blob | Overwriting blobs at the same pathname | Treat blobs as immutable; add a random suffix or version the path |
| Transactional email | Sending from the request path with no retry | Outbox/job + idempotency key + bounce/complaint handling + SPF/DKIM/DMARC |
| Turnstile/reCAPTCHA | Client-side widget only | Verify the token server-side, single-use, and rate-limit independently |
| KYC/AML vendor | Trusting webhook payloads and storing raw responses | Verify signatures, idempotency, minimize/redact, define retention, DPA in place |
| Calendar/tour booking | Naive `Date` handling across PHT/UTC | Store UTC, render `Asia/Manila`, show the timezone to OFWs, handle DST-free PHT explicitly |
| Maps embed | Loading on page load with an unrestricted key | Lazy-load after consent/interaction; restrict key by referrer/API; provide a static fallback |
| 360 tour (Pano2VR XML) | Loading all tour JS/tiles on page load | Click-to-load with poster, sandbox, mobile fallback, keep XML paths stable for redirects |
| Analytics | Firing tags before consent, then losing all attribution | Consent-gated tags + server-side conversion events + persist UTMs in the lead record |
| Vercel Preview | Public preview URLs indexing staging content | Vercel Authentication + `X-Robots-Tag: noindex` + `noindex` metadata |
| WordPress media | Rewriting URLs without redirects | Copy assets to Blob with stable paths or 301 every legacy media URL |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Hero video as the LCP | LCP 4–8 s on 4G; high mobile bounce | Poster is LCP; `preload="none"`; load on interaction; disable on mobile/save-data/reduced-motion | Immediately on mid-tier mobile |
| Oversized source images | 3–12 MB transfers; `/_next/image` slow on first request | Ingest-time resize/compress; AVIF/WebP; explicit `sizes`; media budget | First real photo import |
| Multiple `priority` images | Bandwidth contention; LCP regresses | Exactly one LCP candidate; preload it only | As soon as a second hero ships |
| Font loading | FOUT/CLS; 5 weights × 2 families | `next/font/local`, subset, preload LCP face, metric-adjusted fallback, license check | At launch on slow networks |
| Client-side data fetching for above-the-fold content | Spinner, late LCP, no SSR content for SEO | Server Components + DAL; client only for interaction | Immediately |
| `cookies()`/auth high in the tree | Whole route becomes dynamic; TTFB rises; cache misses | Push auth to the gated segment; keep public shell static | As soon as a header reads the session |
| Unbounded `depth` in Payload queries | Large JSON, N+1 joins, slow lists | Select only needed fields; cap `depth`; paginate; index | ~1k units/leads, or any deep relationship |
| Dashboard aggregates computed on read | Slow `/ops` home; DB CPU spikes | Pre-aggregate/materialized views; cache with short TTL; compute SLA on read only where cheap | ~10k leads / 100k audit rows |
| Audit log growth without partition/index | Slow audit search; vacuum pressure | Partition by month; index actor/time/resource; retention/archive | ~1M rows |
| ISR cache misses from bot-crawled filters | Image/DB cost spikes; cache thrash | Disallow arbitrary query params in cache keys; `noindex` filtered views; bound params | First crawler or campaign |
| Build-time prerender explosion | Builds exceed limits/timeout | Prerender high-value routes; let long-tail ISR; cap locales × posts | 58 posts × 2 locales is fine; adding filters/variants is not |
| Image optimizer cost/quotas | Surprise Vercel bill; 402/429 on images | Cache headers on source; `minimumCacheTTL`; avoid arbitrary `q`; limit remote patterns | Traffic spike or large gallery |
| Third-party chat/pixel | Main-thread contention; CLS; privacy violations | `next/script` lazyOnload; consent gate; audit quarterly | First marketing tag addition |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Price data in the public RSC/API payload | Commercial policy breach; competitive scraping | Schema split + DTOs + field access + unauthenticated crawl test |
| Public Blob store for KYC IDs | Notifiable breach of sensitive personal information | Private store + signed/authenticated access + read audit + retention |
| Payload admin exposed without MFA/rate limits | Credential stuffing; full data compromise | MFA, lockout, IP/rate limits, strong `PAYLOAD_SECRET`, session policy |
| `overrideAccess: true` in request paths | Complete authorization bypass | `overrideAccess: false, user`; lint/review rule; access matrix tests |
| Field-level access omitted on price/commission | Agents/content editors see confidential data | Field access + `hidden` is not security; test per role |
| No CSP / permissive headers | XSS via CMS content or third-party scripts | Nonce-based CSP, HSTS, `X-Frame-Options`/`frame-ancestors`, `nosniff`, referrer policy |
| JSON-LD built with raw `JSON.stringify` from CMS strings | `</script>` injection → XSS | Escape `<` as `\u003c`; validate/limit schema fields; treat CMS text as untrusted |
| SSRF via company/domain enrichment | Server fetches internal metadata/private IPs | Allowlist schemes/hosts, block private/link-local IPs, no redirects, timeout, egress proxy |
| Open redirect on login `next` param | Phishing/credential theft | Allowlist relative paths only |
| Unrestricted file uploads (SVG/HTML/PDF) | Stored XSS, malware distribution | MIME + magic-byte validation, re-encode images, serve with `Content-Disposition`, separate domain/store |
| No rate limiting on lead/booking endpoints | Spam, DB exhaustion, cost | IP+fingerprint limits, Turnstile, queue backpressure, alerting |
| Secrets in `NEXT_PUBLIC_*` | Key leakage in client bundles | Only non-secret public config; secret audit in CI; rotate |
| PII in logs/error tracking | Secondary breach; DPA violation | Scrub/redact, structured logging with allowlist, vendor DPA |
| Unrestricted CSV exports of leads | Bulk exfiltration by an insider | Role-gated exports, row limits, watermark, audit, approval for large exports |
| CSRF/session issues on custom `/ops` | Actions performed as another user | SameSite cookies, origin checks, CSRF tokens for state-changing routes, short sessions |
| Public preview deployments | Staging content/KYC test data indexed or shared | Vercel Authentication, `noindex`, separate preview data |
| Dependency supply chain (Payload plugins) | Compromised package → server access | Pin/lockfile, provenance review, minimal plugins, audit |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Autoplay video with sound or no controls | Startle, data burn, accessibility failure | Muted, `playsInline`, controls, poster, respect reduced motion/save-data |
| Scroll-jacking/parallax everywhere | Motion sickness, broken mobile scroll | Subtle reveal animations; disable under `prefers-reduced-motion`; native scroll |
| Low-contrast luxury palette (taupe on cream) | Fails WCAG 2.2 AA; unreadable outdoors | Test 4.5:1 body / 3:1 large; darken text tokens; never rely on color alone |
| Hover-only interactions / custom cursor | Touch users cannot discover actions | Visible controls, focus states, 24×24 px minimum targets |
| Hidden pricing with no explanation | Prospects feel toyed with; drop-off | Explain "Price available on request"; offer a clear "Request price sheet" path with consent |
| Long form before any value | Abandonment, especially on mobile | Progressive profiling: email/phone first; enrich later with consent |
| Language switch resets to home | Loses context; looks broken | Persist path + locale; visible switcher; remember preference |
| 360 tour not keyboard accessible, no fallback | Excludes keyboard/mobile/low-bandwidth users | Static gallery fallback, keyboard controls, click-to-load, captions |
| Tour times shown without timezone | OFWs book wrong slot | Show `PHT (UTC+8)` and the user's local equivalent |
| Cookie banner blocks content; reject hidden | Dark pattern; regulatory risk | Non-blocking banner, equal accept/reject, granular purposes, remember choice |
| Dead novelty buttons ("Explore", "Discover" with no outcome) | Erodes trust; violates "every button earns its place" | Every CTA has a destination/action, instrumentation, and states |
| Missing empty/loading/error states | Broken-feeling console; duplicate submits | Skeletons, explicit empty states, retry, idempotent submit |
| PDF brochure unusable on mobile | Lost leads | Responsive HTML brochure + optional PDF; gate after value, not before |
| Phone/WhatsApp/Viber not tappable | Friction for PH buyers | `tel:`, WhatsApp/Viber deep links with attribution |
| Filipino translation in colloquial Taglish | Off-brand for luxury buyers | Native luxury-register review; glossary; avoid machine translation |

## "Looks Done But Isn't" Checklist

- [ ] **Pricing gate:** Every public route, API endpoint, RSC payload, sitemap, and OG image is checked unauthenticated for price/inventory leakage — not just the visible page.
- [ ] **Consent:** Withdrawal propagates to every outbound channel; a consent proof export exists; the notice version is stored with each record; reject-all is as easy as accept-all.
- [ ] **KYC:** The Blob store is private; a direct URL does not work; every view/download is audited; retention/deletion has a dry run and an owner.
- [ ] **RBAC:** A role × collection × operation × field matrix passes, including direct REST/GraphQL and server actions — not just the UI.
- [ ] **Audit:** `UPDATE`/`DELETE` on the audit table are denied at the DB level; the hash chain verifies; reads/exports of sensitive records are logged.
- [ ] **SEO:** Every legacy URL (12 units, 58 posts, media, categories/tags, pagination, feeds, tour XML) resolves in one hop to 200; UTMs survive; canonicals/hreflang are correct; no stray `noindex`.
- [ ] **i18n:** Key `/fil` pages have no untranslated body copy; `lang`, metadata, sitemap, and hreflang are correct; the switcher preserves the path.
- [ ] **CWV:** The LCP element is identified and under budget on throttled mobile; video behavior is correct on save-data/reduced-motion; CLS is stable after banner/font load.
- [ ] **Jobs:** Killing the scheduler produces an alert; retries are idempotent; failures land in a dead-letter view; times are UTC in storage and PHT in UI.
- [ ] **Leads:** Submitting with the email provider down still persists the lead and alerts; double-submit does not duplicate; a synthetic lead arrives daily.
- [ ] **Inventory:** Concurrent reserve attempts on one unit produce exactly one success; expired holds release; reservation price is snapshotted.
- [ ] **Redirects:** A 301 does not drop `utm_*`; no redirect chains; old host redirects to the canonical host.
- [ ] **Backups:** A restore drill has been run; PITR is enabled; the restore does not also restore a compromised app secret.
- [ ] **Errors:** Branded 404/500 pages; no stack traces or env values; error tracking receives events with PII scrubbed.
- [ ] **Accessibility:** Keyboard-only tour booking and 360 fallback; visible focus; contrast passes; reduced motion respected.
- [ ] **Content:** No lorem ipsum, no broken images, no placeholder phone numbers, legal copy approved, all 12 unit types have reconciled areas.
- [ ] **Analytics:** Conversion events fire only after consent, but server-side lead records retain source/UTM regardless.
- [ ] **Admin handover:** A client editor can create a post, add a unit, translate a page, and preview it without a developer.
- [ ] **Offboarding:** Deactivating a user revokes sessions immediately; access review is documented.
- [ ] **Deploy safety:** Preview is noindex/protected; migrations are gated; env vars differ correctly per environment.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Price leakage | HIGH | Rotate/remove exposed data, purge caches/CDN, audit access logs, notify client, add crawl test, consider whether notification/legal advice is needed |
| Connection exhaustion | MEDIUM | Switch to pooled URL, shrink pool, add region co-location, scale compute, add pooler alarms; if data was written to the wrong branch, restore from PITR |
| Lost background jobs | MEDIUM | Inspect `payload-jobs`, replay failed jobs idempotently, notify affected leads manually, add dead-letter alerting, move scheduler to Pro/external |
| SEO/redirect loss | HIGH | Restore the old site or a reverse proxy for missing paths, publish a complete 301 map, resubmit sitemaps, monitor GSC daily; equity recovery takes weeks–months |
| Stale/poisoned cache | MEDIUM | Purge tags/CDN, identify the cache key that omitted locale/user, add `no-store` to gated routes, add publish-to-live e2e |
| Invalid consent | HIGH | Stop affected processing, re-consent with a clear notice, preserve existing evidence, update the ledger, involve counsel/DPO |
| KYC document exposure | HIGH | Revoke/shorten signed URLs, move to private store, rotate credentials, preserve evidence, assess notification to NPC/data subjects (72-hour rule under NPC breach rules — confirm current text with counsel), notify insurer/client |
| Over-permissioned admin | MEDIUM | Freeze exports, review audit/access logs, rotate sessions, tighten access functions, run the role matrix, notify if exfiltration is evident |
| Audit tampering/gaps | HIGH | Restore from backup/anchor, recompute chain, preserve forensic copy, disclose to auditor/client, add DB grants/trigger |
| Double-sold unit | HIGH | Freeze inventory, reconcile reservations, honor the earliest binding reservation, compensate/relocate the other buyer per counsel, add DB constraint before re-enabling |
| Content not ready | MEDIUM | Cut scope explicitly, `noindex` incomplete pages, publish an editorial subset, reschedule launch, assign named owners |
| Lead loss | MEDIUM | Recover from provider logs/DB backups where possible, contact prospects, add outbox + synthetic monitoring, publish an incident note internally |
| TS/toolchain breakage | LOW–MEDIUM | Pin versions, revert to the last green lockfile, run the P0 spike, regenerate types, remove `any` casts incrementally |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Hidden pricing leakage | P2 schema split; P3 rendering; P5 enforcement | Unauthenticated crawl of routes/APIs/RSC payloads finds no price keys; `/api` private collections 401/403 |
| Postgres exhaustion / env entanglement | P0 topology; P2 migrations | 50-concurrent load test stable; Preview uses a Neon branch; `push` disabled; migration lock works |
| Serverless job assumptions | P0 plan/scheduler; P4 notifications | Cron disabled → alert fires; duplicate runs are idempotent; dead-letter visible |
| SEO migration as a launch task | P0 URL contract + crawl; P2 manifest; P7 verification | Every legacy URL 301→200 in one hop; UTMs preserved; GSC coverage report |
| Cache Components + Payload coupling | P2 policy/hooks; P3 implementation | DB-down build exposes coupling; publish-to-live e2e within expected window; no `use cache` over auth |
| Consent as a checkbox | P0 legal/data model; P4 capture; P6 enforcement | Withdrawal suppresses sends; proof export; notice version stored; DSAR drill |
| KYC in public storage | P0 storage/DPIA; P6 implementation | Direct blob URL fails; access audit exists; retention dry run |
| Admin over-permissioning | P2 roles; P5 enforcement; P6 KYC roles | Role matrix passes incl. REST/server actions; MFA enforced; offboarding revokes |
| Rewritable audit log | P5 schema; P6 sensitive reads; P8 tamper test | `UPDATE`/`DELETE` denied; chain verifies; read events present |
| CWV destroyed by media | P1 budget; P3 implementation; P8 field data | Throttled mobile LCP < 2.0 s target; one priority image; video respects save-data |
| i18n retrofit | P0 URL/locale; P2 schema; P4 strings; P7 gate | `/fil` key pages complete; `lang`/hreflang/canonical valid; no `/en` URLs |
| Inventory double-booking | P5 | Concurrent reserve test yields one success; expired hold releases; price snapshot |
| Content readiness | P0 audit; P2 import; P7 freeze | No placeholders on indexed pages; unit areas reconcile; approvals recorded |
| Feature sprawl | P0 governance; P3/P4 gate; P8 review | Every shipped CTA has owner/metric/states; defer list reviewed |
| TS 6 / Payload types | P0 spike | Clean install + build + admin CRUD smoke test; generated types diff clean |
| WordPress HTML migration | P2 extraction/import; P7 parity | No Elementor markup; rendered-text diff and link check pass; no author email |
| Silent lead loss | P4 outbox/validation; P8 monitoring | Email provider down still persists + alerts; synthetic lead daily; no duplicates |

## Sequencing Implications for the Roadmap

1. **P0 must include a working deploy, not just scaffolding.** The region/pooling decision, Blob access modes, cron plan, URL contract, and TypeScript/Payload spike are all cheap now and expensive after P2. A "foundations" phase that only installs dependencies defers every high-cost mistake.
2. **Do not schedule RBAC and audit for after the console is built.** Access functions and the audit write path shape every collection and server action. Retrofitting them into a working `/ops` means touching every query and re-testing every workflow.
3. **SEO and i18n are P0/P2 decisions with P7 verification.** If the roadmap places "SEO migration" only at launch, the URL, slug, locale, and content-model decisions will already have been made wrong. Put the crawl and redirect manifest in P0/P2, and make P7 a verification/cutover phase.
4. **KYC must be gated by a DPIA and a private storage topology, not by a UI phase.** Schedule P6 only after the DPIA, retention policy, vendor DPAs, and private Blob store exist. Shipping "KYC status" fields earlier is fine; ingesting documents is not.
5. **Content readiness belongs in P0/P2, even though it is the client's job.** The roadmap should contain a content workstream with named owners and dates, not a single "content migration" task. If content is not ready, decide the reduced-scope launch explicitly rather than letting P3/P7 absorb the delay.
6. **Observability is not a P8 afterthought.** Lead persistence, job failure, form error rate, and cache-publish behavior need instrumentation as soon as those paths exist. Otherwise the team learns about silent lead loss from the client.

## Sources

**Framework/platform (HIGH confidence — official, version-matched)**
- Next.js 16.4.2 bundled docs: `node_modules/next/dist/docs/` — Version 16 upgrade guide (async request APIs, caching API changes, image defaults, Turbopack, `next lint` removal), `cacheComponents`, ISR with Cache Components, `use cache` runtime restrictions, `proxy` convention, `redirects` query preservation, `after`/`waitUntil`, i18n guide, production checklist.
  - https://nextjs.org/docs/app/guides/upgrading/version-16
  - https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
  - https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components
  - https://nextjs.org/docs/app/api-reference/directives/use-cache
  - https://nextjs.org/docs/app/api-reference/file-conventions/proxy
  - https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
  - https://nextjs.org/docs/app/api-reference/functions/after
  - https://nextjs.org/docs/app/guides/internationalization
- Payload CMS docs (3.x): Postgres adapter (pool, `push`, migrations, `beforeSchemaInit`), Production Deployment, Building without a DB connection, Jobs Queue (including the explicit "never use `autoRun` on serverless" and duplicate-scheduling pitfalls), Access Control (Local API skips access; access-operation undefined args), Localization (field-shape change warning).
  - https://payloadcms.com/docs/database/postgres
  - https://payloadcms.com/docs/production/deployment
  - https://payloadcms.com/docs/production/building-without-a-db-connection
  - https://payloadcms.com/docs/jobs-queue/overview
  - https://payloadcms.com/docs/access-control/overview
  - https://payloadcms.com/docs/configuration/localization
- Vercel docs: Functions limits (default region `iad1`, 4.5 MB body limit, 300 s Hobby / 800 s Pro), Cron usage & pricing (Hobby daily-only, per-minute Pro), Vercel Blob (private vs public, immutable access mode, caching, no overwrite by default), Function regions (single-region Hobby).
  - https://vercel.com/docs/functions/limitations
  - https://vercel.com/docs/cron-jobs/usage-and-pricing
  - https://vercel.com/docs/vercel-blob
  - https://vercel.com/docs/functions/configuring-functions/region
- Neon docs: connection pooling (PgBouncer transaction mode, `-pooler` hostname, direct connections for migrations, `max_connections` by compute size, unsupported session features).
  - https://neon.com/docs/connect/connection-pooling
- TypeScript 6.0 release notes: changed defaults (`strict`, `types`, `module`, `target`, `rootDir`), deprecations (`baseUrl`, `moduleResolution: node`, `target: es5`, `outFile`).
  - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html

**Philippine law/policy (MEDIUM confidence — implementation detail needs counsel)**
- Republic Act No. 10173 (Data Privacy Act of 2012), especially Sec. 3(l) (sensitive personal information incl. government-issued IDs, age, marital status), Sec. 11 (transparency/legitimate purpose/proportionality/retention), Sec. 12 (lawful bases incl. consent, contract, legal obligation, legitimate interests), Sec. 13 (sensitive PI requires consent specific to purpose or another enumerated ground), Sec. 16 (data-subject rights), Sec. 20 (security and breach notification), Sec. 21 (accountability for transfers/processors).
  - https://privacy.gov.ph/data-privacy-act/
- NPC breach-notification rules: the commonly cited 72-hour notification window originates from NPC Circular No. 16-03; verify the current circular text and DBNMS procedure with counsel/DPO before launch.
  - https://privacy.gov.ph/breach-notification/
  - https://dbnms.privacy.gov.ph/
- RA 9160 (Anti-Money Laundering Act), as amended by RA 10927: real-estate developers are covered persons; retention and covered/suspicious transaction reporting obligations apply. Exact thresholds and registration duties must be confirmed with compliance counsel; do not hard-code assumed thresholds.
  - https://www.amlc.gov.ph/

**Domain/engineering judgment (MEDIUM confidence — patterns from comparable builds, not a single citation)**
- Serverless connection-pool failure modes, cache/auth boundary leaks, inventory race conditions, consent-ledger design, audit tamper-evidence, and WordPress content-migration fidelity are well-known failure patterns in comparable Next.js/Payload and real-estate platform builds. They are stated here as risks to design against, not as guarantees.
- The existing site's defects in `.planning/PROJECT.md` (no caching, ~660 KB CSS, ~600 KB JS, 5.3 MB map PNG, missing meta descriptions, missing security headers, Google Drive brochures, leaked author email) are treated as the baseline to beat; several pitfalls above are the mechanisms by which a rebuild reintroduces them.

---

*Pitfalls research for: The Velaris Residences digital platform*
*Researched: 2026-10-23*
*Scope: Next.js 16.4 + Payload 3.91 on Vercel, WordPress→Next SEO migration, PH DPA/RA 10173 consent & KYC, English/Filipino launch*
