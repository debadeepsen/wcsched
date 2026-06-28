import type { Match } from '@/app/types/types'

/**
 * Fetches the FIFA World Cup 2026 match schedule and fixtures.
 * Supports passing custom Next.js/Fetch RequestInit options.
 */
export async function getMatches(options?: RequestInit): Promise<Match[]> {
  const response = await fetch(
    'https://fixturedownload.com/feed/json/fifa-world-cup-2026',
    options
  )

  if (!response.ok) {
    throw new Error('Failed to fetch matches')
  }

  return response.json()
}
