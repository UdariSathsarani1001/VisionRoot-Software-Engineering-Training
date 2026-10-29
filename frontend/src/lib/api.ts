/**
 * API client — mock implementation.
 *
 * All data is served from MOCK_REQUESTS in mock-data.ts.
 * Set NEXT_PUBLIC_USE_MOCK=true (already in .env.local) to enable.
 *
 * To test the error state, set NEXT_PUBLIC_MOCK_ERROR=true in .env.local,
 * or submit a request whose title starts with "error" (case-insensitive).
 *
 * On Day 07, replace the mock internals below with real fetch() calls;
 * no component changes are required because signatures stay the same.
 */

import type { Request, RequestStatus, CreateRequestInput } from '@/features/requests/types';
import { MOCK_REQUESTS } from './mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const MOCK_ERROR = process.env.NEXT_PUBLIC_MOCK_ERROR === 'true';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

/** Simulated network latency (ms) */
const MOCK_DELAY = 600;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// In-memory store so createRequest persists within the session
let store: Request[] = [...MOCK_REQUESTS];
let nextId = store.length + 1;

// --- Error class ----------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// --- Mock implementation --------------------------------------------------

async function mockListRequests(status?: RequestStatus): Promise<Request[]> {
  await delay(MOCK_DELAY);

  if (MOCK_ERROR) {
    throw new ApiError('INTERNAL_ERROR', 'Mock error: could not load requests');
  }

  if (status) {
    return store.filter((r) => r.status === status);
  }
  return [...store];
}

async function mockGetRequest(id: number): Promise<Request> {
  await delay(MOCK_DELAY);

  if (MOCK_ERROR) {
    throw new ApiError('INTERNAL_ERROR', 'Mock error: could not load request');
  }

  const req = store.find((r) => r.id === id);
  if (!req) {
    throw new ApiError('NOT_FOUND', 'Request not found');
  }
  return { ...req };
}

async function mockCreateRequest(input: CreateRequestInput): Promise<Request> {
  await delay(MOCK_DELAY);

  // Trigger error state by submitting a title that starts with "error"
  if (input.title.trim().toLowerCase().startsWith('error')) {
    throw new ApiError('INTERNAL_ERROR', 'Mock error: could not create request');
  }

  const now = new Date().toISOString();
  const created: Request = {
    id: nextId++,
    title: input.title.trim(),
    description: input.description,
    category: input.category,
    priority: input.priority,
    status: 'OPEN',
    created_at: now,
    updated_at: now,
  };
  store = [created, ...store];
  return { ...created };
}

// --- Real implementation stub (used when USE_MOCK=false) ------------------

async function realListRequests(status?: RequestStatus): Promise<Request[]> {
  const url = status
    ? `${API_URL}/requests?status=${status}`
    : `${API_URL}/requests`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body?.error?.code ?? 'INTERNAL_ERROR',
      body?.error?.message ?? 'Failed to load requests',
    );
  }
  return res.json();
}

async function realGetRequest(id: number): Promise<Request> {
  const res = await fetch(`${API_URL}/requests/${id}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body?.error?.code ?? 'INTERNAL_ERROR',
      body?.error?.message ?? 'Failed to load request',
    );
  }
  return res.json();
}

async function realCreateRequest(input: CreateRequestInput): Promise<Request> {
  const res = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body?.error?.code ?? 'INTERNAL_ERROR',
      body?.error?.message ?? 'Failed to create request',
      body?.error?.details,
    );
  }
  return res.json();
}

// --- Public API -----------------------------------------------------------

export const listRequests = USE_MOCK ? mockListRequests : realListRequests;
export const getRequest = USE_MOCK ? mockGetRequest : realGetRequest;
export const createRequest = USE_MOCK ? mockCreateRequest : realCreateRequest;
