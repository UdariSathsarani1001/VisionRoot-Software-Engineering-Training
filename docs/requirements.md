# Problem Statement: Service Request Management System

## Background

In many organisations, internal service requests such as IT support issues, facility repairs, and general administrative needs are raised informally through emails, chat messages, phone calls, or verbal conversations. These channels are not designed for tracking work.

## Problem

Because requests are scattered across informal channels:

- **Lost or duplicated requests:** Requests are easily lost, forgotten, or duplicated.
- **No requester visibility:** Requesters cannot see whether their request has been received, is being worked on, or has been resolved.
- **No shared operational view:** Staff handling requests have no single place to see what is open, what is urgent, and what is finished.
- **Inconsistent records:** There is no consistent record of request details (what was asked, its category, its priority, and when it changed), which makes follow-up, accountability, and reporting difficult.
- **Unreliable workflows:** Without a defined workflow, a request’s status can be changed arbitrarily (for example, a request being marked closed before anyone worked on it), which makes the status unreliable.

## Problem Solution

Build a small internal web application where users can **submit**, **track**, and **manage service requests** in one central place. The system will:

- Let a user create a request with a title, description, category (IT, Facilities, Other), and priority (Low, Medium, High).
- Store every request persistently in a database.
- Let users list requests, filter them by status, and view the details of a single request.
- Move requests through an agreed workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED) and reject invalid status transitions.
- Validate all input on the server and return consistent, meaningful error responses.
- Provide a health endpoint and setup documentation so the system can be run and checked by others.

## Users

- **Requester (Employee)**: Submits service requests, views the list of submitted requests, and checks detailed statuses.
- **Request Handler (Support Agent / Admin)**: Reviews incoming requests, filters them by status, and updates request statuses through their lifecycle.
- **Developer / Operator**: Sets up, runs and checks the system (health endpoint, setup documentation, validation behaviour).

## User Stories

### US-01: Create a request
**Priority:** High | **Release:** MVP

**As a** requester,
**I want** to submit a request with a title, description, category and priority,
**so that** my issue is recorded.

**Acceptance criteria**
- [ ] Given valid fields, when I submit, then the request is saved with status OPEN and the API returns 201.
- [ ] Given an empty title or description, then the API returns 400 and the UI shows a validation message.
- [ ] Category must be IT, Facilities or Other.
- [ ] Priority must be LOW, MEDIUM or HIGH.

---

### US-02: List and filter requests
**Priority:** High | **Release:** MVP

**As a** handler,
**I want** to see all requests and filter by status,
**so that** I can focus on what needs work.

**Acceptance criteria**
- [ ] Given existing requests, when I open the list, then all requests are shown with title, category, priority and status.
- [ ] When I filter by a status, only matching requests are shown.
- [ ] When no requests match, an empty state message is shown.

---

### US-03: View request details
**Priority:** High | **Release:** MVP

**As a** requester or handler,
**I want** to open a request,
**so that** I can see its full details.

**Acceptance criteria**
- [ ] Given a valid id, then the full request and its timestamps are returned (200).
- [ ] Given an unknown id, then the API returns 404 with a consistent error body.

---

### US-04: Update request status
**Priority:** High | **Release:** MVP

**As a** handler,
**I want** to move a request through the workflow,
**so that** its progress is accurate.

**Acceptance criteria**
- [ ] Allowed workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED.
- [ ] A valid transition returns 200 and updates updated_at.
- [ ] An invalid transition (e.g. OPEN → CLOSED) is rejected with a clear error.

---

### US-05: Server-side validation and consistent errors
**Priority:** High | **Release:** MVP

**As a** developer,
**I want** all input validated on the server and errors returned in one format,
**so that** clients can handle failures predictably.

**Acceptance criteria**
- [ ] Invalid input returns 400 with a consistent error structure.
- [ ] Missing records return 404.
- [ ] Errors never expose stack traces, credentials or private data.

