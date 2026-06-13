import {
  PaginationOptions,
  CommunityGroupAdmin,
  CommunityGroupAdminFilterOptions,
  CommunityGroupAdminSortOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupAdminRepository {
  getCommunityGroupAdmins(
    filterOptions?: CommunityGroupAdminFilterOptions,
    sortOptions?: CommunityGroupAdminSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CommunityGroupAdmin[], PaginationOptions], Error>>;

  getCommunityGroupAdmin(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  createCommunityGroupAdmin(
    communityGroupAdmin: Omit<
      CommunityGroupAdmin,
      'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  updateCommunityGroupAdmin(
    id: string,
    communityGroupAdmin: Partial<
      Omit<CommunityGroupAdmin, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  deleteCommunityGroupAdmin(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdmin, Error>>;
}
