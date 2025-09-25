export class HttpError extends Error {
  public statusCode: number;
  public data?: unknown;

  public constructor(statusCode: number, message: string, data?: unknown, options?: ErrorOptions) {
    super(message, options);

    this.statusCode = statusCode;
    this.data = data;
  }
}

export class BadRequestError extends HttpError {
  public constructor(message: string, data?: unknown, options?: ErrorOptions) {
    super(400, message, data, options);
  }
}

export class UnauthorizedError extends HttpError {
  public constructor(message: string, data?: unknown, options?: ErrorOptions) {
    super(401, message, data, options);
  }
}

export class ForbiddenError extends HttpError {
  public constructor(message: string, data?: unknown, options?: ErrorOptions) {
    super(403, message, data, options);
  }
}

export class NotFoundError extends HttpError {
  public constructor(message: string, data?: unknown, options?: ErrorOptions) {
    super(404, message, data, options);
  }
}

export class UnprocessableContentError extends HttpError {
  public constructor(message: string, data?: unknown, options?: ErrorOptions) {
    super(422, message, data, options);
  }
}

export class ValidationError extends UnprocessableContentError {
  public data: Record<string, string[]>;

  public constructor(message: string, data: Record<string, string[]>, options?: ErrorOptions) {
    super(message, data, options);
    this.data = data;
  }
}

export class InternalServerError extends HttpError {
  public constructor(message: string, data?: unknown, options?: ErrorOptions) {
    super(500, message, data, options);
  }
}
