"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
// Load .env before importing env config so DATABASE_URL is available.
require("dotenv/config");
const environment_1 = require("../config/environment");
const MIGRATIONS_DIR = path_1.default.resolve(__dirname, '../../../database/migrations');
async function runMigrations() {
    const pool = new pg_1.Pool({ connectionString: environment_1.env.databaseUrl });
    try {
        // Ensure the tracking table exists.
        await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename  text        NOT NULL PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);
        // Find all .sql files, sorted by filename so they run in order.
        const files = fs_1.default
            .readdirSync(MIGRATIONS_DIR)
            .filter((f) => f.endsWith('.sql'))
            .sort();
        if (files.length === 0) {
            console.log('[migrate] No migration files found.');
            return;
        }
        // Fetch already-applied migrations.
        const result = await pool.query('SELECT filename FROM schema_migrations');
        const applied = new Set(result.rows.map((r) => r.filename));
        let newCount = 0;
        for (const file of files) {
            if (applied.has(file)) {
                console.log(`[migrate] Skipping (already applied): ${file}`);
                continue;
            }
            const filePath = path_1.default.join(MIGRATIONS_DIR, file);
            const sql = fs_1.default.readFileSync(filePath, 'utf-8');
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                await client.query(sql);
                await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
                await client.query('COMMIT');
                console.log(`[migrate] Applied: ${file}`);
                newCount++;
            }
            catch (err) {
                await client.query('ROLLBACK');
                const message = err instanceof Error ? err.message : String(err);
                console.error(`[migrate] FAILED: ${file} — ${message}`);
                process.exit(1);
            }
            finally {
                client.release();
            }
        }
        if (newCount === 0) {
            console.log('[migrate] Nothing to apply. Database is up to date.');
        }
        else {
            console.log(`[migrate] Done. Applied ${newCount} migration(s).`);
        }
    }
    finally {
        await pool.end();
    }
}
runMigrations().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[migrate] Fatal error:', message);
    process.exit(1);
});
