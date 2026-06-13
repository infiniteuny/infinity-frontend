import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Team,
  TeamFilterOptions,
  TeamIncludeOptions,
  TeamSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { TeamMapper } from '@app/infrastructure/dtos';
import { TeamRepository } from '@app/domain/repositories';

@injectable()
export class TeamRepositoryImpl implements TeamRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getTeams(
    includeOptions?: TeamIncludeOptions,
    filterOptions?: TeamFilterOptions,
    sortOptions?: TeamSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Team[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/teams', {
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
          'filters[leader_id]': filterOptions?.leaderId,
          'filters[team_type_id]': filterOptions?.teamTypeId,
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
    includeOptions?: TeamIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/teams/${id}`, {
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

      const teamResponse = TeamMapper.fromDtoToDomain(response.data.data.team);

      return right(teamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createTeam(
    team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/teams',
        TeamMapper.fromDomainToDto(team),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/teams/${id}`,
        TeamMapper.fromDomainToDto(team),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<Team, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/teams/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const teamResponse = TeamMapper.fromDtoToDomain(response.data.data.team);

      return right(teamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
