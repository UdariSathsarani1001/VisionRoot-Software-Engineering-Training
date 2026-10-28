# Daily Evidence Log: Day 02

**Date:** 2026-10-27
**Day / topic:** Day 02 - Architecture and system design
**Objective:** Design the system before implementing features across multiple layers.

---

## What I learned

- **Frontend, backend and database responsibilities:** the frontend handles screens and API calls, the backend handles validation and business rules, and the database stores data and enforces constraints.
- **HTTP request flow:** UI → controller → service → repository → database, and back with a deliberate status code.
- **Modular monolith:** one backend deployable with clear modules and layers. It avoids the network, deployment and data-consistency costs of microservices.
- **Separation of concerns:** controllers handle HTTP, services hold business rules, and repositories handle database access.
- **ER diagrams, API contracts and ADRs:** how to describe data, endpoints and design decisions so a reviewer can check them.

## What I implemented

- Wrote `docs/architecture.md` with an architecture diagram, layer responsibilities, the request flow for creating a request, why the architecture fits, and one trade-off and one known risk.
- Wrote `docs/data-model.md` with an ER diagram, the `requests` table, enums, constraints, an index, and DBML for dbdiagram.io.
- Wrote `docs/api-contract.md` with 5 endpoints, example requests and responses, status codes, and one consistent error format.
- Wrote `docs/decisions/ADR-001-architecture.md` explaining the modular monolith decision and the alternatives I rejected.

## Files / folders changed

- `docs/architecture.md`
- `docs/data-model.md`
- `docs/api-contract.md`
- `docs/decisions/ADR-001-architecture.md`
- `evidence/Day-02/daily-log.md`
- `evidence/Day-02/data-model.png`
- `evidence/Day-02/architecture.png`
- `README.md`

## How I tested it

Day 02 has no code to run. I checked consistency between the documents:

- Every endpoint in the API contract maps to a user story and to functional requirements.
- Every field in the data model is covered by a requirement (FR-01 to FR-05, FR-14).
- The status transitions are the same in `requirements.md`, `data-model.md` and `api-contract.md`.
- The trade-off and risk in `architecture.md` match the consequences in ADR-001.
- Title and description length limits match across the requirements, data model and API contract.

## Evidence links (screenshots, tests, diagrams)

- Architecture and request flow: `docs/architecture.md`
- Data model and ER diagram: `docs/data-model.md`
- API contract: `docs/api-contract.md`
- Architecture decision: `docs/decisions/ADR-001-architecture.md`

## Problem encountered

Deciding whether the data model should have one table with enums, or several tables (lookup tables for category, priority and status), since the guide mentions database relationships.

## How I investigated it

I reviewed the data model section of the guide, which allows category to be an enum or a lookup table, and compared both designs against the MVP requirements. I checked whether any MVP feature needs a second table.

## Root cause

The guide mentions relationships, but the MVP stores only one thing (a service request). Category, priority and status are short, fixed lists, so lookup tables would add joins without adding any feature.

## How I fixed it

I chose a single `requests` table with enums, and recorded the reason in `data-model.md`. I listed future tables (`users`, `comments`, `request_history`) that would add relationships when features F-01, F-04 and F-10 are built.

## What I would improve

- Export the diagrams as images (`evidence/Day-02/architecture.png`, `evidence/Day-02/data-model.png`) so they are visible without rendering Mermaid.
- Confirm with my supervisor that one table with enums is acceptable.
- Confirm the error codes and the use of 400 for invalid status transitions before I implement the API on Day 05.

## GitHub

- **GitHub branch:** `docs/day-02-architecture`
- **Pull request:** _(add link, or write "not opened" if your supervisor did not ask for one)_
- **Commit hash:** _(add the output of `git rev-parse --short HEAD` after you commit)_

## Blockers / questions for supervisor

- Is a single table with enums acceptable, or should category, priority and status be lookup tables?
- Should an invalid status transition return 400 or 409?
- Is it fine to keep authentication out of the architecture for the MVP?

---

## Daily evidence checklist

- [ ] Code or documentation pushed to GitHub
- [ ] README or daily notes updated
- [ ] Relevant tests run and results recorded (not applicable for Day 02)
- [ ] Screenshots/diagrams saved under `evidence/Day-02/` or `docs/`, if useful
- [ ] Bug or blocker documented honestly
- [ ] Commit hash and pull request link recorded
- [ ] No secrets, private data or misleading evidence included
