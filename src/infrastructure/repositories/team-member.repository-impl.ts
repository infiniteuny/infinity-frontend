import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { TeamMember } from '@app/domain/entities';
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
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/teams/${teamId}/members`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const teamMembersResponse = response.data.data.team_members.map(
        TeamMemberMapper.fromDtoToDomain,
      );

      return right(teamMembersResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/team-members/${id}`, {
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
