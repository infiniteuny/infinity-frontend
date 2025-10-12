export class HttpError extends Error {
  public statusCode: number;
  public data?: unknown;

  public constructor(
    message: string = 'Unknown HTTP error',
    statusCode: number = 500,
    data?: unknown,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this.statusCode = statusCode;
    this.data = data;
  }
}

export class BadRequestError extends HttpError {
  public constructor(message: string = 'Bad request', data?: unknown, options?: ErrorOptions) {
    super(message, 400, data, options);
  }
}

export class UnauthorizedError extends HttpError {
  public constructor(message: string = 'Unauthorized', data?: unknown, options?: ErrorOptions) {
    super(message, 401, data, options);
  }
}

export class ForbiddenError extends HttpError {
  public constructor(message: string = 'Forbidden', data?: unknown, options?: ErrorOptions) {
    super(message, 403, data, options);
  }
}

export class NotFoundError extends HttpError {
  public constructor(message: string = 'Not found', data?: unknown, options?: ErrorOptions) {
    super(message, 404, data, options);
  }
}

export class UnprocessableContentError extends HttpError {
  public constructor(
    message: string = 'Unprocessable content',
    data?: unknown,
    options?: ErrorOptions,
  ) {
    super(message, 422, data, options);
  }
}

export class ValidationError extends UnprocessableContentError {
  public data?: Record<string, string[]>;

  public constructor(
    message: string = 'Validation error',
    data?: Record<string, string[]>,
    options?: ErrorOptions,
  ) {
    super(message, data, options);
    this.data = data;
  }
}

export class InternalServerError extends HttpError {
  public constructor(
    message: string = 'Internal server error',
    data?: unknown,
    options?: ErrorOptions,
  ) {
    super(message, 500, data, options);
  }
}