---

### US-06: Persistent storage
**Priority:** High | **Release:** MVP

**As a** user,
**I want** my requests saved in a database,
**so that** they are not lost when the app restarts.

**Acceptance criteria**
- [ ] Given created requests, when the application restarts, then the requests are still available.
- [ ] Given the database is unavailable, then the API returns a safe error and does not report false success.

---

### US-07: Health endpoint
**Priority:** Medium | **Release:** MVP

**As an** operator,
**I want** a health endpoint,
**so that** I can check the system is running.

**Acceptance criteria**
- [ ] GET /api/health returns 200 when the documented health criteria pass.
- [ ] Given the database is unreachable, then GET /api/health returns a non-200 status (for example 503).

---

### US-08: Setup documentation
**Priority:** Medium | **Release:** MVP

**As a** new developer,
**I want** clear setup instructions,
**so that** I can run the project from a clean machine.

**Acceptance criteria**
- [ ] Following the README, another developer can install, configure (via .env.example) and run the project.
- [ ] Given no .env file, then the README explains which variables to copy from .env.example.

--- 

## Functional Requirements

| ID | Requirement | Related story |
|---|---|---|
| FR-01 | The system shall allow a user to create a service request with a title, description, category and priority. | US-01 |
| FR-02 | The system shall set the status of a newly created request to OPEN. | US-01 |
| FR-03 | The system shall restrict category to IT, Facilities or Other. | US-01 |
| FR-04 | The system shall restrict priority to LOW, MEDIUM or HIGH. | US-01 |
| FR-05 | The system shall automatically record created_at and updated_at timestamps for every request. | US-01, US-03 |
| FR-06 | The system shall display a list of all requests showing title, category, priority and status. | US-02 |
| FR-07 | The system shall allow the request list to be filtered by status. | US-02 |
| FR-08 | The system shall show an empty-state message when no requests match. | US-02 |
| FR-09 | The system shall allow a user to view the full details of a single request by its id. | US-03 |
| FR-10 | The system shall allow a request's status to be updated. | US-04 |
| FR-11 | The system shall enforce the status workflow OPEN → IN_PROGRESS → RESOLVED → CLOSED. | US-04 |
| FR-12 | The system shall reject any status transition that is not allowed by the workflow, with a clear error message. | US-04 |
| FR-13 | The system shall update updated_at whenever a request's status changes. | US-04 |
| FR-14 | The system shall validate all input on the server (required fields, title 3 to 100 characters, description 1 to 1000 characters, allowed values). | US-05 |
| FR-15 | The system shall return a consistent error format for invalid input (400) and missing records (404). | US-05 |
| FR-16 | The system shall store all requests in a database so they persist after a restart. | US-06 |
| FR-17 | The system shall provide a health endpoint (GET /api/health) that returns 200 when the documented health criteria pass. | US-07 |
| FR-18 | The UI shall show loading, empty, success and error states, and validation feedback on the create form. | US-01, US-02 |

---

## Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Validation | All client input shall be validated on the server, even if the frontend also validates it. |
| NFR-02 | Security | Secrets (passwords, API keys, connection strings) shall be stored in environment variables and never committed to Git. |
| NFR-03 | Security | The repository shall include a .gitignore that excludes .env, and a .env.example containing placeholder names only. |
| NFR-04 | Security | Database access shall use an ORM or parameterised queries to prevent SQL injection. |
| NFR-05 | Security | Error responses shall not expose stack traces, credentials, or internal details. |
| NFR-06 | Reliability | Data shall persist across application restarts. |
| NFR-07 | Reliability | The frontend shall handle network or server failure without displaying a false success message. |
| NFR-08 | Maintainability | The backend shall separate responsibilities into controller/route, service, and repository layers. |
| NFR-09 | Maintainability | Business rules (such as status transitions) shall live in the service layer, not in the UI or controllers. |
| NFR-10 | Maintainability | Code shall be readable and formatted, and pass lint and format checks. |
| NFR-11 | Testability | Important business rules and failure cases shall be covered by automated tests (unit and integration). |
| NFR-12 | Usability | The UI shall have clear labels, responsive layout, and visible feedback for loading, empty, success, and error states. |
| NFR-13 | Observability | The system shall log important events and errors without logging credentials or private data. |
| NFR-14 | Operability | A health endpoint shall allow the running state of the system to be checked. |
| NFR-15 | Portability | A new developer shall be able to clone the repository and run the project by following the README. |
| NFR-16 | Database | The schema shall be created through migration scripts, not undocumented manual edits. |

