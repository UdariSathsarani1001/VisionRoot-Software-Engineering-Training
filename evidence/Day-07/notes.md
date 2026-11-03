# Day 07 Notes

## Decisions

### Status code for invalid transitions
**Decision:** Keep `400 INVALID_TRANSITION` as defined in the API contract.

Reason: `400` communicates that the *request* is invalid (the transition is not allowed by the rules). `409 Conflict` would be more appropriate for a write collision between two concurrent requests racing for the same record, which is a different situation. Using `400` keeps the contract consistent with the validation errors the frontend already handles.

### Same-status update (e.g. OPEN → OPEN)
**Decision:** Rejected as `INVALID_TRANSITION`.

Reason: `OPEN → OPEN` is not in the allowed-transition table. Accepting it would waste a database write with no state change and could hide a client bug. The service rejects it with the same `Cannot change status from X to Y` message used for any disallowed transition.

### Skipping or reversing steps
**Decision:** Rejected (`OPEN → RESOLVED`, `RESOLVED → OPEN`, any attempt after `CLOSED`).

Reason: The workflow is linear and `CLOSED` is final. Allowing skips or reversals would break the audit trail and the requirements (FR-11, FR-12). The transition table in the service enforces this; the repository's atomic `UPDATE … WHERE status = $3` prevents concurrent writes from bypassing it.

### Invalid status value (e.g. `"DONE"`)
**Decision:** Returns `400 VALIDATION_ERROR` with a `details` entry for the `status` field.

Reason: An unrecognised value is a schema error, not a business-rule error. The Zod schema on the request body catches it before the service layer is reached. This is intentionally different from `INVALID_TRANSITION`.

### CORS
**Decision:** Use the `cors` npm package in `app.ts`, reading the allowed origin from the `CORS_ORIGIN` environment variable (default `http://localhost:3000`). Only `GET`, `POST`, `PATCH` and `OPTIONS` are permitted.

Reason: Wildcard (`*`) would allow any origin and conflicts with the principle of least privilege. The environment variable makes the origin configurable for staging or production without a code change. A Next.js rewrite proxy was considered but rejected because it hides the real URL from the developer and adds an extra hop; direct CORS is simpler to debug.

### Mock mode
**Decision:** Mock is kept behind `NEXT_PUBLIC_USE_MOCK=false` by default. The mock code stays in a separate module (`lib/mock-data.ts`) so it remains available for offline development by setting `NEXT_PUBLIC_USE_MOCK=true`.

Reason: Removing the mock entirely would make offline development harder. Keeping it behind a flag costs nothing and the README documents the flag.

### Concurrent status updates
**Decision:** The `updateStatus` repository function uses `UPDATE … WHERE id = $1 AND status = $3 RETURNING *`. If another request changes the status between the service's SELECT and this UPDATE, no row is returned. The service re-reads the row and returns `INVALID_TRANSITION` or `404` accordingly.

Reason: A plain `UPDATE … WHERE id = $1` could silently skip a step if two requests arrive simultaneously. The `AND status = $3` check makes the update atomic with respect to the current status without needing an explicit transaction or advisory lock.

### Status control in the UI
**Decision:** The `StatusActions` component shows only the single allowed next-status button, using the `NEXT_STATUS` map in `constants.ts`. The button is hidden for `CLOSED` requests. The component does not show buttons for transitions the server will reject.

Reason: The plan is clear that hiding buttons is *not* security — the server enforces all rules. The UI convenience helps honest users avoid mistakes. Direct API calls are always possible and will be rejected by the service if the transition is invalid.

---

## Integration bug record

**Symptom:** `request-details.tsx` had duplicate component definitions after an incorrect `str_replace` operation that prepended the new content without removing the old code. TypeScript reported duplicate identifier errors for `RequestDetailsProps`, `formatDate`, `DetailsSkeleton`, and `RequestDetails`.

**Diagnosis:** The `str_replace` matched only the import block at the top of the file and replaced it with the full new component. The original component body was still present below, creating two copies of every declaration in the same file.

**Root cause:** The replacement string included the full file content, not just the import section. The `oldStr` matched only the imports, so the rest of the original file remained.

**Fix:** Rewrote the file completely with `fs_write`, which overwrites the entire file, eliminating the duplication. Verified with `tsc --noEmit` that no errors remained.
