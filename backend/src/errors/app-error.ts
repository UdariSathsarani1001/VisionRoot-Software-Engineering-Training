export type ErrorCode =
  'VALIDATION_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR' | 'INVALID_TRANSITION';

export interface ErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details: ErrorDetail[];

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    details: ErrorDetail[] = [],
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
