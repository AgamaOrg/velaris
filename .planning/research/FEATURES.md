# Feature Research

**Domain:** Luxury residential developer platform — cinematic public marketing site + internal sales-operations console (Metro Manila, Philippines)
**Project:** The Velaris Residences (RHK Land; 3 towers; 12 unit types; show gallery in Bridgetowne)
**Researched:** 2026-10-23
**Confidence:** MEDIUM overall (see per-area table at the end)

---

## Framing: Two Products, One Feature Set

This platform is not one website with an admin panel. It is two products with opposite design goals that share a data model:

| | Public site | `/ops` console |
|---|---|---|
| **Job** | Build desire, capture qualified demand, book tours | Convert demand: assign, follow up, hold, reserve, comply |
| **Design goal** | Restraint. Fewer surfaces, resolved perfectly | Density. Every relevant fact one glance away |
| **Success signal** | Qualified lead, booked tour, brochure request | Response time, stage movement, reservation, source ROI |
| **Failure mode** | Feels like a mass-market property portal | Feels like a spreadsheet with a login |

The public site's discipline is the product differentiator. The console's depth is the operational moat. Feature decisions below are judged against that split, not against "what competitors have."

**Governing rule (from PROJECT.md):** every interactive element produces a real outcome. A feature that cannot be traced to a lead, a tour, a reservation, a compliance obligation, or a decision is not a feature — it is decoration.

---

## Feature Landscape

### A. Public Surface — Table Stakes

Missing any of these makes the site feel either amateur or dishonest for a HNW buyer.

| # | Feature | Why Expected | Complexity | Notes / Dependencies |
|---|---------|--------------|------------|----------------------|
| P1 | Editorial page system: Home, About, Residences, Amenities, Location, Developer, News & Events, Contact | The 8-page IA is already the brand contract; buyers and returning OFWs navigate by it | LOW–MED | Payload blocks + layout primitives. Depends on content model and media pipeline. Do not let editors build arbitrary layouts — that is how luxury sites decay |
| P2 | Persistent, quiet "private consultation / book a viewing" path from every page | HNW buyers expect an invitation, not a funnel; the CTA is the only conversion surface that must never be more than one scroll away | LOW | One primary CTA pattern, not five competing buttons. Becomes the enquiry drawer/modal with context inheritance |
| P3 | Twelve unit-type pages with area breakdown, floor plan, gallery, 360 tour, enquiry | Core of the buying decision; the legacy site already has these and SEO equity lives on them | MED | Depends on: unit-type model (tower, type, beds, interior/balcony/total area, ceiling height, outlook), media set per type, tour embed. This is the single largest content dependency |
| P4 | Floor-plan viewer: zoom/pan, legible at 360px, downloadable high-res | Buyers screenshot and send plans to family; a plan you cannot read on a phone reads as evasive | MED | Pinch-zoom + keyboard pan. No canvas library unless justified — CSS transform + `<dialog>` fullscreen is enough and protects the LCP budget |
| P5 | 360 / virtual tour embed, lazy-loaded, with a graceful non-3D fallback | Already exists in some form; a luxury preselling buyer expects to "walk" a model unit before travelling | MED | Reuse existing assets (see **Discrepancies** below). Depends on third-party embed consent, poster image, `prefers-reduced-motion` fallback, and an LCP budget that the embed does not consume until interaction |
| P6 | Show-gallery tour booking with real availability, hold, and confirmation | Core value from PROJECT.md: "inspiration to a booked tour." A contact form is not a booking | MED–HIGH | Depends on: staff/slot availability model, timezone handling (OFW buyers), double-booking prevention, confirmation email + ICS, reschedule/cancel path. Without slot capacity it is a request form wearing a calendar costume |
| P7 | Lead capture with explicit consent, source/UTM attribution, instant sales notification | Legal requirement (RA 10173) and the only way source ROI becomes real | MED | Depends on consent ledger (O7), attribution capture (first-touch + last-touch + referrer + landing page), notification channel (O9). Consent must be specific and separate from the privacy notice — see Anti-Features |
| P8 | Brochure / project-materials access gated by lead capture | Existing behaviour (currently Google Drive links); buyers expect a dossier; unfiltered downloads leak pricing and stale collateral | MED | Depends on lead capture, object storage, expiring signed URLs, versioned files. Keep the *editorial* content open — gate only the dossier |
| P9 | Bilingual EN + Filipino with per-locale URLs and `hreflang` | Stated launch requirement; most luxury PH developers are English-only, so this is also an edge | MED–HIGH | Depends on Payload localization, a real translation workflow (not machine output), and duplicate QA surface. Filipino copy for luxury editorial is scarce — budget for a writer |
| P10 | SEO foundation: metadata, canonical, sitemap, structured data, OG images, 301 map | The legacy site ranks; competing domains already poach the brand term | MED | Depends on a URL inventory + redirect map for 12 unit pages and 58 news posts. Must be built *before* cutover, not after |
| P11 | News & Events index + article template (58 posts migrated) | Existing IA and a real source of long-tail search traffic | MED | Depends on content migration, image re-optimisation, author/date integrity, Article schema without leaking author emails |
| P12 | Contact / location / show-gallery page: map, directions, hours, named sales team | Buyers show up physically; "where do I go and who do I ask for" is basic service | LOW | Replace the 5.3 MB map asset. Sales-team directory already exists as a legacy page — preserve its URL |
| P13 | Privacy notice, cookie/analytics consent, data-subject request entry point | DPA obligation; also a trust signal for offshore buyers | MED | Depends on consent ledger + a DSR intake route that reaches a human. Do not ship analytics before this |
| P14 | Performance + accessibility as a feature, not a chore: LCP < 2.0 s on 4G, CLS ≈ 0, WCAG 2.2 AA, reduced-motion respected | A luxury page that loads in six seconds is not a luxury page; accessibility is a legal and brand exposure | HIGH (cross-cutting) | Constrains every other public feature. Budgets must be enforced per-route in CI, not aspirationally |
| P15 | Branded 404 / empty / error states with a way back into the journey | Cheap, and the absence is conspicuous on an otherwise polished site | LOW | One component, three variants |

