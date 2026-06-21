import type { Match } from '@/app/types/types'

export type TeamStanding = {
  team: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export type GroupStandings = Record<string, TeamStanding[]>

/**
 * Computes group-stage standings from live match data.
 * Only processes matches whose `Group` field starts with "Group".
 * Unplayed matches (null scores) still register teams with 0-stats so
 * the table is always fully populated.
 */
export function computeGroupStandings(matches: Match[]): GroupStandings {
  // raw map: group → team → standing
  const raw: Record<string, Record<string, TeamStanding>> = {}

  for (const match of matches) {
    const group = match.Group

    // group stage matches only
    if (!group || !group.startsWith('Group')) continue

    if (!raw[group]) raw[group] = {}

    const { HomeTeam, AwayTeam, HomeTeamScore, AwayTeamScore } = match

    // Ensure both teams exist in the table even if the match hasn't been played
    for (const team of [HomeTeam, AwayTeam]) {
      if (!raw[group][team]) {
        raw[group][team] = {
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDiff: 0,
          points: 0
        }
      }
    }

    // Skip unplayed matches
    if (HomeTeamScore === null || AwayTeamScore === null) continue

    const hScore = Number(HomeTeamScore)
    const aScore = Number(AwayTeamScore)
    const home = raw[group][HomeTeam]
    const away = raw[group][AwayTeam]

    home.played++
    away.played++
    home.goalsFor += hScore
    home.goalsAgainst += aScore
    away.goalsFor += aScore
    away.goalsAgainst += hScore

    if (hScore > aScore) {
      home.wins++
      home.points += 3
      away.losses++
    } else if (aScore > hScore) {
      away.wins++
      away.points += 3
      home.losses++
    } else {
      home.draws++
      home.points += 1
      away.draws++
      away.points += 1
    }

    home.goalDiff = home.goalsFor - home.goalsAgainst
    away.goalDiff = away.goalsFor - away.goalsAgainst
  }

  // Sort groups alphabetically; sort teams within each group by:
  // 1. Points (desc)  2. Goal diff (desc)  3. Goals for (desc)  4. Team name (asc)
  const result: GroupStandings = {}
  for (const group of Object.keys(raw).sort()) {
    result[group] = Object.values(raw[group]).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
      return a.team.localeCompare(b.team)
    })
  }

  return result
}
