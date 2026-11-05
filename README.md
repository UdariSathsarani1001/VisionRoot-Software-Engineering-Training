# VisionRoot Software Engineering Training

Training project: **Service Request Management System**, a small internal web application where users can submit and track service requests.

**Status:** Day 09 - Security hardening, structured logging, and deployment documentation

**Repository URL:** https://github.com/UdariSathsarani1001/VisionRoot-Software-Engineering-Training
**Default branch:** `main`

---

## Project Summary

Internal service requests (IT issues, facility repairs, general needs) are often raised through email, chat or phone calls, so they get lost, have no visible status, and have no consistent record. This project builds a single place to submit, track and manage them.

**MVP features**

- Create a request with title, description, category and priority
- List requests and filter by status
- View request details
- Update status using the workflow `OPEN → IN_PROGRESS → RESOLVED → CLOSED`
- Persist records in a database
- Validate input on the server and return consistent errors
- Health endpoint and setup documentation

**Planned stack:** Next.js, Express.js, TypeScript, PostgreSQL. The UI uses Tailwind CSS and shadcn/ui.

## Day 01 Progress

| Item | Location |
|---|---|
| Problem statement, users, scope | `docs/requirements.md` |
| User stories and acceptance criteria (US-01 to US-08) | `docs/requirements.md` |
| Functional and non-functional requirements | `docs/requirements.md` |
| Backlog (MVP vs future) | `docs/requirements.md` and Trello board |
| Daily log | `evidence/Day-01/daily-log.md` |
| Backlog board screenshot | `evidence/Day-01/backlog-board.png` |

**Trello board:** https://trello.com/b/UcGn5JfV/service-request-management-system

## Day 02 Progress

| Item | Location |
|---|---|
| Architecture diagram, layers and request flow | `docs/architecture.md` |
| Data model and ER diagram | `docs/data-model.md` |
| API contract (5 endpoints, status codes, error format) | `docs/api-contract.md` |
| Architecture decision (modular monolith) | `docs/decisions/ADR-001-architecture.md` |
| Daily log | `evidence/Day-02/daily-log.md` |

## Day 03 Progress

| Item | Location |
|---|---|
| Backend scaffold (Express, TypeScript, ESLint, Prettier) | `backend/` |
| Frontend scaffold (Next.js, TypeScript, ESLint, Prettier) | `frontend/` |
| Environment variable examples (placeholders only) | `backend/.env.example`, `frontend/.env.example` |
| Setup instructions | This README (see Setup Instructions) |
| Daily log | `evidence/Day-03/daily-log.md` |

## Day 04 Progress

| Item | Location |
|---|---|
| Request list with status filter and loading / empty / error states | `frontend/src/features/requests/` |
| Create-request form with client-side validation | `frontend/src/features/requests/` |
| Request details page | `frontend/src/app/requests/[id]/` |
| API client with mock data | `frontend/src/lib/api.ts` |
| Shared state components (loading, empty, error) | `frontend/src/components/states/` |
| shadcn/ui components | `frontend/src/components/ui/` |
| Design decisions | `evidence/Day-04/notes.md` |
| Screenshots | `evidence/Day-04/` |
| Daily log | `evidence/Day-04/daily-log.md` |

**Note:** the frontend uses mock data until it is connected to the backend on Day 07.

## Day 05 Progress

| Item | Location |
|---|---|
| Create, list and get-by-id endpoints | `backend/src/modules/requests/` |
| Server-side validation schemas | `backend/src/modules/requests/schema.ts` |
| Business rules (service) and in-memory data access (repository) | `backend/src/modules/requests/service.ts`, `repository.ts` |
| Health endpoint | `GET /api/health` |
| Centralised error handling | `backend/src/middleware/error-handler.ts` |
| Updated API contract with real behaviour | `docs/api-contract.md` |
| Postman collection and request/response evidence | `evidence/Day-05/` |
| Controller, service and repository notes | `evidence/Day-05/notes.md` |
| Daily log | `evidence/Day-05/daily-log.md` |

**Note:** on Day 05 the API stored requests in memory. This was replaced by PostgreSQL on Day 06.

