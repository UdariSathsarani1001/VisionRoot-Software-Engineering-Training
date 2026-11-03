# VisionRoot Software Engineering Training

Training project: **Service Request Management System**, a small internal web application where users can submit and track service requests.

**Status:** Day 07 - Full integration (frontend connected to live API; status-update workflow implemented)

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

## Setup Instructions

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
| `NODE_ENV` | Environment name, such as `development` |
| `DATABASE_URL` | PostgreSQL connection string. Set the real value only in your local `.env` and never commit it |
| `CORS_ORIGIN` | Origin the browser frontend is served from (default `http://localhost:3000`). Must match the frontend URL exactly, including scheme and port |

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

Run these inside `backend/` or `frontend/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start in development mode |
| `npm run build` | Build for production |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Placeholder until tests are added on Day 08 |

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
│   │   │   └── error-handler.ts
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
│   └── tsconfig.json
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
    └── Day-07/
        ├── notes.md
        ├── daily-log.md
        ├── create-form.png
        ├── service-list.png
        ├── details-open.png
        ├── status-in-progress.png
        ├── status-resolved.png
        ├── status-closed.png
        ├── workflow-script-output.png
        ├── postman-runner.png
        └── workflow-test.mjs
```

More folders (`tests/`) will be added on the days they are needed.

## Known Limitations

- The MVP has no authentication or authorisation. All users can perform all actions.
- The project is for local/training use only and must not be deployed to a real production environment.
- Automated tests are planned for Day 08. Manual testing via the Postman collection and the workflow script is the current approach.
- The `CORS_ORIGIN` variable must match the frontend origin exactly (scheme, hostname, port). Mixing `localhost` and `127.0.0.1` will cause CORS errors.

## Git Workflow

- Work is done on feature branches (for example `feat/day-06-database`), not directly on `main`.
- Commits use clear messages, such as `chore: scaffold express typescript backend`.
- Each branch is merged through a pull request.
- No secrets, `.env` files or private data are committed. Only `.env.example` files with placeholders are committed.