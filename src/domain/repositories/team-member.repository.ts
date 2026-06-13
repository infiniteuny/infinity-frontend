import {
  PaginationOptions,
  TeamMember,
  TeamMemberFilterOptions,
  TeamMemberIncludeOptions,
  TeamMemberSortOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface TeamMemberRepository {
  getTeamMembers(
    teamId: string,
    includeOptions?: TeamMemberIncludeOptions,
    filterOptions?: TeamMemberFilterOptions,
    sortOptions?: TeamMemberSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[TeamMember[], PaginationOptions], Error>>;

  getTeamMember(
    id: string,
    includeOptions?: TeamMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>>;

  createTeamMember(
    teamId: string,
    teamMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>>;

  deleteTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>>;
}
