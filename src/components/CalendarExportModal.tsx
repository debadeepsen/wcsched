'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type { Match } from '../app/types/types'
import {
  generateIcs,
  downloadIcs,
  ReminderOption,
  CalendarExportOptions
} from '../utils/calendar'
import { CountryFlag } from './CountryFlag'
import { formatMatchDate } from '@/utils/lib'

interface CalendarExportModalProps {
  isOpen: boolean
  onClose: () => void
  matches: Match[]
}

const STAGES = [
  { id: 1, label: 'Group Stage' },
  { id: 2, label: 'Round of 32' },
  { id: 3, label: 'Round of 16' },
  { id: 4, label: 'Quarter Finals' },
  { id: 5, label: 'Semi Finals' },
  { id: 6, label: 'Finals' }
]

export default function CalendarExportModal({
  isOpen,
  onClose,
  matches
}: CalendarExportModalProps) {
  const [selectedMatches, setSelectedMatches] = useState<Set<number>>(new Set())
  const [teamFilter, setTeamFilter] = useState<string>('All Teams')

  const [options, setOptions] = useState<CalendarExportOptions>({
    reminder: 0,
    includeVenue: true,
    includeDetails: true,
    includeTimezone: true
  })

  const [isExporting, setIsExporting] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Get unique teams
  const teams = useMemo(() => {
    const allTeams = new Set<string>()
    matches.forEach(m => {
      allTeams.add(m.HomeTeam)
      allTeams.add(m.AwayTeam)
    })
    return ['All Teams', ...Array.from(allTeams).sort()]
  }, [matches])

  // Filtered matches based on team filter
  const displayedMatches = useMemo(() => {
    if (teamFilter === 'All Teams') return matches
    return matches.filter(
      m => m.HomeTeam === teamFilter || m.AwayTeam === teamFilter
    )
  }, [matches, teamFilter])

  // Quick Selects
  const selectAll = () => {
    setSelectedMatches(new Set(matches.map(m => m.MatchNumber)))
    setTeamFilter('All Teams')
  }

  const selectStage = (roundNumber: number) => {
    const stageMatches = matches
      .filter(m => m.RoundNumber === roundNumber)
      .map(m => m.MatchNumber)
    setSelectedMatches(new Set(stageMatches))
    setTeamFilter('All Teams')
  }

  // Handle team filter change - auto-select their matches
  const handleTeamFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const team = e.target.value
    setTeamFilter(team)
    if (team !== 'All Teams') {
      const teamMatches = matches
        .filter(m => m.HomeTeam === team || m.AwayTeam === team)
        .map(m => m.MatchNumber)
      setSelectedMatches(new Set(teamMatches))
    }
  }

  const toggleMatch = (matchNumber: number) => {
    const newSelection = new Set(selectedMatches)
    if (newSelection.has(matchNumber)) {
      newSelection.delete(matchNumber)
    } else {
      newSelection.add(matchNumber)
    }
    setSelectedMatches(newSelection)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const matchesToExport = matches.filter(m =>
        selectedMatches.has(m.MatchNumber)
      )
      if (matchesToExport.length === 0) return

      const icsString = await generateIcs(matchesToExport, options)
      downloadIcs(icsString)
      onClose()
    } catch (error) {
      console.error('Failed to generate ICS:', error)
      alert('Failed to generate calendar file. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div
        className='bg-white dark:bg-[#2b2727] w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden focus:outline-none'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        tabIndex={-1}
      >
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700'>
          <h2
            id='modal-title'
            className='text-2xl font-bold text-gray-900 dark:text-gray-100'
          >
            Export to Calendar
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
            aria-label='Close modal'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className='flex-1 overflow-y-auto p-6 space-y-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Match Selection & Filter */}
            <section className='flex flex-col h-[400px]'>
              <div className='flex justify-between items-center mb-3'>
                <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                  Select Matches
                </h3>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {selectedMatches.size} selected
                </span>
              </div>

              <div className='mb-3'>
                <select
                  value={teamFilter}
                  onChange={handleTeamFilterChange}
                  className='w-full p-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-[#1e1b1b] dark:text-gray-200 focus:ring-2 focus:ring-blue-500'
                >
                  {teams.map(team => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex-1 border border-gray-200 dark:border-gray-700 rounded-md overflow-y-auto p-2 bg-gray-50 dark:bg-[#1e1b1b]'>
                {displayedMatches.map(match => {
                  const { date, time } = formatMatchDate(match.DateUtc)
                  return (
                    <label
                      key={match.MatchNumber}
                      className='flex items-start p-2 hover:bg-white dark:hover:bg-[#2b2727] rounded cursor-pointer transition-colors'
                    >
                      <input
                        type='checkbox'
                        className='mt-1 mr-3 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                        checked={selectedMatches.has(match.MatchNumber)}
                        onChange={() => toggleMatch(match.MatchNumber)}
                      />
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate text-left flex items-center gap-2'>
                          <CountryFlag team={match.HomeTeam} mr={0} />{' '}
                          {match.HomeTeam}{' '}
                          <span className='mx-2 text-xs'>vs</span>{' '}
                          <CountryFlag team={match.AwayTeam} mr={0} />{' '}
                          {match.AwayTeam}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-3 mt-1'>
                          <span>{date}</span>
                          <span>{time}</span>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </section>

            {/* Export Settings */}
            <section className='space-y-6'>
              <div>
                <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3'>
                  Notification Reminder
                </h3>
                <select
                  value={options.reminder}
                  onChange={e =>
                    setOptions({
                      ...options,
                      reminder: parseInt(e.target.value) as ReminderOption
                    })
                  }
                  className='w-full p-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-[#1e1b1b] dark:text-gray-200 focus:ring-2 focus:ring-blue-500'
                >
                  <option value={0}>No reminder</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={180}>3 hours before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </div>

              <div>
                <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3'>
                  Include Information
                </h3>
                <div className='space-y-3'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                      checked={options.includeVenue}
                      onChange={e =>
                        setOptions({
                          ...options,
                          includeVenue: e.target.checked
                        })
                      }
                    />
                    <span className='ml-3 text-sm text-gray-700 dark:text-gray-300'>
                      Venue / Location
                    </span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                      checked={options.includeDetails}
                      onChange={e =>
                        setOptions({
                          ...options,
                          includeDetails: e.target.checked
                        })
                      }
                    />
                    <span className='ml-3 text-sm text-gray-700 dark:text-gray-300'>
                      Match Details (Stage, Match #, Kickoff)
                    </span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                      checked={options.includeTimezone}
                      onChange={e =>
                        setOptions({
                          ...options,
                          includeTimezone: e.target.checked
                        })
                      }
                    />
                    <span className='ml-3 text-sm text-gray-700 dark:text-gray-300'>
                      Timezone Data
                    </span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className='p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-[#1e1b1b]/50'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={selectedMatches.size === 0 || isExporting}
            className='px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
          >
            {isExporting ? 'Generating...' : 'Download ICS'}
          </button>
        </div>
      </div>
    </div>
  )
}
