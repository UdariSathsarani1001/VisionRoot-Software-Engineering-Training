# Day 10 Self-Review

## One design decision

I chose a modular monolith for this project instead of splitting the app into separate services. The codebase has one frontend, one Express API and one PostgreSQL database, but the backend is still layered into controller, service and repository responsibilities. This keeps the application easy to understand for a training project, avoids network complexity, and makes the validation and status rules plain to review. The obvious alternative was microservices, but that would have added deployment, monitoring and coordination overhead without improving the MVP.

## One bug

The main bug the project had to protect against was invalid status transitions. The root cause was that the UI and service needed to enforce the same workflow rule (`OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED`) on the server, not only as a convenience in the browser. The fix was to enforce the rule in the service and repository using a guarded update query that checks the current status before applying the change. The regression coverage lives in the integration tests, and the failure is documented in the API contract as `INVALID_TRANSITION`.

## One improvement

The best next improvement is authentication and authorization. The project has no user model, no session tokens, and no role checks. That is the most important missing component before any real use, because the current app allows any user to create, view and mutate any request. Adding a login flow, a `users` table and role-based middleware would turn the MVP into a genuinely safe internal tool.

## Known limitations

- No authentication or authorization is implemented.
- No audit history exists for which user changed a request or when a status change was made.
- There are no frontend tests, only backend coverage for the core validation and status rules.
- There is no CI pipeline or automated deployment workflow.
- The system is intended for local/training use only and is not approved for real production deployment.
- The app is protected by local configuration and environment variables, but it still depends on a local or preconfigured PostgreSQL instance.
