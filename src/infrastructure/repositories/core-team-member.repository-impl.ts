import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  CoreTeamMember,
  CoreTeamMemberFilterOptions,
  CoreTeamMemberIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CoreTeamMemberMapper } from '@app/infrastructure/dtos';
import { CoreTeamMemberRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

@injectable()
export class CoreTeamMemberRepositoryImpl implements CoreTeamMemberRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCoreTeamMembers(
    coreTeamId: string,
    includeOptions?: CoreTeamMemberIncludeOptions,
    filterOptions?: CoreTeamMemberFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CoreTeamMember[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-teams/${coreTeamId}/members`, {
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
      });

      const coreTeamMembersResponse = response.data.data.core_team_members.map(
        CoreTeamMemberMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([coreTeamMembersResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCoreTeamMember(
    id: string,
    includeOptions?: CoreTeamMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-team-members/${id}`, {
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

      const coreTeamMemberResponse = CoreTeamMemberMapper.fromDtoToDomain(
        response.data.data.core_team_member,
      );

      return right(coreTeamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCoreTeamMember(
    coreTeamId: string,
    coreTeamMember: {
      userId: string;
      coreTeamDivisionId: string;
      photo: File;
      animation: File | null;
    },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.postForm(
        `/core-teams/${coreTeamId}/members`,
        {
          user_id: coreTeamMember.userId,
          core_team_division_id: coreTeamMember.coreTeamDivisionId,
          photo: coreTeamMember.photo,
          animation: coreTeamMember.animation instanceof File ? coreTeamMember.animation : null,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const coreTeamMemberResponse = CoreTeamMemberMapper.fromDtoToDomain(
        response.data.data.core_team_member,
      );

      return right(coreTeamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCoreTeamMember(
    id: string,
    coreTeamMember: {
      userId?: string;
      coreTeamDivisionId?: string;
      photo?: File;
      animation?: File | null;
    },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.putForm(
        `/core-team-members/${id}`,
        {
          user_id: coreTeamMember.userId,
          core_team_division_id: coreTeamMember.coreTeamDivisionId,
          photo: coreTeamMember.photo instanceof File ? coreTeamMember.photo : undefined,
          animation:
            coreTeamMember.animation instanceof File
              ? coreTeamMember.animation
              : coreTeamMember.animation === null
                ? null
                : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const coreTeamMemberResponse = CoreTeamMemberMapper.fromDtoToDomain(
        response.data.data.core_team_member,
      );

      return right(coreTeamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCoreTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/core-team-members/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const coreTeamMemberResponse = CoreTeamMemberMapper.fromDtoToDomain(
        response.data.data.core_team_member,
      );

      return right(coreTeamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
