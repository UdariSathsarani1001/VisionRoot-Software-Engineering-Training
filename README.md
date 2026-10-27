 # VisionRoot Software Engineering Training

Training project: **Service Request Management System**, a small internal web application where users can submit and track service requests.

**Status:** Day 02 - Architecture and system design (documentation only, no application code yet)

---

## Project Summary

Internal service requests (IT issues, facility repairs, general needs) are often raised through email, chat or phone calls, so they get lost, have no visible status, and have no consistent record. This project builds a single place to submit, track and manage them.

**MVP features**

- Create a request with title, description, category and priority
- List requests and filter by status
- View request details
- Update status using the workflow `OPEN → IN_PROGRESS → RESOLVED → CLOSED`
- Persist records in a database
- Validate input on the server and return consistent errors
- Health endpoint and setup documentation

**Planned stack:** Next.js, Express.js, TypeScript, PostgreSQL

## Day 01 Progress

| Item | Location |
|---|---|
| Problem statement, users, scope | `docs/requirements.md` |
| User stories and acceptance criteria (US-01 to US-08) | `docs/requirements.md` |
| Functional and non-functional requirements | `docs/requirements.md` |
| Backlog (MVP vs future) | `docs/requirements.md` and Trello board |
| Daily log | `evidence/Day-01/daily-log.md` |
| Backlog board screenshot | `evidence/Day-01/backlog-board.png` |

**Trello board:** https://trello.com/b/UcGn5JfV/service-request-management-system

## Day 02 Progress

| Item | Location |
|---|---|
| Architecture diagram, layers and request flow | `docs/architecture.md` |
| Data model and ER diagram | `docs/data-model.md` |
| API contract (5 endpoints, status codes, error format) | `docs/api-contract.md` |
| Architecture decision (modular monolith) | `docs/decisions/ADR-001-architecture.md` |
| Daily log | `evidence/Day-02/daily-log.md` |

## Repository Structure

```
VisionRoot-Software-Engineering-Training/
├── README.md
├── .gitignore
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   └── decisions/
│       └── ADR-001-architecture.md
└── evidence/
    ├── Day-01/
    │   ├── daily-log.md
    │   └── backlog-board.png
    └── Day-02/
        ├── data-model.png
        ├── architecture.png
        └── daily-log.md
```

More folders (`frontend/`, `backend/`, `tests/`, `database/`) will be added on the days they are needed.