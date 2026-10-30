# Day 04 Notes: Frontend Design Decisions

**Date:** 2026-10-29
**Topic:** Frontend architecture and UI

These notes record the main design and component-boundary decisions made while building the frontend.

---

## Decision 1: One API client module (`lib/api.ts`)

**What:** All data access goes through `src/lib/api.ts`. Components and hooks call its functions (`listRequests`, `getRequest`, `createRequest`) and never call `fetch` directly.

**Why:**
- When the backend is connected on Day 07, only `api.ts` changes.
- Response shapes and the error format are defined in one place, following `docs/api-contract.md`.
- Components are easier to read and test because they do not contain network code.

## Decision 2: Mock data behind the API client

**What:** The backend does not exist yet, so `api.ts` returns sample data from `mock-data.ts` after a short delay. It is switched on with `NEXT_PUBLIC_USE_MOCK=true`.

**Why:**
- The UI can be built and checked (loading, empty, error and success states) before the API exists.
- The delay makes the loading state visible, and a flag makes the error state testable.

**Limitation:** the screenshots show mock data, not a working integration. Real integration is tested on Day 07.

## Decision 3: Feature-based folder structure

**What:** Request-related code lives in `src/features/requests/`. Shared state components live in `src/components/states/`, and shadcn/ui components stay in `src/components/ui/`.

**Why:**
- Everything about requests is in one place, so it is easy to find and change.
- shadcn/ui files are generated code. Keeping them separate from our own code makes it clear what we wrote.
- Pages in `src/app/` stay thin and only compose feature components.

## Decision 4: Separate list and form components

**What:** `RequestList` and `RequestForm` are separate components on separate pages (`/` and `/requests/new`).

**Why:**
- Each component has one job: the list shows and filters data, and the form collects and validates input.
- They have different state (list data and filter vs. form values and field errors), so combining them would mix concerns.
- Each can be changed or tested without touching the other.

## Decision 5: Validation rules in one place

**What:** Allowed values and length limits are defined only in `constants.ts` and `validation.ts`, matching `requirements.md` and `docs/api-contract.md`: title 3 to 100 characters (trimmed), description 1 to 1000, and category and priority from fixed lists.

**Why:**
- A rule changed in one place applies everywhere in the UI.
- It avoids the UI and the documents disagreeing.

**Note:** client-side validation is only a convenience for the user. The server still validates all input (Day 05), because the browser can be bypassed.

## Decision 6: Shared loading, empty and error components

**What:** `LoadingState`, `EmptyState` and `ErrorState` are shared components used by every data view.

**Why:**
- Every view handles loading, empty, error and success the same way.
- The user always sees what is happening when data is loading, absent or invalid.
- Failures show an error and never a false success.

## Decision 7: shadcn/ui with Tailwind CSS

**What:** UI is built from shadcn/ui components (Button, Input, Textarea, Select, Label, Badge, Table, Card, Skeleton, Alert), styled with Tailwind CSS.

**Why:**
- It gives accessible, consistent components (labels, focus states, keyboard support) without writing them from scratch.
- The component source is copied into the repository, so it is visible and can be reviewed.

**Trade-off:** it adds Tailwind and extra dependencies to a small project, and I need to understand the generated code before relying on it.

---

## Known limitations

- The UI uses mock data and is not connected to a backend yet.
- There is no authentication, so all users see and can do everything (see F-01).
- The status-change control is not built today. It is planned for Day 07.

## Next steps

- Day 05: build the API endpoints, then replace the mock calls in `api.ts` with real `fetch` calls on Day 07.
- Update `docs/api-contract.md` with real behaviour once the backend exists.
