# Day 10 Final Test Results

- Date: `2026-11-06`
- Node.js: `v24.17.0`
- Git tag: `v1.0.0-training`
- Reviewed commit: `fb0373a`

## Validation commands and results

| Command | Folder | Result |
|---|---|---|
| `cd backend && npm run lint` | `backend/` | Passed |
| `cd backend && npm run build` | `backend/` | Passed |
| `cd backend && npm test` | `backend/` | Passed — 5 test files, 114 tests passed |
| `cd backend && npm test` (second run) | `backend/` | Passed — 5 test files, 114 tests passed; same result as the first run |
| `cd frontend && npm run lint` | `frontend/` | Passed |
| `cd frontend && npm run build` | `frontend/` | Passed |

## Notes

- The backend suite emitted the expected Vite warning about the native config loader and ESM syntax, but it did not fail the run. The tests still passed completely.
- The frontend production build completed successfully and generated the app routes for `/`, `/requests/[id]`, and `/requests/new`.
- The project is ready for the final review and handover within the training scope, with the remaining risks clearly documented in the self-review and handover notes.
