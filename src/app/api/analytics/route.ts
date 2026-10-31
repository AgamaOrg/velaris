import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const allowedEvents = new Set(['page_view', 'click'])

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (
    !body ||
    typeof body.event_name !== 'string' ||
    !allowedEvents.has(body.event_name) ||
    typeof body.session_id !== 'string' ||
    body.session_id.length < 16 ||
    body.session_id.length > 128 ||
    typeof body.path !== 'string' ||
    body.path.length < 1 ||
    body.path.length > 512
  ) {
    return NextResponse.json({ error: 'Invalid analytics event' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('analytics_events').insert({
    event_name: body.event_name,
    session_id: body.session_id,
    path: body.path,
    label: typeof body.label === 'string' ? body.label.slice(0, 160) : null,
    metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
    user_id: userData.user?.id ?? null,
  })

  if (error) {
    return NextResponse.json({ error: 'Unable to record event' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
