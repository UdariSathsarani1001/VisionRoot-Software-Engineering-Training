import { AppError } from '../../errors/app-error';
import * as repository from './repository';
import { CreateRequestInput, ServiceRequest, Status } from './types';

export function createRequest(input: CreateRequestInput): ServiceRequest {
  return repository.create(input);
}

export function listRequests(status?: Status): ServiceRequest[] {
  return repository.findAll(status);
}

export function getRequest(id: number): ServiceRequest {
  const request = repository.findById(id);
  if (!request) {
    throw new AppError(404, 'NOT_FOUND', 'Request not found');
  }
  return request;
}