### B. Public Surface — Differentiators

Ranked by whether they change a buyer's behaviour or a salesperson's outcome. See §D for the ones that only *look* like differentiators.

| # | Feature | Value Proposition | Complexity | Notes / Dependencies |
|---|---------|-------------------|------------|----------------------|
| P16 | **Residence comparison** (2–3 unit types side by side: area breakdown, beds, layout, outlook, tower) | With 12 types across 2 selling towers, buyers cannot hold the differences in their head. Comparison converts confusion into a shortlist — and a shortlist is what a salesperson can work | MED | Depends on normalised unit-type attributes (P3). Client-side only, no new backend. Gated to unit-type level, never unit-level price |
| P17 | **Context-carrying enquiry** — the form arrives pre-filled with the unit type, tower, and page journey; the salesperson sees "interested in 2BR South, viewed 3BR Premium twice, came from a Meta campaign" | Turns an anonymous form into a briefed conversation; directly attacks the 42-hour average first-response problem by removing triage work | LOW–MED | Depends on attribution (P7) + session context. Cheapest high-leverage differentiator in this document |
| P18 | **Advisor-led payment scenario, delivered as an expiring share link** (not a public calculator) | PH buyers decide on monthly amortisation, not headline price. This satisfies the real question ("what does this cost me per month?") without publishing price, and gives the advisor a reason to send something | MED–HIGH | Depends on: pricing model, scheme engine (spot cash / deferred cash / bank financing / in-house), consent, signed expiring URLs, PDF or print view. This is the honest answer to "payment schedule estimator" |
| P19 | **Digital sales room (light)** — a branded, expiring link containing the unit, floor plan, indicative schedule, and dossier for one named client | The strongest differentiator available: it is how luxury is actually sold (a private, prepared presentation), it is measurable (opens, revisits), and it replaces email attachments and Drive links | MED–HIGH | Depends on P18 + P8 + O7 consent + signed URLs + view analytics. Do **not** build a client login — a link is enough and avoids a whole auth/DPA surface |
| P20 | **True multi-touch attribution attached to the lead record** (first touch, last touch, campaign, referrer, tour interactions) | Makes "source ROI" a number the client can defend in a budget meeting, not a dashboard guess | MED | Depends on P7 + UTM discipline + a documented attribution model. Server-side capture required — client-only analytics loses the offline/OFW paths |
| P21 | **Tour page as a produced visit**: what to expect, duration, who you will meet, parking, arrival instructions, what to bring | Under-rated. It reduces no-shows and signals care; costs almost nothing | LOW | Content + one template. Pair with a reminder email (O9) |
| P22 | **Opt-in availability signal on unit pages** ("this residence is currently reserved" — status only, never price) | Honest scarcity, fewer wasted enquiries, and it makes the console's inventory status do public work | LOW–MED | Business decision, per-unit flag. Must never leak price, buyer identity, or exact hold expiry. Conflicts with "inventory behind login" if applied broadly — default off |
| P23 | **Filipino editorial of genuine quality** (not translated UI strings) | Speaks to OFW families and local buyers in the language the decision is actually discussed in. Nearly no luxury PH developer does this well | MED | Depends on a writer, not a translator tool. Non-negotiable if the bilingual requirement is to mean anything |
| P24 | **Progressive profiling** — a returning known lead is never asked for their name twice; new questions appear only as trust accrues | Respects the buyer and raises completion. The luxury version of "don't make me repeat myself" | LOW–MED | Depends on identity resolution (email/phone hash) + consent. Never reveal that you remember more than they told you in this session without saying so |
| P25 | **Developer provenance module** (Hongkong Land + Robinsons Land track record, governance, delivery history) | For a multi-million-peso preselling purchase, "who is behind this and will they deliver" outranks amenity lists. Most developer sites bury it | LOW (content) | Content and design work, not engineering. Needs real evidence (completed projects, dates), not adjectives |

### C. Ops Console — Table Stakes

A generic real-estate CRM has most of these. Their absence is disqualifying; their presence earns no praise.

