"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
/**
 * Validates that an environment variable is present. Exits the process with a
 * clear message that names the missing variable but never prints any value.
 */
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        console.error(`[config] Missing required environment variable: ${key}. ` +
            `Copy backend/.env.example to backend/.env and fill in the value.`);
        process.exit(1);
    }
    return value;
}
/** Parse PORT; exit if it is not a usable integer. */
function parsePort(raw) {
    if (raw === undefined || raw === '')
        return 4000;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
        console.error(`[config] PORT must be an integer between 1 and 65535, got: "${raw}"`);
        process.exit(1);
    }
    return n;
}
/** Parse NODE_ENV; exit if it is not one of the allowed values. */
function parseNodeEnv(raw) {
    const allowed = ['development', 'production', 'test'];
    const value = raw || 'development';
    if (!allowed.includes(value)) {
        console.error(`[config] NODE_ENV must be one of: ${allowed.join(', ')}, got: "${value}"`);
        process.exit(1);
    }
    return value;
}
/** Parse LOG_LEVEL; default to 'info'. */
function parseLogLevel(raw) {
    const allowed = [
        'trace',
        'debug',
        'info',
        'warn',
        'error',
        'silent',
    ];
    const value = raw || 'info';
    if (!allowed.includes(value)) {
        console.error(`[config] LOG_LEVEL must be one of: ${allowed.join(', ')}, got: "${value}"`);
        process.exit(1);
    }
    return value;
}
const nodeEnv = parseNodeEnv(process.env.NODE_ENV);
// In production, CORS_ORIGIN must be explicitly set (never '*').
function parseCorsOrigin(raw, env) {
    if (env === 'production') {
        if (!raw || raw === '*') {
            console.error('[config] CORS_ORIGIN is required in production and must not be "*".');
            process.exit(1);
        }
        return raw;
    }
    return raw || 'http://localhost:3000';
}
exports.env = {
    port: parsePort(process.env.PORT),
    nodeEnv,
    // TEST_DATABASE_URL is handled by tests/setup.ts, not by the app itself.
    databaseUrl: requireEnv('DATABASE_URL'),
    corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN, nodeEnv),
    logLevel: parseLogLevel(process.env.LOG_LEVEL),
};
