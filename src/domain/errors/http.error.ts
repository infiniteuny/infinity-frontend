export class HttpError extends Error {
  public statusCode: number;
  public data?: unknown;

  public constructor(statusCode: number, message: string, data?: unknown, options?: ErrorOptions) {
    super(message, options);

    this.statusCode = statusCode;
    this.data = data;
  }
}

export class ValidationError extends Error {}

export class BadRequestError extends Error {}

export class UnauthorizedError extends Error {}

export class ForbiddenError extends Error {}

export class NotFoundError extends Error {}

export class InternalServerError extends Error {}
