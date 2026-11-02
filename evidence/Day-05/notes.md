# Day 05 – Backend Implementation Notes

## Layer responsibilities

### Controller (`controller.ts`)
Owns the HTTP boundary. Reads `req.body`, `req.params`, and `req.query`, validates them with Zod schemas, translates the validated data into a service call, sets the HTTP status code, and sends the JSON response. It never holds business rules and never touches the store directly.

### Service (`service.ts`)
Owns the business rules. Receives typed, validated data. Today's only rule is that `status` is always set to `OPEN` on creation (the repository does this, instructed by the service layer). Throws `AppError(404, 'NOT_FOUND')` when a request does not exist. Never imports `Request` or `Response` from Express.

### Repository (`repository.ts`)
Owns data access. Maintains the in-memory array and a counter for generating integer IDs. Generates `id`, `created_at`, and `updated_at`. Returns plain objects. Does not validate input or make business decisions. Persistence (PostgreSQL) replaces this file on Day 06.

---

## Decisions

### In-memory storage
Data is stored in a module-level array. It is lost on every server restart. Chosen because Day 06 adds PostgreSQL — no value in designing a persistence layer twice. The README and API contract both document this limitation.

### Validation library: Zod v4
Zod was already the plan requirement and is the natural fit for TypeScript-first schema validation. Zod v4 (4.6.7) was installed. Key v4 differences from v3 that required adjustments:
- `required_error` / `invalid_type_error` on `z.string()` / `z.number()` are removed; use a plain `error` string or `.min()` messages instead.
- `z.enum()` custom message key is `error`, not `errorMap`.
- `ZodError` exposes `.issues` instead of `.errors`.

### Unknown field handling: **rejected** (`.strict()`)
`createRequestSchema` uses `.strict()`, so any field not in the schema (including `status`, `id`, `created_at`, `updated_at`) returns `400 VALIDATION_ERROR` with a `details` entry listing the unrecognised key. This is the safer default and makes the contract explicit.

### Sort order: newest first
`GET /api/requests` returns results sorted descending by `created_at`. Rationale: the most recently submitted requests are the ones users are most likely monitoring.

### Express version: 5
Express 5 is installed (`^5.3.0`). Async errors thrown inside route handlers are automatically forwarded to the error middleware — no `asyncHandler` wrapper is needed.

---

## Error format
All error responses follow the single structure from the contract:
```json
{ "error": { "code": "...", "message": "...", "details": [] } }
```
`details` is only included when non-empty (field-level validation). Stack traces and internal details are never sent to the client.
