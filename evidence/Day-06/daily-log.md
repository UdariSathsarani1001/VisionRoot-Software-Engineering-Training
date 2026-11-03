# Day 06 Daily Log

## Goal

Replace the in-memory repository with PostgreSQL so requests persist after a restart, and make the schema repeatable via a migration script.

## What was done

### 1. Dependencies installed

```bash
cd backend
npm install pg zod
npm install --save-dev @types/pg
npm pkg set scripts.migrate="tsx src/database/migrate.ts"
```

`zod` was already used in `schema.ts` and `controller.ts` but was missing from `package.json` — added as a runtime dependency.

### 2. Migration file created

`database/migrations/001_create_requests.sql`

- Three enum types: `request_category`, `request_priority`, `request_status`
- `requests` table with `GENERATED ALWAYS AS IDENTITY` primary key, all constraints from the data model
- `chk_title_length` and `chk_description_length` CHECK constraints
- `idx_requests_status` index for the status filter query

### 3. `backend/src/config/environment.ts` updated

Added `databaseUrl: requireEnv('DATABASE_URL')`. The helper throws a clear error at startup if `DATABASE_URL` is missing, so the process fails fast instead of crashing later with a cryptic connection error.

### 4. `backend/src/database/connection.ts` created

One shared `Pool` built from `DATABASE_URL`. A `pool.on('error', ...)` handler logs idle-client errors safely without crashing the process. Exports `checkDatabaseConnectivity()` for the health route.

### 5. `backend/src/database/migrate.ts` created

Custom migration runner:
- Creates `schema_migrations` table if missing
- Reads `.sql` files from `database/migrations/` in filename order
- Applies each unapplied file inside a `BEGIN` / `COMMIT` transaction
- Records each applied file in `schema_migrations`
- Running twice is safe: the second run skips already-applied files
- Any failure triggers `ROLLBACK` and exits with a non-zero code

### 6. `backend/src/modules/requests/repository.ts` replaced

All three functions (`create`, `findAll`, `findById`) now use parameterised queries against PostgreSQL:
- `create`: `INSERT ... RETURNING *`
- `findAll`: `SELECT * FROM requests ORDER BY created_at DESC, id DESC`, with optional `WHERE status = $1`
- `findById`: returns `null` (not `undefined`) when no row is found, so the service can throw `NOT_FOUND`
- `rowToRequest()` maps database rows to the `ServiceRequest` type, converting `Date` objects to ISO 8601 strings

### 7. `backend/src/modules/requests/service.ts` updated

All three functions made `async` to `await` the repository calls.

### 8. `backend/src/modules/requests/controller.ts` updated

Added `await` before each service call.

### 9. `backend/src/modules/requests/schema.ts` updated

Added `.max(2_147_483_647)` to `requestIdSchema` to reject out-of-range ids with `400` before they reach the database.

### 10. `backend/src/modules/health/routes.ts` updated

Now calls `checkDatabaseConnectivity()` and returns:
- `200 { "status": "ok" }` when the database is reachable
- `503 { "status": "unavailable" }` on any failure (never throws)

### 11. `backend/src/server.ts` updated

Added graceful shutdown: closes the pool on `SIGINT` and `SIGTERM` so the process exits cleanly.

### 12. Verification

- `npm run build` — no TypeScript errors
- `npm run lint` — no ESLint errors
- `npm run format` — Prettier applied

## Documents updated

- `docs/api-contract.md` — removed in-memory note, updated health and 500 sections
- `docs/data-model.md` — updated table spec with constraint names, `GENERATED ALWAYS AS IDENTITY`, index
- `backend/README.md` — added database setup, `npm run migrate`, progress table, updated Known Limitations
- `evidence/Day-06/notes.md` — decisions recorded

## Known limitations / not done today

- `PATCH /api/requests/{id}/status` endpoint — Day 07
- `updated_at` is only set on insert today; the repository will set it on status update — Day 07
- Automated tests and a separate test database — Day 08
- Rollback tooling beyond dropping and recreating the dev database — future
