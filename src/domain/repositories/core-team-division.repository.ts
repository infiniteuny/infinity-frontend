import {
  PaginationOptions,
  CoreTeamDivision,
  CoreTeamDivisionFilterOptions,
  CoreTeamDivisionSortOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CoreTeamDivisionRepository {
  getCoreTeamDivisions(
    filterOptions?: CoreTeamDivisionFilterOptions,
    sortOptions?: CoreTeamDivisionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CoreTeamDivision[], PaginationOptions], Error>>;

  getCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>>;

  createCoreTeamDivision(
    coreTeamDivision: Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>>;

  updateCoreTeamDivision(
    id: string,
    coreTeamDivision: Partial<Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>>;

  deleteCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>>;
}
