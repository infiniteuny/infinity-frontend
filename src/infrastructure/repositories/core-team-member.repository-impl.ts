import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { CoreTeamMember } from '@app/domain/entities';
import { CoreTeamMemberMapper } from '@app/infrastructure/dtos';
import { CoreTeamMemberRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class CoreTeamMemberRepositoryImpl implements CoreTeamMemberRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCoreTeamMembers(
    coreTeamId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-teams/${coreTeamId}/members`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const coreTeamMembersResponse = response.data.data.core_team_members.map(
        CoreTeamMemberMapper.fromDtoToDomain,
      );

      return right(coreTeamMembersResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCoreTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-team-members/${id}`, {
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

  public async createCoreTeamMember(
    coreTeamId: string,
    coreTeamMember: { userId: string; coreTeamDivisionId: string; position: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/core-teams/${coreTeamId}/members`,
        {
          user_id: coreTeamMember.userId,
          core_team_division_id: coreTeamMember.coreTeamDivisionId,
          position: coreTeamMember.position,
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
    coreTeamMember: { coreTeamDivisionId?: string; position?: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/core-team-members/${id}`,
        {
          ...(coreTeamMember.coreTeamDivisionId
            ? { core_team_division_id: coreTeamMember.coreTeamDivisionId }
            : {}),
          ...(coreTeamMember.position ? { position: coreTeamMember.position } : {}),
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
