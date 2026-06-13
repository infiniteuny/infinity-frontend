import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  CommunityGroupMember,
  CommunityGroupMemberFilterOptions,
  CommunityGroupMemberIncludeOptions,
  CommunityGroupMemberSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CommunityGroupMemberMapper } from '@app/infrastructure/dtos';
import { CommunityGroupMemberRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

@injectable()
export class CommunityGroupMemberRepositoryImpl implements CommunityGroupMemberRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCommunityGroupMembers(
    communityGroupId: string,
    includeOptions?: CommunityGroupMemberIncludeOptions,
    filterOptions?: CommunityGroupMemberFilterOptions,
    sortOptions?: CommunityGroupMemberSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CommunityGroupMember[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(
        `/community-groups/${communityGroupId}/members`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          params: {
            per_page: paginationOptions?.perPage,
            cursor: paginationOptions?.cursor,
            includes: includeOptions
              ?.filter((value, index, self) => self.indexOf(value) === index)
              .join(','),
            'filters[sso_id]': filterOptions?.ssoId,
            'filters[name]': filterOptions?.name,
            'filters[email_address]': filterOptions?.emailAddress,
            'filters[phone_number]': filterOptions?.phoneNumber,
            'filters[student_id]': filterOptions?.studentId,
            'filters[major_id]': filterOptions?.majorId,
            'filters[start_date]':
              filterOptions?.startDate != null
                ? (filterOptions.startDateOperator ?? '') + filterOptions.startDate.toISOString()
                : undefined,
            'filters[end_date]':
              filterOptions?.endDate != null
                ? (filterOptions.endDateOperator ?? '') + filterOptions?.endDate?.toISOString()
                : undefined,
            'filters[is_member]': filterOptions?.isMember,
            'filters[is_extraordinary]': filterOptions?.isExtraordinary,
            'filters[created_at]':
              filterOptions?.createdAt != null
                ? (filterOptions.createdAtOperator ?? '') + filterOptions.createdAt.toISOString()
                : undefined,
            'filters[updated_at]':
              filterOptions?.updatedAt != null
                ? (filterOptions.updatedAtOperator ?? '') + filterOptions?.updatedAt?.toISOString()
                : undefined,
            sorts: sortOptions
              ? Object.entries(sortOptions)
                  .map((sortOption) => {
                    const prefix = sortOption[1] === 'DESC' ? '-' : '';
                    const field = sortOption[0]
                      .split(/(?=[A-Z])/)
                      .join('_')
                      .toLowerCase();
                    return prefix + field;
                  })
                  .join(',')
              : undefined,
          },
        },
      );

      const communityGroupMembersResponse = response.data.data.community_group_members.map(
        CommunityGroupMemberMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([communityGroupMembersResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCommunityGroupMember(
    id: string,
    includeOptions?: CommunityGroupMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/community-group-members/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
        },
      });

      const communityGroupMemberResponse = CommunityGroupMemberMapper.fromDtoToDomain(
        response.data.data.community_group_member,
      );

      return right(communityGroupMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCommunityGroupMember(
    communityGroupId: string,
    communityGroupMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/community-groups/${communityGroupId}/members`,
        {
          user_id: communityGroupMember.userId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupMemberResponse = CommunityGroupMemberMapper.fromDtoToDomain(
        response.data.data.community_group_member,
      );

      return right(communityGroupMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCommunityGroupMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/community-group-members/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const communityGroupMemberResponse = CommunityGroupMemberMapper.fromDtoToDomain(
        response.data.data.community_group_member,
      );

      return right(communityGroupMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
