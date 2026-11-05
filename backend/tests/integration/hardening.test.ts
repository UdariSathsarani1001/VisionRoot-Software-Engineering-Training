/**
 * Hardening tests (Day 09)
 *
 * Covers:
 * - 413 for bodies larger than the 10 kb limit
 * - 400 VALIDATION_ERROR for malformed JSON (not 500)
 * - Security headers on every response (helmet)
 * - Health endpoint body contains only `status`
 */

import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import app from '../../src/app';
import { closeDatabase } from '../helpers/db';

afterAll(closeDatabase);

// ---------------------------------------------------------------------------
// Body size limit
// ---------------------------------------------------------------------------
describe('body size limit', () => {
  it('returns 413 with standard error shape for an oversized body', async () => {
    // Build a body that is clearly over the 10 kb limit.
    const bigBody = JSON.stringify({
      title: 'Test',
      description: 'x'.repeat(20_000),
      category: 'IT',
      priority: 'LOW',
    });

    const res = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send(bigBody);

    expect(res.status).toBe(413);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
    expect(res.body.error.message).toBeDefined();
    // Must not leak stack traces or internal paths
    expect(JSON.stringify(res.body)).not.toMatch(/at .+\.ts/);
    expect(JSON.stringify(res.body)).not.toMatch(/stack/);
  });

  it('413 response has no stack trace in any field', async () => {
    const bigBody = 'x'.repeat(15_000);
    const res = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send(`{"description":"${bigBody}"}`);

    expect(res.status).toBe(413);
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/Error:/);
    expect(body).not.toMatch(/node_modules/);
  });
});

// ---------------------------------------------------------------------------
// Malformed JSON
// ---------------------------------------------------------------------------
describe('malformed JSON', () => {
  it('returns 400 VALIDATION_ERROR for malformed JSON (not 500)', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send('{ "title": ');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('malformed JSON response has no stack trace', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send('{bad json}');

    expect(res.status).toBe(400);
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/at .+\.ts/);
    expect(body).not.toMatch(/stack/);
  });
});

// ---------------------------------------------------------------------------
// Security headers (helmet)
// ---------------------------------------------------------------------------
describe('security headers', () => {
  const endpoints = [
    { method: 'get', path: '/api/health' },
    { method: 'get', path: '/api/requests' },
    { method: 'get', path: '/api/unknown' },
  ] as const;

  it.each(endpoints)(
    '$method $path has x-content-type-options: nosniff',
    async ({ method, path }) => {
      const res = await request(app)[method](path);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    },
  );

  it.each(endpoints)(
    '$method $path does not expose x-powered-by',
    async ({ method, path }) => {
      const res = await request(app)[method](path);
      expect(res.headers['x-powered-by']).toBeUndefined();
    },
  );

  it('POST /api/requests has x-content-type-options: nosniff', async () => {
    const res = await request(app).post('/api/requests').send({});
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Health endpoint shape
// ---------------------------------------------------------------------------
describe('health endpoint shape', () => {
  it('GET /api/health body contains only the status field', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    // The response must be exactly { status: 'ok' } — no extra fields
    expect(Object.keys(res.body)).toEqual(['status']);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/health reveals no internal details', async () => {
    const res = await request(app).get('/api/health');
    const body = JSON.stringify(res.body);
    // Must not leak version, hostname, error text, or connection details
    expect(body).not.toMatch(/version/);
    expect(body).not.toMatch(/host/);
    expect(body).not.toMatch(/postgresql/i);
    expect(body).not.toMatch(/error/i);
  });
});
