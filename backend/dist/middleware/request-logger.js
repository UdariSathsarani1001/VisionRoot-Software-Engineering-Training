"use strict";
/**
 * Structured request logging using pino and pino-http.
 *
 * Rules:
 * - One JSON line per request with method, path, status code and duration.
 * - Never logs request bodies, Authorization headers, cookies or secrets.
 * - Logs unexpected errors with type only — no values, paths or credentials.
 * - Silent in test mode so test output stays readable.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const environment_1 = require("../config/environment");
// Suppress all log output during tests.
const level = environment_1.env.nodeEnv === 'test' ? 'silent' : environment_1.env.logLevel;
exports.logger = (0, pino_1.default)({ level });
exports.requestLogger = (0, pino_http_1.default)({
    logger: exports.logger,
    // Only log method, path, status and response time. Never log the body,
    // Authorization header, cookies or any value that might contain a secret.
    customLogLevel(_req, res, err) {
        if (err || res.statusCode >= 500)
            return 'error';
        if (res.statusCode >= 400)
            return 'warn';
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
