# Stack Research

**Domain:** Luxury real-estate marketing site + sales operations platform (Next.js/Payload monolith on Vercel)
**Researched:** 2026-10-25
**Confidence:** HIGH for core versions and framework compatibility; MEDIUM for supporting-library choices, TypeScript 6 alignment, and the Tailwind/Next pipeline.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.4.2 | App Router, React Server Components, routing, image/font optimization, Turbopack builds | Already installed and locked. `@payloadcms/next@3.91.0` declares `next >=16.3.3 <17.0.0`, so 16.4.2 is inside the supported range. Do not drift to 16.5+/17 without re-checking Payload peers. |
| React / React DOM | 19.3.0 / 19.3.0 | UI runtime | Installed and locked. Satisfies Next's `^19.0.0` peer and Payload UI/richtext's `^19.0.1 \|\| ^19.1.2 \|\| ^19.2.1` range. Keep the two packages at the exact same version. |
| TypeScript | 6.0.3 | Type system, Payload-generated types, route typing | Project constraint. Payload 3.91 npm metadata declares no TypeScript peer, but Payload v4 raises the floor to 6.0.3 and current v3 docs/boilerplates are on TS 6.x. The repo currently has 5.9.3 — a real mismatch to fix in P0. **MEDIUM confidence** until `next typegen`, `payload generate:types`, lint, and build pass on 6.0.3. |
| Tailwind CSS | 4.3.3 | Styling, design tokens, editorial layout | Installed. Tailwind 4 is CSS-first (`@import "tailwindcss"`, `@theme`); no `tailwind.config.js` is required. |
| @tailwindcss/turbopack | 4.3.3 | Tailwind compilation inside Turbopack | Exact match to Tailwind 4.3.3; already wired in `next.config.ts` as a Turbopack CSS loader. Removes the need for a PostCSS pipeline. |
| Payload CMS | 3.91.0 | Content, auth, RBAC, Local/REST/GraphQL APIs, jobs queue | Project decision. Embeds inside the Next app and shares Postgres, auth, and deployment. All `@payloadcms/*` packages must be exactly 3.91.0 because their peers are exact. |
| @payloadcms/next | 3.91.0 | Next integration, admin route group, `withPayload` | Peer `next >=16.3.3 <17.0.0` and `payload 3.91.0`; 16.4.2 satisfies. |
| @payloadcms/db-postgres | 3.91.0 | Postgres adapter (Drizzle-based) | Project decision. Brings `pg@8.20.0`, `drizzle-orm@0.45.2`, `drizzle-kit@0.31.7`, and `@payloadcms/drizzle@3.91.0`. |
| @payloadcms/richtext-lexical | 3.91.0 | Rich text for news, legal, and page body content | Standard Payload v3 editor. React 19.3.0 satisfies its peer range. |
| Neon Postgres | managed service | System of record for content, inventory, CRM, consent, audit, jobs, sessions | Project decision. Use the pooled `-pooler` host at runtime and the direct host for migrations. Co-locate in `ap-southeast-1` with Vercel `sin1`. |
| Vercel | platform | Hosting, Functions, CDN, Cron, Blob | Project decision. Functions support Node 22.x and 24.x only; 24.x is the default. |
| GraphQL | 16.14.2 | Payload GraphQL peer | Payload peers require `^16.8.1`; 16.14.2 is the latest 16.x. Do not install GraphQL 17. |
| sharp | 0.35.5 | Image resizing for Next and Payload uploads | Next's optional peer is `^0.35.5`; already present. Payload also uses it for upload sizes. Must be available on Vercel. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pg | 8.20.0 | Postgres pool access, migration scripts, `payload.db.pool` typing | Always; pin exact to match the adapter and avoid a second `pg` copy. |
| @types/pg | 8.20.0 | TypeScript types for `pg` | Always (dev dependency). Pin to the adapter's version. |
| @vercel/functions | 3.10.3 | `attachDatabasePool` for Neon serverless connection release | In `instrumentation.ts` / Node runtime after Payload initializes. |
| @vercel/blob | 2.3.1 | Direct private Blob uploads and authenticated reads | Private KYC/reservation documents, brochure gating, and client uploads. Exact version pinned by the Payload Blob adapter. |
| @payloadcms/storage-vercel-blob | 3.91.0 | Payload upload adapter for **public** media | Public marketing images and files only. `access` is typed as `'public'`; it does **not** support private Blob access. |
| @payloadcms/email-resend | 3.91.0 | Transactional email through Resend's REST API | Default email adapter. It has no dependency on the `resend` SDK and calls `fetch` directly. |
| @payloadcms/email-nodemailer | 3.91.0 | SMTP email transport | Only if Postmark or another SMTP provider is chosen instead of Resend. |
| zod | 4.6.7 | Validation at Server Action and route-handler boundaries | Forms, webhooks, query params, and job payload validation. Payload collections use Payload field validation, not Zod. |
| server-only | 0.0.1 | Build-time guard against importing server code into client bundles | Import at the top of the data-access layer, Payload singleton, and secret-bearing modules. |
| drizzle-orm | 0.45.2 | Custom SQL, exclusion constraints, reporting queries, typed raw queries | Only where Payload's Local API cannot express the query or constraint. Pin to the adapter to avoid duplicate Drizzle instances. |
| drizzle-kit | 0.31.7 | Migration generation/inspection when invoking Drizzle directly | Usually transitive through `db-postgres`; install top-level only if scripts import it directly. |
| next-intl | 4.14.9 | UI message catalogs, pluralization, date/number formatting | English/Filipino UI strings. Use it **without** its middleware; the project's `proxy.ts` owns locale rewriting. A typed dictionary is a valid zero-dependency alternative. **MEDIUM confidence** on Cache Components interaction. |
| clsx | 2.1.1 | Conditional class names | Always, with `tailwind-merge`. |
| tailwind-merge | 3.7.0 | Merge conflicting Tailwind classes | Component variants and composed class strings. |
| class-variance-authority | 0.7.1 | Typed component variants | Buttons, cards, form controls, editorial modules. |
| radix-ui | 1.8.1 | Accessible primitives (dialog, menu, tabs, tooltip, popover) | Any interactive overlay or keyboard-heavy control; supports WCAG 2.2 AA. |
| lucide-react | 1.61.0 | Icon set | General UI icons; tree-shakable. |
| @tailwindcss/typography | 0.5.20 | Editorial prose styles | News articles, legal copy, long-form body content. |
| motion | 14.6.0 | Isolated cinematic interactions | Only in small client islands; prefer CSS/View Transitions for LCP-critical motion. |
| embla-carousel-react | 8.6.0 | Image galleries and unit-type carousels | Galleries and 360-tour entry cards. No jQuery/Slick. |
| @vercel/analytics | 2.0.1 | Consent-gated page analytics | After the consent layer exists. Do not load before consent. |
| @vercel/speed-insights | 2.0.0 | Consent-gated Core Web Vitals | After the consent layer exists. |
| @sentry/nextjs | 11.9.0 | Error tracking and performance | Optional; defer until the observability phase. Use the SDK directly, **not** `@payloadcms/plugin-sentry`. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9.39.5 + eslint-config-next 16.4.2 | Linting with flat config | `next lint` is removed in Next 16. Run `eslint .` in CI. Do not jump to ESLint 10 yet; the plugin ecosystem is still catching up. |
| Prettier 3.9.10 + prettier-plugin-tailwindcss 0.8.1 | Formatting and Tailwind class ordering | Run in CI and pre-commit. **MEDIUM confidence** on Tailwind 4 class sorting; verify one formatted file. |
| Vitest 5.0.5 + @vitejs/plugin-react 6.1.2 + jsdom 30.1.3 | Unit and component tests | Vitest 5 requires Node `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`; Node 24 is fine. |
| @testing-library/react 16.3.3 + @testing-library/user-event 14.6.8 | React component tests | Use for form and interaction tests, not for server-only modules. |
| @playwright/test 1.64.1 | End-to-end tests | Satisfies Next's peer `^1.51.1`. Use for public routes, auth, lead capture, and admin smoke tests. |
| Payload CLI (via payload 3.91.0) | Type/import-map generation and migrations | `payload generate:types`, `payload generate:importmap`, `payload migrate`, `payload migrate:create`. |
| Node.js 24.x (24.22.1+) | Runtime | Vercel supports only 22.x/24.x; 24.x is the default. Local Node 26.8.2 is ahead of the deploy runtime and predates the 2026-10-21 security patches (26.12.1). Pin `engines.node` to `24.x` for parity. |
| npm 11.19.1 | Package manager | Keep the existing `package-lock.json` v3. Do not switch to pnpm mid-project. |

