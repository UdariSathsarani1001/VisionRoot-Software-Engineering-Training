# Day 09 Daily Log — Security and Deployment

## What was done

### Security review
- Completed authorization review: documented the four unprotected actions, confirmed authentication is not implemented (F-01), and wrote up that hidden UI buttons and CORS are not authorization controls.
- Completed validation review: confirmed every endpoint validates body, query and path parameters with Zod and `.strict()` mode; confirmed the 10 kb body limit is in place.
- Ran a secret scan: no real credentials found in files or Git history; only safe placeholder values in `.env.example` files.
- Ran `npm audit`: 10 moderate dev-only vulnerabilities in ESLint tooling; 0 in the production install. Documented findings and accepted the known dev-only risk.
- Verified database role: `srm_user` is not a superuser.

### Hardening changes
- Installed `helmet`, `pino`, `pino-http` (production dependencies).
- Added `helmet()` as the first middleware in `app.ts`.
- Set a 10 kb body size limit on `express.json()`.
- Updated `errorHandler` to return `413 PAYLOAD_TOO_LARGE` in the standard error format for oversized bodies.
- Rewrote `config/environment.ts` to validate all required variables at startup and exit cleanly with a named message (no values printed) on any failure.
- Created `middleware/request-logger.ts` with pino structured JSON logging; suppressed in test mode.
- Replaced all `console.log` / `console.error` calls in `server.ts`, `connection.ts`, `migrate.ts`, and `error-handler.ts` with the structured `logger`.

### Documentation
- Created `docs/deployment.md` covering prerequisites, env variables, database setup, build, start/stop, health check, logs, rollback, troubleshooting, known limitations, and security notes.
- Created `docs/security-checklist.md` with 18 items, honest statuses, and a known-limitations section.
- Updated `docs/api-contract.md` to document the 413 response and `PAYLOAD_TOO_LARGE` code.
- Updated `docs/architecture.md` with a new section on security headers, body size limit, structured logging and startup validation.
- Updated `backend/.env.example` and `frontend/.env.example` with all variables and clear annotations.
- Updated `README.md` with Day 09 progress, the production-like run commands, new env variables (`LOG_LEVEL`), and updated Known Limitations.

### Tests
- Added `tests/integration/hardening.test.ts` with 13 new tests.
- Full suite: 114 tests passed (5 test files).

### Build and quality
- `npm run build`: passes.
- `npm run lint`: passes.
- `npm run format`: passes.
- `npm test`: 5 test files, 114 tests passed.

## What was not done

- No Docker, `docker-compose.yml` or CI workflow (not approved today).
- No rate limiting (deferred — no supervisor approval).
- No authentication (F-01 — planned future work).

## Blockers

None.
