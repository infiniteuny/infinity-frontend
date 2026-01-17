import {
  PaginationOptions,
  CoreTeamDivision,
  CoreTeamDivisionFilterOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CoreTeamDivisionRepository {
  getCoreTeamDivisions(
    filterOptions?: CoreTeamDivisionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CoreTeamDivision[], PaginationOptions], Error>>;

  getCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeamDivision, Error>>;

  createCoreTeamDivision(
    coreTeamDivision: Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeamDivision, Error>>;

  updateCoreTeamDivision(
    id: string,
    coreTeamDivision: Partial<Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeamDivision, Error>>;

  deleteCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeamDivision, Error>>;
}
