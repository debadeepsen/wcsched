import type { Match } from '@/app/types/types'
import { LocationIconSVG } from './LocationIconSVG'
import { getRoundName, predictionAccuracy } from '@/utils/lib'
import { CardDateDisplay } from './CardDateDisplay'
import { useMatch } from '@/hooks/useMatch'
import { CardHeader, Odds, Score } from './MatchCardSections'
import { MATCHES_BY_YEAR } from '@/utils/constants'

export default function MatchCard({ match }: { match: Match }) {
  const {
    homeWin,
    awayWin,
    isHomeWinPredicted,
    isHomeWinActual,
    isDrawActual,
    showOdds,
    showScore
  } = useMatch(match)

  const predictionScore = predictionAccuracy(
    homeWin,
    awayWin,
    Number(match.HomeTeamScore),
    Number(match.AwayTeamScore)
  )

  const { totalTeams, teamsPerGroup } = MATCHES_BY_YEAR[2026]

  const roundName = getRoundName(match.MatchIndex, totalTeams, teamsPerGroup)

  return (
    <div className='relative bg-white dark:bg-[#0005] min-w-[400px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-2'>
      <div className='absolute flex items-center justify-center w-full top-[18px] left-0'>
        <h3 className='text-xs font-medium text-gray-800 dark:text-gray-200 mb-4 flex justify-center'>
          {!!roundName && (
            <span className='rounded-md px-2 py-1 bg-red-700/10 dark:bg-red-200/10 shadow-sm dark:shadow-md'>
              {roundName}
            </span>
          )}
        </h3>
      </div>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <CardHeader match={match} />
          </div>

          <div className='text-sm flex flex-col items-center gap-4 text-gray-600 dark:text-gray-400'>
            <div className='flex items-center'>
              <CardDateDisplay utcDate={match.DateUtc} />
            </div>
            {showOdds && (
              <Odds
                homeWin={homeWin}
                awayWin={awayWin}
                isHomeWinPredicted={isHomeWinPredicted}
              />
            )}
            <div className='-mt-3 mb-2 flex gap-2'>
              <span>Score:</span>
              <div className='flex gap-2 items-center'>
                {showScore ? (
                  <Score
                    isDrawActual={isDrawActual}
                    isHomeWinActual={isHomeWinActual}
                    homeTeamScore={match.HomeTeamScore}
                    awayTeamScore={match.AwayTeamScore}
                    predictionScore={predictionScore}
                  />
                ) : (
                  <span>N/A</span>
                )}
              </div>
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
