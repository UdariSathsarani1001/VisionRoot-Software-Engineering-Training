import 'dotenv/config';

/**
 * Validates that an environment variable is present. Exits the process with a
 * clear message that names the missing variable but never prints any value.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(
      `[config] Missing required environment variable: ${key}. ` +
        `Copy backend/.env.example to backend/.env and fill in the value.`,
    );
    process.exit(1);
  }
  return value;
}

/** Parse PORT; exit if it is not a usable integer. */
function parsePort(raw: string | undefined): number {
  if (raw === undefined || raw === '') return 4000;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    console.error(
      `[config] PORT must be an integer between 1 and 65535, got: "${raw}"`,
    );
    process.exit(1);
  }
  return n;
}

/** Parse NODE_ENV; exit if it is not one of the allowed values. */
function parseNodeEnv(
  raw: string | undefined,
): 'development' | 'production' | 'test' {
  const allowed = ['development', 'production', 'test'] as const;
  const value = raw || 'development';
  if (!(allowed as readonly string[]).includes(value)) {
    console.error(
      `[config] NODE_ENV must be one of: ${allowed.join(', ')}, got: "${value}"`,
    );
    process.exit(1);
  }
  return value as 'development' | 'production' | 'test';
}

/** Parse LOG_LEVEL; default to 'info'. */
function parseLogLevel(
  raw: string | undefined,
): 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent' {
  const allowed = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'silent',
  ] as const;
  const value = raw || 'info';
  if (!(allowed as readonly string[]).includes(value)) {
    console.error(
      `[config] LOG_LEVEL must be one of: ${allowed.join(', ')}, got: "${value}"`,
    );
    process.exit(1);
  }
  return value as 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
}

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

// In production, CORS_ORIGIN must be explicitly set (never '*').
function parseCorsOrigin(raw: string | undefined, env: string): string {
  if (env === 'production') {
    if (!raw || raw === '*') {
      console.error(
        '[config] CORS_ORIGIN is required in production and must not be "*".',
      );
      process.exit(1);
    }
    return raw;
  }
  return raw || 'http://localhost:3000';
}

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv,
  // TEST_DATABASE_URL is handled by tests/setup.ts, not by the app itself.
  databaseUrl: requireEnv('DATABASE_URL'),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN, nodeEnv),
  logLevel: parseLogLevel(process.env.LOG_LEVEL),
};
