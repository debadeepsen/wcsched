// extract-elo.js

import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('elo_dump.html', 'utf8');

// Match each table row
const rowRegex =
  /<div class="ui-widget-content slick-row[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="ui-widget-content slick-row|$)/g;

// Match each cell inside a row
const cellRegex =
  /<div class="slick-cell\s+l\d+\s+r\d+[^"]*">([\s\S]*?)<\/div>/g;

const teams = [];

let rowMatch;

while ((rowMatch = rowRegex.exec(html)) !== null) {
  const rowHtml = rowMatch[1];

  const cells = [];
  let cellMatch;

  while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
    let value = cellMatch[1]
      .replace(/<a[^>]*>/g, '')
      .replace(/<\/a>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    cells.push(value);
  }

  // Expected EloRatings structure:
  // 0 Rank
  // 1 Team
  // 2 Elo Rating
  // 3 FIFA Rank
  // 4 FIFA Points
  // 5 Rank Change
  // 6 Elo Change
  // 7-15 Various stats

  if (cells.length >= 16) {
    teams.push({
      rank: Number(cells[0]),
      team: cells[1].replace(/_/g, ' '),
      elo: Number(cells[2]),
      fifaRank: Number(cells[3]),
      fifaPoints: Number(cells[4]),
      rankChange: cells[5],
      eloChange: cells[6],
      matches: Number(cells[7]),
      wins: Number(cells[8]),
      draws: Number(cells[9]),
      losses: Number(cells[10]),
      homeMatches: Number(cells[11]),
      awayMatches: Number(cells[12]),
      neutralMatches: Number(cells[13]),
      goalsFor: Number(cells[14]),
      goalsAgainst: Number(cells[15])
    });
  }
}

writeFileSync(
  'elo-ratings.json',
  JSON.stringify(teams, null, 2)
);

console.log(`Extracted ${teams.length} teams`);
console.log('Saved to elo-ratings.json');