| # | Feature | Why Expected | Complexity | Notes / Dependencies |
|---|---------|--------------|------------|----------------------|
| O1 | **Auth, RBAC, append-only audit log** | Multiple roles (sales director, in-house seller, marketing, compliance, editor) touching priced inventory and personal data | HIGH | Foundation for everything in `/ops`. Deny-by-default, role-scoped queries, no client-side authorisation. Audit rows immutable and queryable by record. Build first, not last |
| O2 | **Lead inbox** — unified list, saved views, filters (source, stage, owner, SLA state, language, budget), bulk assign | The daily workspace. If the inbox is slow, the team goes back to spreadsheets | MED | Depends on O1 + lead model. Server-side pagination and indexed filters from day one |
| O3 | **Client 360** — contact, consent state, source history, unit interests, activity timeline, notes, tasks, documents | One screen that answers "who is this and what happened last" | MED–HIGH | Depends on activity log (O8), consent ledger (O7), dedupe (O19). The timeline is the feature; the fields are table stakes |
| O4 | **Pipeline (Kanban) with configurable stages, stage ageing, next action, owner** | Standard sales-operations grammar; sellers think in stages | MED | Depends on O2. Stage model must be configurable by an admin, not hard-coded — sales process will change |
| O5 | **Assignment and routing** (round-robin, by source, by language, by team, manual override) | Leads that sit unassigned are the top cause of leakage | MED | Depends on O1 (teams/roles) + notification (O9). Log every assignment change to audit |
| O6 | **SLA timers + escalation** (time-to-first-contact, time-in-stage, tour follow-up) | The evidence is unambiguous: first-hour contact is ~7× more likely to qualify; average firms take 42 hours and 23% never respond | MED | Depends on O9 + a scheduler. On Vercel with no long-lived worker, use cron + queue table, not in-process timers. Escalation must be visible, not just emailed |
| O7 | **Consent ledger** — per purpose, per version, timestamped, channel, withdrawal, evidence | DPA requires specific, informed, withdrawable consent evidenced by recorded means; NPC rejects implied/soft opt-in. A single checkbox is not a ledger | HIGH | Depends on nothing else — build early, it gates P7, P8, P18, O17, O18. Every downstream use must *read* consent state, never assume it |
| O8 | **Activity logging** — calls, emails, meetings, tour outcomes, notes, message excerpts | Without it, Client 360 is a contact card and SLA metrics are fiction | LOW–MED | Depends on O3. Log copy-pasted WhatsApp/SMS content as an activity type — do not build a messenger at launch |
| O9 | **Notification channel** (in-app + email; templated, per-role) | New lead, SLA breach, tour booked, hold expiring, reservation created, KYC pending | MED | Depends on O1. Transactional email provider needed. Explicitly *not* SMS/WhatsApp integration at launch (deferred per PROJECT.md) — but design the seam |
| O10 | **Inventory model** — towers → floors → units, attributes, status (`not_released` / `available` / `held` / `reserved` / `sold`), price, currency, price history | The console's reason to exist; price and availability are the gated assets | MED | Depends on unit-type model shared with P3. Status transitions must be state-machine-validated, not free-text |
| O11 | **Holds with expiry, reason, and owner; reservation with conflict prevention** | Double-selling a unit is the catastrophic failure mode of this entire product. Every competing suite advertises "no double booking" | HIGH | Depends on O10 + O1. Must be transactional (DB constraint or serialisable transaction), not "check then write." Hold expiry needs a sweeper job. Every transition audited |
| O12 | **Reservation record** — buyer + co-buyer, unit, scheme, reservation fee status, validity window, document checklist, cancellation/forfeiture reason | The unit of commercial truth; also the trigger point for KYC | MED–HIGH | Depends on O11 + O18. Model the 30-day validity and non-refundable fee explicitly — those are the actual PH norms |
| O13 | **Tour / appointment management** — calendar, assignment, outcome, no-show, reschedule | Marketing books tours; sales must own and close the loop on them | MED | Depends on P6 + O9. Outcome capture is what makes tour→reservation conversion measurable |
| O14 | **Content management** (Payload) for pages, unit types, amenities, news, media, SEO metadata, translations | Client editors must publish without a developer | MED | Depends on content model. Enforce publish workflow + preview. SEO fields per locale |
| O15 | **Document library** — brochures, price lists, floor plans, reservation forms; versioned, access-controlled | Price lists in particular must never be public and must never be stale | MED | Depends on O1 + storage. Signed URLs, version history, "superseded" state |
| O16 | **KPI dashboard** — leads, tours, reservations, conversion, first-response time, unit velocity, source ROI | Named requirement in PROJECT.md. Must show numbers the team trusts | MED | Depends on O2–O13. Define each metric once, in code, with a visible definition tooltip. Trailing-3-month velocity as the default — launch-quarter averages lie |
| O17 | **KYC/AML case at reservation** — identity capture, document upload, beneficial ownership (juridical buyers), PEP/sanctions screening (manual or vendor), decision + rationale, retention | Real estate developers are AMLC covered persons; CIP/CVP/BOV and screening are obligations, not optional | HIGH | Depends on O12 + O7. Sits behind a DPIA (PROJECT constraint). Model screening as a *record with a decision*, not a boolean. Screening vendor selection is a Phase-level decision |
| O18 | **Dedupe and merge** — email/phone normalisation, candidate detection, non-destructive merge | Duplicate clients corrupt consent state, attribution, and KYC history | MED | Depends on O3. Merge must re-point activities and preserve both source records in audit |
| O19 | **Search** across leads, clients, units, documents | People navigate by memory ("the Lim unit, 32nd floor") | LOW–MED | Depends on Postgres full-text/trigram. Resist adding a search service |
| O20 | **Data-subject request workflow** — access, correction, erasure, portability; with retention rules | DPA rights; also the thing an auditor asks for first | MED | Depends on O7 + O3. Erasure must respect AML retention obligations — legal review required |
| O21 | **User/team/role administration** and **role-scoped visibility** (e.g., a seller sees only their own leads) | Needed the day a second team or an external broker is added; retrofitting scoping is painful | MED | Depends on O1. Design row-level scoping now even if only one team exists at launch |
| O22 | **CSV export** with the active filter set, and an audit entry for each export | Reporting escape hatch; also a data-exfiltration control point | LOW | Depends on O1. Log who exported what |

### D. Ops Console — Differentiators

| # | Feature | Value Proposition | Complexity | Notes / Dependencies |
|---|---------|-------------------|------------|----------------------|
| O23 | **Consent ledger as a first-class product surface**, not a compliance checkbox: per-purpose history, withdrawal propagation, "why can we contact this person?" answer | Generic CRMs model consent as a field. A ledger is the difference between passing a DPIA and rewriting your data model. It is also a genuine trust asset with offshore buyers | HIGH | Build in Phase 1 alongside auth. Retrofitting consent into 40 tables is the classic rewrite trigger |
| O24 | **Source ROI to reservation value** — cost per qualified lead, per tour, per reservation, by campaign/channel, net of price | Turns marketing from a cost centre into a measurable one; the client's stated success metric depends on it | MED | Depends on P20 + O10 (prices) + O16. Needs campaign cost input (manual is fine at launch) |
| O25 | **Honest velocity panel** — units/month, absorption against *released* inventory, months-to-sellout, by tower and unit type; trailing 3 months, with launch-quarter excluded | Prevents the most common self-deception in preselling: lifetime averages inflated by launch sales | MED | Depends on O10 + O11. "Released vs total" is the distinction most dashboards get wrong |
| O26 | **Next-best-action queue** — ranked by SLA breach risk + declared intent + stage ageing, with a plain-language reason on each row | Sellers do not read dashboards; they work a queue. Explainability avoids the "why is this lead above that one" mutiny | MED | Depends on O6 + O27. Rules first; no ML needed at this volume |
| O27 | **Structured declared-intent capture** — budget band, timeline, financing route, occupancy intent (own/lease/invest), decision-makers, citizenship/residency | The honest version of "client intelligence": what the buyer told you, structured so it is comparable and reportable. Drives routing, scoring, and the payment scenario | LOW–MED | Depends on O3. Add a completeness score so sellers know what is missing. Never infer what was not declared |
| O28 | **Corporate / juridical buyer path** — company lookup, authorised signatory, beneficial-ownership checklist | AMLC requires BOV for juridical buyers; PH condos are frequently bought through entities. Almost no sales CRM handles this | MED | Depends on O17. Lookup can be manual/registry-based at launch; the *checklist and record* are the valuable part |
| O29 | **Discount and price-change approval workflow** with reason codes | Luxury pricing is negotiated quietly; unlogged discounting destroys both margin and price integrity | MED | Depends on O10 + O1. Every price change is an audited event with an approver |
| O30 | **Audit-ready compliance pack export** — consent records, KYC decisions, data-flow evidence, retention schedule, for one client or one period | The artefact you need during an NPC inquiry or an AMLC review. Costs little if O7/O17 were built properly, impossible if they were not | MED | Depends on O7 + O17 + O22 |
| O31 | **Language-preference routing** (Filipino / English) carried from the public site | Small, but it is the operational half of the bilingual promise — routing an OFW's Filipino-speaking parent to an English-only seller is a lost sale | LOW | Depends on P7 + O5 |
| O32 | **Reservation risk flags** — financing route unconfirmed, documents outstanding, KYC pending, hold expiring | Reservations fail quietly; surfacing the reason is what protects the pipeline | MED | Depends on O12 + O17. Keep it to 4–5 flags with clear owners |

