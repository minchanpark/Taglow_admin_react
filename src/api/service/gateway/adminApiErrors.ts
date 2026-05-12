export class AdminApiError extends Error {
  readonly status?: number;
  readonly payload?: unknown;

  constructor(message: string, options?: { status?: number; payload?: unknown }) {
    super(message);
    this.name = 'AdminApiError';
    this.status = options?.status;
    this.payload = options?.payload;
  }
}

export const isUnauthorizedStatus = (status: number) =>
  status === 401 || status === 403;