## Day 06 Progress

| Item | Location |
|---|---|
| Migration creating the `requests` table, enums, constraints and index | `database/migrations/001_create_requests.sql` |
| Migration runner (`npm run migrate`) | `backend/src/database/migrate.ts` |
| Database connection pool | `backend/src/database/connection.ts` |
| Repository using parameterised PostgreSQL queries | `backend/src/modules/requests/repository.ts` |
| Health endpoint checks the database (200 or 503) | `GET /api/health` |
| Updated data model and API contract | `docs/data-model.md`, `docs/api-contract.md` |
| Schema, persistence and failure evidence | `evidence/Day-06/` |
| Design decisions | `evidence/Day-06/notes.md` |
| Daily log | `evidence/Day-06/daily-log.md` |

**Note:** requests are now saved in PostgreSQL and survive a restart. The frontend was connected to the backend on Day 07.

## Day 07 Progress

| Item | Location |
|---|---|
| `PATCH /api/requests/{id}/status` with transition rules | `backend/src/modules/requests/` |
| Atomic concurrent-update guard in repository | `backend/src/modules/requests/repository.ts` |
| CORS middleware (reads `CORS_ORIGIN` from env) | `backend/src/app.ts`, `backend/src/config/environment.ts` |
| Real `fetch` calls in `api.ts` (`listRequests`, `getRequest`, `createRequest`, `updateRequestStatus`) | `frontend/src/lib/api.ts` |
| `useRequestStatus` hook | `frontend/src/features/requests/use-requests.ts` |
| Status-actions component (next-step button, error display) | `frontend/src/features/requests/status-actions.tsx` |
| Details page wired to status control | `frontend/src/features/requests/request-details.tsx` |
| Server field errors mapped to inline form fields | `frontend/src/features/requests/request-form.tsx` |
| `NEXT_STATUS` convenience map | `frontend/src/features/requests/constants.ts` |
| Workflow test script (10 steps, all transition rules) | `evidence/Day-07/workflow-test.mjs` |
| Day 07 screenshots | [create-form.png](evidence/Day-07/create-form.png), [service-list.png](evidence/Day-07/service-list.png), [details-open.png](evidence/Day-07/details-open.png), [status-in-progress.png](evidence/Day-07/status-in-progress.png), [status-resolved.png](evidence/Day-07/status-resolved.png), [status-closed.png](evidence/Day-07/status-closed.png), [workflow-script-output.png](evidence/Day-07/workflow-script-output.png), [postman-runner.png](evidence/Day-07/postman-runner.png) |
| Full Postman collection with PATCH test cases | `docs/postman/service-request-api.postman_collection.json` |
| Design decisions and integration bug record | `evidence/Day-07/notes.md` |
| Daily log | `evidence/Day-07/daily-log.md` |

## Day 08 Progress

| Item | Location |
|---|---|
| Vitest configuration and test setup | `backend/vitest.config.ts`, `backend/tests/setup.ts` |
| Unit tests for request validation schemas and service behavior | `backend/tests/unit/` |
| Integration tests for the health endpoint and request API, including status transitions | `backend/tests/integration/` |
| Database helpers for integration tests | `backend/tests/helpers/db.ts` |
| Test commands (`npm test`, `npm run test:unit`, `npm run test:integration`) | `backend/package.json` |

## Day 09 Progress

| Item | Location |
|---|---|
| Security headers (`helmet`) and body size limit (10 kb) | `backend/src/app.ts` |
| Startup configuration validation (exits cleanly on missing or invalid variables) | `backend/src/config/environment.ts` |
| Structured JSON request logging (`pino` + `pino-http`); silent in test mode | `backend/src/middleware/request-logger.ts` |
| 413 PAYLOAD_TOO_LARGE error handling | `backend/src/middleware/error-handler.ts` |
| Hardening integration tests (413, security headers, malformed JSON, health shape) | `backend/tests/integration/hardening.test.ts` |
| Deployment guide | `docs/deployment.md` |
| Security checklist | `docs/security-checklist.md` |
| Updated API contract (413 response, error code table) | `docs/api-contract.md` |
| Updated architecture doc (security and logging section) | `docs/architecture.md` |
| Updated `.env.example` files with all variables and annotations | `backend/.env.example`, `frontend/.env.example` |
| Authorization review, decisions, audit findings | `evidence/Day-09/notes.md` |
| Daily log | `evidence/Day-09/daily-log.md` |