## Installation

```bash
# Core framework (already installed; pin exact)
npm install next@16.4.2 react@19.3.0 react-dom@19.3.0

# Payload + adapters (all @payloadcms/* must be exactly 3.91.0)
npm install payload@3.91.0 @payloadcms/next@3.91.0 @payloadcms/db-postgres@3.91.0 \
  @payloadcms/richtext-lexical@3.91.0 @payloadcms/storage-vercel-blob@3.91.0 \
  @payloadcms/email-resend@3.91.0 graphql@16.14.2 sharp@0.35.5

# Runtime support
npm install pg@8.20.0 @vercel/functions@3.10.3 @vercel/blob@2.3.1 \
  zod@4.6.7 server-only@0.0.1 drizzle-orm@0.45.2

# UI/design support
npm install clsx@2.1.1 tailwind-merge@3.7.0 class-variance-authority@0.7.1 \
  radix-ui@1.8.1 lucide-react@1.61.0 next-intl@4.14.9

# Dev/tooling
npm install -D typescript@6.0.3 @types/node@24.19.2 @types/react@19.3.0 @types/react-dom@19.3.0 \
  @types/pg@8.20.0 eslint@9.39.5 eslint-config-next@16.4.2 \
  prettier@3.9.10 prettier-plugin-tailwindcss@0.8.1 \
  vitest@5.0.5 @vitejs/plugin-react@6.1.2 jsdom@30.1.3 \
  @testing-library/react@16.3.3 @testing-library/user-event@14.6.8 @playwright/test@1.64.1 \
  tailwindcss@4.3.3 @tailwindcss/turbopack@4.3.3 @tailwindcss/typography@0.5.20
```

