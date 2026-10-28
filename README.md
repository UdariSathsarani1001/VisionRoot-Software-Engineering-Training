# VisionRoot Software Engineering Training

Training project: **Service Request Management System**, a small internal web application where users can submit and track service requests.

**Status:** Day 03 - GitHub workflow and environment setup (project scaffolding only, no features yet)

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

**Planned stack:** Next.js, Express.js, TypeScript, PostgreSQL

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

## Setup Instructions

### Prerequisites

- Git
- Node.js and npm (use a current supported version: <!-- add the version you used, from `node -v` -->)
- PostgreSQL (needed from Day 06, when the database is added)

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
npm run dev
```

The backend runs on http://localhost:4000. It has no routes yet, so opening it in a browser shows "Cannot GET /".

| Variable | Meaning |
|---|---|
| `PORT` | Port the backend listens on (default 4000) |
| `NODE_ENV` | Environment name, such as `development` |
| `DATABASE_URL` | PostgreSQL connection string (used from Day 06; replace the placeholders locally and never commit it) |

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend runs on http://localhost:3000.

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (default `http://localhost:4000/api`) |

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

Database setup and migrations will be documented on Day 06.

## Repository Structure

```
VisionRoot-Software-Engineering-Training/
├── README.md
├── .gitignore
├── backend/
│   ├── src/
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
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   └── decisions/
│       └── ADR-001-architecture.md
└── evidence/
    ├── Day-01/
    │   ├── daily-log.md
    │   └── backlog-board.png
    ├── Day-02/
    │   ├── data-model.png
    │   ├── architecture.png
    │   └── daily-log.md
    └── Day-03/
        └── daily-log.md
```

More folders (`tests/`, `database/`) will be added on the days they are needed.

## Known Limitations

- The MVP has no authentication or authorisation. All users can perform all actions.
- The project is for local/training use only and must not be deployed to a real production environment.

## Git Workflow

- Work is done on feature branches (for example `chore/day-03-environment-setup`), not directly on `main`.
- Commits use clear messages, such as `chore: scaffold express typescript backend`.
- Each branch is merged through a pull request.
- No secrets, `.env` files or private data are committed. Only `.env.example` files with placeholders are committed.