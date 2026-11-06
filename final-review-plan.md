# Final Review and Handover Plan (Day 10): Service Request Management System

Plan for the final review, the demo and the handover. Day 10 builds nothing new. It fixes the most important findings, makes every document match the real system, proves the project works from a clean state, and hands it over for supervisor review.

## 1. Goal

Present a working MVP and explain the architecture, the tests and the remaining risks. By the end of the day a reviewer can clone the repository, find evidence for all ten days, run the project from the README, and hear you explain what was built, why it is structured this way, what is tested and what remains before real production use.

## 2. Scope for Day 10

| Area | In scope today | Not today |
|---|---|---|
| Review | Collect findings, fix the high-priority ones, list the rest as technical debt | Large refactors, new features |
| Documentation | Make every document match the final system | New design documents |
| Verification | Fresh-clone run, final test, lint, format and build runs, production-like run | New tests (unless a fix needs a regression test) |
| Demo | A 5 to 10 minute demo and a backup recording | Slides (not required) |
| Handover | Self-review, release notes, optional handover document | Real deployment |
| Submission | Final pull request or repository link, tag or commit hash | Deploying to a real production system |

**Rule from the guide:** finishing the training guide does not approve the project for production use, and nothing is deployed to a real production system without explicit supervisor authorization and review.

## 3. What the guide requires (Day 10)

| Requirement | Where it is met |
|---|---|
| Fix the highest-priority review findings | Section 5 |
| Prepare a 5 to 10 minute demo: requirements, architecture, one end-to-end flow and test results | Section 8 |
| Update README, architecture diagram, API docs and ADR | Section 6 |
| Write a self-review: one decision, one bug, one improvement, known limitations | Section 9 |
| `evidence/Day-10/demo-notes.md` and a final test-results file | Sections 8 and 10 |
| The repository has all daily folders and no secrets or temporary junk | Section 11 |
| A final pull request or the repository link for supervisor review | Section 14 |
| The commit hash or tag of the final reviewed version | Section 14 |

## 4. Decisions to make first (record them in `notes.md`)

| Decision | Recommendation |
|---|---|
| Submission route | A final pull request into `main`. Use the repository link only if your supervisor prefers it. |
| Final version marker | A Git tag such as `v1.0.0-training` on the reviewed commit, plus the commit hash in the log |
| Which findings to fix today | Only wrong, unsafe or misleading things (bugs, secrets, documented steps that fail, stale documents). Leave style and large refactors as technical debt. |
| Demo format | Live demo from a clean database with fake data, with a screen recording as a backup |
| Optional documents | Short release notes and a short handover. Skip them if time is tight. |
| New ADR | Optional ADR-002 for deferring authentication (F-01). Only if you can explain it well. |

## 5. Review findings

### 5.1 Collect findings from three places

| Source | How |
|---|---|
| Pull request feedback | Read the comments on every earlier pull request and supervisor message, and list the ones not yet resolved |
| Your own read-through | Read the backend and frontend code as a reviewer, once, from the route to the database |
| Documents | Compare each document with the code (section 6) |

### 5.2 Triage every finding

| Priority | Meaning | Action today |
|---|---|---|
| High | A bug, a security problem, a secret, a documented step that fails, or a document that states something false | Fix it, add a regression test if it is a code defect |
| Medium | Duplicated logic, unclear boundaries, confusing names, missing comments | Fix only if quick and safe |
| Low | Style, naming preferences, nice-to-have improvements | Record as technical debt |

Record the result in a findings table in `evidence/Day-10/notes.md`:

| # | Finding | Where | Priority | Fixed today? | Notes |
|---|---|---|---|---|---|
| 1 | | | | | |

### 5.3 Code review checklist

| Area | Look for |
|---|---|
| Layer boundaries | Business rules in a controller, SQL outside the repository, HTTP objects in the service, `fetch` calls outside `api.ts` |
| Duplication | Status values, transition rules or length limits defined in more than one place (backend schema, service, frontend constants) |
| Leftovers | `console.log`, commented-out code, unused imports, unused files such as the old mock data, `NEXT_PUBLIC_USE_MOCK` references if mock mode was removed |
| Error handling | Every failure goes through the error handler and shows a safe message, and the UI never shows a false success |
| Security | No secrets, parameterised queries, CORS limited to the configured origin, no stack traces in responses |
| Naming and consistency | File and folder names, screenshot names (underscores vs hyphens), branch and commit message style |
| Tests | Every important rule has a test, the tests are deterministic, and the test setup protects the development database |
| Configuration | `.env.example` files list every variable the code reads, with placeholders only |

