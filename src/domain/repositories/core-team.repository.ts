import {
  PaginationOptions,
  CoreTeam,
  CoreTeamFilterOptions,
  CoreTeamSortOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CoreTeamRepository {
  getCoreTeams(
    filterOptions?: CoreTeamFilterOptions,
    sortOptions?: CoreTeamSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CoreTeam[], PaginationOptions], Error>>;

  getCoreTeam(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeam, Error>>;

  createCoreTeam(
    coreTeam: Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeam, Error>>;

  updateCoreTeam(
    id: string,
    coreTeam: Partial<Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeam, Error>>;

  deleteCoreTeam(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeam, Error>>;
}
