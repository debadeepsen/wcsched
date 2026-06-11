import { createEvents, EventAttributes } from 'ics'
import type { Match } from '../app/types/types'

const MATCH_DURATION_HOURS = 2

export type ReminderOption = 0 | 15 | 30 | 60 | 180 | 1440 // in minutes

export interface CalendarExportOptions {
  reminder: ReminderOption
  includeVenue: boolean
  includeDetails: boolean
  includeTimezone: boolean // Currently ics handles UTC parsing, we just provide UTC array
}

function getMatchStage(roundNumber: number): string {
  switch (roundNumber) {
    case 1:
      return 'Group Stage'
    case 2:
      return 'Round of 32'
    case 3:
      return 'Round of 16'
    case 4:
      return 'Quarter Finals'
    case 5:
      return 'Semi Finals'
    case 6:
      return 'Finals' // includes third place and final, usually distinguished by match number if needed
    default:
      return 'Knockout Stage'
  }
}

function parseDateUtc(dateUtc: string): [number, number, number, number, number] {
  const d = new Date(dateUtc)
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1, // ics expects 1-indexed month
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
}

export function generateIcs(matches: Match[], options: CalendarExportOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const events: EventAttributes[] = matches.map((match) => {
      const stage = getMatchStage(match.RoundNumber)
      
      let description = ''
      if (options.includeDetails) {
        description += `FIFA World Cup 2026\n\n`
        description += `Stage: ${stage}\n`
        description += `Match: #${match.MatchNumber}\n\n`
        
        const localDateStr = new Date(match.DateUtc).toLocaleString()
        description += `Kickoff (Local): ${localDateStr}\n`
        description += `Kickoff (UTC): ${match.DateUtc.replace('T', ' ').replace('Z', ' UTC')}`
      }

      const event: EventAttributes = {
        title: `${match.HomeTeam} vs ${match.AwayTeam}`,
        description: description.trim(),
        location: options.includeVenue ? match.Location : undefined,
        start: parseDateUtc(match.DateUtc),
        startInputType: 'utc',
        startOutputType: options.includeTimezone ? 'local' : 'utc',
        duration: { hours: MATCH_DURATION_HOURS },
      }

      if (options.reminder > 0) {
        event.alarms = [
          {
            action: 'display',
            description: `Reminder: ${match.HomeTeam} vs ${match.AwayTeam} starts in ${
              options.reminder >= 60 ? options.reminder / 60 + ' hours' : options.reminder + ' minutes'
            }`,
            trigger: { minutes: options.reminder, before: true },
          },
        ]
      }

      return event
    })

    createEvents(events, (error, value) => {
      if (error) {
        reject(error)
      } else {
        resolve(value)
      }
    })
  })
}

export function downloadIcs(icsString: string, filename: string = 'world-cup-2026-matches.ics') {
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
