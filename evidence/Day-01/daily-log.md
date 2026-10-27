# Daily Evidence Log: Day 01

**Date:** 2026-10-26
**Day / topic:** Day 01 - Requirements and SDLC
**Objective:** Understand the problem and define what successful completion means for the Service Request Management System.

---

## What I learned

- **SDLC:** requirements, design, build, test, release and maintenance, and why requirements come first.
- **User stories:** the "As a / I want / so that" format, and how acceptance criteria (Given / When / Then) make a story testable.
- **Functional vs non-functional requirements:** what the system does vs how well it must do it (validation, security, reliability, maintainability).
- **Scope and prioritisation:** separating MVP from future improvements, and deciding what fits a two-week project.
- **Definition of done:** a feature is done when it is implemented, validated on the server, tested, documented, reviewed and free of secrets.

## What I implemented

- Wrote the problem statement and identified the users (requester, request handler, developer/operator).
- Wrote 8 user stories (US-01 to US-08) with acceptance criteria.
- Wrote functional requirements (FR-01 to FR-18) and non-functional requirements (NFR-01 to NFR-16).
- Created a backlog with 8 MVP items and 10 future items (F-01 to F-10).
- Created a Trello board with the lists Backlog (Future), MVP Backlog, In Progress, Testing / Review and Done. Each user story is a card with an acceptance criteria checklist, and cards carry priority and release labels.
- Documented scope decisions and assumptions, including that authentication is out of the MVP.

## Files / folders changed

- `docs/requirements.md`
- `evidence/Day-01/daily-log.md`
- `evidence/Day-01/backlog-board.png` (screenshot of the Trello board)
- `README.md`
- `.gitignore` (includes `.env`)

## How I tested it

Day 01 has no code to run. I checked that:

- Every user story has at least one specific, testable acceptance criterion.
- Every MVP story includes a failure or invalid-input case where relevant.
- Each functional requirement maps back to a user story.
- A reviewer can read `requirements.md` and see what the MVP must do and how each requirement will be verified.

## Evidence links (screenshots, tests, diagrams)

- Requirements document: `docs/requirements.md`
- Backlog board screenshot: `evidence/Day-01/backlog-board.png`
- Trello board: https://trello.com/b/UcGn5JfV/service-request-management-system

## Problem encountered

Authentication is a normal part of a request system, but it does not fit in a two-week scope.

## How I investigated it

I reviewed the minimum features in the training guide and found that the core workflow (create, list, view, update status, validate, persist) does not depend on knowing who the user is. The guide also asks for authorization needs to be reviewed on Day 9 and for known limitations to be listed.

## Root cause

The scope is limited to two weeks, so adding login, sessions and role enforcement would crowd out the required work on architecture, testing and documentation.

## How I fixed it

I made a design decision to leave authentication out of the MVP and recorded it as future item F-01, with assignment of requests (F-05) depending on it. I documented the limitation in `requirements.md`: all users can perform all actions, roles are descriptive only, and the system is for training use only.

## What I would improve

- Add a requirements traceability table linking each user story to its tests once tests exist.
- Review the acceptance criteria with my supervisor to confirm the MVP scope.
- Rename the Trello labels so the colours are readable in screenshots.

## GitHub

- **GitHub branch:** `docs/day-01-requirements`
- **Pull request:** _(add link, or write "not opened" if your supervisor did not ask for one)_
- **Commit hash:** _(add the output of `git rev-parse --short HEAD` after you commit)_

## Blockers / questions for supervisor

- Is it acceptable to leave authentication out of the MVP and document it as a known limitation?
- Should I commit directly to `main` or use a feature branch and pull request for the documentation commit?

---

## Daily evidence checklist

- [ ] Code or documentation pushed to GitHub
- [ ] README or daily notes updated
- [ ] Relevant tests run and results recorded (not applicable for Day 01)
- [ ] Screenshots saved under `evidence/Day-01/`
- [ ] Bug or blocker documented honestly
- [ ] Commit hash and pull request link recorded
- [ ] No secrets, private data or misleading evidence included
