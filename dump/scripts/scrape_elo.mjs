import * as cheerio from 'cheerio'

const response = await fetch('https://www.eloratings.net/')

const html = await response.text()

const $ = cheerio.load(html)

const ratings = {}

$('table tr').each((_, row) => {
  const cells = $(row).find('td')

  if (cells.length < 3) return

  const team = $(cells[1]).text().trim()
  const elo = Number($(cells[2]).text().trim())

  if (team && !Number.isNaN(elo)) {
    ratings[team] = elo
  }
})

console.log(JSON.stringify(ratings, null, 2))