## 6. Document consistency

Every document must describe the system as it is now, not as an earlier day planned it. Check each one against the code and fix what is stale.

| Document | What to verify |
|---|---|
| `README.md` | Status line, progress tables for all ten days, setup steps, endpoint list, environment variables, test commands and results, repository tree, known limitations (the frontend is connected to the API, status updates exist, tests exist, the database is real) |
| `docs/requirements.md` | Stories, functional and non-functional requirements and the backlog still match what was built. Update the "planned day" column to the real days, or note changes. |
| `docs/architecture.md` | The diagram and layers match the code, the status-update flow, CORS, logging and security notes, and the trade-off and risk |
| `docs/data-model.md` and the ER diagram | Match the real migration. The diagram must not show the unused lookup tables if you used enums. |
| `docs/api-contract.md` | Every endpoint, status code, error code and example matches the real behaviour, including the health 503, the 413 response and the transition rules |
| `docs/decisions/ADR-001-architecture.md` | Status, consequences and review trigger still true. Add a short note if something changed. |
| `docs/postman/...collection.json` | Every request and test matches the current API |
| `docs/deployment.md` and `docs/security-checklist.md` | Match the real configuration and run steps |
| `.env.example` files | Same variable names as the code, `deployment.md` and the README |
| Trello board | Completed stories in Done, future items still in Backlog |
| Evidence folders | Every day has a daily log, and the file names in the README match the real files |

Common stale items to look for: a frontend "uses mock data" statement, an in-memory storage statement, a "no routes yet" note, a Day 02 ER diagram with unused tables, a health endpoint documented without the 503 case, missing environment variables, and old branch names in the Git workflow example.

## 7. Final verification run (from a clean state)

Do this from a **fresh clone** in a new folder, using only the README and the `.env.example` placeholders.

| # | Step | Expected |
|---|---|---|
| 1 | Clone the repository, and follow the README setup for the backend and frontend | Installs without errors |
| 2 | Create the development and test databases and run the migration | Tables and enums exist |
| 3 | `npm test` in `backend/` (twice) | All tests pass, with the same result both times |
| 4 | `npm run lint`, `npm run format` and `npm run build` in `backend/` | Pass |
| 5 | `npm run lint` and `npm run build` in `frontend/` | Pass |
| 6 | Production-like run of both apps (see `deployment.md`) | Health returns 200, the app loads |
| 7 | Walk through the full flow in the browser | Create, list, details, each status change work |
| 8 | Try an invalid transition directly in Postman or curl | Server returns 400 `INVALID_TRANSITION` |
| 9 | Run the Postman collection | All tests pass |
| 10 | Stop PostgreSQL | Health returns 503, other endpoints return a safe 500, and the UI shows an error |
| 11 | Secret checks (section 11) | Nothing real found |

If a step fails, fix the README or the code, and rerun that step. A README step that fails from a fresh clone is a high-priority finding.

## 8. Demo plan (5 to 10 minutes)

### 8.1 Script

| Time | Section | What to show |
|---|---|---|
| 1 min | Problem and requirements | Problem statement, users, MVP scope, backlog |
| 1.5 min | Architecture | The diagram, the layers and what each owns, why a modular monolith |
| 3 min | One end-to-end flow | Create a request in the UI, see it in the list, open details, move the status through the workflow, try an invalid transition and show the server rejecting it, show the row in the database |
| 1.5 min | Tests and quality | The suite passing, the status-transition tests, the separate test database, the regression test for your bug |
| 1 min | Security and operations | Health check, logs, no secrets in Git, and the known limitation of no authentication |
| 1 min | Self-review and next steps | One decision, one bug, one improvement, what remains before production |

### 8.2 Preparation

- Reset the development database and add only fake sample data.
- Have these open before you start: the running app, the architecture diagram, the test output, pgAdmin and Postman.
- Rehearse once with a timer, and trim to fit.
- Record the demo as a backup, and save it or link it in `evidence/Day-10/`.
- Close anything that shows passwords, tokens, private URLs or personal data, including pgAdmin's connection dialog and `.env` files.

