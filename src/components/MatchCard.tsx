import type { Match } from '@/app/types/types'
import { LocationIconSVG } from './LocationIconSVG'
import { DateIconSVG } from './DateIconSVG'
import { formatMatchDate } from '@/utils/lib'
import { CountryFlag } from './CountryFlag'

export default function MatchCard({ match }: { match: Match }) {
  const date = formatMatchDate(match.DateUtc)
  const [datePart, timePart] = date.split(' at ')
  return (
    <div className='bg-white dark:bg-[#0005] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center justify-between bg-red-700/10 dark:bg-red-200/10 w-full p-2 rounded-md text-lg font-semibold text-gray-800 dark:text-white'>
              <div className='flex items-center text-[#222a] dark:text-gray-200 dark:font-normal'>
                <CountryFlag team={match.HomeTeam} />
                {match.HomeTeam}
              </div>
              <div className='flex items-center text-[#222a] dark:text-gray-200 dark:font-normal'>
                <CountryFlag team={match.AwayTeam} />
                {match.AwayTeam}
              </div>
            </div>
          </div>

          <div className='text-sm flex flex-col items-center gap-4 text-gray-600'>
            <div className='flex items-center'>
              <DateIconSVG />
              {datePart}{' '}
              <span className='ml-1 text-md font-bold text-gray-500'>
                {timePart}
              </span>
            </div>

            <div className='flex items-center'>
              <LocationIconSVG />
              {match.Location}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
