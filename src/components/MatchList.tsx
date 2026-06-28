import MatchCard from './MatchCard'
import { isToday } from '@/utils/lib'
import type { Match } from '@/app/types/types'
import { groupAndSortMatches } from '@/utils/matches'

interface MatchListProps {
  matches: Match[]
}

export default function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className='text-center bg-white dark:bg-[#ffffff05] p-8 rounded-lg shadow-lg border border-gray-100 dark:border-white/5'>
        <p className='text-gray-600 dark:text-gray-400'>No matches found in the schedule.</p>
      </div>
    )
  }

  const groupedDays = groupAndSortMatches(matches)

  return (
    <div className='w-full max-w-[1600px] mx-auto'>
      {groupedDays.map(({ dateKey, displayDate, matches: dayMatches }) => (
        <div key={dateKey} className='mb-8 mt-16'>
          <h2 className='text-2xl font-semibold text-gray-800 dark:font-normal dark:text-gray-200 mb-4 flex justify-center'>
            <span className='-mt-2'>{displayDate}</span>
            {isToday(dayMatches[0]?.DateUtc) && (
              <span
                id='today-tag'
                className='flex justify-center items-center -mt-3 ml-2 text-[10px] uppercase font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-md tracking-wider'
              >
                Today
              </span>
            )}
          </h2>

          <div className='flex w-full flex-wrap gap-6 justify-center'>
            {dayMatches.map(match => {
              const id = `${match.RoundNumber}.${match.MatchNumber}`
              return <MatchCard key={id} match={match} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
