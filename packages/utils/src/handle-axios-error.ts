import { AxiosError } from 'axios';
import {
  BadRequestError,
  ForbiddenError,
  HttpError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableContentError,
  ValidationError,
} from '@infiniteuny/infinity-domain';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function handleAxiosError(error: unknown): Error {
  if (error instanceof AxiosError && error.response) {
    const responseData = isRecord(error.response.data) ? error.response.data : undefined;
    const message =
      typeof responseData?.message === 'string' && responseData.message.length > 0
        ? responseData.message
        : error.message;
    const data = responseData?.data;

    switch (error.response.status) {
      case 400:
        return new BadRequestError(message, data);
      case 401:
        return new UnauthorizedError(message, data);
      case 403:
        return new ForbiddenError(message, data);
      case 404:
        return new NotFoundError(message, data);
      case 422: {
        const details = isRecord(data) && isRecord(data.details) ? data.details : undefined;
        if (details) {
          return new ValidationError(message, details as Record<string, string[]>);
        }

        return new UnprocessableContentError(message, data);
      }
      case 500:
        return new InternalServerError(message, data);
      default:
        return new HttpError(message, error.response.status ?? 500, data);
    }
  }

  return error instanceof Error ? error : new Error(String(error));
}
