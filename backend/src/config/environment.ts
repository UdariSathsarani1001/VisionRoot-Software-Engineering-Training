import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Copy backend/.env.example to backend/.env and fill in the value.`,
    );
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: requireEnv('DATABASE_URL'),
  // Origin the browser frontend is served from. Required to allow CORS.
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