### 8.3 Questions to prepare for

| Question | Where your answer comes from |
|---|---|
| Trace one action from the UI to the database | `docs/architecture.md`, request flow |
| Why a modular monolith, and what was the alternative? | ADR-001 |
| Where do validation, business rules and persistence belong? | Layers table in `architecture.md` |
| How is a status transition enforced, and why not only in the UI? | Service rules, the server-side PATCH test |
| Why enums and not lookup tables? | `data-model.md`, `notes.md` |
| What happens when the database is down? | Health 503, safe 500, UI error state |
| What does the regression test protect? | `bug-log.md` |
| Which test protects the most important business rule? | The status-transition tests |
| Why a separate test database, and how is it protected? | The setup guard in `tests/setup.ts` |
| What is missing before real production use? | Section 9 limitations |
| How would you add authentication? | Future item F-01, with the first steps |

## 9. Self-review (`evidence/Day-10/self-review.md`, or inside `demo-notes.md`)

Write it in your own words, with real content from your project.

| Item | What to write |
|---|---|
| One decision | A real design decision, the alternatives, and why you chose it (for example the modular monolith, enums, or deferring authentication) |
| One bug | A real defect from your Day 08 bug log: what happened, the root cause, the fix and the regression test |
| One improvement | What you would do next, and why it matters most |
| Known limitations | No authentication or authorization, no audit history of status changes, backend-only tests, no CI, no rate limiting (unless added), local production-like build only, not approved for production |

## 10. Final test-results file (`evidence/Day-10/test-results.md`)

For each command, record the date, the exact command, where it was run, and the real result (counts and pass or fail). Do not edit the output.

| Command | Folder | What to record |
|---|---|---|
| `npm run test:unit` | `backend/` | Files and tests passed |
| `npm run test:integration` | `backend/` | Files and tests passed |
| `npm test` (twice) | `backend/` | Files and tests passed, and that both runs match |
| `npm run lint`, `npm run format`, `npm run build` | `backend/` | Pass |
| `npm run lint`, `npm run build` | `frontend/` | Pass |
| Postman collection run | n/a | Number of requests and tests passed |
| Health check on the production-like run | n/a | 200, and 503 with the database stopped |

Add the Node.js version and the commit hash the run was made on.

## 11. Repository cleanup and final checks

**Structure**

```
evidence/
├── Day-01/  ...  Day-10/      # each has a daily log
docs/
├── requirements.md, architecture.md, data-model.md, api-contract.md
├── deployment.md, security-checklist.md
├── release-notes.md           # optional
├── handover.md                # optional
├── decisions/ADR-001-architecture.md
└── postman/
```

**Cleanup checklist**
- Every `evidence/Day-01` to `evidence/Day-10` folder exists, with its daily log.
- No `node_modules/`, `dist/`, `.next/`, log files, database dumps (`*.dump`), editor files, duplicate files or abandoned files in Git.
- No commented-out code or debug output left in the source.
- Screenshot and file names in the README match the real files.

**Secret checks** (Git Bash works for all of these):

```bash
git ls-files | grep -i "\.env"
git log -p --all -S "YOUR_REAL_PASSWORD" --oneline
git grep -n -i -E "password|secret|token|postgresql://" -- . ":(exclude)*.md" ":(exclude)package-lock.json"
```

- The first command should list only `.env.example` files.
- The second should print nothing. Use your real password when you run it, and never write it in a document.
- Review the third by hand. Placeholders such as `USER:PASSWORD` are fine.
- Reopen the evidence screenshots and check none shows a password, connection string, private URL or personal data.

## 12. Final README changes

| Section | Change |
|---|---|
| Status | "Day 10 - Final review and handover" and the version or tag |
| Progress tables | One for each of the ten days, plus Day 10 (demo notes, test results, self-review, release notes) |
| How to demo (new, short) | The steps for the end-to-end flow and the test commands |
| Known limitations | Final, honest list (section 9) |
| Final version | The tag and the commit hash of the reviewed version |
| Repository tree | Matches the real project, including `docs/deployment.md`, `docs/security-checklist.md` and `evidence/Day-10/` |

## 13. Optional documents

**Release notes (`docs/release-notes.md`)**

