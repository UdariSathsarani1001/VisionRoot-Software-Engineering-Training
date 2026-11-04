import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/app';
import { runMigrations } from '../../src/database/migrate';
import {
  closeDatabase,
  countRequests,
  getStatusFromDb,
  resetDatabase,
  setStatusInDb,
} from '../helpers/db';

const validBody = {
  title: 'Laptop will not start',
  description: 'Black screen after pressing the power button.',
  category: 'IT',
  priority: 'HIGH',
};

type Created = {
  id: number;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
};

async function createViaApi(
  overrides: Record<string, unknown> = {},
): Promise<Created> {
  const res = await request(app)
    .post('/api/requests')
    .send({ ...validBody, ...overrides });
  expect(res.status).toBe(201);
  return res.body;
}

const patch = (id: number | string, status: unknown) =>
  request(app).patch(`/api/requests/${id}/status`).send({ status });

beforeAll(() => runMigrations());
beforeEach(resetDatabase);
afterAll(closeDatabase);

describe('POST /api/requests', () => {
  it('creates a request with status OPEN and timestamps', async () => {
    const res = await request(app).post('/api/requests').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('OPEN');
    expect(typeof res.body.id).toBe('number');
    expect(Number.isNaN(Date.parse(res.body.created_at))).toBe(false);
    expect(Number.isNaN(Date.parse(res.body.updated_at))).toBe(false);
    expect(await getStatusFromDb(res.body.id)).toBe('OPEN');
  });

  it('returns 400 and the field name for an empty title', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...validBody, title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(
      res.body.error.details.some(
        (d: { field: string }) => d.field === 'title',
      ),
    ).toBe(true);
  });

  it.each([
    ['title too short', { title: 'ab' }],
    ['title too long', { title: 'a'.repeat(101) }],
    ['invalid category', { category: 'Finance' }],
    ['invalid priority', { priority: 'URGENT' }],
    ['missing description', { description: undefined }],
  ])('rejects %s and saves nothing', async (_label, overrides) => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...validBody, ...overrides });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(await countRequests()).toBe(0);
  });

  it('rejects a client-supplied status', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...validBody, status: 'CLOSED' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(await countRequests()).toBe(0);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send('{ "title": ');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/requests', () => {
  it('returns an empty list when there is no data', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns requests newest first', async () => {
    await createViaApi({ title: 'First request' });
    await createViaApi({ title: 'Second request' });
    const res = await request(app).get('/api/requests');
    expect(res.status).toBe(200);
    expect(res.body.map((r: Created) => r.title)).toEqual([
      'Second request',
      'First request',
    ]);
  });

  it('filters by status', async () => {
    await createViaApi({ title: 'Stays open' });
    const other = await createViaApi({ title: 'In progress one' });
    await setStatusInDb(other.id, 'IN_PROGRESS');

    const res = await request(app).get('/api/requests?status=IN_PROGRESS');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('In progress one');
  });

  it('returns 400 for an invalid status filter', async () => {
    const res = await request(app).get('/api/requests?status=DONE');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/requests/:id', () => {
  it('returns an existing request', async () => {
    const created = await createViaApi();
    const res = await request(app).get(`/api/requests/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.id,
      title: validBody.title,
      status: 'OPEN',
    });
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/requests/999999');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it.each(['abc', '0', '-1', '1.5', '99999999999'])(
    'returns 400, not 500, for id "%s"',
    async (id) => {
      const res = await request(app).get(`/api/requests/${id}`);
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    },
  );
});

describe('PATCH /api/requests/:id/status', () => {
  it('applies a valid transition and updates updated_at', async () => {
    const created = await createViaApi();
    const res = await patch(created.id, 'IN_PROGRESS');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_PROGRESS');
    expect(Date.parse(res.body.updated_at)).toBeGreaterThanOrEqual(
      Date.parse(created.updated_at),
    );
    expect(await getStatusFromDb(created.id)).toBe('IN_PROGRESS');
  });

  it.each([
    ['OPEN', 'CLOSED'],
    ['OPEN', 'RESOLVED'],
    ['OPEN', 'OPEN'],
    ['IN_PROGRESS', 'OPEN'],
    ['IN_PROGRESS', 'CLOSED'],
    ['RESOLVED', 'IN_PROGRESS'],
    ['CLOSED', 'OPEN'],
    ['CLOSED', 'CLOSED'],
  ] as const)(
    'rejects %s -> %s and leaves the status unchanged',
    async (from, to) => {
      const created = await createViaApi();
      await setStatusInDb(created.id, from);
      const res = await patch(created.id, to);
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_TRANSITION');
      expect(await getStatusFromDb(created.id)).toBe(from);
    },
  );

  it('rejects an invalid status value', async () => {
    const created = await createViaApi();
    const res = await patch(created.id, 'DONE');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a missing status', async () => {
    const created = await createViaApi();
    const res = await request(app)
      .patch(`/api/requests/${created.id}/status`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await patch(999999, 'IN_PROGRESS');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 400 for an invalid id', async () => {
    const res = await patch('abc', 'IN_PROGRESS');
    expect(res.status).toBe(400);
  });

  it('moves a request through the whole workflow in order', async () => {
    const created = await createViaApi();
    for (const status of ['IN_PROGRESS', 'RESOLVED', 'CLOSED']) {
      const res = await patch(created.id, status);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(status);
    }
    expect(await getStatusFromDb(created.id)).toBe('CLOSED');
  });
});

describe('error responses', () => {
  const failing = [
    () => request(app).post('/api/requests').send({}),
    () => request(app).get('/api/requests/999999'),
    () => request(app).get('/api/requests/abc'),
    () => request(app).get('/api/requests?status=DONE'),
    () => request(app).get('/api/unknown'),
  ];

  it.each(failing.map((call, i) => [i, call] as const))(
    'case %s uses the standard shape and leaks nothing',
    async (_i, call) => {
      const res = await call();
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.error.code).toEqual(expect.any(String));
      expect(res.body.error.message).toEqual(expect.any(String));
      expect(JSON.stringify(res.body)).not.toMatch(
        /stack|node_modules|\.ts:\d+/i,
      );
    },
  );
});
