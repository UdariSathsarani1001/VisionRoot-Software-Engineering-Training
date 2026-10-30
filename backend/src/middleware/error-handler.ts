import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

function buildErrorBody(
  code: string,
  message: string,
  details?: { field: string; message: string }[],
) {
  const body: Record<string, unknown> = { code, message };
  if (details && details.length > 0) {
    body.details = details;
  }
  return { error: body };
}

// Central error handler — must have four parameters for Express to recognise it.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json(buildErrorBody(err.code, err.message, err.details));
    return;
  }

  if (err instanceof ZodError) {
    const details = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res
      .status(400)
      .json(buildErrorBody('VALIDATION_ERROR', 'Invalid input', details));
    return;
  }

  // Malformed JSON from Express body-parser lands here as a SyntaxError.
  if (err instanceof SyntaxError && 'body' in err) {
    res
      .status(400)
      .json(buildErrorBody('VALIDATION_ERROR', 'Malformed JSON body'));
    return;
  }

  // Unexpected error — log safely, return nothing internal.
  console.error(
    '[error]',
    err instanceof Error ? err.message : 'Unknown error',
  );
  res
    .status(500)
    .json(buildErrorBody('INTERNAL_ERROR', 'An unexpected error occurred'));
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(buildErrorBody('NOT_FOUND', 'Route not found'));
}
