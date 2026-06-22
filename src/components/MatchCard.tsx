import type { Match } from '@/app/types/types'
import { LocationIconSVG } from './LocationIconSVG'
import {
  checkIfFirstCharIsNumeric,
  predictionAccuracy,
  predictionScoreColor,
  predictMatch,
  TEAM_TO_ISO_URL
} from '@/utils/lib'
import { CountryFlag } from './CountryFlag'
import { CardDateDisplay } from './CardDateDisplay'
import Link from 'next/link'

export default function MatchCard({ match }: { match: Match }) {
  const { homeWin, awayWin } = predictMatch(match.HomeTeam, match.AwayTeam)
  const isHomeWinPredicted = homeWin > awayWin
  const isHomeWinActual =
    Number(match.HomeTeamScore) > Number(match.AwayTeamScore)
  const isDrawActual = match.HomeTeamScore === match.AwayTeamScore

  const showOdds = [match.HomeTeam, match.AwayTeam].every(
    e => !checkIfFirstCharIsNumeric(e) && !e.startsWith('To be')
  )

  const showScore = match.HomeTeamScore !== null
  let brierScore: string | null = null
  if (showScore && showOdds) {
    const homeScoreNum = Number(match.HomeTeamScore)
    const awayScoreNum = Number(match.AwayTeamScore)
    let oHome = 0
    let oAway = 0
    let oDraw = 0

    if (homeScoreNum > awayScoreNum) oHome = 1
    else if (homeScoreNum < awayScoreNum) oAway = 1
    else oDraw = 1
    // Half Brier score (ranges from 0 to 1)
    brierScore = (
      (Math.pow(homeWin - oHome, 2) +
        Math.pow(awayWin - oAway, 2) +
        Math.pow(0 - oDraw, 2)) /
      2
    ).toFixed(2)
  }

  const predictionScore = predictionAccuracy(
    homeWin,
    awayWin,
    Number(match.HomeTeamScore),
    Number(match.AwayTeamScore)
  )

  return (
    <div className='bg-white dark:bg-[#0005] min-w-[400px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center justify-between bg-red-700/10 dark:bg-red-200/10 w-full p-2 rounded-md text-lg font-semibold text-gray-800 dark:text-white'>
              <Link
                href={`/team/${TEAM_TO_ISO_URL[match.HomeTeam]?.toLowerCase() || match.HomeTeam}`}
                className='flex items-center text-[#222a] text-red-800/80 dark:text-red-200/80 font-medium dark:font-normal text-sm lg:text-lg hover:underline decoration-red-400 underline-offset-4'
              >
                <CountryFlag team={match.HomeTeam} />
                {match.HomeTeam}
              </Link>
              <Link
                href={`/team/${TEAM_TO_ISO_URL[match.AwayTeam]?.toLowerCase() || match.AwayTeam}`}
                className='flex items-center text-[#222a] text-red-800/80 dark:text-red-200/80 font-medium dark:font-normal text-sm lg:text-lg hover:underline decoration-red-400 underline-offset-4'
              >
                <CountryFlag team={match.AwayTeam} />
                {match.AwayTeam}
              </Link>
            </div>
          </div>

          <div className='text-sm flex flex-col items-center gap-4 text-gray-600 dark:text-gray-400'>
            <div className='flex items-center'>
              <CardDateDisplay utcDate={match.DateUtc} />
            </div>
            {showOdds && (
              <div className='-mt-1 mb-2'>
                Odds:{' '}
                <span>
                  <span
                    className={
                      isHomeWinPredicted ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {(homeWin * 100).toFixed(2)}%
                  </span>{' '}
                  -{' '}
                  <span
                    className={
                      isHomeWinPredicted ? 'text-red-500' : 'text-green-500'
                    }
                  >
                    {(awayWin * 100).toFixed(2)}%
                  </span>
                </span>
              </div>
            )}
            <div className='-mt-3 mb-2 flex gap-2'>
              <span>Score:</span>
              <div className='flex gap-2 items-center'>
                {showScore ? (
                  <>
                    <span
                      className={
                        isDrawActual
                          ? 'text-yellow-600'
                          : isHomeWinActual
                            ? 'text-green-500'
                            : 'text-red-500'
                      }
                    >
                      {match.HomeTeamScore}
                    </span>{' '}
                    -{' '}
                    <span
                      className={
                        isDrawActual
                          ? 'text-yellow-600'
                          : isHomeWinActual
                            ? 'text-red-500'
                            : 'text-green-500'
                      }
                    >
                      {match.AwayTeamScore}
                    </span>
                    <span
                      className='font-semibold text-xs rounded-full w-6 h-6 flex items-center justify-center'
                      title='Prediction accuracy score'
                      style={{
                        color: predictionScoreColor(predictionScore),
                        backgroundColor:
                          predictionScoreColor(predictionScore) + '22'
                      }}
                    >
                      {predictionScore}
                    </span>
                  </>
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
