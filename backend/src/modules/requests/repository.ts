import { pool } from '../../database/connection';
import { CreateRequestInput, ServiceRequest, Status } from './types';

// Map a raw database row to the ServiceRequest shape.
// The pg driver returns timestamptz as a Date object; convert to ISO 8601.
function rowToRequest(row: Record<string, unknown>): ServiceRequest {
  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    category: row.category as ServiceRequest['category'],
    priority: row.priority as ServiceRequest['priority'],
    status: row.status as ServiceRequest['status'],
    created_at: (row.created_at as Date).toISOString(),
    updated_at: (row.updated_at as Date).toISOString(),
  };
}

export async function create(
  input: CreateRequestInput,
): Promise<ServiceRequest> {
  const result = await pool.query<Record<string, unknown>>(
    `INSERT INTO requests (title, description, category, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.title, input.description, input.category, input.priority],
  );
  return rowToRequest(result.rows[0]);
}

export async function findAll(status?: Status): Promise<ServiceRequest[]> {
  if (status) {
    const result = await pool.query<Record<string, unknown>>(
      `SELECT * FROM requests
       WHERE status = $1
       ORDER BY created_at DESC, id DESC`,
      [status],
    );
    return result.rows.map(rowToRequest);
  }

  const result = await pool.query<Record<string, unknown>>(
    `SELECT * FROM requests
     ORDER BY created_at DESC, id DESC`,
  );
  return result.rows.map(rowToRequest);
}

export async function findById(id: number): Promise<ServiceRequest | null> {
  const result = await pool.query<Record<string, unknown>>(
    `SELECT * FROM requests WHERE id = $1`,
    [id],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return rowToRequest(result.rows[0]);
}

/**
 * Atomically update the status, but only when the current status matches
 * `expectedStatus`. This prevents two concurrent requests from skipping a
 * transition step.
 *
 * Returns the updated row, or null if no row matched (concurrent update).
 */
export async function updateStatus(
  id: number,
  newStatus: Status,
  expectedStatus: Status,
): Promise<ServiceRequest | null> {
  const result = await pool.query<Record<string, unknown>>(
    `UPDATE requests
     SET status = $2, updated_at = now()
     WHERE id = $1 AND status = $3
     RETURNING *`,
    [id, newStatus, expectedStatus],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return rowToRequest(result.rows[0]);
}
