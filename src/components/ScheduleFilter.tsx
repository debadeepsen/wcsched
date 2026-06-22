'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { TEAM_TO_ISO_URL } from '@/utils/lib'

export default function ScheduleFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTeam = searchParams.get('team') || ''
  const currentGroup = searchParams.get('group') || ''

  const teams = Object.keys(TEAM_TO_ISO_URL).sort()
  const groups = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H', 'Group I', 'Group J', 'Group K', 'Group L']

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set('team', val)
      params.delete('group') // mutual exclusion
    } else {
      params.delete('team')
    }
    router.push(`/?${params.toString()}`)
  }

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set('group', val)
      params.delete('team') // mutual exclusion
    } else {
      params.delete('group')
    }
    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/')
  }

  return (
    <div className='flex flex-wrap gap-4 items-center bg-white dark:bg-[#ffffff05] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 mb-8 w-fit mx-auto'>
      <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Filter:</span>
      
      <select 
        className='text-sm bg-gray-50 dark:bg-[#252121] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500/50 text-gray-800 dark:text-gray-200 cursor-pointer'
        value={currentTeam}
        onChange={handleTeamChange}
      >
        <option value='' className='dark:bg-[#252121]'>All Teams</option>
        {teams.map(t => (
          <option key={t} value={TEAM_TO_ISO_URL[t]?.toLowerCase() || t} className='dark:bg-[#252121]'>
            {t}
          </option>
        ))}
      </select>

      <select 
        className='text-sm bg-gray-50 dark:bg-[#252121] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500/50 text-gray-800 dark:text-gray-200 cursor-pointer'
        value={currentGroup}
        onChange={handleGroupChange}
      >
        <option value='' className='dark:bg-[#252121]'>All Groups</option>
        {groups.map(g => (
          <option key={g} value={g} className='dark:bg-[#252121]'>{g}</option>
        ))}
      </select>

      {(currentTeam || currentGroup) && (
        <button
          onClick={clearFilters}
          className='text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium ml-2 transition-colors'
        >
          Clear
        </button>
      )}
    </div>
  )
}
