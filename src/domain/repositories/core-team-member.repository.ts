import {
  CoreTeamMember,
  CoreTeamMemberFilterOptions,
  CoreTeamMemberIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CoreTeamMemberRepository {
  getCoreTeamMembers(
    coreTeamId: string,
    includeOptions?: CoreTeamMemberIncludeOptions,
    filterOptions?: CoreTeamMemberFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CoreTeamMember[], PaginationOptions], Error>>;

  getCoreTeamMember(
    id: string,
    includeOptions?: CoreTeamMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;

  createCoreTeamMember(
    coreTeamId: string,
    coreTeamMember: {
      userId: string;
      coreTeamDivisionId: string;
      photo: File;
      animation?: File;
    },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;

  updateCoreTeamMember(
    id: string,
    coreTeamMember: {
      userId?: string;
      coreTeamDivisionId?: string;
      photo?: File;
      animation?: File | null;
    },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;

  deleteCoreTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;
}
