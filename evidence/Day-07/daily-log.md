# Daily Log — Day 07

## Goal
Connect the frontend, API and database into one working end-to-end workflow and add the status-update feature (US-04).

## Work completed

### Backend
- Added `PATCH /api/requests/:id/status` endpoint.
- Added `updateStatusSchema` to `schema.ts` (Zod, strict, validates status enum).
- Added `updateRequestStatus(id, newStatus)` to `service.ts` with the allowed-transition table (`OPEN → IN_PROGRESS → RESOLVED → CLOSED`). Throws `AppError(400, INVALID_TRANSITION)` for any disallowed or same-status update. Throws `AppError(404, NOT_FOUND)` when the request does not exist.
- Added `updateStatus(id, newStatus, expectedStatus)` to `repository.ts`. Uses `UPDATE … WHERE id = $1 AND status = $3 RETURNING *` for atomic concurrent-update protection. Returns `null` if the row was modified concurrently.
- Added `updateRequestStatus` controller handler and wired the PATCH route in `routes.ts`.
- Installed `cors@2.8.5` and `@types/cors@2.8.17`.
- Added `corsOrigin` to `config/environment.ts` (reads `CORS_ORIGIN`, defaults to `http://localhost:3000`).
- Registered `cors` middleware in `app.ts` before routes, allowing `GET`, `POST`, `PATCH`, `OPTIONS`.
- Updated `backend/.env.example` with `CORS_ORIGIN`.
- Added `CORS_ORIGIN=http://localhost:3000` to `backend/.env`.

### Frontend
- Replaced `lib/api.ts` mock-only implementation with a real `fetch`-based implementation using a shared `apiFetch` helper that maps network failures and non-OK responses to `ApiError`. Mock is preserved behind `NEXT_PUBLIC_USE_MOCK=true`.
- Added `updateRequestStatus(id, status)` to `lib/api.ts`.
- Added `NEXT_STATUS` map to `features/requests/constants.ts` (UI convenience labels for each allowed next step).
- Added `useRequestStatus()` hook to `use-requests.ts` — wraps `updateRequestStatus` with `updating`/`error` state.
- Created `features/requests/status-actions.tsx` — renders the single next-step button, disables during request, updates parent on success, shows error without changing displayed status on failure.
- Updated `request-details.tsx` to import and render `StatusActions`, passing the request and an `onUpdated` callback that updates component state from the PATCH response.
- Updated `request-form.tsx` to map server `details` array back to inline field errors on a `400`.
- Set `NEXT_PUBLIC_USE_MOCK=false` in `frontend/.env.local` and `frontend/.env.example`.
- Updated footer in `layout.tsx` to remove the "Running on mock data" line.

### Tests and evidence
- Created `evidence/Day-07/workflow-test.mjs` — 10-step Node script covering the full transition sequence and all error cases.
- Created `evidence/Day-07/notes.md` with all design decisions and the integration bug record.
- Captured screenshots: [evidence/Day-07/create-form.png](create-form.png), [evidence/Day-07/service-list.png](service-list.png), [evidence/Day-07/details-open.png](details-open.png), [evidence/Day-07/status-in-progress.png](status-in-progress.png), [evidence/Day-07/status-resolved.png](status-resolved.png), [evidence/Day-07/status-closed.png](status-closed.png), [evidence/Day-07/workflow-script-output.png](workflow-script-output.png), and [evidence/Day-07/postman-runner.png](postman-runner.png).

### Docs
- Updated `docs/api-contract.md` with PATCH endpoint detail, allowed-transition table, CORS note, and same-status rule.
- Updated `docs/architecture.md` with the status-update request flow and CORS explanation.
- Created a full Postman collection in `docs/postman/service-request-api.postman_collection.json`.
- Updated root `README.md` with how to run both apps, environment variables, and known limitations.

## Decisions
See `evidence/Day-07/notes.md`.

## Issues
- `request-details.tsx` had duplicate declarations after an incorrect `str_replace`. Fixed by rewriting the file. Details in `notes.md`.

## Checklist status
- [x] Backend PATCH endpoint implemented and tested with Postman
- [x] CORS configured and working in the browser
- [x] Frontend calling real API (USE_MOCK=false)
- [x] Status control on details page
- [x] Error states verified (backend stopped, 400, 404)
- [x] Workflow script written
- [x] Docs updated
- [x] Screenshots captured against the running system
- [x] Workflow script output captured after running against the live backend
