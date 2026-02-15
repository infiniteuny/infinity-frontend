import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Team, TeamFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { TeamRepository } from '@app/domain/repositories';
import { TeamMapper } from '@app/infrastructure/dtos';

export class TeamRepositoryImpl implements TeamRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getTeams(
    filterOptions?: TeamFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Team[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/teams', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[leader_id]': filterOptions?.leaderId,
          'filters[name]': filterOptions?.name,
          'filters[is_personal]': filterOptions?.isPersonal,
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

      const teamsResponse = response.data.data.teams.map(TeamMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([teamsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/teams/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const teamResponse = TeamMapper.fromDtoToDomain(response.data.data.team);

      return right(teamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createTeam(
    team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/teams',
        TeamMapper.fromDomaintoDto(team),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const teamResponse = TeamMapper.fromDtoToDomain(response.data.data.team);

      return right(teamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateTeam(
    id: string,
    team: Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/teams/${id}`,
        TeamMapper.fromDomaintoDto(team),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const teamResponse = TeamMapper.fromDtoToDomain(response.data.data.team);

      return right(teamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/teams/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const teamResponse = TeamMapper.fromDtoToDomain(response.data.data.team);

      return right(teamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