## Setup Instructions

For a full guide including production-like build, environment variable reference, rollback and troubleshooting, see **[`docs/deployment.md`](docs/deployment.md)**.

For a security review, see **[`docs/security-checklist.md`](docs/security-checklist.md)**.

### Prerequisites

- Git
- Node.js and npm
- PostgreSQL (and pgAdmin 4, optional, to manage it)

### 1. Clone the repository

```bash
git clone https://github.com/UdariSathsarani1001/VisionRoot-Software-Engineering-Training
cd VisionRoot-Software-Engineering-Training
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# set DATABASE_URL in .env (see "5. Database" below), then:
npm run migrate
npm run dev
```

The backend runs on http://localhost:4000. Set up the database first (see "5. Database"), otherwise the backend cannot save requests.

**API endpoints**

| Method | Path | Purpose | Success | Errors |
|---|---|---|---|---|
| POST | `/api/requests` | Create a request | 201 | 400 |
| GET | `/api/requests` | List requests (optional `?status=`) | 200 | 400 |
| GET | `/api/requests/{id}` | Get one request | 200 | 400, 404 |
| PATCH | `/api/requests/{id}/status` | Update status | 200 | 400, 404 |
| GET | `/api/health` | Health check (includes the database) | 200 | 503 |

Full request and response examples are in `docs/api-contract.md`.

**Testing the API without the frontend**

Import the Postman collection (`docs/postman/service-request-api.postman_collection.json`) into Postman and run the requests in order, or use curl:

```bash
curl http://localhost:4000/api/health
curl -X POST http://localhost:4000/api/requests \
  -H "Content-Type: application/json" \
  -d '{"title":"Laptop will not start","description":"Black screen on power on.","category":"IT","priority":"HIGH"}'
curl http://localhost:4000/api/requests
```

Requests are saved in PostgreSQL, so they are still there after restarting the backend.

| Variable | Meaning |
|---|---|
| `PORT` | Port the backend listens on (default 4000) |
| `NODE_ENV` | Environment name: `development`, `production` or `test`. Validated at startup. |
| `DATABASE_URL` | PostgreSQL connection string. Set the real value only in your local `.env` and never commit it |
| `CORS_ORIGIN` | Origin the browser frontend is served from (default `http://localhost:3000`). Must match the frontend URL exactly, including scheme and port. Required in production and must not be `*`. |
| `LOG_LEVEL` | Minimum log level (default `info`). Allowed: `trace`, `debug`, `info`, `warn`, `error`, `silent`. |

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend runs on http://localhost:3000. **Start the backend first** — the frontend calls the live API and will show an error state if the backend is not running.

> **Running both apps together:** open two terminals — one in `backend/` running `npm run dev` and one in `frontend/` running `npm run dev`.

> **Mock mode:** if you need to run the frontend without the backend (for UI-only work), set `NEXT_PUBLIC_USE_MOCK=true` in `frontend/.env.local` and restart the Next.js dev server. The mock keeps data in memory for the session only.

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (default `http://localhost:4000/api`). Must end in `/api` |
| `NEXT_PUBLIC_USE_MOCK` | Set to `true` to use the in-memory mock instead of the real API (default `false`) |

### 4. Useful commands

**Development:**

Run the development, build, lint and format commands inside `backend/` or `frontend/`. Run the test commands inside `backend/`.

| Command | Purpose |
|---|---|
| `npm run dev` | Start in development mode |
| `npm run build` | Build for production |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run all backend unit and integration tests |
| `npm run test:unit` | Run backend unit tests |
| `npm run test:integration` | Run backend integration tests |

**Production-like build and run (backend):**

```bash
cd backend
npm ci
npm run build
# Git Bash / macOS / Linux
NODE_ENV=production npm start
# PowerShell
$env:NODE_ENV = "production"; npm start
```

