import { MatchPrediction } from '@/app/types/types'
import { wc_elo } from '@/data/wc_elo'

export const stringToColor = (str: string, opacity?: number) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // Basic polynomial rolling hash (DJB2 variant)
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Use the golden ratio conjugate to evenly distribute hues
  const goldenRatioConjugate = 0.618033988749895
  let hue = Math.abs((hash * goldenRatioConjugate) % 1) * 360

  // Keep saturation and lightness stable for pleasant UI colors
  const saturation = 70 // 70%
  const lightness = 60 // 60%
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100
    l /= 100
    const c = (1 - Math.abs(2 * l - 1)) * s
    const hp = h / 60
    const x = c * (1 - Math.abs((hp % 2) - 1))
    let r1 = 0,
      g1 = 0,
      b1 = 0
    if (hp >= 0 && hp < 1) {
      r1 = c
      g1 = x
    } else if (hp >= 1 && hp < 2) {
      r1 = x
      g1 = c
    } else if (hp >= 2 && hp < 3) {
      g1 = c
      b1 = x
    } else if (hp >= 3 && hp < 4) {
      g1 = x
      b1 = c
    } else if (hp >= 4 && hp < 5) {
      r1 = x
      b1 = c
    } else if (hp >= 5 && hp < 6) {
      r1 = c
      b1 = x
    }
    const m = l - c / 2
    const r = Math.round((r1 + m) * 255)
    const g = Math.round((g1 + m) * 255)
    const b = Math.round((b1 + m) * 255)
    return [r, g, b]
  }
  const [r, g, b] = hslToRgb(Math.round(hue), saturation, lightness)
  return `rgba(${r}, ${g}, ${b}, ${opacity ?? 1})`
}

export const stringToColorDark = (str: string, opacity?: number) => {
  const color = stringToColor(str, opacity)
  const [r, g, b] = color.split(',')
  const r2 = Number(r.split('(')[1]) - 60
  const g2 = Number(g) - 60
  const b2 = Number(b.split(')')[0]) - 60
  return `rgba(${r2}, ${g2}, ${b2}, ${opacity ?? 1})`
}

export const COUNTRY_ISO2: Record<string, string> = {
  Algeria: 'DZ',
  Argentina: 'AR',
  Australia: 'AU',
  Austria: 'AT',
  Belgium: 'BE',
  'Bosnia and Herzegovina': 'BA',
  Brazil: 'BR',
  'Cabo Verde': 'CV',
  Canada: 'CA',
  Colombia: 'CO',
  'Congo DR': 'CD',
  Croatia: 'HR',
  Curaçao: 'CW',
  Czechia: 'CZ',
  "Côte d'Ivoire": 'CI',
  Ecuador: 'EC',
  Egypt: 'EG',

  // Football-specific naming
  England: 'GB',

  France: 'FR',
  Germany: 'DE',
  Ghana: 'GH',
  Haiti: 'HT',
  'IR Iran': 'IR',
  Iraq: 'IQ',
  Japan: 'JP',
  Jordan: 'JO',
  'Korea Republic': 'KR',
  Mexico: 'MX',
  Morocco: 'MA',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Norway: 'NO',
  Panama: 'PA',
  Paraguay: 'PY',
  Portugal: 'PT',
  Qatar: 'QA',
  'Saudi Arabia': 'SA',
  Scotland: 'GB',
  Senegal: 'SN',
  'South Africa': 'ZA',
  Spain: 'ES',
  Sweden: 'SE',
  Switzerland: 'CH',
  Tunisia: 'TN',
  Türkiye: 'TR',
  USA: 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ'
}

export const TEAM_TO_ISO_URL: Record<string, string> = {
  ...COUNTRY_ISO2,
  England: 'ENG',
  Scotland: 'SCO'
}

export const ISO_URL_TO_TEAM: Record<string, string> = Object.fromEntries(
  Object.entries(TEAM_TO_ISO_URL).map(([team, iso]) => [iso.toLowerCase(), team])
)


export function formatMatchDate(utcDateString: string) {
  if (!utcDateString) return { date: 'Not scheduled', time: '' }

  const utcDate = new Date(utcDateString)

  const date = utcDate.toLocaleDateString([], {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const time = utcDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  })
  return { date, time }
}

export function eloWinProbability(teamAElo: number, teamBElo: number): number {
  return 1 / (1 + Math.pow(10, (teamBElo - teamAElo) / 400))
}

export function predictMatch(
  homeTeam: string,
  awayTeam: string
): MatchPrediction {
  let homeElo: number | undefined = wc_elo.find(
    team => team?.team === homeTeam
  )?.elo
  let awayElo: number | undefined = wc_elo.find(
    team => team?.team === awayTeam
  )?.elo

  if (!homeElo || !awayElo) {
    return { homeWin: 0.5, awayWin: 0.5 }
  }

  const homeWin = eloWinProbability(homeElo, awayElo)

  return {
    homeWin,
    awayWin: 1 - homeWin
  }
}

export function checkIfFirstCharIsNumeric(str: string) {
  return typeof str === 'string' && /^\d/.test(str)
}

export const predictionAccuracy = (
  team1Prob: number,
  team2Prob: number,
  team1Score: number,
  team2Score: number
): number => {
  // Determine actual result
  const actual =
    team1Score > team2Score
      ? 'team1'
      : team2Score > team1Score
        ? 'team2'
        : 'draw'

  const predicted = team1Prob >= team2Prob ? 'team1' : 'team2'

  const confidence = Math.max(team1Prob, team2Prob)

  // 0..1
  const closeness = 1 - Math.abs(team1Prob - team2Prob)

  // 0..1
  const goalMarginForgiveness = Math.max(
    0,
    1 - Math.abs(team1Score - team2Score) / 5
  )

  // Draw handling
  if (actual === 'draw') {
    const score = closeness * 85 + goalMarginForgiveness * 15

    return Math.round(score)
  }

  // Winner predicted correctly
  if (predicted === actual) {
    const score = 70 + confidence * 20 + goalMarginForgiveness * 10

    return Math.min(100, Math.round(score))
  }

  // Winner predicted incorrectly
  const score = (1 - confidence) * 60 + goalMarginForgiveness * 10

  return Math.max(0, Math.round(score))
}

const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100

  const a = (s * Math.min(l, 1 - l)) / 100

  const f = (n: number) => {
    const k = (n + h / 30) % 12

    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

export const predictionScoreColor = (score: number) => {
  score = Math.max(0, Math.min(100, score))

  let hue: number

  if (score <= 50) {
    // red -> amber
    hue = lerp(0, 40, score / 50)
  } else {
    // amber -> green
    hue = lerp(40, 130, (score - 50) / 50)
  }

  return hslToHex(hue, 80, 40)
}

export const isToday = (utcDateString?: string) =>
  utcDateString
    ? new Date(utcDateString).setHours(0, 0, 0, 0) ===
      new Date().setHours(0, 0, 0, 0)
    : false
