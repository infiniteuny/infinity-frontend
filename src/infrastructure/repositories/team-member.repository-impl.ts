import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  TeamMember,
  TeamMemberFilterOptions,
  TeamMemberIncludeOptions,
} from '@app/domain/entities';
import { TeamMemberMapper } from '@app/infrastructure/dtos';
import { TeamMemberRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class TeamMemberRepositoryImpl implements TeamMemberRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getTeamMembers(
    teamId: string,
    includeOptions?: TeamMemberIncludeOptions,
    filterOptions?: TeamMemberFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[TeamMember[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/teams/${teamId}/members`, {
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

      const teamMembersResponse = response.data.data.team_members.map(
        TeamMemberMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([teamMembersResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getTeamMember(
    id: string,
    includeOptions?: TeamMemberIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/team-members/${id}`, {
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

      const teamMemberResponse = TeamMemberMapper.fromDtoToDomain(response.data.data.team_member);

      return right(teamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createTeamMember(
    teamId: string,
    teamMember: { userId: string; role: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/teams/${teamId}/members`,
        {
          user_id: teamMember.userId,
          role: teamMember.role,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const teamMemberResponse = TeamMemberMapper.fromDtoToDomain(response.data.data.team_member);

      return right(teamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateTeamMember(
    id: string,
    teamMember: { role?: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/team-members/${id}`,
        {
          ...(teamMember.role ? { role: teamMember.role } : {}),
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const teamMemberResponse = TeamMemberMapper.fromDtoToDomain(response.data.data.team_member);

      return right(teamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/team-members/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const teamMemberResponse = TeamMemberMapper.fromDtoToDomain(response.data.data.team_member);

      return right(teamMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
