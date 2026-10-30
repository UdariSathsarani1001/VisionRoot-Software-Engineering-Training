# Backend – Service Request Management API

Express + TypeScript REST API. Data is held **in memory** and is lost on server restart. PostgreSQL persistence arrives on Day 06.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
cd backend
npm install
cp .env.example .env   # adjust PORT if needed
```

## Running

```bash
npm run dev    # tsx watch (hot-reload)
npm run build  # compile to dist/
npm start      # run compiled dist/server.js
```

## Endpoints

| Method | Path                | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| `GET`  | `/api/health`       | Health check                               |
| `POST` | `/api/requests`     | Create a service request                   |
| `GET`  | `/api/requests`     | List requests (optional `?status=` filter) |
| `GET`  | `/api/requests/:id` | Get a single request by ID                 |

Full request/response shapes are documented in [`docs/api-contract.md`](../docs/api-contract.md).

## Quick test with curl

```bash
# Health
curl http://localhost:4000/api/health

# Create
curl -X POST http://localhost:4000/api/requests \
  -H "Content-Type: application/json" \
  -d '{"title":"Laptop broken","description":"Black screen","category":"IT","priority":"HIGH"}'

# List all
curl http://localhost:4000/api/requests

# List filtered
curl "http://localhost:4000/api/requests?status=OPEN"

# Get by id
curl http://localhost:4000/api/requests/1
```

## Notes

- **In-memory storage:** all data is cleared when the server restarts.
- **Unknown fields in the request body are rejected** (`400 VALIDATION_ERROR`). The fields `status`, `id`, `created_at`, and `updated_at` are set by the server and cannot be sent by the client.
- **Sort order:** list results are returned newest first.
- The health endpoint returns `200 { "status": "ok" }` without a database check. The `503` case is added on Day 06.

## Scripts

| Script                 | Purpose                   |
| ---------------------- | ------------------------- |
| `npm run dev`          | Start with hot-reload     |
| `npm run build`        | Compile TypeScript        |
| `npm start`            | Run compiled build        |
| `npm run lint`         | Run ESLint                |
| `npm run format`       | Run Prettier (write)      |
| `npm run format:check` | Run Prettier (check only) |