---

## Anti-Features (Deliberately Not Building)

These will be requested. Each has a better substitute.

### Public

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|---|---|---|---|
| **Public mortgage / amortisation calculator** | "Buyers want to know the monthly" | Requires a price to be meaningful — violates the no-public-pricing policy; a generic calculator with guessed rates is misleading and legally exposed; it invites comparison-shopping on the one axis luxury refuses to compete on | P18: advisor-led scenario, shared as an expiring link. The buyer gets the real number; the site keeps the policy |
| **AI chatbot "concierge"** | Every vendor demo has one; fear of missing overnight leads | Low traffic + high-value leads means the bot mostly handles nothing well; a wrong answer about pricing, availability, or foreign ownership is a brand and legal incident; it also competes with the booking CTA for attention | Fast human SLA (O6) + booking (P6) + a real contact path. Revisit only if inbound volume exceeds human capacity |
| **3D unit configurator / furniture or finish swapper** | Feels premium in a pitch deck | No bearing on a preselling purchase decision; enormous asset and QA cost; invites the buyer to design a unit that will not be delivered as shown | High-quality fixed renders + an honest disclaimer + a real model unit at the show gallery |
| **Sun-path / light simulator** | Impressive in demos | At 12 unit types the decision value is marginal versus the render and data cost; buyers ask the advisor anyway | Orientation described in words and one reliable per-unit outlook note |
| **Gamified tower explorer with unit dots, prices, and "claim"** | Vendors sell exactly this (interactive building explorer with colour-coded availability) | Directly publishes the gated asset (price), turns a residence into a seat map, and cheapens the brand. It is a mass-market sales office tool | Floor plans + comparison + advisor. If an availability signal is wanted, P22 (status only, opt-in) |
| **VR / metaverse / AR showroom** | Innovation signalling | No hardware, no buyer expectation, no measurable conversion in this market; ages badly | A well-produced 360 tour (P5) and a physical show gallery |
| **Pop-ups, exit-intent modals, countdown timers, "3 units left"** | Conversion-rate folklore | Reads as pressure-selling; contradicts the brand; countdown urgency on a 12-type luxury tower is also factually dubious | Quiet persistent CTA (P2) + honest availability signal (P22) |
| **Live-chat widget with a queue** | "Every site has one" | Unstaffed chat is worse than no chat; covers content, harms CWV, and creates an unlogged personal-data channel outside the consent ledger | Booking + email + phone, all logged in O3 |
| **Newsletter signup as the primary conversion** | Cheap list growth | A luxury buyer is not subscribing to a newsletter; it produces low-intent contacts and extra consent surface | Book a viewing, request the dossier, or ask for a call |
| **Public user accounts / wishlists / saved searches** | Product-team instinct | Adds auth, password reset, and DPA obligations for visitors with no transactional reason to return; competes with the sales relationship | P19 digital sales room link (no account) + P24 progressive profiling |
| **Multi-currency price display** | International buyer appeal | Only meaningful if prices are public (they are not); introduces FX liability and stale rates | Quote in PHP through the advisor; mention financing in the buyer's currency only conversationally |
| **Blog comments / community forum** | Engagement metrics | Moderation burden, spam, brand risk, and zero path to a tour | Editorial News & Events, no comments |
| **Per-unit auto-generated PDF "exposé" on demand** | Vendors advertise it; looks efficient | Becomes a second design surface to maintain, drifts from the CMS, and is a pricing-leak vector if it includes anything commercial | P19 sales-room link with a print stylesheet, generated from the same data |
| **Machine-translated Filipino** | Speed | Luxury copy fails visibly when machine-translated; the register is wrong and it undermines the entire bilingual claim | A writer (P23). Launch fewer pages well rather than all pages badly |