**Production-like build and run (frontend):**

```bash
cd frontend
npm ci
# Set NEXT_PUBLIC_API_URL in frontend/.env.local before building
npm run build
npm start
```

Verify the backend is healthy: `curl http://localhost:4000/api/health` should return `{"status":"ok"}`.

Backend tests require PostgreSQL and a separate test database. Set `TEST_DATABASE_URL` in `backend/.env` to the test database connection string. Its database name must contain `test`, and it must not be the same as `DATABASE_URL`. Integration tests run migrations and clear request records in that test database; never point `TEST_DATABASE_URL` at a development or production database.

### Test results

Last run (Day 09), inside `backend/`:

| Command | Result |
|---|---|
| `npm run test:unit` | 2 test files, 60 tests passed |
| `npm run test:integration` | 3 test files, 54 tests passed |
| `npm test` | 5 test files, 114 tests passed |
| `npm run lint` | passes |
| `npm run format` | passes |
| `npm run build` | passes |

### 5. Database

PostgreSQL is required. The database is created once by hand, and everything inside it (types, table, index) is created by the migration. The names below are examples: use your own, and keep them consistent with `DATABASE_URL`.

**1. Create a login role and a database.** In pgAdmin 4, use the Query Tool on your server and run (choose your own password):

```sql
CREATE ROLE srm_user WITH LOGIN PASSWORD 'CHOOSE_A_STRONG_PASSWORD';
CREATE DATABASE service_requests OWNER srm_user;
```

Alternatively, create the role under Login/Group Roles and the database under Databases in the pgAdmin tree.

**2. Set `DATABASE_URL`** in `backend/.env` (never commit this file). Use `backend/.env.example` as the template:

```
DATABASE_URL=postgresql://srm_user:YOUR_PASSWORD@localhost:5432/service_requests
```

If the password contains special characters such as `@`, `:`, `/`, `#` or `%`, URL-encode them.

**3. Run the migrations:**

```bash
cd backend
npm run migrate
```

This applies the SQL files in `database/migrations/` in order and records each one in a `schema_migrations` table. Running it again applies nothing.

**4. Check the result** in pgAdmin (refresh, then open Schemas, public): the `requests` and `schema_migrations` tables, and the `request_category`, `request_priority` and `request_status` types.

**Reset the database:** drop `service_requests`, create it again (step 1), then run `npm run migrate`.

**Health check:** `GET /api/health` returns 200 when the database is reachable and 503 when it is not.

## 6. Testing

Backend tests use **Vitest** and **supertest**. They need a **separate** PostgreSQL test database because the integration tests clear request records.

**1. Create the test database** in pgAdmin 4 (Query Tool), using the role created in the database setup above:

```sql
CREATE DATABASE service_requests_test OWNER srm_user;
```

**2. Apply the migration.** The request API integration suite applies the migrations automatically before its tests; no manual migration is needed for the test database.

**3. Set `TEST_DATABASE_URL`** in `backend/.env` (never commit this file) to the PostgreSQL connection URI for the test database:

```
TEST_DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/service_requests_test
```

**4. Run the tests** from `backend/`:

```bash
npm test
```

**Safety rules.** Test setup refuses to run if `TEST_DATABASE_URL` is missing, exactly matches `DATABASE_URL`, or has a database name that does not contain `test`. Always use the separate test database; never point `TEST_DATABASE_URL` at a development or production database.

**What is tested**

| Type | Location | Covers |
|---|---|---|
| Unit | `backend/tests/unit/schema.test.ts` | Validation boundaries: title (3 to 100 characters), description (1 to 1000), category, priority, status, and ID range |
| Unit | `backend/tests/unit/service.test.ts` | All 16 status transitions, not-found behavior, and mocked repository interactions |
| Integration | `backend/tests/integration/requests.test.ts` | Create, list, filter, get, PATCH, validation errors, and safe error responses through the API and database |
| Integration | `backend/tests/integration/health.test.ts` | Health check and unknown routes |

**How the tests stay reliable:** the request API integration suite resets the `requests` table before each test, Vitest runs test files sequentially, and unit tests use a mocked repository.

## Repository Structure

