import type { Match } from '@/app/types/types'
import { LocationIconSVG } from './LocationIconSVG'
import { DateIconSVG } from './DateIconSVG'

export default function MatchCard({ match }: { match: Match }) {
  return (
    <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-lg font-semibold text-gray-800'>
              {match.HomeTeam} vs {match.AwayTeam}
            </div>
            {match.Group && (
              <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>
                {match.Group}
              </span>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
            <div className='flex items-center'>
              <DateIconSVG />
              {match.DateUtc}
            </div>

            <div className='flex items-center'>
              <LocationIconSVG />
              {match.Location}
            </div>
          </div>
        </div>

        {match.RoundNumber && (
          <div className='mt-4 md:mt-0 md:ml-4'>
            <span className='bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full'>
              Round {match.RoundNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
