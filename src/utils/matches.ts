import type { Match } from '@/app/types/types'
import { ISO_URL_TO_TEAM } from './lib'

/**
 * Filters a list of matches by team (slug/name) or group name.
 */
export function filterMatches(
  matches: Match[],
  teamFilter?: string | null,
  groupFilter?: string | null
): Match[] {
  if (teamFilter) {
    const teamName = ISO_URL_TO_TEAM[teamFilter.toLowerCase()] || teamFilter
    return matches.filter(
      m => m.HomeTeam === teamName || m.AwayTeam === teamName
    )
  }
  if (groupFilter) {
    return matches.filter(m => m.Group === groupFilter)
  }
  return matches
}

/**
 * Represents matches grouped under a single date.
 */
export interface GroupedDayMatches {
  dateKey: number
  displayDate: string
  matches: Match[]
}

/**
 * Groups matches by their date (local/UTC day boundary) and sorts them chronologically.
 */
export function groupAndSortMatches(matches: Match[]): GroupedDayMatches[] {
  const grouped = matches.reduce((acc: Record<number, Match[]>, match) => {
    const dateObj = new Date(match.DateUtc)
    const dateKey = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate()
    ).getTime()

    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(match)
    return acc
  }, {})

  return Object.entries(grouped)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([dateKeyStr, dayMatches]) => {
      const dateKey = Number(dateKeyStr)
      const displayDate = new Date(dateKey).toLocaleDateString([], {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      const sortedMatches = dayMatches.sort((a, b) => a.MatchNumber - b.MatchNumber)

      return {
        dateKey,
        displayDate,
        matches: sortedMatches
      }
    })
}
