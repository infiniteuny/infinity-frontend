import { Either } from 'effect/Either';
import {
  PaginationOptions,
  Team,
  TeamFilterOptions,
  TeamIncludeOptions,
  TeamSortOptions,
} from '@app/domain/entities';

export interface TeamRepository {
  getTeams(
    includeOptions?: TeamIncludeOptions,
    filterOptions?: TeamFilterOptions,
    sortOptions?: TeamSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Team[], PaginationOptions], Error>>;

  getTeam(
    id: string,
    includeOptions?: TeamIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Team, Error>>;

  createTeam(
    team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader' | 'teamType'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Team, Error>>;

  updateTeam(
    id: string,
    team: Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader' | 'teamType'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Team, Error>>;

  deleteTeam(id: string, abortSignal?: AbortSignal, token?: string): Promise<Either<Team, Error>>;
}
