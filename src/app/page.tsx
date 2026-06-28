import type { Metadata } from 'next'
import HomeHeader from '@/components/HomeHeader'
import TournamentOverview from '@/components/TournamentOverview'
import ScheduleFilter from '@/components/ScheduleFilter'
import MatchList from '@/components/MatchList'
import ScrollToTodayButton from '@/components/ScrollToTodayButton'
import { getMatches } from '@/utils/api'
import { filterMatches } from '@/utils/matches'
import type { SearchParams } from './types/types'

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Match Schedule & Fixtures',
  description: 'View the complete match schedule and fixtures for the FIFA World Cup 2026, including teams, groups, match times, and prediction odds.'
}

export default async function Home({
  searchParams
}: {
  searchParams?: SearchParams
}) {
  const allMatches = await getMatches({ next: { revalidate: 3600 } })
  const resolvedParams = await searchParams

  const teamFilter =
    typeof resolvedParams?.team === 'string' ? resolvedParams.team : null
  const groupFilter =
    typeof resolvedParams?.group === 'string' ? resolvedParams.group : null

  const filteredMatches = filterMatches(allMatches, teamFilter, groupFilter)

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-[#1e1b1b]'>
      <div className='container mx-auto px-4 py-8'>
        <HomeHeader allMatches={allMatches} />
        <ScheduleFilter />
        <TournamentOverview />
        <MatchList matches={filteredMatches} />
      </div>
      <ScrollToTodayButton />
    </div>
  )
}
