# Deployment Guide: Service Request Management System

> **Training project — not approved for production use** without explicit supervisor authorisation and a full security review. This guide describes a local production-like build only.

---

## 1. Overview

The system has three components:

| Component | Technology | Default port |
|---|---|---|
| Frontend | Next.js | 3000 |
| Backend API | Express.js (Node.js) | 4000 |
| Database | PostgreSQL | 5432 |

The frontend calls the backend over HTTP. The backend queries PostgreSQL using a parameterised query pool. Both apps are configured entirely through environment variables — no values are hard-coded.

---

## 2. Prerequisites

| Requirement | Notes |
|---|---|
| Git | To clone the repository |
| Node.js ≥ 20 | Check with `node --version` |
| npm ≥ 10 | Bundled with Node.js |
| PostgreSQL ≥ 14 | Running locally or on a reachable host |
| Ports 3000 and 4000 | Must be free on the machine |

---

## 3. Environment variables

### Backend (`backend/.env`)

| Variable | Purpose | Example placeholder | Required |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string for the app database | `postgresql://srm_user:PASSWORD@localhost:5432/service_requests` | **Required** |
| `PORT` | Port the backend listens on | `4000` | Optional — defaults to 4000 |
| `NODE_ENV` | Environment name | `production` | Optional — defaults to `development`. Set to `production` for a production-like run. |
| `CORS_ORIGIN` | Browser origin of the frontend. Must match exactly. | `http://localhost:3000` | **Required in production.** Optional in development — defaults to `http://localhost:3000`. Must not be `*`. |
| `LOG_LEVEL` | Minimum log level | `info` | Optional — defaults to `info`. Allowed: `trace`, `debug`, `info`, `warn`, `error`, `silent`. |
| `TEST_DATABASE_URL` | Connection string for the test database | `postgresql://srm_user:PASSWORD@localhost:5432/service_requests_test` | Required only when running tests. Not used by the running application. |

Copy `backend/.env.example` to `backend/.env` and fill in the real values. Never commit `.env`.

### Frontend (`frontend/.env.local`)

