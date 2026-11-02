# Day 06 Notes

## Decisions (from database-plan.md section 4)

| Decision | Choice | Why |
|---|---|---|
| Data access | `pg` driver with plain SQL | Matches the single-table design, straightforward to explain, no ORM overhead |
| Category, priority and status | PostgreSQL enums (`request_category`, `request_priority`, `request_status`) | Already chosen in `docs/data-model.md`; enforces allowed values at the database level |
| Primary key | `integer GENERATED ALWAYS AS IDENTITY` | Matches the integer `id` in the API contract; the database owns the sequence |
| Migration tool | Custom runner (`migrate.ts`) with numbered `.sql` files | Simple, transparent, repeatable; no extra tooling to install |
| Migration location | `database/migrations/` at the repository root | Keeps database artefacts separate from the backend source |
| Connection code location | `backend/src/database/connection.ts` | Matches `docs/architecture.md` backend structure |
| `updated_at` | Set by `DEFAULT now()` on insert; the repository will update it on status change (Day 07) | The client never sets timestamps — one consistent rule |
| Failure behaviour | Unexpected database errors → `500 INTERNAL_ERROR`; health endpoint → `503 { "status": "unavailable" }` | Matches `docs/api-contract.md` |

## Repository changes noted

The in-memory repository functions (`create`, `findAll`, `findById`) were synchronous. The database-backed versions are `async`. The minimal change required:
- `repository.ts`: all three functions are now `async` and return `Promise<...>`.
- `service.ts`: all three functions are now `async` and `await` the repository calls.
- `controller.ts`: already `async`; added `await` before each service call (previously the return values were used directly, which still worked because an async call without `await` just returns a Promise that would be serialised by `res.json`, but adding `await` is correct and explicit).

## Integer overflow guard

PostgreSQL `integer` is 32-bit signed (max `2147483647`). `requestIdSchema` in `schema.ts` now rejects ids above `2147483647` with `400 VALIDATION_ERROR`, so the API never sends an out-of-range value to the database.

## Lookup tables discarded

The ER diagram originally included `categories`, `priorities` and `statuses` lookup tables. These are unused — the `requests` table already uses enum types for those columns. The lookup tables were removed from the diagram (Option A from the plan). The enum design is simpler and matches `docs/data-model.md`.

## Database setup

- Role: `srm_user` (login role, no superuser privileges)
- Database: `service_requests`, owner `srm_user`
- Connection string stored in `backend/.env` (not committed)
- Placeholder in `backend/.env.example`
