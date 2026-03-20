import {
  PaginationOptions,
  CommunityGroupAdmin,
  CommunityGroupAdminFilterOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupAdminRepository {
  getCommunityGroupAdmins(
    filterOptions?: CommunityGroupAdminFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CommunityGroupAdmin[], PaginationOptions], Error>>;

  getCommunityGroupAdmin(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  createCommunityGroupAdmin(
    communityGroupAdmin: Omit<
      CommunityGroupAdmin,
      'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  updateCommunityGroupAdmin(
    id: string,
    communityGroupAdmin: Partial<
      Omit<CommunityGroupAdmin, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  deleteCommunityGroupAdmin(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>>;
}
