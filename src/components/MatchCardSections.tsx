import { Match } from '@/app/types/types'
import { getTeamName, predictionScoreColor, TEAM_TO_ISO_URL } from '@/utils/lib'
import { CountryFlag } from './CountryFlag'
import Link from 'next/link'

export const CardHeader = ({ match }: { match: Match }) => {
  return (
    <div className='flex items-center justify-between bg-red-700/10 dark:bg-red-200/10 w-full p-2 rounded-md text-lg font-semibold text-gray-800 dark:text-white'>
      <Link
        href={`/team/${TEAM_TO_ISO_URL[match.HomeTeam]?.toLowerCase() || match.HomeTeam}`}
        className='flex items-center text-[#222a] text-red-800/80 dark:text-red-200/80 font-medium dark:font-normal text-sm lg:text-lg hover:underline decoration-red-400 underline-offset-4'
      >
        <CountryFlag team={match.HomeTeam} />
        {getTeamName(match.HomeTeam)}
      </Link>
      <Link
        href={`/team/${TEAM_TO_ISO_URL[match.AwayTeam]?.toLowerCase() || match.AwayTeam}`}
        className='flex items-center text-[#222a] text-red-800/80 dark:text-red-200/80 font-medium dark:font-normal text-sm lg:text-lg hover:underline decoration-red-400 underline-offset-4'
      >
        <CountryFlag team={match.AwayTeam} />
        {getTeamName(match.AwayTeam)}
      </Link>
    </div>
  )
}

export const Odds = ({
  homeWin,
  awayWin,
  isHomeWinPredicted
}: {
  homeWin: number
  awayWin: number
  isHomeWinPredicted: boolean
}) => {
  return (
    <div className='-mt-1 mb-2'>
      Odds:{' '}
      <span>
        <span
          className={isHomeWinPredicted ? 'text-green-500' : 'text-red-500'}
        >
          {(homeWin * 100).toFixed(2)}%
        </span>{' '}
        -{' '}
        <span
          className={isHomeWinPredicted ? 'text-red-500' : 'text-green-500'}
        >
          {(awayWin * 100).toFixed(2)}%
        </span>
      </span>
    </div>
  )
}

export const Score = ({
  isDrawActual,
  isHomeWinActual,
  homeTeamScore,
  awayTeamScore,
  predictionScore
}: {
  isDrawActual: boolean
  isHomeWinActual: boolean
  homeTeamScore: number
  awayTeamScore: number
  predictionScore: number
}) => {
  return (
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
        {homeTeamScore}
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
        {awayTeamScore}
      </span>
      <span
        className='font-semibold text-xs rounded-full w-6 h-6 flex items-center justify-center'
        title='Prediction accuracy score'
        style={{
          color: predictionScoreColor(predictionScore),
          backgroundColor: predictionScoreColor(predictionScore) + '22'
        }}
      >
        {predictionScore}
      </span>
    </>
  )
}
