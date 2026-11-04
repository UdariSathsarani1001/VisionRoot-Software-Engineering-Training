# Day 08 – Backend Testing Notes

## Testing approach

The backend now uses Vitest for its test runner and Supertest to exercise the Express app through HTTP without starting a separate server. Tests are split by purpose:

- **Unit tests** validate request schemas and service behavior. The service tests mock the repository so the business rules are tested independently of PostgreSQL.
- **Integration tests** send requests through the real Express app and use PostgreSQL to verify persistence, database-backed behavior, and response formatting.

The tests are run from `backend/`:

| Command | Purpose |
|---|---|
| `npm run test:unit` | Run schema and service unit tests |
| `npm run test:integration` | Run API and health integration tests |
| `npm test` | Run the complete backend test suite |

## Test database safety

Integration tests use `TEST_DATABASE_URL`, not the application’s development `DATABASE_URL`. The setup file loads environment variables and refuses to start the test run if the test URL is missing, is textually identical to `DATABASE_URL`, or its database name does not contain `test`. After these checks, it sets `DATABASE_URL` to the test URL and sets `NODE_ENV` to `test`.

The request API integration suite runs the migration before its tests and truncates `requests` (restarting the identity sequence) before each test. This gives each API test a clean database state. Because this reset removes table rows, `TEST_DATABASE_URL` must point only to a disposable test database, never a development or production database.

## Test coverage

### Unit tests

`tests/unit/schema.test.ts` checks:

- Request title length and trimming
- Description length and required-field behavior
- Allowed and rejected categories and priorities
- Allowed and rejected workflow statuses
- Optional status filters
- Positive integer request IDs and the PostgreSQL 32-bit integer maximum

`tests/unit/service.test.ts` checks:

- Request lookup success and not-found behavior
- Passing validated create input to the repository
- All 16 source/destination status pairs across `OPEN`, `IN_PROGRESS`, `RESOLVED`, and `CLOSED`
- That allowed transitions update through the repository, while disallowed transitions fail without updating
- Not-found status updates do not reach the repository update call

### Integration tests

`tests/integration/requests.test.ts` exercises request creation, newest-first listing, status filtering, lookup by ID, and status updates through the HTTP API and PostgreSQL. It also checks validation and malformed JSON errors, invalid IDs and filters, missing records, disallowed status transitions, complete workflow progression, persistence, and standard error responses.

`tests/integration/health.test.ts` verifies the database-backed health endpoint and the standard 404 response for an unknown route.

## Reliability decisions

### Run test files sequentially

Vitest is configured with `fileParallelism: false`. Both integration files use the shared database connection pool and close it after their tests; sequential execution avoids those files racing over the same pool or database.

### Use a real database only where needed

Schema and service tests use no database; service tests mock repository functions. Integration tests use PostgreSQL to validate behavior that cannot be established by mocks alone, including migrations, persistence, and database health.

### Bound test and hook duration

Vitest test and hook timeouts are both set to 15 seconds. This keeps a stalled database call or setup hook from hanging the suite indefinitely.

## Results

The Day 08 run passed 60 unit tests, 41 integration tests, and all 101 tests in the full suite. ESLint, Prettier, and the TypeScript build also passed. See [bug-log.md](./bug-log.md) for the recorded commands and the non-blocking Vite configuration warning.