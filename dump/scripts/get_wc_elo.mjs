import * as fs from 'fs'

const wc_teams = [
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Bosnia and Herzegovina',
  'Brazil',
  'Canada',
  'Cabo Verde',
  'Colombia',
  'Congo DR',
  "Côte d'Ivoire",
  'Croatia',
  'Curaçao',
  'Czechia',
  'Ecuador',
  'Egypt',
  'England',
  'France',
  'Germany',
  'Ghana',
  'Haiti',
  'IR Iran',
  'Iraq',
  'Japan',
  'Jordan',
  'Korea Republic',
  'Mexico',
  'Morocco',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Panama',
  'Paraguay',
  'Portugal',
  'Qatar',
  'Saudi Arabia',
  'Scotland',
  'Senegal',
  'South Africa',
  'Spain',
  'Sweden',
  'Switzerland',
  'Tunisia',
  'Türkiye',
  'USA',
  'Uruguay',
  'Uzbekistan'
]

const data = JSON.parse(fs.readFileSync('../elo-ratings.json'))

const wcData = wc_teams.map((team) => data.find((d) => d.team === team))

fs.writeFileSync('../wc-elo-ratings.json', JSON.stringify(wcData, null, 2))
