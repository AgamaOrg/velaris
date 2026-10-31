import { createSupabaseServerClient } from '@/lib/supabase/server'

export type AnalyticsSummary = {
  pageViews: number
  clicks: number
  sessions: number
  returningSessions: number
  retentionRate: number
  leads: number
  residenceInterest: Array<{ label: string; value: number }>
  daily: Array<{ label: string; pageViews: number; clicks: number }>
  recentActivity: Array<{ type: string; label: string; path: string; occurredAt: string }>
  contentPages: number
  hasData: boolean
}

export type AnalyticsRange = '12h' | '24h' | '7d' | '30d'

export const analyticsRanges: Array<{ value: AnalyticsRange; label: string; hours: number }> = [
  { value: '12h', label: 'Last 12 hours', hours: 12 },
  { value: '24h', label: 'Last 24 hours', hours: 24 },
  { value: '7d', label: 'Last 7 days', hours: 24 * 7 },
  { value: '30d', label: 'Last 30 days', hours: 24 * 30 },
]

export function isAnalyticsRange(value: string | undefined): value is AnalyticsRange {
  return analyticsRanges.some((range) => range.value === value)
}

export async function getAnalyticsSummary(range: AnalyticsRange = '30d'): Promise<AnalyticsSummary> {
  const supabase = await createSupabaseServerClient()
  const selectedRange = analyticsRanges.find((item) => item.value === range) ?? analyticsRanges[3]
  const since = new Date(Date.now() - selectedRange.hours * 60 * 60 * 1000).toISOString()
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('event_name, session_id, path, label, metadata, occurred_at')
    .gte('occurred_at', since)
    .order('occurred_at', { ascending: true })
    .limit(10000)

  if (error) {
    throw new Error(`Analytics query failed: ${error.message}`)
  }

  const rows = events ?? []
  const pageViews = rows.filter((event) => event.event_name === 'page_view')
  const clicks = rows.filter((event) => event.event_name === 'click')
  const sessions = new Set(pageViews.map((event) => event.session_id))
  const sessionDays = new Map<string, Set<string>>()
  for (const event of pageViews) {
    const date = event.occurred_at.slice(0, 10)
    const dates = sessionDays.get(event.session_id) ?? new Set<string>()
    dates.add(date)
    sessionDays.set(event.session_id, dates)
  }
  const returningSessions = [...sessionDays.values()].filter((dates) => dates.size > 1).length
  const dailyMap = new Map<string, { pageViews: number; clicks: number }>()
  for (const event of rows) {
    const date = new Date(event.occurred_at)
    const bucket = selectedRange.hours <= 24
      ? `${date.toISOString().slice(0, 13)}:00`
      : date.toISOString().slice(0, 10)
    const current = dailyMap.get(bucket) ?? { pageViews: 0, clicks: 0 }
    if (event.event_name === 'page_view') current.pageViews += 1
    if (event.event_name === 'click') current.clicks += 1
    dailyMap.set(bucket, current)
  }
  const residenceMap = new Map<string, number>()
  for (const event of clicks) {
    if (!event.label) continue
    const current = residenceMap.get(event.label) ?? 0
    residenceMap.set(event.label, current + 1)
  }
  const { count: leads, error: leadsError } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since)
  if (leadsError) throw new Error(`Lead query failed: ${leadsError.message}`)
  const { count: contentPages, error: contentError } = await supabase
    .from('content_pages')
    .select('id', { count: 'exact', head: true })
  if (contentError) throw new Error(`Content query failed: ${contentError.message}`)

  return {
    pageViews: pageViews.length,
    clicks: clicks.length,
    sessions: sessions.size,
    returningSessions,
    retentionRate: sessions.size ? Math.round((returningSessions / sessions.size) * 100) : 0,
    leads: leads ?? 0,
    residenceInterest: [...residenceMap.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, value]) => ({ label, value })),
    daily: [...dailyMap.entries()].map(([label, value]) => ({ label, ...value })),
    recentActivity: rows
      .slice(-6)
      .reverse()
      .map((event) => ({
        type: event.event_name,
        label: event.label || (event.event_name === 'page_view' ? 'Page viewed' : 'Interaction recorded'),
        path: event.path,
        occurredAt: event.occurred_at,
      })),
    contentPages: contentPages ?? 0,
    hasData: rows.length > 0,
  }
}