### Ops

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|---|---|---|---|
| **AI lead scoring / predictive close probability (ML)** | Every 2026 vendor markets it | At a few hundred leads there is no training signal; a black-box score that sellers distrust is worse than no score; it also creates automated-decision-making obligations under DPA | O26 rules + declared intent (O27), with visible reasons. Revisit at real volume |
| **Voice AI / auto-dialer qualification** | Vendor demos; outbound capacity anxiety | Wrong instrument for HNW relationships; recording and consent obligations; a robotic first contact is unrecoverable | Human sellers + O6 SLA + O26 queue |
| **Dynamic / algorithmic pricing engine** | Revenue optimisation | In luxury preselling, visible algorithmic discounting erodes the value story and antagonises early buyers; pricing is a committee decision | O29 approval workflow + O25 velocity data as *input* to human pricing |
| **Full ERP: invoicing, collections, construction milestones, accounting, payroll** | "One system" instinct | Enormous scope, statutory accounting complexity, and the client already has finance systems. This is how a sales platform dies | Reservation + payment-schedule *record* only; export to finance. Collections ageing is a later, separate decision |
| **Broker/channel-partner portal + commission engine** | The legacy site publishes an in-house seller list; channel sales are common in PH | Premature: no broker channel at launch; commission rules are political and change often; external users multiply the RBAC and audit surface | O21 row-level scoping designed now; broker portal deferred to v2 |
| **Offline-first field app / native mobile apps** | Site visits happen in dead zones | Explicitly out of scope (PROJECT.md); duplicates the console | Responsive web console, tested on a phone at the show gallery |
| **Drag-and-drop custom dashboard / BI query builder** | "Executives want their own view" | Becomes an unmaintained mini-BI tool; every dashboard disagrees with every other | 8 fixed, opinionated reports with visible metric definitions (O16, O24, O25) + CSV export (O22) |
| **Real-time websockets on every table** | Feels modern | Adds infrastructure the Vercel/serverless constraint makes awkward, for data that changes a few times an hour | Refresh-on-focus + optimistic UI + a polled "new leads" counter |
| **Built-in WhatsApp / SMS messenger** | Sellers live in WhatsApp | Messaging integrations are explicitly deferred; building a messenger is a product in itself | O8 activity logging of message excerpts; design the integration seam |
| **E-signature and online payment at launch** | Obvious end-state | Deferred with integrations (PROJECT.md); payment handling adds PCI scope and a money-transmission conversation | Document checklist + status tracking (O12); sign and pay outside the system for now |
| **Multi-project / multi-tenant architecture from day one** | "RHK has more projects" | Premature abstraction over one project and three towers; multiplies every query, role, and report | Single-project schema with a `project` key present but unused, so the migration is a data exercise |
| **Gamified seller leaderboards with badges** | Motivation | Mismatch with a luxury sales culture; encourages cherry-picking and gaming the SLA clock | O16 team performance, read by a manager, not broadcast |
| **"AI writes your listing copy"** | Speed | Luxury copy is the brand; generated copy reads generic and is hard to audit for claims | Editor-written, CMS-managed (O14) |
| **Covert enrichment / scraped prospect profiles** | Sales would love it | Unlawful without a lawful basis under RA 10173 and GDPR; explicitly out of scope in PROJECT.md | O27 declared data + O28 company lookup + O17 KYC |
| **Public API / partner integrations at launch** | Future-proofing | No consumers yet; every endpoint is attack surface and maintenance | Internal typed data layer; add endpoints when a consumer exists |

---

## Feature Theater: The Explicit Calls

Not every "differentiator" is worth building for a luxury brand. This is the honest scorecard.

| Candidate | Verdict | Reasoning |
|---|---|---|
| Residence comparison (P16) | **Genuinely valuable** | Reduces a real cognitive load (12 types) and produces a shortlist the seller can act on. Cheap, no new backend |
| Context-carrying enquiry (P17) | **Genuinely valuable** | Removes triage work and improves the first conversation. Highest value-to-cost ratio in this document |
| Advisor-led payment scenario + sales room (P18/P19) | **Genuinely valuable** | Answers the buyer's actual question without breaking policy; creates a measurable, shareable artefact. This is the differentiator worth spending on |
| Multi-touch attribution (P20) | **Genuinely valuable** | Directly serves the stated success metric. Unglamorous, high payoff |
| Tour-page detail (P21) | **Genuinely valuable, underrated** | Reduces no-shows; costs content only |
| Availability signal (P22) | **Valuable if disciplined** | Only status, only opt-in, never price. Becomes theater (or harm) if it turns into a seat map |
| Bilingual editorial (P23) | **Genuinely valuable** | Real audience, real differentiation. Theater if machine-translated |
| Progressive profiling (P24) | **Mildly valuable** | Nice, not decisive. Build only after P17 works |
| Developer provenance (P25) | **Genuinely valuable** | Trust is the actual purchase barrier in preselling. Content work, not engineering |
| Interactive 3D building explorer with per-unit hotspots and availability colouring | **Theater for this product** | Vendor-driven; conflicts with the no-public-pricing policy; converts residences into inventory SKUs. A 360 tour (P5) plus plans and comparison covers the decision |
| Sun-path simulator | **Theater** | Demos well, decides nothing |
| Brochure-on-demand PDF generator | **Theater (mostly)** | Duplicate design surface + leak risk; a print stylesheet on the sales-room link gets 90% of the value |
| AI chatbot concierge | **Theater + risk** | See anti-features |
| Live guided remote tour | **Theater at launch** | Requires staffing a scheduled video channel; the show gallery and 360 tour cover it. Revisit for offshore buyers only if data shows demand |
| Predictive lead scoring (ML) | **Theater at this volume** | No training signal; erodes trust |
| Dynamic pricing | **Theater + brand damage** | See anti-features |
| Custom dashboard builder | **Theater** | Fixed reports win |
| Public wishlist/account | **Theater** | No repeat-transaction reason |

**Test to apply to any future public feature:** does it move a named person closer to a booked viewing or a briefed sales conversation? If it only makes the site more impressive in a stakeholder demo, cut it. That is the operational meaning of "every button earns its place."

---

## Feature Dependencies

