export class CreateClassApiError extends Error {
  readonly status?: number;
  readonly traceId?: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    options: {
      status?: number;
      traceId?: string;
      fieldErrors?: Record<string, string[]>;
    } = {},
  ) {
    super(message);
    this.name = 'CreateClassApiError';
    this.status = options.status;
    this.traceId = options.traceId;
    this.fieldErrors = options.fieldErrors;
  }
}

