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
} from '@app/domain/errors';

export function handleAxiosError(error: unknown): Error {
  if (error instanceof AxiosError && (error as AxiosError).response) {
    let resultError: HttpError;

    switch ((error as AxiosError).response?.status) {
      case 400:
        resultError = new BadRequestError(
          error.response?.data.message ?? error.message,
          error.response?.data.data,
        );
        break;
      case 401:
        resultError = new UnauthorizedError(
          error.response?.data.message ?? error.message,
          error.response?.data.data,
        );
        break;
      case 403:
        resultError = new ForbiddenError(
          error.response?.data.message ?? error.message,
          error.response?.data.data,
        );
        break;
      case 404:
        resultError = new NotFoundError(
          error.response?.data.message ?? error.message,
          error.response?.data.data,
        );
        break;
      case 422:
        if (error.response?.data.data.details) {
          resultError = new ValidationError(
            error.response?.data.message ?? error.message,
            error.response?.data.data.details,
          );
        } else {
          resultError = new UnprocessableContentError(
            error.response?.data.message ?? error.message,
            error.response?.data.data,
          );
        }
        break;
      case 500:
        resultError = new InternalServerError(
          error.response?.data.message ?? error.message,
          error.response?.data.data,
        );
        break;
      default:
        return new HttpError(
          error.response?.status ?? 500,
          error.response?.data.message ?? error.message,
          error.response?.data.data,
        );
    }

    return resultError;
  } else {
    return error as Error;
  }
}
