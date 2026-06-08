# World Cup 2026 Schedule

A Next.js application that displays the FIFA World Cup 2026 schedule by fetching data from the fixturedownload.com API.

## Features

- Displays complete World Cup 2026 match schedule
- Modern, responsive UI with Tailwind CSS
- Real-time data fetching from external API
- Clean card-based layout for match information
- Tournament overview section

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

The application fetches data from:
- API Endpoint: `/api/world-cup`
- Source: `https://fixturedownload.com/feed/json/fifa-world-cup-2026`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── world-cup/
│   │       └── route.ts    # API route for fetching World Cup data
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page component
├── components/
│   └── MatchCard.tsx       # Individual match card component
```

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React 18

## Build and Deploy

To build the application for production:

```bash
npm run build
npm start
```

## License

This project is open source and available under the [MIT License](LICENSE).