---

## Backlog: MVP vs Future Improvements

### Prioritisation approach

Items are placed in the MVP if the system cannot meet its core purpose without them: submitting, tracking and updating service requests with validated, persistent data. Everything else is deferred so the project stays realistic for two weeks.

### MVP backlog

| ID | Item | Priority | Related requirements | Planned day |
|---|---|---|---|---|
| US-01 | Create a request | High | FR-01 to FR-05 | Day 5 to 7 |
| US-02 | List and filter requests by status | High | FR-06 to FR-08 | Day 5 to 7 |
| US-03 | View request details | High | FR-09 | Day 5 to 7 |
| US-04 | Update request status with workflow rules | High | FR-10 to FR-13 | Day 7 |
| US-05 | Server-side validation and consistent errors | High | FR-14, FR-15 | Day 5 |
| US-06 | Persistent storage in a database | High | FR-16 | Day 6 |
| US-07 | Health endpoint | Medium | FR-17, NFR-14 | Day 5 |
| US-08 | Setup documentation | Medium | NFR-15 | Day 3 and ongoing |

### Future improvements (out of MVP scope)

| ID | Item | Priority | Reason for deferring |
|---|---|---|---|
| F-01 | User authentication and roles (requester vs handler) | Medium | Adds login, sessions and authorisation rules beyond the two-week scope |
| F-02 | Email notifications on status change | Low | Needs an external email service and extra configuration |
| F-03 | File attachments on requests | Low | Needs file storage and security checks |
| F-04 | Comments on requests | Low | Extra data model and UI, not needed for core tracking |
| F-05 | Assign requests to specific handlers | Medium | Depends on user accounts (F-01) |
| F-06 | Search by keyword | Low | Filtering by status is enough for the MVP |
| F-07 | Filter by category and priority | Low | Can be added once status filtering works |
| F-08 | Pagination and sorting of the request list | Low | Not needed for small data volumes |
| F-09 | Dashboards and reporting | Low | Requires aggregated queries and extra UI |
| F-10 | Request history / audit log of status changes | Medium | Useful for accountability, but extra table and logic |

### Scope decisions

- **In MVP:** create, list, filter by status, view, update status with workflow rules, persistent storage, validation, consistent errors, health endpoint, setup documentation.

- **Out of scope (Future improvements):** see F-01 to F-10 above, including authentication and roles, notifications, attachments, comments, assignment, search, extra filters, pagination, dashboards and an audit log.

## Definition of Done

A feature is done when it is implemented across the relevant layers, validates input on the server, handles failure cases, has automated tests for its main rules, is documented, is committed through a pull request, and contains no secrets.

## Assumptions and Limitations

- The MVP has no authentication or authorisation. All users can perform all actions.
- Requester and request handler roles are descriptive only and are not enforced.
- The system is for local/training use only and must not be deployed to a real production environment.
- Length limits: title 3 to 100 characters (after trimming whitespace), description 1 to 1000 characters.
- Future work: authentication and roles (F-01), request assignment (F-05).

## Success Criteria
The project is successful when a user can submit a request, see it in the list, open its details, and have it moved through the status workflow, while invalid input and invalid status changes are rejected with clear errors, all data persists after a restart, and a reviewer can verify each behaviour through the documented acceptance criteria and automated tests.