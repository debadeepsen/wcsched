import type { TeamStanding } from '@/utils/standings'
import { CountryFlag } from '@/components/CountryFlag'
import Link from 'next/link'
import { TEAM_TO_ISO_URL } from '@/utils/lib'

interface GroupTableProps {
  group: string
  rows: TeamStanding[]
}

export default function GroupTable({ group, rows }: GroupTableProps) {
  const hasResults = rows.some(r => r.played > 0)

  return (
    <div className='bg-white dark:bg-[#ffffff08] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5'>
      {/* Group header */}
      <div className='flex items-center gap-2 px-4 py-2.5 bg-red-700/8 dark:bg-red-300/8 border-b border-red-100/60 dark:border-red-400/10'>
        <h3 className='font-semibold text-red-800 dark:text-red-300 text-xs tracking-widest uppercase'>
          {group}
        </h3>
        {!hasResults && (
          <span className='ml-auto text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-medium'>
            Not started
          </span>
        )}
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='text-[11px] text-gray-400 dark:text-gray-600 border-b border-gray-100 dark:border-white/5'>
              <th className='w-7 pl-3 pr-1 py-2 text-center font-medium'>#</th>
              <th className='px-3 py-2 text-left font-medium'>Team</th>
              <th className='w-8 px-1 py-2 text-center font-medium' title='Played'>P</th>
              <th className='w-8 px-1 py-2 text-center font-medium' title='Wins'>W</th>
              <th className='w-8 px-1 py-2 text-center font-medium' title='Draws'>D</th>
              <th className='w-8 px-1 py-2 text-center font-medium' title='Losses'>L</th>
              <th className='w-9 px-1 py-2 text-center font-medium' title='Goals For'>GF</th>
              <th className='w-9 px-1 py-2 text-center font-medium' title='Goals Against'>GA</th>
              <th className='w-10 px-1 py-2 text-center font-medium' title='Goal Difference'>GD</th>
              <th className='w-10 px-2 py-2 text-center font-semibold text-red-600 dark:text-red-400' title='Points'>Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              // Top 2 advance; 3rd can also advance in WC 2026 (best 3rd-placed)
              const qualifies = i < 2
              const mayQualify = i === 2

              return (
                <tr
                  key={row.team}
                  className={`border-b border-gray-50 dark:border-white/[0.03] last:border-0 transition-colors
                    ${qualifies ? 'hover:bg-green-50/30 dark:hover:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-white/[0.015]'}
                  `}
                >
                  {/* Position */}
                  <td className='pl-3 pr-1 py-2.5 text-center'>
                    <span
                      className={`text-xs font-semibold w-5 h-5 rounded-full inline-flex items-center justify-center
                        ${qualifies
                          ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                          : mayQualify
                            ? 'bg-yellow-400/15 text-yellow-700 dark:text-yellow-400'
                            : 'text-gray-400 dark:text-gray-600'
                        }`}
                    >
                      {i + 1}
                    </span>
                  </td>

                  {/* Team */}
                  <td className='px-3 py-2.5'>
                    <Link
                      href={`/team/${TEAM_TO_ISO_URL[row.team]?.toLowerCase() || row.team}`}
                      className='flex items-center gap-2 hover:underline decoration-gray-400 underline-offset-4'
                    >
                      <CountryFlag team={row.team} />
                      <span className={`text-[13px] leading-tight ${qualifies ? 'font-semibold text-gray-800 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {row.team}
                      </span>
                    </Link>
                  </td>

                  {/* Stats */}
                  <td className='px-1 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{row.played}</td>
                  <td className='px-1 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{row.wins}</td>
                  <td className='px-1 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{row.draws}</td>
                  <td className='px-1 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{row.losses}</td>
                  <td className='px-1 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{row.goalsFor}</td>
                  <td className='px-1 py-2.5 text-center text-xs text-gray-500 dark:text-gray-400'>{row.goalsAgainst}</td>

                  {/* Goal diff */}
                  <td className={`px-1 py-2.5 text-center text-xs font-semibold
                    ${row.goalDiff > 0 ? 'text-green-600 dark:text-green-400' : row.goalDiff < 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-600'}`}
                  >
                    {row.goalDiff > 0 ? '+' : ''}{row.goalDiff}
                  </td>

                  {/* Points */}
                  <td className='px-2 py-2.5 text-center'>
                    <span className='text-xs font-bold text-red-700 dark:text-red-400'>{row.points}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className='flex items-center gap-4 px-4 py-2 border-t border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]'>
        <div className='flex items-center gap-1.5'>
          <span className='w-2 h-2 rounded-full bg-green-500/70 dark:bg-green-400/70 inline-block' />
          <span className='text-[10px] text-gray-400 dark:text-gray-600'>Advance</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <span className='w-2 h-2 rounded-full bg-yellow-400/70 inline-block' />
          <span className='text-[10px] text-gray-400 dark:text-gray-600'>May advance</span>
        </div>
      </div>
    </div>
  )
}
