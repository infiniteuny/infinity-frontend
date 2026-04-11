import {
  PaginationOptions,
  CommunityGroup,
  CommunityGroupFilterOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupRepository {
  getCommunityGroups(
    filterOptions?: CommunityGroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CommunityGroup[], PaginationOptions], Error>>;

  getCommunityGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroup, Error>>;

  createCommunityGroup(
    communityGroup: Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroup, Error>>;

  updateCommunityGroup(
    id: string,
    communityGroup: Partial<Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroup, Error>>;

  deleteCommunityGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroup, Error>>;
}
