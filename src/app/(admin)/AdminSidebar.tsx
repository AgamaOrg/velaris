'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type WorkspaceTab = 'overview' | 'traffic' | 'audience' | 'conversion' | 'operations'

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')

  function changeWorkspaceTab(tab: WorkspaceTab) {
    const hash = `#${tab === 'overview' ? 'analytics' : tab}`
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash)
    }
    window.dispatchEvent(new Event('workspace-tab-change'))
  }

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.slice(1)
      setActiveTab(
        ['traffic', 'audience', 'conversion', 'operations'].includes(hash)
          ? hash as WorkspaceTab
          : 'overview',
      )
    }
    updateFromHash()
    window.addEventListener('hashchange', updateFromHash)
    window.addEventListener('workspace-tab-change', updateFromHash)
    return () => {
      window.removeEventListener('hashchange', updateFromHash)
      window.removeEventListener('workspace-tab-change', updateFromHash)
    }
  }, [])

  return (
    <div className={`relative min-h-screen lg:grid ${open ? 'lg:grid-cols-[18rem_minmax(0,1fr)]' : 'lg:grid-cols-[0_minmax(0,1fr)]'} transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}>
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
        className={`admin-sidebar fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#f8ede0]/15 bg-[#101713]/90 px-8 pb-8 pt-24 text-[#f8ede0] shadow-[12px_0_40px_rgba(16,23,19,0.16),inset_-1px_0_rgba(248,237,224,0.08)] backdrop-blur-xl transition-[transform,opacity,width,padding,border] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:shadow-[inset_-1px_0_rgba(248,237,224,0.08)] ${open ? 'translate-x-0 opacity-100 lg:w-72' : '-translate-x-full opacity-0 lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:border-r-0 lg:px-0 lg:translate-x-0'}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(248,237,224,0.09),transparent_32%),linear-gradient(180deg,rgba(67,84,75,0.12),transparent_45%)]" />
        <div className="relative z-10 flex min-w-max items-center gap-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none">
          <Image
            src="/dummy_pics/Frame.svg"
            alt=""
            width={30}
            height={54}
            priority
            className="h-9 w-auto brightness-0 invert"
          />
          <div>
            <p className="font-serif text-xl tracking-[0.12em]">THE VELARIS</p>
            <p className="mt-1 font-sans text-[0.5rem] tracking-[0.35em] text-[#f8ede0]/45">RESIDENCES</p>
          </div>
        </div>
        <nav className="relative z-10 mt-16 space-y-2 font-sans text-sm transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none">
          <p className="mb-5 text-[0.6rem] uppercase tracking-[0.28em] text-[#f8ede0]/35">Workspace</p>
          {([
            ['overview', 'Overview'],
            ['traffic', 'Traffic'],
            ['audience', 'Audience'],
            ['conversion', 'Conversion'],
            ['operations', 'Operations'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => changeWorkspaceTab(value)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-[#43544b]/70 hover:text-[#f8ede0] ${activeTab === value ? 'bg-[#43544b] text-[#f8ede0]' : 'text-[#f8ede0]/75'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${activeTab === value ? 'bg-[#ffbc7d]' : 'bg-[#f8ede0]/25'}`} />
              {label}
            </button>
          ))}
        </nav>
        <div className="relative z-10 mt-auto min-w-max border-t border-[#f8ede0]/10 pt-5 font-sans text-xs text-[#f8ede0]/40 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none">
          <p>Bridgetowne, Quezon City</p>
          <p className="mt-1">Private team workspace</p>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
