import 'dotenv/config';

const testUrl = process.env.TEST_DATABASE_URL;
const devUrl = process.env.DATABASE_URL;

if (!testUrl) {
  throw new Error(
    'TEST_DATABASE_URL is not set. Tests need a separate test database.',
  );
}
if (testUrl === devUrl) {
  throw new Error('TEST_DATABASE_URL must not be the same as DATABASE_URL.');
}
const dbName = new URL(testUrl).pathname.replace('/', '');
if (!dbName.includes('test')) {
  throw new Error(
    `Refusing to run: database name "${dbName}" must contain "test".`,
  );
}

process.env.DATABASE_URL = testUrl;
process.env.NODE_ENV = 'test';
