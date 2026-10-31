'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

type WorkspaceTab = 'overview' | 'traffic' | 'audience' | 'conversion' | 'operations'
type AnalyticsTab = 'traffic' | 'audience' | 'conversion'

function workspaceTabFromHash(): WorkspaceTab {
  const hash = window.location.hash.slice(1)
  return ['traffic', 'audience', 'conversion', 'operations'].includes(hash)
    ? hash as WorkspaceTab
    : 'overview'
}

function changeWorkspaceTab(tab: WorkspaceTab) {
  const hash = `#${tab === 'overview' ? 'analytics' : tab}`
  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash)
  }
  window.dispatchEvent(new Event('workspace-tab-change'))
}

export function AdminWorkspaceNav() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')

  useEffect(() => {
    const updateFromHash = () => setActiveTab(workspaceTabFromHash())
    updateFromHash()
    window.addEventListener('hashchange', updateFromHash)
    window.addEventListener('workspace-tab-change', updateFromHash)
    return () => {
      window.removeEventListener('hashchange', updateFromHash)
      window.removeEventListener('workspace-tab-change', updateFromHash)
    }
  }, [])

  return (
    <nav className="hidden items-center gap-5 normal-case tracking-normal text-[#6b6459] md:flex" aria-label="Dashboard sections">
      {([
        ['overview', 'Overview'],
        ['traffic', 'Traffic'],
        ['audience', 'Audience'],
        ['conversion', 'Conversion'],
        ['operations', 'Operations'],
      ] as const).map(([value, label]) => (
        <button key={value} type="button" onClick={() => {
          setActiveTab(value)
          changeWorkspaceTab(value)
        }} className={activeTab === value ? 'border-b border-[#43544b] pb-1 text-[#0a0b09]' : 'transition hover:text-[#0a0b09]'}>{label}</button>
      ))}
    </nav>
  )
}

export default function AdminWorkspaceTabs({
  overview,
  operations,
}: {
  overview: ReactNode
  operations: ReactNode
}) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')

  useEffect(() => {
    const updateFromHash = () => setActiveTab(workspaceTabFromHash())
    updateFromHash()
    window.addEventListener('hashchange', updateFromHash)
    window.addEventListener('workspace-tab-change', updateFromHash)
    return () => {
      window.removeEventListener('hashchange', updateFromHash)
      window.removeEventListener('workspace-tab-change', updateFromHash)
    }

  }, [])

  return (
    <div>
      <div className={activeTab === 'overview' ? '' : 'admin-workspace-detail'} hidden={activeTab === 'operations'}>{overview}</div>
      <div hidden={activeTab !== 'operations'}>{operations}</div>
    </div>
  )
}

export function AdminAnalyticsTabs({
  traffic,
  audience,
  conversion,
}: {
  traffic: ReactNode
  audience: ReactNode
  conversion: ReactNode
}) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab | null>(null)

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.slice(1)
      setActiveTab(hash === 'traffic' || hash === 'audience' || hash === 'conversion' ? hash : null)
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
    <div>
      <div hidden={activeTab !== 'traffic'}>{traffic}</div>
      <div hidden={activeTab !== 'audience'}>{audience}</div>
      <div hidden={activeTab !== 'conversion'}>{conversion}</div>
    </div>
  )
}
