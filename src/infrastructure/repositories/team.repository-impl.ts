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
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(TeamMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
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

      return right(TeamMapper.fromDtoToDomain(response.data.data));
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

      return right(TeamMapper.fromDtoToDomain(response.data.data));
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

      return right(TeamMapper.fromDtoToDomain(response.data.data));
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

      return right(TeamMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
