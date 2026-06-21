import type { Metadata } from 'next'
import type { Match } from '@/app/types/types'
import { computeGroupStandings } from '@/utils/standings'
import GroupTable from '@/components/standings/GroupTable'
import TeamRankingsTable from '@/components/standings/TeamRankingsTable'
import StandingsTabs from '@/components/standings/StandingsTabs'

export const metadata: Metadata = {
  title: 'Standings — FIFA World Cup 2026',
  description: 'Live group standings and team rankings for FIFA World Cup 2026'
}

async function getMatches(): Promise<Match[]> {
  const response = await fetch(
    'https://fixturedownload.com/feed/json/fifa-world-cup-2026',
    { cache: 'no-store' }
  )
  if (!response.ok) throw new Error('Failed to fetch matches')
  return response.json()
}

export default async function StandingsPage() {
  const matches = await getMatches()
  const groupStandings = computeGroupStandings(matches)

  const totalGroups = Object.keys(groupStandings).length
  const matchesPlayed = matches.filter(m => m.HomeTeamScore !== null).length

  const groupsContent = (
    <div>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
        {matchesPlayed > 0
          ? `${matchesPlayed} match${matchesPlayed !== 1 ? 'es' : ''} played · standings update live`
          : 'Tournament group stage has not started yet — all teams shown with 0 points.'}
      </p>
      <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {Object.entries(groupStandings).map(([group, rows]) => (
          <GroupTable key={group} group={group} rows={rows} />
        ))}
      </div>
    </div>
  )

  const rankingsContent = <TeamRankingsTable />

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-[#1e1b1b]'>
      <div className='container mx-auto px-4 py-8'>

        {/* Page header */}
        <header className='text-center mt-4 mb-10'>
          <h1 className='text-4xl md:text-5xl font-bold dark:font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center justify-center gap-4'>
            <img src='/fifawc.png' width={48} height={48} alt='FIFA WC 2026' />
            Standings
          </h1>
          <p className='text-xl text-red-600'>FIFA World Cup 2026</p>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            {totalGroups} groups · 48 teams
          </p>
        </header>

        <StandingsTabs groupsContent={groupsContent} rankingsContent={rankingsContent} />
      </div>
    </div>
  )
}
