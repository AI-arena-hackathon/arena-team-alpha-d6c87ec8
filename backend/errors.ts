export type ErrorCode =
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'PAYLOAD_TOO_LARGE'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

export interface ErrorBody {
  readonly code: ErrorCode;
  readonly message: string;
}

export interface ResolvedError {
  readonly status: number;
  readonly body: ErrorBody;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;

  constructor(statusCode: number, code: ErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function resolveErrorBody(
  err: Error & { statusCode?: number; status?: number; code?: string },
): ResolvedError {
  const status = err.statusCode ?? err.status ?? 500;
  if (err instanceof ApiError) {
    return { status: err.statusCode, body: { code: err.code, message: err.message } };
  }
  if (status >= 500) {
    return { status: 500, body: { code: 'INTERNAL_ERROR', message: 'Internal server error' } };
  }
  if (status === 413) {
    return { status, body: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' } };
  }
  if (typeof err.code === 'string') {
    return { status, body: { code: err.code as ErrorCode, message: err.message } };
  }
  return { status, body: { code: 'BAD_REQUEST', message: 'Malformed JSON body' } };
}