| Section | Content |
|---|---|
| Version | `v1.0.0-training` and the date |
| Features | Create, list and filter, details, status workflow, persistence, health check |
| Quality | Tests, validation, error handling, logging |
| Known limitations | The list from section 9 |
| How to run | A link to the README and `deployment.md` |

**Handover (`docs/handover.md`)**

| Section | Content |
|---|---|
| What exists | Components and where they live |
| How to run and test | Links to the README and `deployment.md` |
| Where the documents are | Requirements, architecture, data model, API contract, ADR, checklist |
| Open risks and technical debt | The list from your findings table |
| Recommended next steps | Authentication and roles (F-01), request history (F-10), frontend tests, CI, rate limiting, HTTPS and monitoring |

## 14. Final submission

1. Fix the high-priority findings and update the documents (sections 5 and 6) on a branch such as `docs/day-10-final-review`.
2. Run the final verification (section 7) and save `test-results.md`.
3. Open the **final pull request** using your template, linking the demo notes, the test results and the self-review. Respond to review comments and record important decisions.
4. After approval and merge, tag the reviewed commit on `main`:

```bash
git checkout main
git pull
git tag -a v1.0.0-training -m "Final reviewed version of the training project"
git push origin v1.0.0-training
git rev-parse --short HEAD
```

5. Record the tag and the commit hash in `evidence/Day-10/daily-log.md` and the README. Make the tag on the commit your supervisor actually reviewed, and don't move it afterwards.
6. If your supervisor prefers a repository link, send the link, the branch and the hash instead of a pull request.

## 15. Final checklist, with the evidence for each item

| Guide item | Evidence |
|---|---|
| I can explain the SDLC and the project's requirements | `docs/requirements.md`, the demo |
| I can explain the architecture and trace a request | `docs/architecture.md`, the demo flow |
| I can justify the architecture and explain one alternative | ADR-001 |
| I understand controller, service, repository and database responsibilities | `architecture.md`, `evidence/Day-05/notes.md` |
| I can implement and test an endpoint with server-side validation | Backend code, tests, Postman collection |
| I can use Git branches, commits and pull requests | The commit history and pull requests |
| I have documented database setup and schema changes | `database/migrations/`, README, `data-model.md` |
| I have automated tests for business rules and failure cases | `backend/tests/`, `test-results.md` |
| I have daily evidence and a problem-solving log | `evidence/Day-01` to `Day-10`, `bug-log.md` |
| I have documented setup, environment variables, testing and deployment | README, `deployment.md`, `.env.example` |
| No credentials or sensitive information are committed | The secret checks, the security checklist |
| I can demonstrate the MVP and explain limitations and next steps | The demo, the self-review |

Tick an item only if its evidence exists and you can show it.

## 16. Evidence to save under `evidence/Day-10/`

- `demo-notes.md`, `test-results.md`, `self-review.md` (or inside the demo notes) and `daily-log.md`.
- The terminal output of the final fresh-clone run: tests, lint, format, build and the health check.
- The demo recording (or a link), and screenshots of the end-to-end flow, the invalid transition rejected by the server, and the database row.
- A screenshot of the repository on GitHub showing all the folders, and of the final pull request with its review comments.
- The tag and the commit hash.
- Optionally, the updated Trello board and the release notes.

No credentials, private URLs or personal data in any screenshot or recording.

## 17. Build order

1. Record the decisions in section 4.
2. Collect and triage the review findings (section 5).
3. Fix the high-priority findings, with a regression test for any code defect, and rerun the tests.
4. Update every document against the code (section 6).
5. Run the clean-state verification (section 7), and fix anything the README missed.
6. Write `test-results.md`, `self-review.md` and `demo-notes.md`.
7. Write the optional release notes and handover.
8. Clean the repository and run the secret checks (section 11).
9. Update the README (section 12).
10. Rehearse and record the demo.
11. Open the final pull request, respond to feedback, merge, and tag (section 14).
12. Write the daily log, tick the final checklist honestly, and send the final update.

## 18. Done when

- The high-priority findings are fixed, and the rest are listed honestly as technical debt.
- Every document matches the final system, and the README works from a fresh clone.
- The final tests, lint, format and builds pass, and the results are saved.
- The repository has all ten daily folders and no secrets or temporary junk.
- A final pull request or repository link is submitted, with the commit hash or tag recorded.
- You can explain what was built, why it is structured this way, what is tested and what remains before real production use, and you can show the evidence for each claim.
