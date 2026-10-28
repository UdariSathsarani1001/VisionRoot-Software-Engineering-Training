# ADR-001: Use a modular monolith architecture

**Status:** Accepted
**Date:** 2026-10-27
**Related:** [architecture.md](../architecture.md) · [requirements.md](../requirements.md)

## Context

We are building a small Service Request Management System in two weeks. It has one main entity (a service request), five API endpoints, and one database. The stack is Next.js, Express.js, TypeScript and PostgreSQL.

We need an architecture that is simple to build, test and explain, with clear responsibilities between the frontend, backend and database. The system has no authentication and no external services in the MVP.

## Decision

We will use a **modular monolith**:

- One Next.js frontend.
- One Express.js backend API that is deployed as a single unit.
- One PostgreSQL database.

Inside the backend, code is split into layers: **controller → service → repository**. Validation happens in the controller, business rules (such as status transitions) in the service, and database access in the repository.

## Alternatives considered

| Option | Why it was not chosen |
|---|---|
| **Microservices** | Adds network failures, separate deployments, monitoring and data-consistency problems. Too much for a small project with one entity. |
| **Serverless functions** | Adds cloud setup and cold-start concerns, and makes local development and testing harder. Not needed for this scope. |
| **Next.js API routes only (no separate Express backend)** | Simpler, but it mixes UI and API code and does not show the backend layering the training project asks us to practise. |
| **Single file / no layers** | Quickest to start, but business rules, validation and SQL would be mixed together, making the code hard to test and change. |

## Consequences

**Easier**
- Simple to build, run and debug as one backend.
- Each layer has one job, so code is easier to read and test.
- Business rules can be unit tested without a database or HTTP.

**Harder or more expensive**
- The whole backend deploys and scales as one unit, so parts cannot scale independently.
- The layers add some extra files and boilerplate for a small project.
- The team must keep the layers disciplined, because a monolith can become messy if boundaries are ignored.

**Known risk**
- The MVP has no authentication, so anyone who can reach the app can change any request. This is accepted for local/training use only (see F-01 in the backlog).

## Review trigger

Reconsider this decision if:

- Parts of the system need to scale or deploy independently.
- More than one team starts working on separate modules.
- A feature needs an external service or a very different technology.
- The system moves toward real production use.
