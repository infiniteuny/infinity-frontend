import {
  CommunityGroupSortOptions,
  PaginationOptions,
  UserCommunityGroup,
  UserCommunityGroupFilterOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserCommunityGroupRepository {
  getUserCommunityGroups(
    userId: string,
    filterOptions?: UserCommunityGroupFilterOptions,
    sortOptions?: CommunityGroupSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserCommunityGroup[], PaginationOptions], Error>>;
}
