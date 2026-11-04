/**
 * API client — real fetch implementation.
 *
 * All calls go to NEXT_PUBLIC_API_URL (which must end in /api).
 * Set NEXT_PUBLIC_USE_MOCK=true to fall back to the in-memory mock,
 * which is useful when the backend is not running locally.
 *
 * Restart the Next.js dev server after changing any NEXT_PUBLIC_ variable.
 */

import type {
  Request,
  RequestStatus,
  CreateRequestInput,
} from '@/features/requests/types';
import { MOCK_REQUESTS } from './mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

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

// --- Shared fetch helper --------------------------------------------------

/**
 * Wraps fetch and maps every failure to ApiError so callers never see raw
 * network errors or unparsed responses.
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    // fetch() itself failed — backend down, CORS blocked, no network, etc.
    throw new ApiError(
      'NETWORK_ERROR',
      'Could not reach the server. Check your connection and try again.',
    );
  }

  if (!res.ok) {
    let body: {
      error?: {
        code?: string;
        message?: string;
        details?: { field: string; message: string }[];
      };
    } = {};
    try {
      body = await res.json();
    } catch {
      // Non-JSON error body — fall through to generic message
    }
    throw new ApiError(
      body?.error?.code ?? 'INTERNAL_ERROR',
      body?.error?.message ?? `Request failed with status ${res.status}`,
      body?.error?.details,
    );
  }

  return res.json() as Promise<T>;
}

// --- Real implementation --------------------------------------------------

async function realListRequests(status?: RequestStatus): Promise<Request[]> {
  const path = status ? `/requests?status=${status}` : '/requests';
  return apiFetch<Request[]>(path);
}

async function realGetRequest(id: number): Promise<Request> {
  return apiFetch<Request>(`/requests/${id}`);
}

async function realCreateRequest(input: CreateRequestInput): Promise<Request> {
  return apiFetch<Request>('/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

async function realUpdateRequestStatus(
  id: number,
  status: RequestStatus,
): Promise<Request> {
  return apiFetch<Request>(`/requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

// --- Mock implementation (kept behind USE_MOCK flag) ----------------------

/** Simulated network latency (ms) */
const MOCK_DELAY = 600;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// In-memory store so mock changes persist within the session
let store: Request[] = [...MOCK_REQUESTS];
let nextId = store.length + 1;

async function mockListRequests(status?: RequestStatus): Promise<Request[]> {
  await delay(MOCK_DELAY);
  if (status) return store.filter((r) => r.status === status);
  return [...store];
}

async function mockGetRequest(id: number): Promise<Request> {
  await delay(MOCK_DELAY);
  const req = store.find((r) => r.id === id);
  if (!req) throw new ApiError('NOT_FOUND', 'Request not found');
  return { ...req };
}

async function mockCreateRequest(input: CreateRequestInput): Promise<Request> {
  await delay(MOCK_DELAY);
  const now = new Date().toISOString();
  const created: Request = {
    id: nextId++,
    ...input,
    status: 'OPEN',
    created_at: now,
    updated_at: now,
  };
  store = [created, ...store];
  return { ...created };
}

const MOCK_TRANSITIONS: Partial<Record<RequestStatus, RequestStatus>> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
  RESOLVED: 'CLOSED',
};

async function mockUpdateRequestStatus(
  id: number,
  status: RequestStatus,
): Promise<Request> {
  await delay(MOCK_DELAY);
  const req = store.find((r) => r.id === id);
  if (!req) throw new ApiError('NOT_FOUND', 'Request not found');
  if (MOCK_TRANSITIONS[req.status] !== status) {
    throw new ApiError(
      'INVALID_TRANSITION',
      `Cannot change status from ${req.status} to ${status}`,
    );
  }
  const updated = { ...req, status, updated_at: new Date().toISOString() };
  store = store.map((r) => (r.id === id ? updated : r));
  return { ...updated };
}

// --- Public API -----------------------------------------------------------

export const listRequests = USE_MOCK ? mockListRequests : realListRequests;
export const getRequest = USE_MOCK ? mockGetRequest : realGetRequest;
export const createRequest = USE_MOCK ? mockCreateRequest : realCreateRequest;
export const updateRequestStatus = USE_MOCK
  ? mockUpdateRequestStatus
  : realUpdateRequestStatus;
