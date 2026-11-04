"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.findById = findById;
exports.updateStatus = updateStatus;
const connection_1 = require("../../database/connection");
// Map a raw database row to the ServiceRequest shape.
// The pg driver returns timestamptz as a Date object; convert to ISO 8601.
function rowToRequest(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority,
        status: row.status,
        created_at: row.created_at.toISOString(),
        updated_at: row.updated_at.toISOString(),
    };
}
async function create(input) {
    const result = await connection_1.pool.query(`INSERT INTO requests (title, description, category, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [input.title, input.description, input.category, input.priority]);
    return rowToRequest(result.rows[0]);
}
async function findAll(status) {
    if (status) {
        const result = await connection_1.pool.query(`SELECT * FROM requests
       WHERE status = $1
       ORDER BY created_at DESC, id DESC`, [status]);
        return result.rows.map(rowToRequest);
    }
    const result = await connection_1.pool.query(`SELECT * FROM requests
     ORDER BY created_at DESC, id DESC`);
    return result.rows.map(rowToRequest);
}
async function findById(id) {
    const result = await connection_1.pool.query(`SELECT * FROM requests WHERE id = $1`, [id]);
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
async function updateStatus(id, newStatus, expectedStatus) {
    const result = await connection_1.pool.query(`UPDATE requests
     SET status = $2, updated_at = now()
     WHERE id = $1 AND status = $3
     RETURNING *`, [id, newStatus, expectedStatus]);
    if (result.rows.length === 0) {
        return null;
    }
    return rowToRequest(result.rows[0]);
}
