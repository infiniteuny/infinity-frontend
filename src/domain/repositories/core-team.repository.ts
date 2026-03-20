import { PaginationOptions, CoreTeam, CoreTeamFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CoreTeamRepository {
  getCoreTeams(
    filterOptions?: CoreTeamFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CoreTeam[], PaginationOptions], Error>>;

  getCoreTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeam, Error>>;

  createCoreTeam(
    coreTeam: Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeam, Error>>;

  updateCoreTeam(
    id: string,
    coreTeam: Partial<Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeam, Error>>;

  deleteCoreTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeam, Error>>;
}
