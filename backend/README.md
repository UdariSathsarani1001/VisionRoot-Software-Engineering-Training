# Backend – Service Request Management API

Express + TypeScript REST API backed by PostgreSQL.

## Requirements

- Node.js 18+
- npm
- PostgreSQL (local install with pgAdmin 4 recommended)

## Database setup (one-time)

1. Open pgAdmin 4 and create a login role and database (or run the SQL below in the Query Tool):

```sql
CREATE ROLE srm_user WITH LOGIN PASSWORD 'CHOOSE_A_STRONG_PASSWORD';
CREATE DATABASE service_requests OWNER srm_user;
```

2. Copy `.env.example` to `.env` and fill in your connection string:

```
DATABASE_URL=postgresql://srm_user:YOUR_PASSWORD@localhost:5432/service_requests
```

If the password contains special characters (`@`, `:`, `/`, `#`, `%`), URL-encode them.

3. Install dependencies and run the migration:

```bash
cd backend
npm install
npm run migrate
```

The migration creates the `requests` table, the three enum types and the status index. Running it twice is safe — the second run applies nothing.

## Running

```bash
npm run dev    # tsx watch (hot-reload)
npm run build  # compile to dist/
npm start      # run compiled dist/server.js
```

## Endpoints

| Method | Path                | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| `GET`  | `/api/health`       | Health check (200 ok / 503 unavailable)    |
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

- **PostgreSQL storage:** requests persist across server restarts.
- **Unknown fields in the request body are rejected** (`400 VALIDATION_ERROR`). The fields `status`, `id`, `created_at`, and `updated_at` are set by the server and cannot be sent by the client.
- **Sort order:** list results are returned newest first (`created_at DESC, id DESC`).
- **Health check:** returns `200 { "status": "ok" }` when the database is reachable, or `503 { "status": "unavailable" }` when it is not.
- **Out-of-range ids:** requesting an id above `2147483647` returns `400 VALIDATION_ERROR`, not `500`.

## Scripts

| Script                     | Purpose                           |
| -------------------------- | --------------------------------- |
| `npm run dev`              | Start with hot-reload             |
| `npm run build`            | Compile TypeScript                |
| `npm start`                | Run compiled build                |
| `npm run migrate`          | Apply pending database migrations |
| `npm run lint`             | Run ESLint                        |
| `npm run format`           | Run Prettier (write)              |
| `npm run format:check`     | Run Prettier (check only)         |
| `npm run test:unit`        | Run unit tests                    |
| `npm run test:integration` | Run integration tests             |

Integration tests require `TEST_DATABASE_URL` in `.env`, pointing to a dedicated
database whose name contains `test` and differs from `DATABASE_URL`. The request
integration tests apply pending migrations and truncate test data before each case.
Never point `TEST_DATABASE_URL` at a development or production database.

## Progress

| Day | Focus                                        | Status     |
| --- | -------------------------------------------- | ---------- |
| 01  | Project setup, requirements, backlog         | ✅ Done    |
| 02  | Architecture, data model, ADR                | ✅ Done    |
| 03  | Backend scaffold (Express + TypeScript)      | ✅ Done    |
| 04  | Frontend scaffold (Next.js)                  | ✅ Done    |
| 05  | Core API (Create, List, Get) — in-memory     | ✅ Done    |
| 06  | PostgreSQL database layer, migrations        | ✅ Done    |
| 07  | Status update endpoint, frontend integration | 🔲 Pending |
| 08  | Automated tests                              | 🔲 Pending |
