# API Contract: Service Request Management System

**Related:** [requirements.md](requirements.md) · [architecture.md](architecture.md) · [data-model.md](data-model.md)

## 1. Overview

- **Base path:** `/api`
- **Format:** JSON for all requests and responses
- **Authentication:** none in the MVP (see Assumptions and Limitations in `requirements.md`)

## 2. Endpoints

| Method | Path | Purpose | Success | Errors |
|---|---|---|---|---|
| POST | `/api/requests` | Create a request | 201 | 400 |
| GET | `/api/requests` | List requests (optional status filter) | 200 | 400 |
| GET | `/api/requests/{id}` | Get one request | 200 | 400, 404 |
| PATCH | `/api/requests/{id}/status` | Change status | 200 | 400, 404 |
| GET | `/api/health` | Health check | 200 | 503 |

## 3. Request object

```json
{
  "id": 1,
  "title": "Laptop will not start",
  "description": "The laptop shows a black screen after pressing the power button.",
  "category": "IT",
  "priority": "HIGH",
  "status": "OPEN",
  "created_at": "2026-10-27T09:15:00Z",
  "updated_at": "2026-10-27T09:15:00Z"
}
```

| Field | Rules |
|---|---|
| `id` | Integer, set by the server |
| `title` | Required, 3 to 100 characters (trimmed) |
| `description` | Required, 1 to 1000 characters |
| `category` | Required: `IT`, `Facilities` or `Other` |
| `priority` | Required: `LOW`, `MEDIUM` or `HIGH` |
| `status` | `OPEN`, `IN_PROGRESS`, `RESOLVED` or `CLOSED`. New requests start as `OPEN` |
| `created_at`, `updated_at` | Set by the server. The client cannot send them |

## 4. Create a request

`POST /api/requests`

**Request body**

```json
{
  "title": "Laptop will not start",
  "description": "The laptop shows a black screen after pressing the power button.",
  "category": "IT",
  "priority": "HIGH"
}
```

**Success: 201 Created**

```json
{
  "id": 1,
  "title": "Laptop will not start",
  "description": "The laptop shows a black screen after pressing the power button.",
  "category": "IT",
  "priority": "HIGH",
  "status": "OPEN",
  "created_at": "2026-10-27T09:15:00Z",
  "updated_at": "2026-10-27T09:15:00Z"
}
```

**Error: 400 Bad Request** (for example, an empty title)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "title", "message": "Title must be 3 to 100 characters" }
    ]
  }
}
```

## 5. List requests

`GET /api/requests`
`GET /api/requests?status=OPEN`

| Query parameter | Required | Values |
|---|---|---|
| `status` | No | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |

**Success: 200 OK**

```json
[
  {
    "id": 1,
    "title": "Laptop will not start",
    "description": "The laptop shows a black screen after pressing the power button.",
    "category": "IT",
    "priority": "HIGH",
    "status": "OPEN",
    "created_at": "2026-10-27T09:15:00Z",
    "updated_at": "2026-10-27T09:15:00Z"
  }
]
```

If no requests match, the response is `200 OK` with an empty list: `[]`. The frontend shows the empty-state message.

**Error: 400 Bad Request** (for example, `?status=DONE`)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid status filter"
  }
}
```

## 6. Get one request

`GET /api/requests/{id}`

**Success: 200 OK:** returns the request object (see section 3).

**Error: 404 Not Found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Request not found"
  }
}
```

**Error: 400 Bad Request:** returned if `id` is not a valid number.

## 7. Update status

`PATCH /api/requests/{id}/status`

**Request body**

```json
{
  "status": "IN_PROGRESS"
}
```

**Allowed transitions**

| From | To |
|---|---|
| `OPEN` | `IN_PROGRESS` |
| `IN_PROGRESS` | `RESOLVED` |
| `RESOLVED` | `CLOSED` |

**Success: 200 OK:** returns the updated request with a new `updated_at`.

**Error: 400 Bad Request** (invalid transition, for example `OPEN` to `CLOSED`)

```json
{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Cannot change status from OPEN to CLOSED"
  }
}
```

**Error: 404 Not Found:** same format as section 6.

## 8. Health check

`GET /api/health`

**Success: 200 OK** (the API is running and the database is reachable)

```json
{
  "status": "ok"
}
```

**Error: 503 Service Unavailable** (the database cannot be reached)

```json
{
  "status": "unavailable"
}
```

## 9. Error format

Every error uses the same structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Short, safe description",
    "details": []
  }
}
```

| HTTP status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Missing or invalid input |
| 400 | `INVALID_TRANSITION` | Status change not allowed |
| 404 | `NOT_FOUND` | Request id does not exist |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

`details` is optional and only used for field-level validation errors. Error responses never include stack traces, credentials or private data.

## 10. Traceability

| Endpoint | User story | Requirements |
|---|---|---|
| `POST /api/requests` | US-01 | FR-01 to FR-05, FR-14 |
| `GET /api/requests` | US-02 | FR-06 to FR-08 |
| `GET /api/requests/{id}` | US-03 | FR-09 |
| `PATCH /api/requests/{id}/status` | US-04 | FR-10 to FR-13 |
| All endpoints (errors) | US-05 | FR-14, FR-15 |
| `GET /api/health` | US-07 | FR-17 |
