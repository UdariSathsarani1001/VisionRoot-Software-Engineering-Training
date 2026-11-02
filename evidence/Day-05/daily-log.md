# Daily Evidence Log: Day 05

**Date:** 2026-10-30
**Day / topic:** Day 05 - Backend API and service layer
**Objective:** Implement endpoints with clean responsibilities and predictable responses.

---

## What I learned

- **Routes, controllers, services and repositories:** the route maps a path to a controller, the controller handles HTTP, the service applies business rules, and the repository reads and writes data.
- **Schema validation:** validating body, query and path input on the server, because the client cannot be trusted.
- **HTTP methods and status codes:** 201 for created, 200 for success, 400 for invalid input, 404 for a missing record.
- **Consistent error responses:** one error structure for every failure, handled in one central place.
- **Separation of HTTP concerns from business logic:** the service never uses `req` or `res`, so business rules can be tested on their own.

## What I implemented

- `POST /api/requests`, `GET /api/requests` (with an optional `status` filter) and `GET /api/requests/{id}`.
- Server-side validation with a schema: title 3 to 100 characters (trimmed), description 1 to 1000, category and priority from the allowed values, a valid status filter and a valid id.
- Business rule in the service: new requests always start as `OPEN`.
- An in-memory repository for create, list and find by id.
- `GET /api/health`.
- Centralised error handling with one error format, a 404 handler for unknown routes, and no stack traces in responses.
- Updated `docs/api-contract.md` with the real behaviour.

## Files / folders changed

- `backend/src/modules/requests/` (`routes.ts`, `controller.ts`, `service.ts`, `repository.ts`, `schema.ts`, `types.ts`)
- `backend/src/middleware/error-handler.ts` and the 404 handler
- `backend/src/errors/app-error.ts`
- `backend/src/app.ts`
- `backend/package.json` (added the validation library)
- `docs/api-contract.md`
- `README.md`
- `evidence/Day-05/` (`notes.md`, `daily-log.md`, request and response evidence)

## How I tested it

I tested the API without the frontend, using the Postman collection (`service-request-api.postman_collection.json`):

- Created a request with valid input and checked the 201 response, the `OPEN` status, the id and the timestamps.
- Sent invalid input (empty title, 2-character title, 101-character title, missing description, invalid category, invalid priority, malformed JSON) and checked for 400 with the standard error format.
- Listed requests with no filter, with `status=OPEN`, and with an invalid status.
- Fetched a request by id: found (200), not found (404) and an invalid id (400).
- Called an unknown route and checked for 404 in the standard format.
- Called `GET /api/health` and checked for 200.
- Checked that no response exposes a stack trace or internal details, and that responses match `docs/api-contract.md`.
- Ran `npm run lint`, `npm run format` and `npm run build` in `backend/`.

## Evidence links (screenshots, tests, diagrams)

- Successful requests (201, 200): `evidence/Day-05/create_request.png`
- Invalid-input and error examples (400, 404): `evidence/Day-05/create_request_empty_title .png`, `evidence/Day-05/get_request_not_found.png`
- How controller, service and repository differ: `evidence/Day-05/notes.md`
- Updated API contract: `docs/api-contract.md`

## Problem encountered

The database is not built until Day 06, so the API needs somewhere to store requests, and the health endpoint cannot check a database yet.

## How I investigated it

I checked the guide's roadmap and my backlog. Day 05 requires working endpoints with persisted data tested later, and the database setup is a Day 06 task, so the repository could not use PostgreSQL yet.

## Root cause

The roadmap separates the API (Day 05) from the database (Day 06), so there is no database to store data or to check for the health endpoint's 503 case.

## How I fixed it

I used an in-memory repository behind repository functions, so only the repository changes on Day 06. I made the health endpoint return 200 without a database check, and recorded both limitations in `docs/api-contract.md`, the README and `notes.md`. Data is lost when the server restarts until Day 06.

## What I would improve

- Add the database check to `GET /api/health` and persist data on Day 06.
- Add `PATCH /api/requests/{id}/status` with the transition rules on Day 07.
- Add automated unit and integration tests for the service rules and the endpoints on Day 08.

## Blockers / questions for supervisor

- Is in-memory storage acceptable for Day 05 until the database is added on Day 06?
- Should unknown fields in the request body be ignored or rejected?
- Should an invalid status transition return 400 or 409 when I build it on Day 07?

---

## Daily evidence checklist

- [ ] Code or documentation pushed to GitHub
- [ ] README or daily notes updated
- [ ] Relevant tests run and results recorded (Postman requests, lint, format and build)
- [ ] Screenshots saved under `evidence/Day-05/`
- [ ] Bug or blocker documented honestly
- [ ] Commit hash and pull request link recorded
- [ ] No secrets, private data or misleading evidence included
