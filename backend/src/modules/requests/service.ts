import { AppError } from '../../errors/app-error';
import * as repository from './repository';
import { CreateRequestInput, ServiceRequest, Status } from './types';

// Allowed status transitions. The service owns this rule (NFR-09).
const ALLOWED_TRANSITIONS: Partial<Record<Status, Status>> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
  RESOLVED: 'CLOSED',
};

export async function createRequest(
  input: CreateRequestInput,
): Promise<ServiceRequest> {
  return repository.create(input);
}

export async function listRequests(status?: Status): Promise<ServiceRequest[]> {
  return repository.findAll(status);
}

export async function getRequest(id: number): Promise<ServiceRequest> {
  const request = await repository.findById(id);
  if (!request) {
    throw new AppError(404, 'NOT_FOUND', 'Request not found');
  }
  return request;
}

export async function updateRequestStatus(
  id: number,
  newStatus: Status,
): Promise<ServiceRequest> {
  // Load the current request first so we can give a meaningful 404 or
  // transition error before touching the database.
  const current = await repository.findById(id);
  if (!current) {
    throw new AppError(404, 'NOT_FOUND', 'Request not found');
  }

  const allowed = ALLOWED_TRANSITIONS[current.status];
  if (allowed !== newStatus) {
    throw new AppError(
      400,
      'INVALID_TRANSITION',
      `Cannot change status from ${current.status} to ${newStatus}`,
    );
  }

  // Pass the expected current status so the UPDATE is atomic: if another
  // request changes the status concurrently the WHERE clause will not match.
  const updated = await repository.updateStatus(id, newStatus, current.status);
  if (!updated) {
    // The row was modified between our SELECT and UPDATE — re-fetch and report.
    const fresh = await repository.findById(id);
    if (!fresh) {
      throw new AppError(404, 'NOT_FOUND', 'Request not found');
    }
    throw new AppError(
      400,
      'INVALID_TRANSITION',
      `Cannot change status from ${fresh.status} to ${newStatus}`,
    );
  }

  return updated;
}
