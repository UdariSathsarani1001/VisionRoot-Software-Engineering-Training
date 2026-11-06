# Release Notes

## Version: `v1.0.0-training`

## Highlights

- Create, list and filter service requests through a simple internal management interface.
- View detailed request records and update status through the `OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED` workflow.
- Persist request data in PostgreSQL using migrations and parameterised database queries.
- Validate request payloads and path/query parameters on the server with consistent JSON error responses.
- Expose a health check that reports database availability and safe failure states.

## Quality and reliability

- Backend tests cover validation, service logic and API integration.
- Logging is structured and JSON-based, with secrets suppressed from the request logs.
- Production-like validation includes secure headers, request-size limits and startup config checks.

## Known limitations

- No authentication or authorization is implemented.
- No audit trail exists for who changed a request or when each status update occurred.
- No rate limiting or CI pipeline is configured.
- This project remains a local/training deployment and is not approved for real production use.

## How to run

See the main project README and the deployment guide in `docs/deployment.md`.
