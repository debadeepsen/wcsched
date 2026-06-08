import MatchCard from '@/components/MatchCard'
import type { Match } from './types/types'
import { GroupHeading } from '@/components/GroupHeading'

async function getMatches(): Promise<Match[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/world-cup`,
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
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-red-50'>
      <div className='container mx-auto px-4 py-8'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-4'>
            FIFA World Cup 2026
          </h1>
          <p className='text-xl text-red-600'>Match Schedule & Fixtures</p>
        </header>

        <div className='mb-8'>
          <div className='bg-yellow-100/60 rounded-lg shadow-xs p-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
              Tournament Overview
            </h2>
            <p className='text-gray-600'>
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
                (acc: Record<number, Record<string, Match[]>>, match) => {
                  const round = match.RoundNumber
                  const group = match.Group

                  if (!acc[round]) acc[round] = {}
                  if (!acc[round][group]) acc[round][group] = []

                  acc[round][group].push(match)

                  return acc
                },
                {}
              )
            )
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([round, groups]) => (
                <div key={round} className='mb-8'>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                    Round {round}
                  </h2>

                  {Object.entries(groups)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([group, groupMatches]) => (
                      <div key={group} className='mb-6'>
                        <GroupHeading group={group} />

                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>
                          {groupMatches
                            .sort(
                              (a, b) => a.MatchNumber - b.MatchNumber
                            )
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
                    ))}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
