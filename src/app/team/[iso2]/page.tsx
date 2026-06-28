import { notFound } from 'next/navigation'
import { ISO_URL_TO_TEAM } from '@/utils/lib'
import { wc_elo } from '@/data/wc_elo'
import MatchCard from '@/components/MatchCard'
import GroupTable from '@/components/standings/GroupTable'
import { computeGroupStandings } from '@/utils/standings'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { getMatches } from '@/utils/api'

export default async function TeamPage({
  params
}: {
  params: { iso2: string }
}) {
  const teamName = ISO_URL_TO_TEAM[params.iso2.toLowerCase()]
  if (!teamName) {
    notFound()
  }

  const teamStats = wc_elo.find(t => t?.team === teamName)

  const matches = await getMatches({ cache: 'no-store' })

  // Filter matches for this team
  const teamMatches = matches.filter(
    m => m.HomeTeam === teamName || m.AwayTeam === teamName
  )

  // Find the group this team is in
  const groupMatch = teamMatches.find(m => m.Group && m.Group.startsWith('Group'))
  const groupName = groupMatch ? groupMatch.Group : null

  // Compute standings for this team's group
  const allStandings = computeGroupStandings(matches)
  const groupStandings = groupName ? allStandings[groupName] : null

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-[#1e1b1b]'>
      <div className='container mx-auto px-4 py-8'>
        
        {/* Back link */}
        <Link 
          href="/" 
          className='inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors'
        >
          <Icon icon='lucide:arrow-left' fontSize={16} />
          Back to Schedule
        </Link>

        {/* Team Header */}
        <header className='bg-white dark:bg-[#ffffff08] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6'>
          <div className='flex-shrink-0'>
             <div className='w-24 h-16 rounded shadow-sm overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-white/5'>
                {/* Reusing CountryFlag but making it bigger by wrapping and scaling, 
                    since CountryFlag is hardcoded to w-6 h-4. We will just use the raw img for larger display. */}
                <img
                  alt={teamName}
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${
                    params.iso2.toUpperCase() === 'ENG' || params.iso2.toUpperCase() === 'SCO' 
                      ? 'GB' 
                      : params.iso2.toUpperCase()
                  }.svg`}
                  className='w-full h-full object-cover'
                />
             </div>
          </div>
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2'>
              {teamName}
            </h1>
            <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm'>
              {teamStats ? (
                <>
                  <div className='flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5'>
                    <Icon icon='lucide:bar-chart-2' className='text-red-500' />
                    <span className='text-gray-600 dark:text-gray-400'>ELO Rank:</span>
                    <span className='font-semibold text-gray-800 dark:text-gray-200'>#{teamStats.rank}</span>
                  </div>
                  <div className='flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5'>
                    <Icon icon='lucide:globe' className='text-blue-500' />
                    <span className='text-gray-600 dark:text-gray-400'>FIFA Rank:</span>
                    <span className='font-semibold text-gray-800 dark:text-gray-200'>#{teamStats.fifaRank}</span>
                  </div>
                  <div className='flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5'>
                    <Icon icon='lucide:activity' className='text-green-500' />
                    <span className='text-gray-600 dark:text-gray-400'>Form (W-D-L):</span>
                    <span className='font-semibold text-gray-800 dark:text-gray-200'>
                      {teamStats.wins}-{teamStats.draws}-{teamStats.losses}
                    </span>
                  </div>
                </>
              ) : (
                <span className='text-gray-500'>No advanced stats available</span>
              )}
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content: Matches */}
          <div className='lg:col-span-2'>
            <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2'>
              <Icon icon='lucide:calendar' className='text-red-600' />
              Match Schedule
            </h2>
            {teamMatches.length > 0 ? (
              <div className='flex flex-col gap-4'>
                {teamMatches.sort((a, b) => a.MatchNumber - b.MatchNumber).map(match => (
                  <MatchCard key={match.MatchNumber} match={match} />
                ))}
              </div>
            ) : (
              <div className='bg-white dark:bg-[#ffffff08] rounded-xl p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/5'>
                No matches scheduled for {teamName} yet.
              </div>
            )}
          </div>

          {/* Sidebar: Group Standings */}
          <div className='lg:col-span-1'>
            {groupName && groupStandings && (
              <div className='sticky top-20'>
                <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2'>
                  <Icon icon='lucide:list-ordered' className='text-red-600' />
                  Group Standing
                </h2>
                <GroupTable group={groupName} rows={groupStandings} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
