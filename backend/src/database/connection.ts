import { Pool } from 'pg';
import { env } from '../config/environment';
import { logger } from '../middleware/request-logger';

// One shared pool for the entire application.
export const pool = new Pool({ connectionString: env.databaseUrl });

// Log idle-client errors so a background failure does not crash the process.
// Never log the connection string or any credential.
pool.on('error', (err) => {
  logger.error(
    { type: err.constructor.name },
    `[database] Unexpected idle client error: ${err.message}`,
  );
});

/**
 * Verify that the database is reachable.
 * Returns true on success, false on any failure.
 * Never throws.
 */
export async function checkDatabaseConnectivity(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
