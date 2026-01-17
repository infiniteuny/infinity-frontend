import { PaginationOptions, CommunityGroupAdmin } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupAdminRepository {
  getCommunityGroupAdmins(
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
    communityGroupAdmin: Omit<CommunityGroupAdmin, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  updateCommunityGroupAdmin(
    id: string,
    communityGroupAdmin: Partial<Omit<CommunityGroupAdmin, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>>;

  deleteCommunityGroupAdmin(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>>;
}
