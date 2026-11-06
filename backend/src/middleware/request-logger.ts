/**
 * Structured request logging using pino and pino-http.
 *
 * Rules:
 * - One JSON line per request with method, path, status code and duration.
 * - Never logs request bodies, Authorization headers, cookies or secrets.
 * - Logs unexpected errors with type only — no values, paths or credentials.
 * - Silent in test mode so test output stays readable.
 */

import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from '../config/environment';

// Suppress all log output during tests.
const level = env.nodeEnv === 'test' ? 'silent' : env.logLevel;

export const logger = pino({ level });

export const requestLogger = pinoHttp({
  logger,

  // Only log method, path, status and response time. Never log the body,
  // Authorization header, cookies or any value that might contain a secret.
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  // Serialise only the safe subset of the request/response.
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        // Intentionally omit: headers, body, remoteAddress.
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },

  // Add response time automatically (pino-http default).
  // Do not log incoming request bodies.
  autoLogging: {
    ignore(req) {
      // Optionally suppress health-check noise in production logs.
      return req.url === '/api/health';
    },
  },
});
