export class JoinRequestsApiError extends Error {
  readonly status?: number;
  readonly traceId?: string;

  constructor(
    message: string,
    status?: number,
    traceId?: string,
  ) {
    super(message);
    this.name = 'JoinRequestsApiError';
    this.status = status;
    this.traceId = traceId;
  }
}
