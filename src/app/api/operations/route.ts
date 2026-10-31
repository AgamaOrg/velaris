import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function getAuthenticatedClient() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return supabase
}

export async function GET() {
  const supabase = await getAuthenticatedClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { data: board, error: boardError } = await supabase
    .from('kanban_boards')
    .select('id, name')
    .eq('name', 'Velaris Operations')
    .single()

  if (boardError) {
    return NextResponse.json({ error: 'Unable to load operations board' }, { status: 500 })
  }

  const [{ data: columns, error: columnsError }, { data: cards, error: cardsError }] = await Promise.all([
    supabase
      .from('kanban_columns')
      .select('id, name, position')
      .eq('board_id', board.id)
      .order('position'),
    supabase
      .from('kanban_cards')
      .select('id, column_id, title, description, priority, position, created_at')
      .eq('board_id', board.id)
      .order('position'),
  ])

  if (columnsError || cardsError) {
    return NextResponse.json({ error: 'Unable to load operations board data' }, { status: 500 })
  }

  return NextResponse.json({ board, columns: columns ?? [], cards: cards ?? [] })
}

export async function POST(request: Request) {
  const supabase = await getAuthenticatedClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json() as { title?: string; columnId?: number; priority?: string }
  const title = body.title?.trim()
  const priority = body.priority === 'low' || body.priority === 'high' ? body.priority : 'normal'

  if (!title || title.length > 160 || !body.columnId) {
    return NextResponse.json({ error: 'A title and column are required' }, { status: 400 })
  }

  const { data: column, error: columnError } = await supabase
    .from('kanban_columns')
    .select('id, board_id')
    .eq('id', body.columnId)
    .single()

  if (columnError || !column) {
    return NextResponse.json({ error: 'The selected column does not exist' }, { status: 400 })
  }

  const { data: card, error } = await supabase
    .from('kanban_cards')
    .insert({
      board_id: column.board_id,
      column_id: column.id,
      title,
      priority,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select('id, column_id, title, description, priority, position, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Unable to create card' }, { status: 500 })
  }

  return NextResponse.json({ card }, { status: 201 })
}

export async function PATCH(request: Request) {
  const supabase = await getAuthenticatedClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json() as { cardId?: number; columnId?: number; position?: number }
  if (!body.cardId || !body.columnId || typeof body.position !== 'number') {
    return NextResponse.json({ error: 'Card, column, and position are required' }, { status: 400 })
  }

  const { data: card, error } = await supabase
    .from('kanban_cards')
    .update({ column_id: body.columnId, position: Math.max(0, Math.floor(body.position)), updated_at: new Date().toISOString() })
    .eq('id', body.cardId)
    .select('id, column_id, position')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Unable to move card' }, { status: 500 })
  }

  return NextResponse.json({ card })
}

export async function DELETE(request: Request) {
  const supabase = await getAuthenticatedClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json() as { cardId?: number }
  if (!body.cardId || !Number.isInteger(body.cardId)) {
    return NextResponse.json({ error: 'A valid card is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('kanban_cards')
    .delete()
    .eq('id', body.cardId)

  if (error) {
    return NextResponse.json({ error: 'Unable to remove task' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
