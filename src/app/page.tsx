'use client'

import { useState, useEffect } from 'react'
import MatchCard from '@/components/MatchCard'
import type { Match } from './types/types'

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/world-cup')
      if (!response.ok) {
        throw new Error('Failed to fetch matches')
      }
      const data = await response.json()

      setMatches(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading World Cup 2026 Schedule...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center'>
        <div className='text-center bg-white p-8 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>Error</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={fetchMatches}
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-red-50'>
      <div className='container mx-auto px-4 py-8'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-4'>
            FIFA World Cup 2026
          </h1>
          <p className='text-xl text-gray-600'>Match Schedule & Fixtures</p>
        </header>

        <div className='mb-8'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
              Tournament Overview
            </h2>
            <p className='text-gray-600'>
              The 2026 FIFA World Cup will be hosted across 16 cities in the
              United States, Canada, and Mexico. This will be the first World
              Cup with 48 teams participating.
            </p>
          </div>
        </div>

        <div className='grid gap-6'>
          {matches.length === 0 ? (
            <div className='text-center bg-white p-8 rounded-lg shadow-lg'>
              <p className='text-gray-600'>No matches found in the schedule.</p>
            </div>
          ) : (
            // Group matches by round number then by group
            Object.entries(
              matches.reduce(
                (acc: Record<number, Record<string, Match[]>>, match) => {
                  const round = match.RoundNumber
                  const group = match.Group
                  if (!acc[round]) acc[round] = {}
                  if (!acc[round][group]) acc[round][group] = []
                  acc[round][group].push(match)
                  return acc
                },
                {} as Record<number, Record<string, Match[]>>
              )
            )
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([round, groups]) => (
                <div key={round} className='mb-8'>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                    Round {round}
                  </h2>
                  {/* Iterate over groups within the round */}
                  {Object.entries(groups)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([group, groupMatches]) => (
                      <div key={group} className='mb-6'>
                        <h3 className='text-xl font-medium text-gray-700 mb-2'>
                          Group {group}
                        </h3>
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                          {groupMatches
                            .sort((a, b) => a.MatchNumber - b.MatchNumber)
                            .map(match => {
                              const id = `${match.RoundNumber}.${match.MatchNumber}`
                              return <MatchCard key={id} match={match} />
                            })}
                        </div>
                      </div>
                    ))}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
