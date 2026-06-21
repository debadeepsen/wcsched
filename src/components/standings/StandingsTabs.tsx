'use client'

import { useState, type ReactNode } from 'react'
import { Icon } from '@iconify/react'

type TabId = 'groups' | 'rankings'

interface Tab {
  id: TabId
  label: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'groups', label: 'Group Standings', icon: 'lucide:layout-grid' },
  { id: 'rankings', label: 'Team Rankings', icon: 'lucide:bar-chart-2' }
]

interface StandingsTabsProps {
  groupsContent: ReactNode
  rankingsContent: ReactNode
}

export default function StandingsTabs({ groupsContent, rankingsContent }: StandingsTabsProps) {
  const [active, setActive] = useState<TabId>('groups')

  const content: Record<TabId, ReactNode> = {
    groups: groupsContent,
    rankings: rankingsContent
  }

  return (
    <div>
      {/* Tab bar */}
      <div className='flex gap-1 p-1 rounded-xl bg-gray-200/60 dark:bg-white/5 w-fit mb-8'>
        {TABS.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none
                ${isActive
                  ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              <Icon icon={tab.icon} fontSize={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content panels */}
      {TABS.map(tab => (
        <div key={tab.id} className={active === tab.id ? 'block' : 'hidden'}>
          {content[tab.id]}
        </div>
      ))}
    </div>
  )
}