```
FOUNDATION (must ship first, in this order)
  O1 Auth + RBAC + audit ──┬──> everything in /ops
                           └──> O21 role scoping, O22 export logging

  O7 Consent ledger ───────┬──> P7 lead capture
                           ├──> P8 brochure gate
                           ├──> P18/P19 sales room
                           ├──> O17 KYC
                           └──> O20 data-subject requests

  Unit-type model (shared) ─┬──> P3 unit pages
                            ├──> P16 comparison
                            └──> O10 inventory

  O10 Inventory ──> O11 holds/reservations ──> O12 reservation ──> O17 KYC ──> O30 compliance pack
                                          └──> O25 velocity ──> O16 KPI dashboard

  O9 Notifications ──┬──> P6 tour confirmation
                     ├──> P7 instant lead alert
                     └──> O6 SLA escalation

PUBLIC CHAIN
  P1 pages ──> P3 unit pages ──┬──> P4 floor plan
                               ├──> P5 360 tour
                               └──> P16 comparison
  P7 lead capture ──> P17 context-carrying enquiry ──> P20 attribution ──> O24 source ROI
  P6 booking ──> O13 tour management ──> O16 conversion metrics
  P18 schedule ──> P19 sales room ──> (measured by) O24
  P9 localization ──> P1, P3, P10, P11, P23, O14, O31
  P10 SEO/redirects ──> launch cutover (blocks everything public)

ENHANCEMENTS (not blockers)
  O27 declared intent ──enhances──> O26 next-best-action
  O18 dedupe ──enhances──> O3 Client 360, O24 attribution accuracy
  O28 juridical path ──enhances──> O17 KYC
  O29 price approvals ──enhances──> O10 integrity
  P22 availability signal ──enhances──> P3 (but must never expose P18 pricing)

CONFLICTS / TENSIONS
  P22 public availability  ⚡  "inventory behind login" policy  → default off; status only
  P5 360 embeds            ⚡  P14 LCP < 2.0 s                → poster + click-to-load
  P8 gating                ⚡  P10 SEO / AI citation           → gate dossier only, never editorial
  Ops depth (O1–O32)       ⚡  one-developer operability      → fixed reports, no BI builder
  P9 bilingual             ⚡  editorial quality bar           → fewer pages, human translation
  O6 timers on Vercel      ⚡  no long-lived server            → cron + queue table, idempotent jobs
  O17 KYC                  ⚡  launch speed                    → DPIA first; manual screening acceptable at v1
```

### Dependency notes

- **O1 before O10/O11.** Inventory is priced, personal, and audited data. Adding RBAC after reservations exist means rewriting every query and backfilling an audit history you cannot reconstruct.
- **O7 before P7.** Consent captured as a form field cannot be upgraded to a ledger without losing historical evidence. This is the single most expensive thing to retrofit.
- **Shared unit-type model before P3 and O10.** The public unit page and the ops inventory row must be the same entity, or the site will drift from the price list within a month.
- **O11 is the correctness core.** Holds and reservations need transactional guarantees. A race between two sellers is the failure that destroys trust in the whole console.
- **P10 before cutover, not after.** Redirect mapping for 12 unit pages and 58 news posts is a prerequisite for preserving the brand term. It is also cheap now and impossible to recover later.
- **P18 depends on the scheme engine, which depends on a pricing model.** Do not start the estimator before unit pricing exists in O10.
- **O17 depends on a DPIA.** PROJECT.md makes this explicit. KYC can be *modelled* early (fields, states, audit) while screening stays manual until legal sign-off.

---

## MVP Definition

### Launch with (v1)

The smallest set that satisfies PROJECT.md's Core Value: inspiration → booked tour → sales action.

**Public**
- [ ] P1 eight-page editorial system — the brand contract
- [ ] P3 twelve unit-type pages (area, plan, gallery, tour, enquiry) — the decision surface
- [ ] P4 floor-plan viewer — plans must be readable on a phone
- [ ] P5 360 tour, lazy-loaded with fallback — already-owned assets, high desire value
- [ ] P6 tour booking with real slots and confirmation — the named conversion event
- [ ] P7 lead capture + consent + attribution + instant alert — the demand engine
- [ ] P8 dossier gated by lead capture — replaces Google Drive links
- [ ] P10 SEO/redirect foundation — protects existing equity
- [ ] P11 News & Events with 58 posts — long-tail traffic and IA parity
- [ ] P12 contact/location, P13 privacy + DSR entry, P14 performance/a11y, P15 states
- [ ] P9 EN + FIL for the pages that matter — do not ship half-translated

**Ops**
- [ ] O1 auth + RBAC + audit — foundation
- [ ] O7 consent ledger — legal and architectural prerequisite
- [ ] O2 lead inbox, O3 Client 360, O4 pipeline, O5 assignment, O6 SLA, O8 activity, O9 notifications
- [ ] O10 inventory, O11 holds/reservations, O12 reservation record
- [ ] O13 tour management — closes the loop on P6
- [ ] O14 CMS for pages/units/news/media/SEO
- [ ] O16 KPI dashboard (fixed metrics) + O22 CSV export
- [ ] O17 KYC case *structure* (manual screening) — gated by DPIA
- [ ] O19 search, O21 user/role admin

### Add after validation (v1.x)

Trigger: the console is in daily use and lead volume is measurable.

- [ ] P16 residence comparison — trigger: enquiries cluster on 2–3 types and sellers report buyer confusion
- [ ] P17 context-carrying enquiry — trigger: first-response time is the bottleneck
- [ ] P18 + P19 payment scenario and sales room — trigger: pricing model stable; sellers are emailing screenshots of spreadsheets
- [ ] P20 multi-touch attribution + O24 source ROI — trigger: marketing budget review needs defensible numbers
- [ ] O25 velocity panel, O26 next-best-action queue, O27 declared intent — trigger: >30 leads/month
- [ ] O18 dedupe/merge — trigger: duplicate complaints or attribution anomalies
- [ ] O20 DSR workflow, O30 compliance pack — trigger: DPIA completion / first audit request
- [ ] O31 language routing, P21 tour detail, P24 progressive profiling, P22 availability signal
- [ ] O29 price-change approvals — trigger: first negotiated discount

### Future consideration (v2+)

