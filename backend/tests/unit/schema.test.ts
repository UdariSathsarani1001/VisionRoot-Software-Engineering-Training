import { describe, expect, it } from 'vitest';
import {
  createRequestSchema,
  listRequestsQuerySchema,
  requestIdSchema,
  updateStatusSchema,
} from '../../src/modules/requests/schema';

const valid = {
  title: 'Laptop will not start',
  description: 'Black screen after pressing the power button.',
  category: 'IT',
  priority: 'HIGH',
};

describe('createRequestSchema', () => {
  it('accepts a valid body', () => {
    expect(createRequestSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['empty', '', false],
    ['whitespace only', '   ', false],
    ['2 characters', 'ab', false],
    ['3 characters', 'abc', true],
    ['100 characters', 'a'.repeat(100), true],
    ['101 characters', 'a'.repeat(101), false],
  ])('title: %s', (_label, title, ok) => {
    expect(createRequestSchema.safeParse({ ...valid, title }).success).toBe(ok);
  });

  it('trims the title', () => {
    const result = createRequestSchema.safeParse({
      ...valid,
      title: '  abc  ',
    });
    expect(result.success && result.data.title).toBe('abc');
  });

  it.each([
    ['empty', '', false],
    ['1 character', 'a', true],
    ['1000 characters', 'a'.repeat(1000), true],
    ['1001 characters', 'a'.repeat(1001), false],
  ])('description: %s', (_label, description, ok) => {
    expect(
      createRequestSchema.safeParse({ ...valid, description }).success,
    ).toBe(ok);
  });

  it('rejects a missing description', () => {
    const body = {
      title: valid.title,
      category: valid.category,
      priority: valid.priority,
    };
    expect(createRequestSchema.safeParse(body).success).toBe(false);
  });

  it.each([
    ['IT', true],
    ['Facilities', true],
    ['Other', true],
    ['Finance', false],
    ['it', false],
    ['', false],
  ])('category: %s', (category, ok) => {
    expect(createRequestSchema.safeParse({ ...valid, category }).success).toBe(
      ok,
    );
  });

  it.each([
    ['LOW', true],
    ['MEDIUM', true],
    ['HIGH', true],
    ['URGENT', false],
    ['high', false],
  ])('priority: %s', (priority, ok) => {
    expect(createRequestSchema.safeParse({ ...valid, priority }).success).toBe(
      ok,
    );
  });
});

describe('updateStatusSchema', () => {
  it.each([
    ['OPEN', true],
    ['IN_PROGRESS', true],
    ['RESOLVED', true],
    ['CLOSED', true],
    ['DONE', false],
    ['', false],
  ])('status: %s', (status, ok) => {
    expect(updateStatusSchema.safeParse({ status }).success).toBe(ok);
  });

  it('rejects a missing status', () => {
    expect(updateStatusSchema.safeParse({}).success).toBe(false);
  });
});

describe('listRequestsQuerySchema', () => {
  it('accepts no filter and a valid filter', () => {
    expect(listRequestsQuerySchema.safeParse({}).success).toBe(true);
    expect(listRequestsQuerySchema.safeParse({ status: 'OPEN' }).success).toBe(
      true,
    );
  });

  it('rejects an invalid filter', () => {
    expect(listRequestsQuerySchema.safeParse({ status: 'DONE' }).success).toBe(
      false,
    );
  });
});

describe('requestIdSchema', () => {
  it.each([
    ['1', true],
    ['2147483647', true],
    ['2147483648', false],
    ['0', false],
    ['-1', false],
    ['1.5', false],
    ['abc', false],
  ])('id: %s', (id, ok) => {
    expect(requestIdSchema.safeParse(id).success).toBe(ok);
  });
});