| Variable | Purpose | Example placeholder | Required |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:4000/api` | **Required.** Must end in `/api`. Fixed at build time — set before `npm run build`. |
| `NEXT_PUBLIC_USE_MOCK` | Use in-memory mock instead of the real API | `false` | Optional — defaults to `false`. Set to `true` only for frontend-only development. |

> **`NEXT_PUBLIC_` variables are embedded at build time.** If you change `NEXT_PUBLIC_API_URL` you must rebuild the frontend. These variables are visible in the compiled output — do not store secrets in them.

---

## 4. Database setup

Run these steps once on a fresh machine. Skip if the database already exists.

**1. Create the login role and database.** Connect to PostgreSQL as a superuser (e.g. `postgres`) and run:

```sql
CREATE ROLE srm_user WITH LOGIN PASSWORD 'CHOOSE_A_STRONG_PASSWORD';
CREATE DATABASE service_requests OWNER srm_user;
```

**2. Set `DATABASE_URL`** in `backend/.env`:

```
DATABASE_URL=postgresql://srm_user:YOUR_PASSWORD@localhost:5432/service_requests
```

URL-encode special characters in the password (`@` → `%40`, `:` → `%3A`, etc.).

**3. Run the migrations:**

```bash
cd backend
npm run migrate
```

The runner reads `.sql` files from `database/migrations/`, applies each one in a transaction, and records it in `schema_migrations`. Running it again on an already-migrated database applies nothing.

**4. Verify.** In pgAdmin or psql, confirm the `requests` and `schema_migrations` tables exist in the `service_requests` database.

> **Migration runner dependency:** `npm run migrate` uses `tsx`, a dev dependency. Run migrations from a full install (`npm install`, not `npm install --omit=dev`). On a server that only has production dependencies, compile the runner with `npm run build` and run it as `node dist/database/migrate.js`.

---

## 5. Build

### Backend

```bash
cd backend
npm ci
npm run build
```

This compiles TypeScript to `backend/dist/`. The output requires Node.js and the production dependencies listed in `package.json`.

### Frontend

Set `NEXT_PUBLIC_API_URL` before building — it is fixed at compile time.

```bash
cd frontend
npm ci
# Ensure NEXT_PUBLIC_API_URL is set in frontend/.env.local (or as an env var)
npm run build
```

---

## 6. Start and stop

### Start (production-like)

**Backend — Git Bash / macOS / Linux:**

```bash
cd backend
NODE_ENV=production npm start
```

**Backend — PowerShell:**

```powershell
cd backend
$env:NODE_ENV = "production"; npm start
```

**Frontend (in a second terminal):**

```bash
cd frontend
npm start
```

The backend starts on port 4000 and the frontend on port 3000. The first log line from the backend confirms the port and environment:

```json
{"level":30,"time":...,"msg":"Backend running on port 4000 [production]"}
```

### Stop

Press **Ctrl+C** in each terminal. The backend handles `SIGINT` and `SIGTERM` by closing the HTTP server and draining the PostgreSQL connection pool before exiting.

---

## 7. Health check

```bash
curl http://localhost:4000/api/health
```

| Response | Meaning |
|---|---|
| `200 {"status":"ok"}` | API is running and the database is reachable |
| `503 {"status":"unavailable"}` | API is running but the database cannot be reached |

The health endpoint never reveals version numbers, hostnames, error messages or connection details.

---

## 8. Logs

- Logs go to **stdout** as newline-delimited JSON (one object per request).
- Each line contains: `level`, `time`, `req.method`, `req.url`, `res.statusCode`, `responseTime` (ms).
- **Never logged:** request bodies, `Authorization` headers, cookies, the database connection string, or any other secret.
- Unexpected server errors are logged with error type and message only — no stack traces or internal paths.
- Log level is controlled by `LOG_LEVEL`. In production, `info` captures all requests. Use `warn` for quieter output.
- In `NODE_ENV=test`, all log output is suppressed (`silent`) so test output remains readable.

Example log line (formatted for readability):

```json
{
  "level": 30,
  "time": 1746432000000,
  "req": { "method": "GET", "url": "/api/requests" },
  "res": { "statusCode": 200 },
  "responseTime": 12,
  "msg": "request completed"
}
```

---

## 9. Rollback

### Bad code release

1. Stop the application (Ctrl+C or `kill`).
2. Check out the previous commit or tag: `git checkout <tag-or-sha>`.
3. Rebuild: `npm ci && npm run build` in the backend, `npm ci && npm run build` in the frontend.
4. Restart and verify the health check returns 200.

### Bad migration

Migrations only go forward. Before migrating on any important database, take a backup:

```bash
pg_dump -U srm_user -h localhost -F c -f service_requests_backup_$(date +%Y%m%d).dump service_requests
```

Enter the password when prompted. Store the backup outside the repository (`*.dump` is in `.gitignore`).

To restore from backup after a bad migration:

```bash
dropdb -U srm_user service_requests
createdb -U srm_user service_requests
pg_restore -U srm_user -d service_requests service_requests_backup_YYYYMMDD.dump
```

If you have written a `down` script for the migration, you may run it instead of restoring from backup — but a backup is safer.

### Bad configuration

Restore the previous values in `.env` (or the server's environment) and restart the application. The startup validation will catch any missing or invalid variable and exit with a clear message before the server starts accepting connections.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `[config] Missing required environment variable: DATABASE_URL` on startup | `DATABASE_URL` not set in `.env` | Copy `.env.example` to `.env` and set the value |
| Backend starts but health returns 503 | Database not running, or wrong `DATABASE_URL` | Start PostgreSQL; check the connection string in `.env` |
| Frontend shows CORS error in browser console | `CORS_ORIGIN` on the backend doesn't match the frontend URL | Set `CORS_ORIGIN` in `backend/.env` to the exact frontend origin (e.g. `http://localhost:3000`) and restart the backend |
| `EADDRINUSE` on port 4000 or 3000 | Another process is using the port | Stop the other process, or change `PORT` / the Next.js port |
| Migration fails with `role "srm_user" does not exist` | Role not created yet | Run the `CREATE ROLE` command in pgAdmin as `postgres` |
| Migration fails with `permission denied` | `srm_user` lacks privileges on the database | `GRANT ALL ON DATABASE service_requests TO srm_user;` |
| Frontend shows stale API URL after `NEXT_PUBLIC_API_URL` change | Variable was changed after the build | Rebuild the frontend: `npm run build` |
| `[config] PORT must be an integer…` on startup | `PORT` is set to a non-numeric value | Correct the value in `.env` or remove it to use the default 4000 |

---

## 11. Known limitations

- **No authentication or authorisation.** Anyone who can reach port 4000 can read and change every request. Authentication is planned as future work (F-01).
- **HTTP only.** Local runs use HTTP. In a real deployment, HTTPS must be provided by a reverse proxy (e.g. nginx with a TLS certificate) or the hosting platform — the application does not handle TLS itself.
- **No rate limiting.** There are no request-rate limits on any endpoint.
- **Single instance.** No clustering, load balancing, monitoring or alerting.
- **Local migration runner.** Migrations are run manually; there is no automated deployment pipeline.
- **No audit trail.** Status changes are not recorded with a timestamp and actor (planned as F-10).
- **Not approved for production use.** Supervisor authorisation and a full security review are required before any real deployment.

---

## 12. Security notes

See [`docs/security-checklist.md`](security-checklist.md) for a full item-by-item review.

Key points:
- No secrets, `.env` files or credentials are committed to Git.
- All user input is validated on the server with Zod.
- All SQL uses parameterised queries — no string interpolation.
- Error responses never include stack traces, file paths or credentials.
- Security headers are set by `helmet` on every response.
- Request bodies are limited to 10 kb.
- Configuration is validated at startup; the process exits clearly if a required variable is missing.