- [ ] O28 juridical/corporate buyer path — trigger: entity purchases appear in the pipeline
- [ ] Resident portal — explicitly phased after the sales platform (PROJECT.md)
- [ ] CRM / messaging / calendar / payment / e-sign integrations — deferred by decision, revisit with vendor selection
- [ ] Broker channel portal + commissions — trigger: channel sales become material
- [ ] ML lead scoring / AI assist — trigger: enough closed-won history to train and validate
- [ ] Multi-project support — trigger: a second RHK project
- [ ] Additional languages (Chinese) — explicitly deferred

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---|---|---|---|
| O1 Auth/RBAC/audit | HIGH | HIGH | P1 |
| O7 Consent ledger | HIGH | HIGH | P1 |
| O10 Inventory + O11 holds/reservations | HIGH | HIGH | P1 |
| P3 Unit-type pages | HIGH | MED | P1 |
| P6 Tour booking | HIGH | MED–HIGH | P1 |
| P7 Lead capture + attribution | HIGH | MED | P1 |
| O3 Client 360 + O8 activity | HIGH | MED–HIGH | P1 |
| O2 Inbox + O4 pipeline + O6 SLA | HIGH | MED | P1 |
| P10 SEO/redirects | HIGH (business-critical) | MED | P1 |
| P14 Performance + a11y | HIGH | HIGH | P1 |
| P5 360 tour | MED–HIGH | MED | P1 |
| P8 Dossier gate | MED | MED | P1 |
| P9 Bilingual | MED–HIGH | MED–HIGH | P1 |
| O16 KPI dashboard | HIGH | MED | P1 |
| O17 KYC (structure + manual) | HIGH (legal) | HIGH | P1 |
| O13 Tour management | MED | MED | P1–P2 |
| P16 Comparison | MED–HIGH | MED | P2 |
| P17 Context enquiry | MED–HIGH | LOW | P2 (cheap — pull forward if capacity allows) |
| P18/P19 Schedule + sales room | HIGH | MED–HIGH | P2 |
| P20 Attribution + O24 source ROI | HIGH | MED | P2 |
| O25 Velocity | MED–HIGH | MED | P2 |
| O26 Next-best action | MED | MED | P2 |
| O27 Declared intent | MED | LOW–MED | P2 |
| O18 Dedupe | MED | MED | P2 |
| O20 DSR + O30 compliance pack | MED (legal) | MED | P2 |
| P21 Tour detail / P22 availability / P23 editorial / P24 profiling | MED | LOW–MED | P2 |
| O28 Juridical buyer | MED | MED | P3 |
| Resident portal, integrations, broker portal, ML | — | — | P3 |

**Priority key:** P1 = launch; P2 = add after the console is in daily use; P3 = deferred / trigger-based.

---

## Competitor Feature Analysis

| Feature | Ayala Land Premier (PH luxury benchmark) | Rockwell / Shang (PH luxury peers) | Global suites (Sell.Do, ArchiNord, UnitFinder, BRIQ) | Our approach |
|---|---|---|---|---|
| Unit presentation | Project microsites, renders, "Inquire", showroom booking. Little per-unit depth publicly | Similar: brand-led microsites, floor plans, private viewing CTAs | Interactive 3D tower explorer, per-unit pages, availability colouring | 12 deeply-resolved unit pages + comparison + 360 tour; no public price |
| Pricing | Withheld or "upon request" | Withheld / broker-mediated | Public in many markets; cost-sheet generators | Never public. Advisor-led scenario + expiring sales-room link |
| Booking | Inquiry form / showroom appointment | Inquiry form | Calendar integrations, site-visit scheduling | Owned slot-based booking with holds, confirmation, ICS, reschedule |
| Lead handling | Route to sales / broker network | Route to in-house or accredited brokers | Omnichannel capture, scoring, SLA alarms, auto-assignment | Owned inbox + routing + SLA timers + context-carrying enquiries |
| Inventory | Internal / broker price lists | Internal | Real-time inventory, blocking, reservation, no double booking | Transactional holds and reservations with full audit |
| Compliance | Privacy notice, cookie consent | Privacy notice | KVKK/PDPL features in some regional suites | Consent *ledger*, DPA/AML-native KYC case, compliance pack export |
| Reporting | Project sales reporting | Project sales reporting | Velocity, absorption, source ROI, agent performance | Fixed, honest metrics: velocity (trailing 3 mo), response time, source ROI to reservation |
| Localisation | English-dominant | English-dominant | Multi-language platform features | EN + FIL with human editorial quality and language-aware routing |
| Client intelligence | Relationship-led, offline | Relationship-led, offline | AI scoring, enrichment, predictive | Declared data only + consented company lookup + KYC. No covert profiling |

**Read of the market:** PH luxury developers compete on brand and on the physical showroom, and treat the website as a brochure. Global CRM suites compete on feature count and AI claims, and treat consent as a checkbox. The open position is *operational seriousness behind a restrained brand*: a public site that behaves like a private invitation, and a console that a compliance auditor would respect. That is a defensible position, and it is exactly what PROJECT.md already asserts.

---

## Discrepancies Found During the Direct Site Audit

These affect scoping and should be resolved before requirements are frozen.

1. **Two competing URL families for the same unit types.** The Residences page links some types to `/residences/<slug>/` and others to `/units/<slug>/`, and exposes a third tab group with the same six types. PROJECT.md budgets redirects for "12 unit pages," but the legacy site appears to have more than one crawlable URL per unit. **Action:** crawl and inventory every unit URL, decide the canonical set, and map the rest with 301s. This is a P10 prerequisite and a real SEO risk.
2. **Tour assets are not what PROJECT.md describes.** PROJECT.md says "XML-based Pano2VR-style 360 tours (`tour/1br.xml`), four unit types." The live Project Materials page links **Matterport** embeds for seven suites plus a showroom tour, plus YouTube AVPs and walkthrough videos, plus some locally-hosted tour pages. **Action:** re-audit the actual asset inventory before planning P5. If Matterport is the real source, the plan must address embed consent, performance, and third-party availability — and the "reuse Pano2VR XML" assumption is wrong.
3. **Unit-type count is ambiguous.** The public nav presents North (6) + South (5) = 11 named types, while PROJECT.md says 12 and the flow mentions a third tower. **Action:** confirm the canonical taxonomy (is "Three-Bedroom Premium" a distinct type or a variant?) before building P3 or the SEO map. Getting this wrong multiplies rework across content, SEO, and ops inventory.
4. **Brochures are Google Drive links** (confirmed: two Drive links on the Residences page, one on the homepage, one on Project Materials). P8 is therefore a genuine replacement, not a nice-to-have — and the Drive files are an uncontrolled copy of collateral that may contain pricing.
5. **The legacy contact form's consent is a single bundled sentence** covering "use and/or transfer of my personal data for direct marketing." Under NPC Circular 2023-04 this is closer to blanket consent than the specific, purpose-bound, evidenced consent the DPA requires. The rebuild must not copy it. This validates O7 as P1 rather than a later compliance task.
6. **Legacy site has a "Reserve A Unit Online" page** but no transactional reservation flow — it is instructions. Worth reading before designing O12 so the digital process matches what the sales team already promises buyers.