If npm reports an `ERESOLVE` peer conflict, resolve it by pinning the exact versions above. Use `--legacy-peer-deps` once only if a transitive Payload peer blocks installation, then commit the lockfile. Do **not** use `--force`, and do not leave `--legacy-peer-deps` as the permanent install mode.

Suggested `package.json` scripts:

```json
{
  "engines": { "node": "24.x" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "typegen": "next typegen",
    "payload:types": "payload generate:types",
    "payload:importmap": "payload generate:importmap",
    "migrate": "payload migrate",
    "migrate:create": "payload migrate:create"
  }
}
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Payload 3.91 embedded in Next | Sanity, Contentful, Strapi, headless WordPress | Only if the client insists on a hosted CMS or cannot own Postgres. Payload wins here because the ops console needs the same auth, schema, and Local API. |
| `@payloadcms/db-postgres` with `pg` Pool | `@payloadcms/db-vercel-postgres` (Neon serverless driver) | If the project abandons `attachDatabasePool` and the `pg` Pool model. It introduces a second driver and diverges from the researched architecture; not recommended. |
| Tailwind via `@tailwindcss/turbopack` | `@tailwindcss/postcss` + `postcss.config.mjs` | If Turbopack is disabled or the build moves to webpack. Do not run both pipelines. |
| Resend via `@payloadcms/email-resend` | Postmark via `@payloadcms/email-nodemailer` | If the client chooses Postmark/SMTP. The rest of the app calls a provider-agnostic email service, so this is a one-adapter swap. |
| Vercel Blob (public adapter + direct private SDK) | S3/R2/Cloudinary | If private KYC custody or advanced transforms become mandatory. Project constraint is Vercel Blob, and the SDK already supports private access. |
| Payload jobs + protected cron endpoint | Vercel Queues/Workflows, Inngest, Trigger.dev | If jobs need multi-step waits longer than a function lifetime, cross-service orchestration, or independent scaling. Keep one observable queue now. |
| `@sentry/nextjs@11` directly | `@payloadcms/plugin-sentry` | Only if the Payload plugin updates to a Next 16-compatible Sentry SDK. Today the plugin pulls Sentry 9, whose peer excludes Next 16. |
| `next-intl` for UI strings | Typed dictionary modules | If the team wants zero extra dependencies and only two locales. `next-intl` is better when pluralization/date formatting grows. |
| Vitest 5 + Testing Library | Jest | Only if an existing Jest setup or a required transform forces it. Greenfield Next 16 is simpler with Vitest. |
| Node 24.x on Vercel | Node 26.x local/self-hosted | If deploying to Docker or a long-lived server. Vercel Functions currently expose only 22.x and 24.x. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js 15 / Pages Router | Project constraint is 16.4.2; Payload's Next 16 support starts at 16.3.3. The scaffold already uses App Router. | Next.js 16.4.2 App Router. |
| `middleware.ts` | Deprecated in Next 16 and renamed to `proxy.ts`; Proxy runs on the Node runtime. | `proxy.ts` with a narrow matcher. |
| `next lint` | Removed in Next 16; `next build` no longer lints. | `eslint .` with flat config. |
| Custom `webpack` configuration | Turbopack is the default builder. Next 16 errors when it detects a webpack config and no Turbopack config; `withPayload` injects a legacy webpack callback. | Keep `turbopack` configured (already present) and do not add your own webpack config. |
| `serverRuntimeConfig` / `publicRuntimeConfig` | Removed in Next 16. | Environment variables read on the server; `NEXT_PUBLIC_*` only for genuinely public values. |
| `images.domains` / `next/legacy/image` | Deprecated/removed; Next 16 requires explicit remote patterns. | `images.remotePatterns` and `next/image`. |
| React 18 or mismatched React/React DOM | Peer conflicts with Next 16 and Payload; duplicate React breaks hooks and RSC. | React 19.3.0 + React DOM 19.3.0, exact. |
| TypeScript 5.x in this repo | Project constraint is TS 6; the installed 5.9.3 is a scaffold mismatch. Mixing TS 5/6 across ESLint, Payload CLI, and `tsc` causes type/runtime drift. | TypeScript 6.0.3, validated in P0. |
| GraphQL 17 | Payload peers require `^16.8.1`; 17.x is outside the range. | GraphQL 16.14.2. |
| Mixed `@payloadcms/*` versions | Payload packages use exact peers (`3.91.0`). A single 3.92 package can duplicate internals or fail resolution. | Pin every `@payloadcms/*` package to 3.91.0. |
| `@payloadcms/db-vercel-postgres` | Different driver/pool model than the researched `pg` Pool + `attachDatabasePool` architecture. | `@payloadcms/db-postgres`. |
| `@payloadcms/plugin-sentry` | Depends on `@sentry/nextjs ^9.5.0`, whose Next peer excludes Next 16. | `@sentry/nextjs@11.9.0` directly, or defer observability. |
| Payload `jobs.autoRun` | Assumes a long-lived server; explicitly unsupported on serverless/Vercel. | Protected `/api/payload-jobs/run` (and schedule endpoint) called by Vercel Cron with `CRON_SECRET`. |
| `@vercel/blob` latest top-level while using the adapter | The adapter pins `@vercel/blob@2.3.1`; installing 2.8.2 top-level can create two copies. | Pin `@vercel/blob@2.3.1` or dedupe deliberately. |
| Public Blob for KYC/reservation documents | The Payload adapter only supports `access: 'public'`; Blob access mode is chosen at store creation and is not changeable. | Direct `@vercel/blob` with `access: 'private'` behind an authenticated, audited route. |
| Auth.js/NextAuth, Clerk, Supabase Auth | Duplicates Payload's users/sessions/RBAC and creates two identity models. | Payload auth (`users` collection, `useSessions: true`) and shared access functions. |
| Prisma | A second ORM/schema owner alongside Payload/Drizzle; migrations and types drift. | Payload Local API + Drizzle for raw SQL/constraints. |
| MongoDB adapter | Project chose Neon Postgres and relational ledgers. | `@payloadcms/db-postgres`. |
| Redis/Upstash for rate limiting or queues | Adds infrastructure the small team does not need; Postgres already provides durable jobs and rate-limit rows. | Postgres-backed rate limits + Payload jobs. |
| `unstable_cache` as the long-term caching model | Replaced by `use cache` in Next 16; it works only as a transitional API. | `use cache` + `cacheTag`/`cacheLife` when Cache Components are enabled; otherwise use it deliberately and plan migration. |
| ESLint 10 | The Next/TypeScript plugin ecosystem is still stabilizing on v10. | ESLint 9.39.5. |
| Running `@tailwindcss/postcss` and `@tailwindcss/turbopack` together | Double compilation and conflicting CSS output. | Pick the Turbopack loader already configured. |
| `npm install --force` / permanent `--legacy-peer-deps` | Hides real peer conflicts and can produce duplicate React/GraphQL/Payload copies. | Exact pins; resolve conflicts explicitly. |

## Stack Patterns by Variant

**If the email provider is Postmark or another SMTP service:**
- Use `@payloadcms/email-nodemailer@3.91.0` with the provider's SMTP credentials.
- Keep the domain-level `sendEmail` service provider-agnostic so jobs do not import the adapter directly.
- Because Resend is the default in this stack, a swap touches only the Payload email config and env vars.

**If the KYC provider custodies identity documents:**
- Do not store KYC documents at all; persist only the provider reference, status, redacted results, and audit events.
- This is the preferred pattern in `ARCHITECTURE.md` and removes the private-Blob custody problem entirely.
- If documents must be stored, use `@vercel/blob` directly with `access: 'private'` and an authenticated, `no-store` streaming route; never the Payload public adapter.

**If Cache Components are validated with the Payload admin:**
- Keep `cacheComponents: true` and `partialPrefetching: true`; `withPayload` sets `PAYLOAD_CACHE_COMPONENTS_ENABLED` and wraps the admin root in Suspense for this mode.
- If the P0 admin build or `/ops` behavior fails, follow `ARCHITECTURE.md` and disable both for v1; use static generation, `revalidate`, and tagged invalidation instead.
- Do not set `partialPrefetching: true` without `cacheComponents: true`; Next 16 throws at build time.

**If deploying to Vercel (the project default):**
- Set `engines.node` to `24.x` and use Node 24.22.1+ locally for parity.
- Use 24.x/22.x only; Node 26 is not available on Vercel Functions.
- Co-locate functions in `sin1` and Neon in `ap-southeast-1`.

**If self-hosting or using Docker later:**
- Node 26.12.1+ is acceptable after the October 2026 security patches.
- Keep the same Postgres pool/`attachDatabasePool` behavior only if the host supports Vercel's function lifecycle; otherwise use a normal long-lived pool and disable `attachDatabasePool`.

**If custom Payload admin components are needed:**
- Add `@payloadcms/ui@3.91.0` explicitly (it is normally transitive through `@payloadcms/next`).
- Never import `@payloadcms/ui` into `/ops`; keep the ops console on its own design system.

**If an interactive location map is required:**
- Load a client-only map island (Mapbox or Google Maps) after interaction/consent.
- Otherwise use a static map image with a link to Google Maps to protect LCP and avoid a third-party script on first paint.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.4.2` | `react@19.3.0`, `react-dom@19.3.0` | Next peer is `^19.0.0`; exact React/DOM parity required. |
| `next@16.4.2` | `@payloadcms/next@3.91.0` | Peer range `>=16.3.3 <17.0.0`; 16.4.2 is inside. |
| `payload@3.91.0` | all `@payloadcms/*@3.91.0` | Exact peers; do not mix 3.91 and 3.92. |
| `payload@3.91.0` | `graphql@16.14.2` | Peer `^16.8.1`; 16.14.2 satisfies, 17.x does not. |
| `@payloadcms/db-postgres@3.91.0` | `pg@8.20.0`, `drizzle-orm@0.45.2`, `drizzle-kit@0.31.7` | Adapter dependencies are exact. Pin top-level copies to the same versions to avoid duplicates. |
| `@payloadcms/storage-vercel-blob@3.91.0` | `@vercel/blob@2.3.1` | Adapter dependency exact. Adapter supports public access only. |
| `@payloadcms/richtext-lexical@3.91.0` | `react@19.3.0`, `react-dom@19.3.0` | Peer `^19.0.1 \|\| ^19.1.2 \|\| ^19.2.1`; 19.3.0 satisfies the caret range. |
| `next@16.4.2` | `typescript@6.0.3` | Next min is 5.1; Payload 3.91 declares no TS peer. **P0 must verify** `next typegen`, `payload generate:types`, lint, and build. MEDIUM. |
| `next@16.4.2` | `eslint@9.39.5`, `eslint-config-next@16.4.2` | Peer `eslint >=9.0.0`; flat config. ESLint 10 is untested with this plugin set. |
| `tailwindcss@4.3.3` | `@tailwindcss/turbopack@4.3.3` | Exact dependency; keep versions identical. |
| `@sentry/nextjs@11.9.0` | `next@16.4.2` | Peer `^16.0.0-0`; supported. The Payload Sentry plugin's `@sentry/nextjs@9.x` is not. |
| Node `24.x` (24.22.1+) | `next@16.4.2`, `payload@3.91.0` | Next engines `>=20.9.0`; Payload engines `>=20.18.1`; Payload docs require `^22.23.4 \|\| >=24.22.1`. Vercel exposes only 22.x/24.x. |
| `@vercel/blob@2.3.1` | private Blob access | SDK types include `'public' \| 'private'`; the Payload adapter does not. Verify the private-read pattern (token-authenticated `get`/route) before KYC implementation. |

## Current Repo Gaps (P0 Toolchain Spike)

These are concrete mismatches between the scaffold and the decided stack. Fix them before feature work.

1. **Payload is not installed.** `package.json` contains only Next, React, and the Tailwind/ESLint scaffold. Add `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/storage-vercel-blob`, `@payloadcms/email-resend`, `graphql`, and `sharp`.
2. **TypeScript is 5.9.3, not 6.0.3.** `package.json` still has `typescript: "^5"`. Upgrade and run the full type/lint/build loop.
3. **`@types/node` is 20.x.** Use `@types/node@24.19.2` to match the Node 24 deploy target, not the local Node 26 runtime.
4. **`next.config.ts` has no `withPayload` wrapper.** Import `withPayload` from `@payloadcms/next/withPayload` and export `withPayload(nextConfig)`. Keep the existing `turbopack` config; do not add webpack.
5. **`cacheComponents` / `partialPrefetching` conflict with the architecture.** The scaffold enables both; `ARCHITECTURE.md` recommends disabling them for v1 because Payload admin compatibility was not fully proven. Payload 3.91 does ship a `PAYLOAD_CACHE_COMPONENTS_ENABLED` path, so run the admin build both ways and decide explicitly.
6. **No `@payload-config` path alias.** Add `"@payload-config": ["./src/payload.config.ts"]` to `tsconfig.json` paths. Payload's Next integration expects it.
7. **No `(payload)` route group, `payload.config.ts`, `instrumentation.ts`, or `proxy.ts`.** These are required before the admin or jobs can run.
8. **No `engines.node`.** Add `"node": "24.x"` so Vercel does not pick a different major.
9. **No Blob remote pattern.** Add the public Blob host to `images.remotePatterns`; do not use `images.domains`.
10. **No migration/typegen scripts.** Add `payload generate:types`, `generate:importmap`, `migrate`, and `migrate:create`; generate types in CI and fail on diff.
11. **No `proxy.ts`.** Next 16 renamed the `middleware.ts` convention to `proxy.ts`; the locale rewrite and coarse auth redirect must live in `proxy.ts`.
12. **Tailwind pipeline is already Turbopack-based.** Do not add `@tailwindcss/postcss` or a PostCSS config; that would create a second CSS pipeline.

## Integration Notes

- **`withPayload`:** `import { withPayload } from '@payloadcms/next/withPayload'` in `next.config.ts`. It adds `serverExternalPackages`, security headers, `poweredByHeader: false`, and a legacy webpack callback. The webpack callback is inert under Turbopack; do not add your own.
- **Payload config:** `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, push: false })`. Use `push: false` everywhere except a disposable local database. Run `payload migrate` before `next build` in CI.
- **Neon pool:** After `getPayload`, call `attachDatabasePool(payload.db.pool)` from `@vercel/functions` in `instrumentation.ts`, guarded by `process.env.NEXT_RUNTIME === 'nodejs'`. The db-postgres adapter exposes `payload.db.pool` and `payload.db.poolOptions`. Keep `max` small (1–3) per function instance; use the pooled URL at runtime and the unpooled URL for migrations.
- **Routing:** Use `proxy.ts`, not `middleware.ts`. Next 16 Proxy runs on the Node runtime and cannot be used for authorization decisions; enforce access in the data layer and route handlers.
- **Caching:** `revalidateTag(tag, 'max')` (two arguments) after commit; `updateTag` for read-your-writes in Server Actions. If Cache Components are enabled, `use cache` replaces `unstable_cache`; `cacheLife`/`cacheTag` are stable in Next 16.
- **Images:** Set `images.qualities: [75, 90]` if art direction needs 90 (Next 16 defaults to `[75]` only), `minimumCacheTTL` to ~30 days for immutable media, and `remotePatterns` for the Blob host.
- **Jobs:** `jobs.autoRun: false`. Expose protected `/api/payload-jobs/run` (and the schedule handler) with `CRON_SECRET`; schedule via `vercel.json` on Pro. Set an explicit `maxDuration`.
- **Private Blob:** `put(pathname, body, { access: 'private' })`, then serve through an authenticated `no-store` route that checks permission and writes an audit event. Never expose a public URL for KYC or reservation documents.
- **Email:** Configure `@payloadcms/email-resend` with `RESEND_API_KEY` and a verified `defaultFrom`; verify DKIM/SPF. Send from a job after the business transaction commits, not inside `afterChange`.
- **Env vars:** `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`. Keep secrets server-only; never prefix them with `NEXT_PUBLIC_`.
- **Runtime:** Payload admin and API routes must run on the Node runtime. If Cache Components are enabled, do not export `runtime` from those route segments.

## Sources

- **Installed `package-lock.json` and `node_modules` manifests** — exact installed versions for Next 16.4.2, React 19.3.0, Tailwind 4.3.3, TypeScript 5.9.3, ESLint 9.39.5, and `@types/node` 20.x. **HIGH.**
- **`node_modules/next/dist/docs/` (version-matched Next 16.4.2 docs)** — `version-16`, `proxy`, `cacheComponents`, `partialPrefetching`, `typescript`, `eslint`, `images`, `turbopack`, `serverExternalPackages`, and environment-variable behavior. **HIGH.**
- **npm registry (`npm view`)** — Payload 3.91.0 peers/dependencies, `@payloadcms/next` Next peer range, `@payloadcms/db-postgres` dependency pins, `@payloadcms/storage-vercel-blob` `@vercel/blob` pin, Next 16.4.2 engines/peers, TypeScript dist-tags, GraphQL 16.x, Sentry 11 peers, Vercel Functions 3.10.3 exports. **HIGH.**
- **Payload v3 installation docs** — https://payloadcms.com/docs/getting-started/installation — Node and Next support ranges. **HIGH.**
- **Payload Postgres docs** — https://payloadcms.com/docs/database/postgres — pool config, Drizzle, migrations, transaction behavior. **HIGH.**
- **Payload Vercel Blob docs** — https://payloadcms.com/docs/upload/storage-adapters#vercel-blob — adapter is public-only; private Blob is a separate integration. **HIGH.**
- **Payload Jobs Queue docs** — https://payloadcms.com/docs/jobs-queue/overview — `autoRun` is not for serverless; use protected run endpoints. **HIGH.**
- **Vercel Node.js versions** — https://vercel.com/docs/functions/runtimes/node-js/node-js-versions — current runtimes are 22.x and 24.x; 24.x is default. **HIGH.**
- **Vercel Blob access control** — https://vercel.com/docs/vercel-blob/access-control — public vs private access; access mode is fixed at store creation. **MEDIUM** (verified against `@vercel/blob@2.3.1` types; the docs page was not re-fetched in this session).
- **Neon connection pooling** — https://neon.com/docs/connect/connection-pooling — pooled vs direct connections, PgBouncer transaction-mode limits. **HIGH.**
- **`@vercel/functions` 3.10.3 types** — `attachDatabasePool` is exported and accepts a `pg` Pool. **HIGH** (verified in the installed tarball).
- **Tailwind CSS 4 + Next.js guide** — https://tailwindcss.com/docs/installation/framework-guides/nextjs — CSS-first setup and the Turbopack/PostCSS choice. **MEDIUM** (the installed package and scaffold were verified; the docs URL was not re-fetched).
- **GSD `classify-confidence` seam** — returned LOW/SUS for some official npm packages during this research. Local lockfile/manifests and official package tarballs are treated as higher authority; the LOW labels reflect a heuristic, not a contradiction of the pinned versions.

---

*Stack research for: The Velaris Residences digital platform*
*Researched: 2026-10-25*
