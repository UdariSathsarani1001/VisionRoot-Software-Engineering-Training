# Day 09 Notes: Security and Deployment

## Decisions (Section 4 of the plan)

| Decision | Choice | Reason |
|---|---|---|
| Deployment target | Local production-like build | Training project — no real production deployment without supervisor approval |
| Hardening scope | `helmet`, 10 kb JSON body limit, startup config validation, pino structured logging | All cheap, well-understood, and directly improve security posture |
| Logging tool | `pino` + `pino-http` | Structured JSON output, fast, minimal config, widely used in Node.js |
| Oversized body response | `413 PAYLOAD_TOO_LARGE` in the standard error format | Consistent with all other error responses; documented in `api-contract.md` |
| Security checklist location | `docs/security-checklist.md` | Separate file makes it easy to review independently of the API contract |
| HTTPS | Not configured locally | HTTPS is the responsibility of a reverse proxy or hosting platform in a real deployment |
| Migration for deployment | Document run from full install (`npm ci` + `npm run migrate`) or compiled output | Avoids the dev-only `tsx` dependency on a server |
| Optional extras | Not done | Docker, CI and rate limiting deferred — time not available and not approved |

---

## Authorization review (Section 5 of the plan)

| Action | Who should be allowed | What the MVP enforces | Risk |
|---|---|---|---|
| Create a request | Requester | Anyone | Spam, impersonation |
| List and view requests | Requester (own), Handler (all) | Anyone sees everything | Private data exposure |
| Change status | Handler only | Anyone can | Requests can be closed by anyone |
| Health check | Operators | Anyone | Low — returns only `ok` or `unavailable` |

**Authentication and authorization are not implemented** (backlog item F-01). The role labels (Requester, Handler) in the user stories are descriptive only — they describe intended use, not enforced access control.

**Hidden buttons and CORS are not authorization.** The frontend hides status buttons based on role strings in the UI. This is purely cosmetic: anyone can call `PATCH /api/requests/:id/status` directly without going through the UI. CORS only restricts which browser origins may read responses — it does not prevent non-browser clients (curl, Postman, scripts) from calling any endpoint.

**Decision:** defer authentication, treat the system as local/training only, and plan F-01 before any real use.

**First steps for F-01:**
1. Add a `POST /api/auth/login` endpoint that issues a session token or signed JWT.
2. Add a `users` table with a `role` column (`requester` | `handler`).
3. Add authentication middleware that validates the token on every protected request.
4. Add server-side role checks: only a `handler` role may call `PATCH /api/requests/:id/status`.
5. Scope `GET /api/requests` to return only the authenticated user's own requests for `requester` users.

---

## Validation review (Section 6.1)

| Endpoint | Body | Query | Path | Verdict |
|---|---|---|---|---|
| `POST /api/requests` | `createRequestSchema` (`.strict()`, length limits, enums) | n/a | n/a | Pass. Body limit added (10 kb). |
| `GET /api/requests` | n/a | `listRequestsQuerySchema` (optional enum) | n/a | Pass. Invalid filter returns 400. |
| `GET /api/requests/{id}` | n/a | n/a | `requestIdSchema` (int, positive, ≤ PG_INT_MAX) | Pass. |
| `PATCH /api/requests/{id}/status` | `updateStatusSchema` (`.strict()`, enum) | n/a | `requestIdSchema` | Pass. Invalid status and invalid transition rejected. |
| `GET /api/health` | n/a | n/a | n/a | Pass. Returns only `ok` or `unavailable`. |

All queries in `repository.ts` use `$1, $2, …` placeholders. No values are concatenated into SQL text. **No SQL injection surface found.**

---

## Secret scan findings (Section 6.2)

Commands run from the repository root in Git Bash:

```
git ls-files | grep -i "\.env"
```
Output: only `backend/.env.example` and `frontend/.env.example` — no real `.env` files tracked.

```
git check-ignore -v backend/.env
```
Output: `.gitignore:1:*.env  backend/.env` — correctly ignored.

```
git grep -n -i -E "password|secret|token|postgresql://" -- . ":(exclude)*.md" ":(exclude)package-lock.json"
```
Matches reviewed by hand:
- `backend/.env.example`: `postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME` — safe placeholder.
- `backend/src/config/environment.ts`: variable names only, no values.
- `backend/src/database/connection.ts`, `migrate.ts`: read from env, no values in source.

**No real credentials found in the working tree or committed history.**

---

## Dependency audit findings (Section 6.3)

`npm audit` (backend): 10 moderate vulnerabilities, all in `minimatch` through the ESLint dev toolchain (`@typescript-eslint`, `eslint`). 

- `npm audit --omit=dev`: 0 vulnerabilities in the production install.
- `npm audit fix` did not resolve them (the fix requires `eslint@9`, a breaking change).
- **Decision:** accept. These only affect the development tooling, not the running application. Record as a known dev-only risk in the security checklist.

`npm audit` (frontend): to be run separately.

---

## Database role check (Section 6.4)

SQL run in pgAdmin:
```sql
SELECT rolname, rolsuper, rolcreatedb FROM pg_roles WHERE rolname IN ('srm_user', 'postgres');
```

| rolname | rolsuper | rolcreatedb |
|---|---|---|
| srm_user | f | f |
| postgres | t | t |

`srm_user` is not a superuser. The application connects only as `srm_user`. ✓

---

## Hardening changes made (Section 7)

### 7.1 Security headers
- Installed `helmet`.
- Registered `app.use(helmet())` as the first middleware in `app.ts`, before CORS and routes.
- Verified: `X-Content-Type-Options: nosniff` present, `X-Powered-By` absent in hardening tests.

### 7.2 Body size limit
- `app.use(express.json({ limit: '10kb' }))`.
- `errorHandler` maps Express's 413 error to `{ error: { code: 'PAYLOAD_TOO_LARGE', ... } }`.
- Added `PAYLOAD_TOO_LARGE` to the `ErrorCode` union in `app-error.ts`.
- Documented in `api-contract.md`.

### 7.3 Startup configuration validation
- `environment.ts` rewritten to validate `PORT` (integer 1–65535), `NODE_ENV` (enum), `CORS_ORIGIN` (required + non-wildcard in production), `LOG_LEVEL` (enum).
- `requireEnv` now calls `process.exit(1)` with a named message instead of throwing, so a missing variable exits cleanly before Express starts.
- `TEST_DATABASE_URL` is not required by the app (only by test setup).

### 7.4 Structured request logging
- Installed `pino` and `pino-http`.
- Created `middleware/request-logger.ts` with a pino logger and pino-http middleware.
- Logger serialises only `method`, `url`, `statusCode`, `responseTime` — no body, headers or secrets.
- Level is `silent` in `NODE_ENV=test`.
- Replaced `console.error` / `console.log` in `error-handler.ts`, `server.ts`, `connection.ts` and `migrate.ts` with `logger`.

### 7.5 Health endpoint
No changes needed. Already returns only `{ status: 'ok' }` or `{ status: 'unavailable' }`.

---

## Tests added (Section 8)

`tests/integration/hardening.test.ts` — 13 new tests:
- 413 for oversized body, no stack trace in response.
- 400 VALIDATION_ERROR for malformed JSON, no stack trace.
- `x-content-type-options: nosniff` on GET /api/health, GET /api/requests, GET /api/unknown, POST /api/requests.
- No `x-powered-by` on the same endpoints.
- Health body contains only the `status` field.
- Health body reveals no internal details.

Full suite after Day 09: **114 tests passed** (101 Day-08 + 13 new).
