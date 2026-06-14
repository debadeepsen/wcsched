import MatchCard from '@/components/MatchCard'
import type { Match } from './types/types'
import CalendarButton from '@/components/CalendarButton'

async function getMatches(): Promise<Match[]> {
  const response = await fetch(
    'https://fixturedownload.com/feed/json/fifa-world-cup-2026',
    {
      // Choose one:
      // cache: 'force-cache', // static
      // next: { revalidate: 3600 }, // ISR
      cache: 'no-store', // always fresh
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch matches')
  }

  return response.json()
}

export default async function Home() {
  const matches = await getMatches()

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-[#1e1b1b]'>
      <div className='container mx-auto px-4 py-8'>
        <header className='text-center mt-4 mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold dark:font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center gap-6'>
            <img src='/fifawc.png' width={60} height={60} />
            FIFA World Cup 2026
          </h1>
          <p className='text-xl text-red-600 mb-6'>Match Schedule & Fixtures</p>
          <div className="flex justify-center">
            <CalendarButton matches={matches} />
          </div>
        </header>

        <div className='mb-8'>
          <div className='bg-yellow-100/50 dark:bg-yellow-800/5 rounded-lg shadow-xs p-6'>
            <h2 className='text-2xl font-semibold dark:font-normal text-gray-800 dark:text-gray-200 mb-2'>
              Tournament Overview
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              The 2026 FIFA World Cup will be hosted across 16 cities in the
              United States, Canada, and Mexico. This will be the first World
              Cup with 48 teams participating.
            </p>
          </div>
        </div>

        <div className='w-fit mx-auto'>
          {matches.length === 0 ? (
            <div className='text-center bg-white p-8 rounded-lg shadow-lg'>
              <p className='text-gray-600'>No matches found in the schedule.</p>
            </div>
          ) : (
            Object.entries(
              matches.reduce(
                (acc: Record<number, Match[]>, match) => {
                  const dateObj = new Date(match.DateUtc)
                  const dateKey = new Date(
                    dateObj.getFullYear(),
                    dateObj.getMonth(),
                    dateObj.getDate()
                  ).getTime()

                  if (!acc[dateKey]) acc[dateKey] = []

                  acc[dateKey].push(match)

                  return acc
                },
                {}
              )
            )
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([dateKey, dayMatches]) => {
                const displayDate = new Date(Number(dateKey)).toLocaleDateString([], {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })

                return (
                <div key={dateKey} className='mb-8'>
                  <h2 className='text-2xl font-semibold text-gray-800 dark:font-normal dark:text-gray-200 mb-4'>
                    {displayDate}
                  </h2>

                  <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>
                    {dayMatches
                      .sort((a, b) => a.MatchNumber - b.MatchNumber)
                      .map(match => {
                        const id = `${match.RoundNumber}.${match.MatchNumber}`

                        return (
                          <MatchCard
                            key={id}
                            match={match}
                          />
                        )
                      })}
                  </div>
                </div>
                )
              })
          )}
        </div>
      </div>
    </div>
  )
}
