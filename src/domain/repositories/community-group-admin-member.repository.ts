import {
  CommunityGroupAdminMember,
  CommunityGroupAdminMemberFilterOptions,
  CommunityGroupAdminMemberIncludeOptions,
  CommunityGroupAdminMemberSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupAdminMemberRepository {
  getCommunityGroupAdminMembers(
    communityGroupAdminId: string,
    includeOptions?: CommunityGroupAdminMemberIncludeOptions,
    filterOptions?: CommunityGroupAdminMemberFilterOptions,
    sortOptions?: CommunityGroupAdminMemberSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CommunityGroupAdminMember[], PaginationOptions], Error>>;

  getCommunityGroupAdminMember(
    id: string,
    includeOptions?: CommunityGroupAdminMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>>;

  createCommunityGroupAdminMember(
    communityGroupAdminId: string,
    communityGroupAdminMember: {
      userId: string;
      communityGroupId: string;
      photo: File;
      animation: File | null;
    },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>>;

  updateCommunityGroupAdminMember(
    id: string,
    communityGroupAdminMember: {
      userId?: string;
      communityGroupId?: string;
      photo?: File;
      animation?: File | null;
    },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>>;

  deleteCommunityGroupAdminMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>>;
}
