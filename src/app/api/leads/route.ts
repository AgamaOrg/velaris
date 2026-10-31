import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const locale = body?.locale === 'fil' ? 'fil' : 'en'

  if (!name || name.length > 160 || !email || email.length > 254 || !email.includes('@')) {
    return NextResponse.json({ error: 'Name and a valid email are required' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('leads').insert({
    name,
    email,
    phone: typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : null,
    interest: typeof body.interest === 'string' ? body.interest.trim().slice(0, 160) : null,
    message: typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : null,
    locale,
  })

  if (error) {
    return NextResponse.json({ error: 'Unable to save enquiry' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
