import { pool } from '../../src/database/connection';

export async function resetDatabase() {
  await pool.query('TRUNCATE requests RESTART IDENTITY');
}

export async function closeDatabase() {
  await pool.end();
}

export async function setStatusInDb(id: number, status: string) {
  await pool.query('UPDATE requests SET status = $1 WHERE id = $2', [
    status,
    id,
  ]);
}

export async function getStatusFromDb(id: number): Promise<string | undefined> {
  const result = await pool.query('SELECT status FROM requests WHERE id = $1', [
    id,
  ]);
  return result.rows[0]?.status;
}

export async function countRequests(): Promise<number> {
  const result = await pool.query(
    'SELECT count(*)::int AS count FROM requests',
  );
  return result.rows[0].count;
}
