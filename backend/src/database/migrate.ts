/**
 * Migration runner.
 *
 * Usage: npm run migrate
 *
 * - Reads numbered .sql files from database/migrations/ (repository root).
 * - Creates schema_migrations if it does not exist.
 * - Applies each unapplied file inside a transaction.
 * - Running it twice is safe: the second run applies nothing.
 */

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Load .env before importing env config so DATABASE_URL is available.
import 'dotenv/config';
import { env } from '../config/environment';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../../database/migrations');

export async function runMigrations(
  databaseUrl: string = env.databaseUrl,
): Promise<void> {
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Ensure the tracking table exists.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename  text        NOT NULL PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    // Find all .sql files, sorted by filename so they run in order.
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('[migrate] No migration files found.');
      return;
    }

    // Fetch already-applied migrations.
    const result = await pool.query<{ filename: string }>(
      'SELECT filename FROM schema_migrations',
    );
    const applied = new Set(result.rows.map((r) => r.filename));

    let newCount = 0;

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrate] Skipping (already applied): ${file}`);
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file],
        );
        await client.query('COMMIT');
        console.log(`[migrate] Applied: ${file}`);
        newCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[migrate] FAILED: ${file} — ${message}`);
        throw err;
      } finally {
        client.release();
      }
    }

    if (newCount === 0) {
      console.log('[migrate] Nothing to apply. Database is up to date.');
    } else {
      console.log(`[migrate] Done. Applied ${newCount} migration(s).`);
    }
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[migrate] Fatal error:', message);
    process.exitCode = 1;
  });
}
