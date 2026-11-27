# ForexLedger

A single-user, multi-currency ledger for expenses and subscriptions. Every amount is stored in its original currency together with the exchange rate of its own date, so past totals never change when rates move.

- **Front end:** React, Vite, TypeScript (`frontend/`)
- **Back end:** NestJS, MongoDB with Mongoose (`backend/`)

## Run with Docker

Requirements: [Docker](https://docs.docker.com/get-docker/) with Docker Compose.

```bash
git clone https://github.com/muhabme/forex-ledger.git forexledger
cd forexledger
docker compose up --build
```

Open <http://localhost:8080>. The page shows "API ok, database up" once everything is running.

The first build takes a few minutes. Stop with `Ctrl+C`, or run `docker compose down` from another terminal. `docker compose down -v` also deletes the database volume.

## Run locally (development)

Requirements: Node.js 24 (see `.nvmrc`; with nvm, run `nvm use`) and a MongoDB 8.0 server. The quickest way to get MongoDB is Docker:

```bash
docker run -d --name forexledger-mongo -p 27017:27017 mongo:8.0
```

Back end, on <http://localhost:3000>:

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Front end, on <http://localhost:5173>, in a second terminal. The Vite dev server forwards `/api` to the back end on port 3000:

```bash
cd frontend
npm install
npm run dev
```

## Tests

Back end (Jest). The e2e tests start their own in-memory MongoDB, so no database server is needed:

```bash
cd backend
npm test            # unit tests
npm run test:e2e    # HTTP API tests
```

Front end (Vitest):

```bash
cd frontend
npm test
```

## Code quality

Both apps provide the same checks:

```bash
npm run lint        # ESLint
npm run format      # Prettier (default settings)
```

The back end also has `npm run typecheck`; in the front end, `npm run build` type-checks before bundling.