```
VisionRoot-Software-Engineering-Training/
├── README.md
├── .gitignore
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── requests/
│   │   │       ├── routes.ts
│   │   │       ├── controller.ts
│   │   │       ├── service.ts
│   │   │       ├── repository.ts
│   │   │       ├── schema.ts
│   │   │       └── types.ts
│   │   ├── middleware/
│   │   │   ├── error-handler.ts
│   │   │   └── request-logger.ts
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   └── migrate.ts
│   │   ├── config/
│   │   │   └── environment.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── eslint.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── tests/
│       ├── setup.ts
│       ├── helpers/
│       │   └── db.ts
│       ├── integration/
│       │   ├── hardening.test.ts
│       │   ├── health.test.ts
│       │   └── requests.test.ts
│       └── unit/
│           ├── schema.test.ts
│           └── service.test.ts
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── states/
│   │   ├── features/
│   │   │   └── requests/
│   │   └── lib/
│   │       ├── api.ts
│   │       └── mock-data.ts
│   ├── .env.example
│   └── package.json
├── database/
│   └── migrations/
│       └── 001_create_requests.sql
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   ├── deployment.md
│   ├── security-checklist.md
│   ├── decisions/
│   │   └── ADR-001-architecture.md
│   └── postman/
│       └── service-request-api.postman_collection.json
└── evidence/
    ├── Day-01/
    │   ├── daily-log.md
    │   └── backlog-board.png
    ├── Day-02/
    │   ├── data-model.png
    │   ├── architecture.png
    │   └── daily-log.md
    ├── Day-03/
    │   └── daily-log.md
    ├── Day-04/
    │   ├── notes.md
    │   ├── daily-log.md
    │   ├── form-validation.png
    │   ├── new_request_form.png
    │   ├── request_details_page.png
    │   └── request_page.png
    ├── Day-05/
    │   ├── notes.md
    │   ├── daily-log.md
    │   ├── create_request_empty_title.png
    │   ├── create_request.png
    │   ├── get_request_by_id.png
    │   ├── get_request_not_found.png
    │   └── list_requests.png
    ├── Day-06/
    │   ├── notes.md
    │   └── daily-log.md
    ├── Day-07/
    │   ├── notes.md
    │   ├── daily-log.md
    │   ├── create-form.png
    │   ├── service-list.png
    │   ├── details-open.png
    │   ├── status-in-progress.png
    │   ├── status-resolved.png
    │   ├── status-closed.png
    │   ├── workflow-script-output.png
    │   ├── postman-runner.png
    │   └── workflow-test.mjs
    ├── Day-08/
    │   ├── notes.md
    │   ├── daily-log.md
    │   ├── bug-log.md
    │   ├── unit-tests-pass.png
    │   ├── integration-tests-pass.png
    │   ├── lint-format-build.png
    │   └── full-suite-pass.png
    └── Day-09/
        ├── notes.md
        ├── daily-log.md
        ├── backend-production-build.png
        ├── backend-health-check.png
        ├── backend-health-failed.png
        ├── backend-log.png
        ├── frontend-production-build.png
        └── full-suite-pass.png
```

## Known Limitations

- The MVP has no authentication or authorisation. All users can perform all actions. Hidden UI buttons and CORS are not authorization controls — authentication is planned as future work (F-01).
- The project is for local/training use only and must not be deployed to a real production environment without supervisor authorisation.
- HTTP only when run locally. HTTPS is the responsibility of a reverse proxy or hosting platform in a real deployment.
- No rate limiting on any endpoint.
- Automated backend tests require a separately configured PostgreSQL test database.
- The `CORS_ORIGIN` variable must match the frontend origin exactly (scheme, hostname, port). Mixing `localhost` and `127.0.0.1` will cause CORS errors.
- See `docs/security-checklist.md` for the full list of known security limitations.

## Git Workflow

- Work is done on feature branches (for example `feat/day-06-database`), not directly on `main`.
- Commits use clear messages, such as `chore: scaffold express typescript backend`.
- Each branch is merged through a pull request.
- No secrets, `.env` files or private data are committed. Only `.env.example` files with placeholders are committed.