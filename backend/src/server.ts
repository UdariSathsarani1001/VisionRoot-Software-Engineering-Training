import app from './app';
import { env } from './config/environment';
import { pool } from './database/connection';
import { logger } from './middleware/request-logger';

const server = app.listen(env.port, () => {
  logger.info(`Backend running on port ${env.port} [${env.nodeEnv}]`);
});

// Graceful shutdown: close the database pool so the process exits cleanly.
function shutdown(signal: string): void {
  logger.info(`[server] Received ${signal}. Shutting down…`);
  server.close(async () => {
    await pool.end();
    logger.info('[server] Database pool closed. Exiting.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
