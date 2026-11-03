import app from './app';
import { env } from './config/environment';
import { pool } from './database/connection';

const server = app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});

// Graceful shutdown: close the database pool so the process exits cleanly.
function shutdown(signal: string): void {
  console.log(`[server] Received ${signal}. Shutting down…`);
  server.close(async () => {
    await pool.end();
    console.log('[server] Database pool closed. Exiting.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
