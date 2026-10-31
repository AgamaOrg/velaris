'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <div className={`relative min-h-screen lg:grid ${open ? 'lg:grid-cols-[18rem_minmax(0,1fr)]' : 'lg:grid-cols-[0_minmax(0,1fr)]'} transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="admin-menu-button fixed left-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#0a0b09]/10 bg-[#f8ede0]/90 text-[#43544b] shadow-sm backdrop-blur transition hover:bg-[#43544b] hover:text-[#f8ede0]"
        aria-label={open ? 'Collapse navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        <span className="flex w-4 flex-col gap-1">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-3 bg-current" />
          <span className="h-px w-full bg-current" />
        </span>
      </button>
      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#f8ede0]/15 bg-[#101713]/90 px-8 pb-8 pt-24 text-[#f8ede0] shadow-[12px_0_40px_rgba(16,23,19,0.16),inset_-1px_0_rgba(248,237,224,0.08)] backdrop-blur-xl transition-[transform,opacity,width,padding,border] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:shadow-[inset_-1px_0_rgba(248,237,224,0.08)] ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:pointer-events-none lg:invisible lg:w-0 lg:overflow-hidden lg:border-r-0 lg:px-0'}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(248,237,224,0.09),transparent_32%),linear-gradient(180deg,rgba(67,84,75,0.12),transparent_45%)]" />
        <div className="relative z-10">
          <p className="font-serif text-xl tracking-[0.12em]">THE VELARIS</p>
          <p className="mt-1 font-sans text-[0.5rem] tracking-[0.35em] text-[#f8ede0]/45">RESIDENCES</p>
        </div>
        <nav className="relative z-10 mt-16 space-y-2 font-sans text-sm">
          <p className="mb-5 text-[0.6rem] uppercase tracking-[0.28em] text-[#f8ede0]/35">Workspace</p>
          <Link href="/velaris#analytics" className="flex items-center gap-3 rounded-xl bg-[#43544b] px-4 py-3 transition hover:bg-[#50665a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffbc7d]" /> Overview
          </Link>
          <span className="flex items-center gap-3 px-4 py-3 text-[#f8ede0]/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f8ede0]/25" /> Content
            <span className="ml-auto text-[0.55rem] uppercase tracking-[0.14em]">Soon</span>
          </span>
          <span className="flex items-center gap-3 px-4 py-3 text-[#f8ede0]/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f8ede0]/25" /> Leads
            <span className="ml-auto text-[0.55rem] uppercase tracking-[0.14em]">Soon</span>
          </span>
        </nav>
        <div className="relative z-10 mt-auto border-t border-[#f8ede0]/10 pt-5 font-sans text-xs text-[#f8ede0]/40">
          <p>Bridgetowne, Quezon City</p>
          <p className="mt-1">Private team workspace</p>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
