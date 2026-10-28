# Daily Evidence Log: Day 03

**Date:** 2026-10-28
**Day / topic:** Day 03 - GitHub workflow and environment setup
**Objective:** Make the project reproducible and establish a professional contribution workflow.

---

## What I learned

- **Git workflow:** status, add, commit, push, feature branches, pull requests and review, and why small commits with clear messages make work traceable.
- **Dependency management:** how `package.json` and the lock file record dependencies so another developer gets the same install.
- **Environment variables:** real values live in `.env` (never committed), and `.env.example` documents the variable names with placeholders only.
- **Lint and format tools:** ESLint finds code problems, and Prettier keeps formatting consistent.
- **README and `.gitignore`:** the README lets a new developer set up the project, and `.gitignore` keeps secrets and generated files out of Git.

## What I implemented

- Reused the existing repository and agreed folder structure from Day 01 and Day 02.
- Scaffolded the `frontend/` app (Next.js, TypeScript, ESLint, Prettier).
- Scaffolded the `backend/` app (Express, TypeScript, ESLint, Prettier) with `app.ts`, `server.ts` and `config/environment.ts`.
- Added scripts to both apps: `dev`, `build`, `start`, `lint`, `format` and `test` (placeholder).
- Added `.env.example` files with placeholder values only, and updated `.gitignore` to exclude `.env`, `node_modules/` and build output.
- Updated the README with the repository URL, default branch, prerequisites and setup steps.
- Created a feature branch, committed in small steps and opened a pull request.


## Files / folders changed

- `README.md`
- `.gitignore`
- `backend/` (`package.json`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc`, `.env.example`, `src/`)
- `frontend/` (Next.js app, `.prettierrc`, `.env.example`)
- `evidence/Day-03/daily-log.md`

## How I tested it

- Cloned the repository into a fresh folder and followed my own README steps to install and start both apps.
- Ran `npm run lint` and `npm run format` in `backend/` and `frontend/`, and fixed the errors.
- Ran `npm run build` in both apps.
- Started the backend and confirmed it prints the "running" message on the configured port, and started the frontend and opened it in the browser.
- Ran `git status` and checked the history to confirm no `.env` file or real credentials were committed.

## Evidence links (screenshots, tests, diagrams)

- README with setup steps: `README.md`
- Lint, format and build output: `evidence/Day-03/` <!-- add file names -->
- Repository tree screenshot (if requested): `evidence/Day-03/repo-tree.png`
- Pull request: _(add link)_

## Problem encountered

The Day 03 task says to create the repository, but a repository already existed from Day 01.

## How I investigated it

I checked the guide's tasks and my existing commit history. The repository already had the agreed structure (`docs/`, `evidence/`, `README.md`, `.gitignore`), and the guide's requirement is that the project is reproducible and has a clean workflow, not that a new repository is created.

## Root cause

The roadmap lists "create the repository" as a Day 03 task, but I needed a repository on Day 01 to commit my requirements, so the work was already done.

## How I fixed it

I kept the existing repository and used Day 03 to add the `frontend/` and `backend/` scaffolding, environment files and setup documentation on a new feature branch. I recorded the repository URL and default branch in the README.

## What I would improve

- Add a `.github/pull_request_template.md` so every pull request is pre-filled with the template.
- Pin the Node.js version (for example with an `.nvmrc` file) so every developer uses the same one.
- Add a short troubleshooting section to the README for common setup errors.

## GitHub

- **GitHub branch:** `chore/day-03-environment-setup`
- **Pull request:** _(add link, or write "not opened" if your supervisor did not ask for one)_
- **Commit hash:** _(add the output of `git rev-parse --short HEAD` after you commit)_

## Blockers / questions for supervisor

- Should I keep `frontend/` and `backend/` in one repository (monorepo), as in the suggested structure?
- Which Node.js version should the team use?
- Should pull requests be merged by me, or only by the supervisor after review?

---

## Daily evidence checklist

- [ ] Code or documentation pushed to GitHub
- [ ] README or daily notes updated
- [ ] Relevant tests run and results recorded (lint, format and build output)
- [ ] Screenshots saved under `evidence/Day-03/`
- [ ] Bug or blocker documented honestly
- [ ] Commit hash and pull request link recorded
- [ ] No secrets, private data or misleading evidence included
