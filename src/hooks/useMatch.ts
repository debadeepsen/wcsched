import { Match } from '@/app/types/types'
import { predictMatch, checkIfFirstCharIsNumeric } from '@/utils/lib'

export const useMatch = (match: Match) => {
  const { homeWin, awayWin } = predictMatch(match.HomeTeam, match.AwayTeam)
  const isHomeWinPredicted = homeWin > awayWin
  const isHomeWinActual =
    Number(match.HomeTeamScore) > Number(match.AwayTeamScore)
  const isDrawActual = match.HomeTeamScore === match.AwayTeamScore

  const showOdds = [match.HomeTeam, match.AwayTeam].every(
    e => !checkIfFirstCharIsNumeric(e) && !e.startsWith('To be')
  )
  const showScore = match.HomeTeamScore !== null

  return {
    homeWin,
    awayWin,
    isHomeWinPredicted,
    isHomeWinActual,
    isDrawActual,
    showOdds,
    showScore
  }
}
