import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  CommunityGroupAdminMember,
  CommunityGroupAdminMemberFilterOptions,
  CommunityGroupAdminMemberIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CommunityGroupAdminMemberMapper } from '@app/infrastructure/dtos';
import { CommunityGroupAdminMemberRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class CommunityGroupAdminMemberRepositoryImpl implements CommunityGroupAdminMemberRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCommunityGroupAdminMembers(
    communityGroupAdminId: string,
    includeOptions?: CommunityGroupAdminMemberIncludeOptions,
    filterOptions?: CommunityGroupAdminMemberFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CommunityGroupAdminMember[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(
        `/community-group-admins/${communityGroupAdminId}/members`,
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
          },
        },
      );

      const communityGroupAdminMembersResponse =
        response.data.data.community_group_admin_members.map(
          CommunityGroupAdminMemberMapper.fromDtoToDomain,
        );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([communityGroupAdminMembersResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCommunityGroupAdminMember(
    id: string,
    includeOptions?: CommunityGroupAdminMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(
        `/community-group-admin-members/${id}`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          params: {
            includes: includeOptions
              ?.filter((value, index, self) => self.indexOf(value) === index)
              .join(','),
          },
        },
      );

      const communityGroupAdminMemberResponse = CommunityGroupAdminMemberMapper.fromDtoToDomain(
        response.data.data.community_group_admin_member,
      );

      return right(communityGroupAdminMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCommunityGroupAdminMember(
    communityGroupAdminId: string,
    communityGroupAdminMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/community-group-admins/${communityGroupAdminId}/members`,
        {
          user_id: communityGroupAdminMember.userId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupAdminMemberResponse = CommunityGroupAdminMemberMapper.fromDtoToDomain(
        response.data.data.community_group_admin_member,
      );

      return right(communityGroupAdminMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCommunityGroupAdminMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(
        `/community-group-admin-members/${id}`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupAdminMemberResponse = CommunityGroupAdminMemberMapper.fromDtoToDomain(
        response.data.data.community_group_admin_member,
      );

      return right(communityGroupAdminMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
