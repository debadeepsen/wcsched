export type Match = {
  MatchNumber: number
  MatchIndex?: number
  RoundNumber: number
  DateUtc: string
  Location: string
  HomeTeam: string
  AwayTeam: string
  Group: string
  HomeTeamScore: any
  AwayTeamScore: any
  Winner: string
}

export type MatchPrediction = {
  homeWin: number
  awayWin: number
}

export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>