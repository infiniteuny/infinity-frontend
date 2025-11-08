import {
  PaginationOptions,
  Major,
  MajorFilterOptions,
  MajorIncludeOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface MajorRepository {
  getMajors(
    includeOptions?: MajorIncludeOptions,
    filterOptions?: MajorFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Major[], PaginationOptions], Error>>;

  getMajor(
    id: string,
    includeOptions?: MajorIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Major, Error>>;

  createMajor(
    major: Omit<Major, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Major, Error>>;

  updateMajor(
    id: string,
    major: Partial<Omit<Major, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Major, Error>>;

  deleteMajor(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Major, Error>>;
}
