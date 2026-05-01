import {
  CommunityGroupMember,
  CommunityGroupMemberFilterOptions,
  CommunityGroupMemberIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupMemberRepository {
  getCommunityGroupMembers(
    communityGroupId: string,
    includeOptions?: CommunityGroupMemberIncludeOptions,
    filterOptions?: CommunityGroupMemberFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CommunityGroupMember[], PaginationOptions], Error>>;

  getCommunityGroupMember(
    id: string,
    includeOptions?: CommunityGroupMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>>;

  createCommunityGroupMember(
    communityGroupId: string,
    communityGroupMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>>;

  deleteCommunityGroupMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>>;
}
