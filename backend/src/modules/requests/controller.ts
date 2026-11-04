import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../errors/app-error';
import {
  createRequestSchema,
  listRequestsQuerySchema,
  requestIdSchema,
  updateStatusSchema,
} from './schema';
import * as service from './service';
import { Status } from './types';

export async function createRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid input', details);
    }

    const request = await service.createRequest(parsed.data);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

export async function listRequests(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = listRequestsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid status filter');
    }

    const requests = await service.listRequests(
      parsed.data.status as Status | undefined,
    );
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
}

export async function getRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = requestIdSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'id must be a positive integer',
      );
    }

    const request = await service.getRequest(parsed.data.id);
    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
}

export async function updateRequestStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Validate the route parameter
    const idParsed = requestIdSchema.safeParse(req.params);
    if (!idParsed.success) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'id must be a positive integer',
      );
    }

    // Validate the request body
    const bodyParsed = updateStatusSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      const details = bodyParsed.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid input', details);
    }

    const updated = await service.updateRequestStatus(
      idParsed.data.id,
      bodyParsed.data.status as Status,
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}
