import { CreateRequestInput, ServiceRequest, Status } from './types';

// In-memory store. Data is lost on server restart. Persistence arrives on Day 06.
const store: ServiceRequest[] = [];
let nextId = 1;

function nowIso(): string {
  return new Date().toISOString();
}

export function create(input: CreateRequestInput): ServiceRequest {
  const now = nowIso();
  const request: ServiceRequest = {
    id: nextId++,
    title: input.title,
    description: input.description,
    category: input.category,
    priority: input.priority,
    status: 'OPEN',
    created_at: now,
    updated_at: now,
  };
  store.push(request);
  return request;
}

export function findAll(status?: Status): ServiceRequest[] {
  const results = status
    ? store.filter((r) => r.status === status)
    : [...store];
  // Newest first.
  return results.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function findById(id: number): ServiceRequest | undefined {
  return store.find((r) => r.id === id);
}
