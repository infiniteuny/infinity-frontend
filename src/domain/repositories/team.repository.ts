import { Either } from 'effect/Either';
import { PaginationOptions, Team, TeamFilterOptions } from '@app/domain/entities';

export interface TeamRepository {
  getTeams(
    filterOptions?: TeamFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Team[], PaginationOptions], Error>>;

  getTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Team, Error>>;

  createTeam(
    team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Team, Error>>;

  updateTeam(
    id: string,
    team: Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Team, Error>>;

  deleteTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Team, Error>>;
}
