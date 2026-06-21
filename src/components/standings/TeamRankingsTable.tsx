'use client'

import { useState, useMemo } from 'react'
import { wc_elo } from '@/data/wc_elo'
import { CountryFlag } from '@/components/CountryFlag'
import { Icon } from '@iconify/react'

type SortKey =
  | 'rank'
  | 'elo'
  | 'fifaRank'
  | 'fifaPoints'
  | 'matches'
  | 'wins'
  | 'draws'
  | 'losses'
  | 'goalsFor'
  | 'goalsAgainst'

type SortDir = 'asc' | 'desc'

interface ColDef {
  key: SortKey
  label: string
  title: string
  defaultDir: SortDir
}

const COLUMNS: ColDef[] = [
  { key: 'rank', label: 'ELO #', title: 'ELO World Rank', defaultDir: 'asc' },
  { key: 'elo', label: 'ELO', title: 'ELO Rating', defaultDir: 'desc' },
  { key: 'fifaRank', label: 'FIFA #', title: 'FIFA World Ranking', defaultDir: 'asc' },
  { key: 'fifaPoints', label: 'FIFA Pts', title: 'FIFA Points', defaultDir: 'desc' },
  { key: 'matches', label: 'Pld', title: 'Matches Played', defaultDir: 'desc' },
  { key: 'wins', label: 'W', title: 'Wins', defaultDir: 'desc' },
  { key: 'draws', label: 'D', title: 'Draws', defaultDir: 'desc' },
  { key: 'losses', label: 'L', title: 'Losses', defaultDir: 'asc' },
  { key: 'goalsFor', label: 'GF', title: 'Goals Scored', defaultDir: 'desc' },
  { key: 'goalsAgainst', label: 'GA', title: 'Goals Conceded', defaultDir: 'asc' }
]

export default function TeamRankingsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const teams = useMemo(
    () => wc_elo.filter((t): t is NonNullable<typeof t> => t !== null),
    []
  )

  const sorted = useMemo(() => {
    return [...teams].sort((a, b) => {
      const va = a[sortKey] as number
      const vb = b[sortKey] as number
      return sortDir === 'asc' ? va - vb : vb - va
    })
  }, [teams, sortKey, sortDir])

  const handleSort = (col: ColDef) => {
    if (sortKey === col.key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(col.key)
      setSortDir(col.defaultDir)
    }
  }

  const deltaCls = (raw: string) => {
    const n = parseInt(raw)
    if (n > 0) return 'text-green-600 dark:text-green-400'
    if (n < 0) return 'text-red-500 dark:text-red-400'
    return 'text-gray-400 dark:text-gray-600'
  }

  const deltaLabel = (raw: string, isRank = false) => {
    const n = parseInt(raw)
    if (n === 0) return '—'
    const arrow = n > 0 ? (isRank ? '↑' : '+') : (isRank ? '↓' : '')
    return `${arrow}${isRank ? Math.abs(n) : raw}`
  }

  return (
    <div className='bg-white dark:bg-[#ffffff08] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5'>
      <div className='px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center gap-3'>
        <Icon icon='lucide:bar-chart-2' fontSize={16} className='text-red-600 dark:text-red-400' />
        <h3 className='font-semibold text-gray-800 dark:text-gray-200 text-sm'>Team Rankings</h3>
        <span className='ml-auto text-[11px] text-gray-400 dark:text-gray-600'>{sorted.length} teams · click column to sort</span>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm min-w-[760px]'>
          <thead>
            <tr className='text-[11px] border-b border-gray-100 dark:border-white/5 bg-gray-50/60 dark:bg-white/[0.015]'>
              {/* Team — non-sortable, sticky on left */}
              <th className='px-3 py-2.5 text-left font-medium text-[11px] text-gray-400 dark:text-gray-600 whitespace-nowrap'>
                Team
              </th>
              {COLUMNS.map(col => {
                const active = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col)}
                    title={col.title}
                    className={`px-3 py-2.5 text-center font-medium cursor-pointer select-none whitespace-nowrap transition-colors
                      ${active
                        ? 'text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10'
                        : 'text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <span className='flex items-center justify-center gap-0.5'>
                      {col.label}
                      <Icon
                        icon={
                          active
                            ? sortDir === 'asc'
                              ? 'lucide:chevron-up'
                              : 'lucide:chevron-down'
                            : 'lucide:chevrons-up-down'
                        }
                        fontSize={10}
                        className={active ? 'text-red-500' : 'text-gray-300 dark:text-gray-700'}
                      />
                    </span>
                  </th>
                )
              })}
              {/* Non-sortable delta columns */}
              <th className='px-3 py-2.5 text-center font-medium text-[11px] text-gray-400 dark:text-gray-600 whitespace-nowrap' title='ELO Change (recent)'>
                ELO Δ
              </th>
              <th className='px-3 py-2.5 text-center font-medium text-[11px] text-gray-400 dark:text-gray-600 whitespace-nowrap' title='ELO Rank Change'>
                Rank Δ
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team) => {
              const isTop3 = team.rank <= 3

              return (
                <tr
                  key={team.team}
                  className='border-b border-gray-50 dark:border-white/[0.03] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors'
                >
                  {/* Team name + flag */}
                  <td className='px-3 py-2.5'>
                    <div className='flex items-center gap-2 whitespace-nowrap'>
                      <CountryFlag team={team.team} />
                      <span className='text-[13px] font-medium text-gray-800 dark:text-gray-200'>{team.team}</span>
                    </div>
                  </td>

                  {/* ELO rank */}
                  <td className='px-3 py-2.5 text-center'>
                    <span className={`text-xs font-bold
                      ${team.rank === 1 ? 'text-amber-500' : team.rank <= 3 ? 'text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {isTop3 ? (team.rank === 1 ? '🥇' : team.rank === 2 ? '🥈' : '🥉') : team.rank}
                    </span>
                  </td>

                  {/* ELO */}
                  <td className='px-3 py-2.5 text-center font-semibold text-gray-700 dark:text-gray-200 text-xs'>
                    {team.elo}
                  </td>

                  {/* FIFA rank */}
                  <td className='px-3 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{team.fifaRank}</td>

                  {/* FIFA points */}
                  <td className='px-3 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{team.fifaPoints}</td>

                  {/* Played */}
                  <td className='px-3 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{team.matches}</td>

                  {/* W D L */}
                  <td className='px-3 py-2.5 text-center text-xs text-green-600 dark:text-green-400 font-medium'>{team.wins}</td>
                  <td className='px-3 py-2.5 text-center text-xs text-yellow-600 dark:text-yellow-400 font-medium'>{team.draws}</td>
                  <td className='px-3 py-2.5 text-center text-xs text-red-500 dark:text-red-400 font-medium'>{team.losses}</td>

                  {/* GF GA */}
                  <td className='px-3 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{team.goalsFor}</td>
                  <td className='px-3 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{team.goalsAgainst}</td>

                  {/* ELO Δ */}
                  <td className={`px-3 py-2.5 text-center text-xs font-semibold ${deltaCls(team.eloChange)}`}>
                    {deltaLabel(team.eloChange)}
                  </td>

                  {/* Rank Δ */}
                  <td className={`px-3 py-2.5 text-center text-xs font-semibold ${deltaCls(team.rankChange)}`}>
                    {deltaLabel(team.rankChange, true)}
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>

      {/* Table is missing "Team" column in header — let's fix by prepending a sticky team cell */}
    </div>
  )
}
