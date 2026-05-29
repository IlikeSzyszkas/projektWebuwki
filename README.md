# F1 Results Browser

Web application for browsing Formula 1 race results, qualifying times, and championship standings.

## Stack
- **Backend:** Node.js + Express + TypeScript + SQLite
- **Frontend:** React + Vite + TypeScript
- **Data source:** Jolpica F1 API (Ergast replacement, free, no auth)

## Running backend
`ash
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:3001
`

## API endpoints
- GET /health
- GET /api/seasons
- GET /api/races/:season
- GET /api/results/:season/:round
- GET /api/standings/drivers/:season
- GET /api/standings/constructors/:season

## Status
Backend complete. Frontend in progress.
