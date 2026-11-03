import { AppError } from '../../errors/app-error';
import * as repository from './repository';
import { CreateRequestInput, ServiceRequest, Status } from './types';

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
