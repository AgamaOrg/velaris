import { redirect } from 'next/navigation'
import type { CSSProperties } from 'react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { analyticsRanges, getAnalyticsSummary, isAnalyticsRange, type AnalyticsRange } from '@/lib/analytics'
import AdminSidebar from '../AdminSidebar'
import AdminBoard from '../AdminBoard'
import AdminWorkspaceTabs, { AdminAnalyticsTabs, AdminWorkspaceNav } from '../AdminWorkspaceTabs'

export const dynamic = 'force-dynamic'

export default async function VelarisAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect('/velaris/login')
  }
  const params = await searchParams
  const range: AnalyticsRange = isAnalyticsRange(params.range) ? params.range : '30d'
  const selectedRange = analyticsRanges.find((item) => item.value === range) ?? analyticsRanges[3]
  const analytics = await getAnalyticsSummary(range)
  const maxDailyValue = Math.max(1, ...analytics.daily.map((day) => Math.max(day.pageViews, day.clicks)))
  const maxInterest = Math.max(1, ...analytics.residenceInterest.map((item) => item.value))
  const chartHeight = 180
  const chartWidth = 720
  const chartPoints = (key: 'pageViews' | 'clicks') =>
    analytics.daily
      .map((day, index) => {
        const x = analytics.daily.length > 1 ? (index / (analytics.daily.length - 1)) * chartWidth : chartWidth / 2
        const y = chartHeight - (day[key] / maxDailyValue) * (chartHeight - 12) - 6
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  const clickRate = analytics.pageViews
    ? Math.round((analytics.clicks / analytics.pageViews) * 100)
    : 0

  return (
    <main className="min-h-screen bg-[#d9cbbb] text-[#0a0b09]">
      <AdminSidebar>
        <div className="mx-auto min-h-screen max-w-[1500px] bg-[radial-gradient(circle_at_100%_0%,rgba(213,141,82,0.13),transparent_28%),#f8ede0] lg:my-4 lg:mr-4 lg:min-h-[calc(100vh-2rem)] lg:rounded-[32px] lg:border lg:border-[#0a0b09]/10 lg:shadow-[0_24px_70px_rgba(67,84,75,0.14)]">
        <section className="px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
          <div className="admin-rise mb-5 flex flex-wrap items-center justify-between gap-4 font-sans text-[0.6rem] uppercase tracking-[0.18em] text-[#876f53]">
            <div className="flex items-center gap-6">
              <span>Velaris / Workspace</span>
              <AdminWorkspaceNav />
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Private team workspace</span>
              <form action="/auth/signout" method="post">
                <button className="rounded-full border border-[#0a0b09]/15 px-3 py-1.5 normal-case tracking-normal text-[#6b6459] transition hover:-translate-y-0.5 hover:border-[#0a0b09]/40 hover:text-[#0a0b09]">Sign out</button>
              </form>
            </div>
          </div>
          <header className="admin-rise relative overflow-hidden rounded-[26px] bg-[#101713] px-6 py-7 text-[#f8ede0] shadow-[0_16px_34px_rgba(16,23,19,0.16)] sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-[#f8ede0]/10" />
            <div className="pointer-events-none absolute right-8 top-8 h-36 w-36 rounded-full border border-[#ffbc7d]/15" />
            <div className="relative z-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-[#ffbc7d]/75">Velaris intelligence room</p>
                <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-6xl">Dashboard</h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#f8ede0]/55">A live view of attention, momentum, and the work moving the residence forward.</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-sans text-[0.58rem] uppercase tracking-[0.18em] text-[#f8ede0]/40">Current view</p>
                <p className="mt-2 font-serif text-xl">{selectedRange.label}</p>
              </div>
            </div>
            <div className="relative z-10 mt-7 flex items-center justify-between border-t border-[#f8ede0]/10 pt-4">
              <span className="flex items-center gap-2 font-sans text-[0.58rem] uppercase tracking-[0.16em] text-[#f8ede0]/55"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffbc7d]" /> Live first-party data</span>
              <span className="font-sans text-[0.58rem] uppercase tracking-[0.16em] text-[#f8ede0]/35">Private workspace</span>
            </div>
          </header>

          <AdminWorkspaceTabs
            overview={(
          <section id="analytics" className="scroll-mt-8">
            <div className="workspace-summary">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="mt-2 font-serif text-2xl tracking-[-0.03em]">Performance at a glance.</h2>
              </div>
              <div className="flex items-center gap-3">
                <form method="get">
                  <label className="sr-only" htmlFor="analytics-range">Analytics date range</label>
                  <select id="analytics-range" name="range" defaultValue={range} className="rounded-full border border-[#0a0b09]/10 bg-[#f2e6d7]/50 px-3 py-1.5 font-sans text-[0.58rem] uppercase tracking-[0.14em] text-[#6b6459] outline-none transition focus:border-[#43544b]">
                    {analyticsRanges.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <button type="submit" className="ml-1 rounded-full bg-[#43544b] px-3 py-1.5 font-sans text-[0.58rem] uppercase tracking-[0.14em] text-[#f8ede0] transition hover:bg-[#2c3a33]">
                    Apply
                  </button>
                </form>
                <span className="flex items-center gap-2 font-sans text-xs text-[#6b6459]"><i className="h-1.5 w-1.5 rounded-full bg-[#43544b]" /> Live data</span>
              </div>
            </div>
            {!analytics.hasData && (
              <div className="mt-5 rounded-2xl border border-dashed border-[#876f53]/40 bg-[#f2e6d7]/40 p-5 text-sm text-[#6b6459]">
                Analytics are connected and waiting for the first visitor events.
              </div>
            )}
            <div className="relative z-10 mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {[
                ['Page views', analytics.pageViews.toLocaleString(), 'Traffic'],
                ['Clicks', analytics.clicks.toLocaleString(), 'Engagement'],
                ['Sessions', analytics.sessions.toLocaleString(), 'Reach'],
                ['Retention', `${analytics.retentionRate}%`, 'Returning'],
                ['Leads', analytics.leads.toLocaleString(), 'Enquiries'],
                ['Content', analytics.contentPages.toLocaleString(), 'Published + draft'],
              ].map(([label, value, caption], index) => (
                <article key={label} className={`admin-card admin-rise group relative overflow-hidden rounded-2xl border border-[#0a0b09]/10 bg-[#f8ede0] p-4 shadow-[0_8px_18px_rgba(67,84,75,0.07)] [animation-delay:var(--card-delay)] ${index < 3 ? 'min-h-32' : 'min-h-28'}`} style={{ '--card-delay': `${120 + index * 70}ms` } as CSSProperties}>
                  <div className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#0a0b09]/8 transition group-hover:scale-110 ${index === 0 ? 'bg-[#43544b]/15 text-[#43544b]' : index === 1 ? 'bg-[#d58d52]/20 text-[#9b5b2e]' : index === 2 ? 'bg-[#876f53]/15 text-[#876f53]' : 'bg-[#f2e6d7] text-[#6b6459]'}`}>
                    <span className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <p className="font-sans text-[0.58rem] uppercase tracking-[0.16em] text-[#6b6459]">{label}</p>
                  <p className="mt-5 font-serif text-3xl tracking-[-0.05em]">{value}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-sans text-[0.58rem] uppercase tracking-[0.14em] text-[#876f53]">{caption}</p>
                    <span className="font-sans text-[0.55rem] text-[#43544b]">{index < 3 ? 'Live' : 'Tracked'}</span>
                  </div>
                </article>
              ))}
            </div>
            </div>
            <AdminAnalyticsTabs
              traffic={(
            <>
            <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#f2e6d7]/60 p-5 shadow-[0_8px_24px_rgba(67,84,75,0.04)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#6b6459]">Traffic & engagement</p>
                    <p className="mt-2 font-serif text-xl">Daily activity</p>
                  </div>
                  <div className="flex gap-4 font-sans text-[0.58rem] uppercase tracking-[0.14em] text-[#6b6459]">
                    <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#43544b]" />Views</span>
                    <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#ffbc7d]" />Clicks</span>
                  </div>
                </div>
                <div className="mt-6 flex h-44 items-end gap-1 border-b border-[#0a0b09]/10 sm:gap-2">
                  {analytics.daily.map((day) => (
                    <div key={day.label} className="group relative flex h-full flex-1 items-end gap-0.5">
                      <span className="w-1/2 rounded-t bg-[#43544b]/80 transition group-hover:bg-[#43544b]" style={{ height: `${Math.max(3, (day.pageViews / maxDailyValue) * 100)}%` }} />
                      <span className="w-1/2 rounded-t bg-[#ffbc7d]/80 transition group-hover:bg-[#ffbc7d]" style={{ height: `${Math.max(3, (day.clicks / maxDailyValue) * 100)}%` }} />
                      <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#101713] px-2 py-1 font-sans text-[0.55rem] text-[#f8ede0] group-hover:block">{day.pageViews} views · {day.clicks} clicks</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between font-sans text-[0.58rem] uppercase tracking-[0.12em] text-[#6b6459]">
                  <span>{analytics.daily[0]?.label ?? 'No events yet'}</span>
                  <span>{analytics.daily.at(-1)?.label ?? '30 days'}</span>
                </div>
              </article>
              <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#101713] p-5 text-[#f8ede0] shadow-[0_12px_28px_rgba(16,23,19,0.12)] sm:p-6">
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#f8ede0]/45">Residence interest</p>
                <p className="mt-2 font-serif text-xl">What guests explore</p>
                <div className="mt-6 space-y-4">
                  {analytics.residenceInterest.length ? analytics.residenceInterest.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between gap-3 font-sans text-xs">
                        <span className="truncate text-[#f8ede0]/75">{item.label}</span>
                        <span className="text-[#ffbc7d]">{item.value}</span>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-[#f8ede0]/10">
                        <div className="h-1 rounded-full bg-[#ffbc7d]" style={{ width: `${(item.value / maxInterest) * 100}%` }} />
                      </div>
                    </div>
                  )) : <p className="text-sm leading-6 text-[#f8ede0]/50">Residence interest will appear as visitors interact with the site.</p>}
                </div>
              </article>
            </div>
            <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
              <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#f2e6d7]/50 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#6b6459]">Trend line</p>
                    <p className="mt-2 font-serif text-xl">Audience momentum</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl">{clickRate}%</p>
                    <p className="font-sans text-[0.55rem] uppercase tracking-[0.12em] text-[#6b6459]">click rate</p>
                  </div>
                </div>
                <div className="mt-6 overflow-hidden">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="h-52 w-full" role="img" aria-label="Page views and clicks trend">
                    {[0, 0.33, 0.66, 1].map((line) => (
                      <line key={line} x1="0" x2={chartWidth} y1={chartHeight * line} y2={chartHeight * line} stroke="rgba(10,11,9,0.1)" strokeDasharray="3 5" />
                    ))}
                    <polyline points={chartPoints('pageViews')} fill="none" stroke="#43544b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={chartPoints('clicks')} fill="none" stroke="#d58d52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {analytics.daily.map((day, index) => {
                      const x = analytics.daily.length > 1 ? (index / (analytics.daily.length - 1)) * chartWidth : chartWidth / 2
                      const y = chartHeight - (day.pageViews / maxDailyValue) * (chartHeight - 12) - 6
                      return <circle key={day.label} cx={x} cy={y} r="3.5" fill="#43544b" />
                    })}
                  </svg>
                </div>
                <div className="flex justify-between font-sans text-[0.58rem] uppercase tracking-[0.12em] text-[#6b6459]">
                  <span>{analytics.daily[0]?.label ?? 'No events yet'}</span>
                  <span>{analytics.daily.at(-1)?.label ?? '30 days'}</span>
                </div>
              </article>
              <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#101713] p-5 text-[#f8ede0] sm:p-6">
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#f8ede0]/45">Returning audience</p>
                <p className="mt-2 font-serif text-xl">Retention signal</p>
                <div className="mt-7 flex items-center justify-center">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ background: `conic-gradient(#ffbc7d ${analytics.retentionRate}%, rgba(248,237,224,0.12) 0)` }}>
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#101713]">
                      <span className="font-serif text-3xl">{analytics.retentionRate}%</span>
                      <span className="mt-1 font-sans text-[0.55rem] uppercase tracking-[0.14em] text-[#f8ede0]/45">returning</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#f8ede0]/10 pt-5 text-center">
                  <div>
                    <p className="font-serif text-xl">{analytics.sessions}</p>
                    <p className="mt-1 font-sans text-[0.55rem] uppercase tracking-[0.12em] text-[#f8ede0]/45">sessions</p>
                  </div>
                  <div>
                    <p className="font-serif text-xl">{analytics.returningSessions}</p>
                    <p className="mt-1 font-sans text-[0.55rem] uppercase tracking-[0.12em] text-[#f8ede0]/45">repeat</p>
                  </div>
                </div>
              </article>
            </div>
            <article className="mt-5 rounded-2xl border border-[#0a0b09]/10 bg-[#f2e6d7]/50 p-5 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#6b6459]">Conversion path</p>
                  <p className="mt-2 font-serif text-xl">From visit to enquiry</p>
                </div>
                <p className="font-sans text-xs text-[#6b6459]">Based on recorded first-party events</p>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-4">
                {[
                  ['Visits', analytics.sessions, '#43544b'],
                  ['Views', analytics.pageViews, '#5d7569'],
                  ['Clicks', analytics.clicks, '#d58d52'],
                  ['Leads', analytics.leads, '#a66f4c'],
                ].map(([label, value, color], index) => (
                  <div key={label} className="relative">
                    <div className="flex items-baseline justify-between font-sans text-xs">
                      <span className="text-[#6b6459]">{label}</span>
                      <span className="font-serif text-xl">{value}</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#0a0b09]/8">
                      <div className="h-full rounded-full transition-all" style={{ width: `${analytics.sessions ? Math.max(value ? 5 : 0, (Number(value) / Math.max(analytics.sessions, analytics.pageViews, analytics.clicks, analytics.leads, 1)) * 100) : 0}%`, backgroundColor: color as string }} />
                    </div>
                    {index < 3 && <span className="absolute -right-2 top-7 hidden text-[#876f53] md:block">→</span>}
                  </div>
                ))}
              </div>
            </article>
            <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <article className="rounded-2xl bg-[#43544b] p-6 text-[#f8ede0]">
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#f8ede0]/45">Enquiries</p>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <p className="font-serif text-6xl tracking-[-0.06em]">{analytics.leads}</p>
                  <span className="rounded-full border border-[#f8ede0]/20 px-3 py-1 font-sans text-[0.58rem] uppercase tracking-[0.14em] text-[#f8ede0]/65">{selectedRange.label}</span>
                </div>
                <p className="mt-5 max-w-xs text-sm leading-6 text-[#f8ede0]/60">Visitor enquiries captured through the private viewing form.</p>
              </article>
              <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#f2e6d7]/50 p-6">
                <div className="flex items-center justify-between border-b border-[#0a0b09]/10 pb-4">
                  <div>
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#6b6459]">Activity</p>
                    <p className="mt-2 font-serif text-xl">Recent signals</p>
                  </div>
                  <span className="font-sans text-xs text-[#876f53]">Live</span>
                </div>
                <div className="mt-2 divide-y divide-[#0a0b09]/10">
                  {analytics.recentActivity.length ? analytics.recentActivity.map((item) => (
                    <div key={`${item.occurredAt}-${item.path}`} className="flex items-center gap-4 py-3">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${item.type === 'click' ? 'bg-[#ffbc7d]' : 'bg-[#43544b]'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-base">{item.label}</p>
                        <p className="mt-0.5 truncate font-sans text-[0.58rem] uppercase tracking-[0.12em] text-[#6b6459]">{item.path}</p>
                      </div>
                      <time className="font-sans text-[0.58rem] text-[#876f53]" dateTime={item.occurredAt}>{new Date(item.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
                    </div>
                  )) : <p className="py-5 text-sm text-[#6b6459]">Activity will appear as visitors explore the site.</p>}
                </div>
              </article>
            </div>
            </>
              )}
              audience={(
                <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                  <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#101713] p-6 text-[#f8ede0]">
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#f8ede0]/45">Returning audience</p>
                    <p className="mt-2 font-serif text-2xl">Retention signal</p>
                    <div className="mt-8 flex items-center gap-8">
                      <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#ffbc7d ${analytics.retentionRate}%, rgba(248,237,224,0.12) 0)` }}>
                        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#101713]">
                          <span className="font-serif text-4xl">{analytics.retentionRate}%</span>
                          <span className="mt-1 font-sans text-[0.55rem] uppercase tracking-[0.14em] text-[#f8ede0]/45">returning</span>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div><p className="font-serif text-2xl">{analytics.sessions}</p><p className="font-sans text-[0.55rem] uppercase tracking-[0.14em] text-[#f8ede0]/45">total sessions</p></div>
                        <div><p className="font-serif text-2xl">{analytics.returningSessions}</p><p className="font-sans text-[0.55rem] uppercase tracking-[0.14em] text-[#f8ede0]/45">repeat sessions</p></div>
                      </div>
                    </div>
                  </article>
                  <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#f2e6d7]/60 p-6">
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#6b6459]">Residence interest</p>
                    <p className="mt-2 font-serif text-2xl">What guests explore</p>
                    <div className="mt-7 space-y-5">
                      {analytics.residenceInterest.length ? analytics.residenceInterest.map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between gap-3 font-sans text-xs"><span className="truncate">{item.label}</span><span className="text-[#876f53]">{item.value}</span></div>
                          <div className="mt-2 h-1.5 rounded-full bg-[#0a0b09]/8"><div className="h-1.5 rounded-full bg-[#43544b]" style={{ width: `${(item.value / maxInterest) * 100}%` }} /></div>
                        </div>
                      )) : <p className="text-sm text-[#6b6459]">Residence interest will appear as visitors interact with the site.</p>}
                    </div>
                  </article>
                </div>
              )}
              conversion={(
                <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
                  <article className="rounded-2xl border border-[#0a0b09]/10 bg-[#f2e6d7]/60 p-6">
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#6b6459]">Conversion path</p>
                    <p className="mt-2 font-serif text-2xl">From visit to enquiry</p>
                    <div className="mt-8 space-y-5">
                      {[
                        ['Visits', analytics.sessions, '#43544b'],
                        ['Views', analytics.pageViews, '#5d7569'],
                        ['Clicks', analytics.clicks, '#d58d52'],
                        ['Leads', analytics.leads, '#a66f4c'],
                      ].map(([label, value, color]) => (
                        <div key={label}>
                          <div className="flex items-baseline justify-between font-sans text-xs"><span>{label}</span><span className="font-serif text-xl">{value}</span></div>
                          <div className="mt-2 h-2 rounded-full bg-[#0a0b09]/8"><div className="h-2 rounded-full" style={{ width: `${analytics.sessions ? Math.max(value ? 5 : 0, (Number(value) / Math.max(analytics.sessions, analytics.pageViews, analytics.clicks, analytics.leads, 1)) * 100) : 0}%`, backgroundColor: color as string }} /></div>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-2xl bg-[#43544b] p-6 text-[#f8ede0]">
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#f8ede0]/45">Enquiries</p>
                    <p className="mt-3 font-serif text-7xl tracking-[-0.06em]">{analytics.leads}</p>
                    <p className="mt-2 font-sans text-[0.58rem] uppercase tracking-[0.14em] text-[#f8ede0]/55">{selectedRange.label} · captured leads</p>
                    <div className="mt-10 border-t border-[#f8ede0]/15 pt-5">
                      <p className="font-serif text-xl">Recent signals</p>
                      <div className="mt-3 divide-y divide-[#f8ede0]/10">
                        {analytics.recentActivity.length ? analytics.recentActivity.slice(0, 4).map((item) => (
                          <div key={`${item.occurredAt}-${item.path}`} className="flex items-center gap-3 py-2.5 text-sm">
                            <span className={`h-1.5 w-1.5 rounded-full ${item.type === 'click' ? 'bg-[#ffbc7d]' : 'bg-[#f8ede0]/60'}`} />
                            <span className="truncate text-[#f8ede0]/75">{item.label}</span>
                          </div>
                        )) : <p className="py-2 text-sm text-[#f8ede0]/50">Activity will appear as visitors explore the site.</p>}
                      </div>
                    </div>
                  </article>
                </div>
              )}
            />
          </section>
            )}
            operations={<AdminBoard />}
          />

          <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#0a0b09]/10 pt-5 font-sans text-xs text-[#6b6459]">
            <p>Signed in as <span className="text-[#0a0b09]">{data.user.email}</span></p>
            <p>{selectedRange.label} · First-party events</p>
          </section>
        </section>
        </div>
      </AdminSidebar>
    </main>
  )
}