---

## Confidence Assessment

| Area | Confidence | Notes |
|---|---|---|
| Public table stakes | MEDIUM | Cross-checked across five vendor/platform sources and the live legacy site; no independent PH-luxury benchmark study exists. The *categories* are solid; exact feature ordering is judgement |
| Public differentiators | MEDIUM | Grounded in luxury-brand literature (Wharton 2025, practitioner sources) plus conversion evidence. The "what is theater" calls are opinionated synthesis — deliberately so, per the brief |
| Ops table stakes | MEDIUM | Vendor feature pages converge strongly, but they are marketing material, not independent evaluation. Corroborated by the PH buying-process sources for reservation/KYC steps |
| Ops differentiators | MEDIUM | Consent ledger and compliance pack follow directly from NPC/AMLC primary documents (MEDIUM after cross-check of AMLC IRR + BSP circular + law-firm summary). The value judgements are mine |
| Compliance specifics | MEDIUM | AMLC covered-person status for developers, PHP 7.5M cash threshold, PHP 500k realty reporting, CIP/CVP/BOV, and NPC consent requirements are corroborated across primary and secondary sources. **Not legal advice** — counsel and a DPIA are required before KYC go-live, as PROJECT.md states |
| Complexity estimates | MEDIUM | Relative sizing for a small team on Next.js/Payload/Vercel. HIGH = correctness-critical or cross-cutting, not merely "lots of UI" |
| Market/PHP norms | MEDIUM | Reservation fee ranges, 30-day validity, spot cash/deferred/bank/in-house schemes, 40% foreign quota corroborated across multiple PH sources |
| Feature-theater calls | MEDIUM (judgement) | These are reasoned positions, not measured outcomes. Treat as hypotheses to defend in roadmap discussion, not facts |

---

## Gaps to Address

- **Actual lead volume and team size.** Every "is this theater?" call depends on whether the sales team handles 30 leads a month or 300. Get the real number; it changes O26, O27, and the chatbot verdict.
- **Whether brokers/channel partners will ever touch the console.** If yes, O21 row-level scoping and external-user auth must be designed in v1 even if unused.
- **Pricing model shape** (per-sqm, per-unit, tower premiums, discounts, payment schemes). P18 and O10 cannot be specified without it.
- **Screening vendor decision** for KYC/AML (Sanctions/PEP lists, PH-specific lists, manual fallback). Affects O17 complexity and DPIA scope.
- **Translation capacity.** Who writes the Filipino editorial, and how many pages are in scope for launch? This is the most likely schedule surprise in P9.
- **Tour asset truth.** See Discrepancy 2 — the current assumption in PROJECT.md does not match the live site.
- **Whether any availability signal is permitted publicly.** Business decision, not a technical one; confirm with the client before building P22.
- **Retention schedule** per data category (leads, KYC, reservations, analytics). Required for O7, O20, O30 and blocks a defensible DPIA.
- **Analytics/consent tooling choice.** Cookie consent must not ship before P13/O7, and the tool must be able to record consent evidence, not just block scripts.

---

## Sources

**Primary / official**
- AMLC — 2018 IRR of RA 9160 (as amended), 2021 BSP Circular amendments (real estate developers/brokers as covered persons; PHP 7.5M cash threshold; CIP/CVP/BOV) — MEDIUM after cross-check
- National Privacy Commission — RA 10173; NPC Circular 2023-04 (Guidelines on Consent); NPC Circular 2023-07 (Legitimate Interest); Advisory Opinions 2018-050, 2023-016 — MEDIUM
- DHSUD — PD 957 (Subdivision and Condominium Buyer's Protective Decree), License to Sell requirements; RA 4726 (Condominium Act) — MEDIUM
- The Velaris Residences live site — Home, Residences, Project Materials (direct audit, 2026-10-23) — HIGH for observed facts
- HBR, Oldroyd, McElheran & Elkington, "The Short Life of Online Sales Leads" (2011) — response-time evidence — MEDIUM (old but replicated directionally)

**Secondary / market**
- Wharton, "The Exclusivity Paradox: Optimizing Online Strategies for Luxury Brands" (2025) — luxury digital strategy
- Branding Strategy Insider (2025) — exclusivity, restraint, gated access
- Think Design; TTG Creatives; editorial-UI practitioner writing — luxury web design principles
- Conversion Research Hub benchmark report (2026); Deal/lead-response vendor studies — conversion and speed-to-lead benchmarks (vendor-biased, treated as directional)
- Respicio & Co.; MLS.ph; fng.ph; Taft Properties; 1Kalayaan — PH condominium purchase process, reservation fee norms, payment schemes
- ArchiNord, Faham Estate CRM, Xpedeon, Sell.Do, SafeSale, BRIQ, RAG ERP — developer sales-CRM module inventories
- UnitFinder/Plyo, RegalScene, RFX Plus, Render Vision, Matterport, Trivaxis — interactive unit/tower presentation feature sets
- Ayala Land Premier, Rockwell Land, Shang Properties — PH luxury benchmark positioning

**Confidence protocol:** all web-derived claims were tagged at the tier returned by the confidence seam (LOW unverified / MEDIUM cross-checked). No LOW-tier claim is presented as authoritative. Findings that are synthesis or judgement are labelled as such in the table above.

---

*Feature research for: luxury real-estate developer platform (public marketing + sales operations)*
*Researched: 2026-10-23*
