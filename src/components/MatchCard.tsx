import type { Match } from '@/app/types/types'
import { LocationIconSVG } from './LocationIconSVG'
import { DateIconSVG } from './DateIconSVG'
import { COUNTRY_ISO2, formatMatchDate } from '@/utils/lib'
import { CountryFlag } from './CountryFlag'

export default function MatchCard({ match }: { match: Match }) {
  const date = formatMatchDate(match.DateUtc)
  const [datePart, timePart] = date.split(' at ')
  return (
    <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center text-lg font-semibold text-gray-800'>
              <CountryFlag team={match.HomeTeam} />
              {match.HomeTeam}
              <span className='text-sm text-gray-500 inline-block mx-2'>
                vs
              </span>
              <CountryFlag team={match.AwayTeam} />
              {match.AwayTeam}
            </div>
          </div>

          <div className='text-sm text-gray-600'>
            <div className='flex items-center'>
              <DateIconSVG />
              {datePart} <span className='ml-1 text-md font-bold text-gray-500'>{timePart}</span>
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
