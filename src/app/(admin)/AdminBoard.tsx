'use client'

import { useEffect, useState } from 'react'

type BoardColumn = { id: number; name: string; position: number }
type BoardCard = {
  id: number
  column_id: number
  title: string
  description: string | null
  priority: 'low' | 'normal' | 'high'
  position: number
  created_at: string
}

const priorityDotClasses = {
  low: 'bg-[#43544b]',
  normal: 'bg-[#876f53]',
  high: 'bg-[#d58d52]',
}

export default function AdminBoard() {
  const [columns, setColumns] = useState<BoardColumn[]>([])
  const [cards, setCards] = useState<BoardCard[]>([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<BoardCard['priority']>('normal')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [draggedCard, setDraggedCard] = useState<number | null>(null)
  const [deletingCard, setDeletingCard] = useState<number | null>(null)
  const [pendingDelete, setPendingDelete] = useState<BoardCard | null>(null)

  useEffect(() => {
    fetch('/api/operations')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load board')
        return response.json()
      })
      .then((data: { columns: BoardColumn[]; cards: BoardCard[] }) => {
        setColumns(data.columns)
        setCards(data.cards)
      })
      .catch(() => setError('Run the operations board migration in Supabase to enable this workspace.'))
      .finally(() => setLoading(false))
  }, [])

  async function addCard(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !columns[0]) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority, columnId: columns[0].id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Unable to create card')
      setCards((current) => [...current, data.card])
      setTitle('')
      setPriority('normal')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create card')
    } finally {
      setSaving(false)
    }
  }

  async function moveCard(columnId: number) {
    if (!draggedCard) return
    const card = cards.find((item) => item.id === draggedCard)
    if (!card || card.column_id === columnId) return
    const position = cards.filter((item) => item.column_id === columnId).length
    setCards((current) => current.map((item) => item.id === draggedCard ? { ...item, column_id: columnId, position } : item))
    setDraggedCard(null)
    const response = await fetch('/api/operations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: draggedCard, columnId, position }),
    })
    if (!response.ok) setError('The card moved visually, but could not be saved.')
  }

  async function removeCard(card: BoardCard) {
    setDeletingCard(card.id)
    setError('')
    try {
      const response = await fetch('/api/operations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: card.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Unable to remove task')
      setCards((current) => current.filter((item) => item.id !== card.id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to remove task')
    } finally {
      setDeletingCard(null)
      setPendingDelete(null)
    }
  }

  return (
    <section id="operations" className="mt-10 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-[#876f53]">Operations workspace</p>
          <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em]">Move the work forward.</h2>
          <p className="mt-2 max-w-xl text-sm text-[#6b6459]">A private board for coordinating content, residences, enquiries, and launch moments.</p>
        </div>
        <form onSubmit={addCard} className="flex flex-wrap items-center gap-2">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a task..." maxLength={160} className="w-44 rounded-xl border border-[#0a0b09]/10 bg-[#f2e6d7]/60 px-3 py-2 font-sans text-xs outline-none placeholder:text-[#6b6459]/60 focus:border-[#43544b] sm:w-56" />
          <select value={priority} onChange={(event) => setPriority(event.target.value as BoardCard['priority'])} className="rounded-xl border border-[#0a0b09]/10 bg-[#f2e6d7]/60 px-3 py-2 font-sans text-xs outline-none">
            <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option>
          </select>
          <button disabled={saving || loading} className="rounded-xl bg-[#43544b] px-4 py-2 font-sans text-xs text-[#f8ede0] transition hover:bg-[#2c3a33] disabled:opacity-50">{saving ? 'Adding...' : 'Add task'}</button>
        </form>
      </div>
      {error && <p className="mt-4 rounded-xl border border-[#d58d52]/30 bg-[#d58d52]/10 p-3 font-sans text-xs text-[#9b5b2e]">{error}</p>}
      {loading ? <div className="mt-5 h-48 animate-pulse rounded-2xl bg-[#f2e6d7]/60" /> : (
        <div className="mt-6 grid gap-4 overflow-x-auto pb-2 md:grid-cols-5">
          {columns.map((column) => (
            <div key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={() => moveCard(column.id)} className="min-h-56 min-w-[220px] rounded-2xl border border-[#0a0b09]/8 bg-[#f2e6d7]/35 p-4">
              <div className="flex items-center justify-between border-b border-[#0a0b09]/10 px-1 pb-3">
                <h3 className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-[#6b6459]">{column.name}</h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f8ede0] px-1.5 font-sans text-[0.58rem] text-[#876f53]">{cards.filter((card) => card.column_id === column.id).length}</span>
              </div>
              <div className="mt-3 space-y-3">
                {cards.filter((card) => card.column_id === column.id).sort((a, b) => a.position - b.position).map((card) => (
                  <article key={card.id} draggable onDragStart={() => setDraggedCard(card.id)} className="group cursor-grab rounded-xl border border-[#0a0b09]/8 bg-[#f8ede0] p-4 shadow-[0_4px_14px_rgba(67,84,75,0.04)] transition hover:-translate-y-0.5 hover:border-[#43544b]/25 hover:shadow-[0_8px_20px_rgba(67,84,75,0.08)] active:cursor-grabbing">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-serif text-[1.05rem] leading-6 text-[#0a0b09]">{card.title}</p>
                      <button
                        type="button"
                        aria-label={`Remove ${card.title}`}
                        onClick={() => setPendingDelete(card)}
                        disabled={deletingCard === card.id}
                        className="shrink-0 rounded-md px-1.5 py-0.5 font-sans text-sm leading-none text-[#6b6459]/40 opacity-0 transition hover:bg-[#d58d52]/15 hover:text-[#9b5b2e] group-hover:opacity-100 focus:opacity-100 disabled:opacity-40"
                      >
                        {deletingCard === card.id ? '…' : '×'}
                      </button>
                    </div>
                    <div className="mt-5 flex items-center gap-2 border-t border-[#0a0b09]/8 pt-3 font-sans text-[0.55rem] uppercase tracking-[0.14em] text-[#876f53]">
                      <span className={`h-1.5 w-1.5 rounded-full ${priorityDotClasses[card.priority]}`} />
                      {card.priority} priority
                    </div>
                  </article>
                ))}
                {!cards.some((card) => card.column_id === column.id) && <p className="rounded-xl border border-dashed border-[#876f53]/25 px-3 py-8 text-center font-sans text-xs text-[#6b6459]/60">Drop work here</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      {pendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101713]/35 px-5 backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !deletingCard) setPendingDelete(null)
        }}>
          <div className="w-full max-w-md rounded-3xl border border-[#f8ede0]/20 bg-[#101713] p-6 text-[#f8ede0] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="remove-task-title">
            <p className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-[#ffbc7d]">Remove task</p>
            <h3 id="remove-task-title" className="mt-3 font-serif text-2xl">Remove this task?</h3>
            <p className="mt-3 text-sm leading-6 text-[#f8ede0]/60">
              <span className="text-[#f8ede0]">“{pendingDelete.title}”</span> will be permanently removed from the operations board.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={() => setPendingDelete(null)} disabled={deletingCard === pendingDelete.id} className="rounded-xl border border-[#f8ede0]/20 px-4 py-2.5 font-sans text-xs text-[#f8ede0]/75 transition hover:border-[#f8ede0]/40 hover:text-[#f8ede0] disabled:opacity-40">Cancel</button>
              <button type="button" onClick={() => removeCard(pendingDelete)} disabled={deletingCard === pendingDelete.id} className="rounded-xl bg-[#d58d52] px-4 py-2.5 font-sans text-xs text-[#101713] transition hover:bg-[#ffbc7d] disabled:opacity-50">
                {deletingCard === pendingDelete.id ? 'Removing...' : 'Remove task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
