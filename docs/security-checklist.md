# Security Checklist: Service Request Management System

**Project:** Service Request Management System
**Review date:** Day 09
**Reviewer:** Developer (training review — not a penetration test)

---

| # | Item | Status | Note |
|---|---|---|---|
| 1 | No secrets, `.env` files or credentials committed (files and history) | Done | `git ls-files \| grep -i "\.env"` lists only `.env.example` files. `git check-ignore` confirms `backend/.env` and `frontend/.env.local` are ignored. Secret scan with `git grep` found only safe placeholders such as `USER:PASSWORD`. |
| 2 | `.env` ignored, `.env.example` has placeholders only | Done | `.gitignore` excludes `*.env` and `.env*`. Both `.env.example` files contain only placeholder values. Updated on Day 09 to include all variables. |
| 3 | All input validated on the server (body, query, path) | Done | Every endpoint validates body, query and path parameters with Zod. `createRequestSchema` and `updateStatusSchema` use `.strict()` to reject extra fields. `requestIdSchema` guards against integer overflow. |
| 4 | Parameterised queries only | Done | All SQL in `repository.ts` uses `$1, $2, …` placeholders. No user values are concatenated into SQL strings. |
| 5 | Error responses expose no stack traces, paths or credentials | Done | `errorHandler` returns only a code and safe message. Unexpected errors log `err.message` server-side with pino; the response is always `INTERNAL_ERROR`. Tested by integration and hardening suites. |
| 6 | CORS limited to the configured frontend origin | Done | `cors` middleware reads `CORS_ORIGIN`. Wildcards are not used. In production, `CORS_ORIGIN` is required and must not be `*` (enforced at startup). |
| 7 | Security headers enabled | Done | `helmet()` is registered as the first middleware in `app.ts`. Sets `X-Content-Type-Options: nosniff`, removes `X-Powered-By`, and applies other safe defaults. Verified with hardening tests. |
| 8 | Request body size limited | Done | `express.json({ limit: '10kb' })` caps bodies. Oversized bodies return `413 PAYLOAD_TOO_LARGE` in the standard error format. Tested in `hardening.test.ts`. |
| 9 | Database user is not a superuser (least privilege) | Done | `srm_user` is created with `CREATE ROLE srm_user WITH LOGIN PASSWORD '…'` — no `SUPERUSER` flag. Verified with `SELECT rolsuper FROM pg_roles WHERE rolname = 'srm_user'`. The app connects only as `srm_user`, never as `postgres`. |
| 10 | Dependency audit reviewed | Partial | `npm audit` reports 10 moderate vulnerabilities, all in `minimatch` via dev-only ESLint tooling (`@typescript-eslint`, `eslint`). None affect the production install (`npm audit --omit=dev` reports 0 issues). The fix requires `npm audit fix --force` which would install `eslint@9`, a breaking change — accepted and documented as a known dev-only risk. |
| 11 | Logs contain no secrets or request bodies | Done | `pino-http` is configured in `request-logger.ts` to log only `method`, `url`, `statusCode` and `responseTime`. Request bodies, `Authorization` headers, cookies and the connection string are never serialised. |
| 12 | Health endpoint reveals nothing sensitive | Done | Returns only `{ "status": "ok" }` or `{ "status": "unavailable" }`. No version, hostname, error message or connection details. Tested in `hardening.test.ts`. |
| 13 | Config validated at startup, no values printed | Done | `environment.ts` validates `DATABASE_URL` (required), `PORT` (integer, 1–65535), `NODE_ENV` (enum), `CORS_ORIGIN` (required + non-wildcard in production), and `LOG_LEVEL` (enum). Missing or invalid variables cause `process.exit(1)` with a message that names the variable but never prints its value. |
| 14 | Frontend `NEXT_PUBLIC_` variables hold no secrets | Done | `NEXT_PUBLIC_API_URL` is the backend base URL — not a secret. `NEXT_PUBLIC_USE_MOCK` is a boolean flag. No tokens, keys or passwords are in any `NEXT_PUBLIC_` variable. |
| 15 | HTTPS | Not done | Not configured locally. In a real deployment, HTTPS must be provided by a reverse proxy (e.g. nginx + Let's Encrypt) or the hosting platform. The application does not handle TLS. |
| 16 | Authentication and authorization | Not done | **Known limitation (F-01).** No authentication or authorisation is implemented. All users who can reach the API can read and change every request. The role labels (Requester, Handler) in the user stories are descriptive only. Hidden UI buttons and CORS are not authorisation controls — CORS only restricts browser origins, and anyone can call the API directly. **First steps when implementing:** add a login endpoint, issue a session token or JWT, store a role on each user record, and add a server-side role check on every `PATCH` endpoint. |
| 17 | Rate limiting | Not done | No rate limiting on any endpoint. `express-rate-limit` on `POST /api/requests` and `PATCH /api/requests/:id/status` would be a cheap improvement. Deferred — acceptable for a local/training deployment. |
| 18 | Backup and rollback documented | Done | `docs/deployment.md` documents `pg_dump` backup, restore steps, rollback for bad code releases, bad migrations and bad configuration. `*.dump` is in `.gitignore`. |

---

## Known limitations

The following are accepted risks for the current local/training scope. Each must be addressed before any real deployment.

- **No authentication or authorization.** Anyone who can reach the app can read and change every request. (F-01)
- **HTTP only when run locally.** TLS must be provided by a reverse proxy or hosting platform in a real deployment.
- **No rate limiting.** Any client can send unlimited requests to any endpoint.
- **No audit history of status changes.** There is no record of who changed a status or when. (F-10)
- **Single instance.** No horizontal scaling, health monitoring, alerting or automatic restart on crash.
- **Manual migration runner.** Migrations are run by hand; there is no automated deployment pipeline.
- **No automated secret rotation.** Database credentials are static; there is no vault or rotation mechanism.
- **Not approved for production use.** Supervisor authorisation and a full security review are required.
