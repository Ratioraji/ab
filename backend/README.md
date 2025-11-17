# Carbon Portfolio Backend

Express API for the Carbon Portfolio technical test.

## Setup

```bash
npm install
```

## Running

```bash
npm run dev
```

Server will start on http://localhost:4000 with auto-reload via nodemon.

Any changes to `.ts` files in the `src/` directory will automatically restart the server.

## Testing

```bash
npm test
```

## API Endpoints

- `GET /api/portfolio` - Returns all positions
- `GET /api/portfolio/summary` - Returns portfolio summary (currently unfiltered)

## Structure

- `src/server.ts` - Express application
- `src/types.ts` - TypeScript type definitions
- `src/data/portfolio.ts` - Sample position data
- `src/services/portfolioSummary.ts` - Business logic for computing summaries
- `tests/` - Jest test files