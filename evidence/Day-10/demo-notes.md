# Day 10 Demo Notes

## Final version

- Tag: `v1.0.0-training`
- Commit: `fb0373a`
- Node.js: `v24.17.0`

## Demo scene

Open these before the demo starts:
- the frontend on `http://localhost:3000`
- the backend on `http://localhost:4000`
- Postman or `curl` for the invalid-transition check
- pgAdmin or `psql` pointed at the development database
- the architecture diagram and `README.md`

## Demo script (5-10 minutes)

1. Problem and scope
   - explain the pain point: service requests disappear into chat/email and have no status history
   - show the core users and the list of MVP features

2. Architecture
   - show the modular monolith diagram from `docs/architecture.md`
   - explain the split between frontend, Express API, and PostgreSQL
   - call out the service layer rule that status transitions live on the server, not only in the UI

3. End-to-end workflow
   - create a new request in the UI
   - confirm it appears in the list and on the details page
   - update the status to `IN_PROGRESS`, then `RESOLVED`, then `CLOSED`
   - show that the API rejects an invalid transition such as `OPEN -> CLOSED` or `RESOLVED -> IN_PROGRESS`
   - show the saved row in PostgreSQL for the final request

4. Quality checks
   - mention that the backend suite passes repeatedly (`npm test` twice)
   - point to `backend/tests/integration/requests.test.ts` and the hardening tests
   - show the `health` endpoint returning `200` when the database is reachable and the failure mode when the database is not

5. Security and operations
   - note that `helmet`, config validation, body size limits and structured JSON logging are in place
   - confirm there are no tracked `.env` files, and that only placeholders are stored in `.env.example`
   - state the known limitations honestly: no authentication, no rate limiting, local-only deployment

6. Self-review and next steps
   - explain the design decision, the earlier bug fix and the next improvement
   - call out the future `F-01` authentication work as the biggest next step before real production use

## Backup guide

If the browser demo fails, use the following backup flow:
- run the backend and frontend locally
- use Postman to create a request and update the status
- use `curl http://localhost:4000/api/health` to show the health check
- show the database row with `SELECT * FROM requests ORDER BY id DESC LIMIT 1;`

No recording was captured in this local session, so the live walkthrough is the primary proof. Record it in a screen capture if a formal backup is needed.
