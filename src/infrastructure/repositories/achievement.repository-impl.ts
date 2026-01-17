import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Achievement, AchievementFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { AchievementRepository } from '@app/domain/repositories';
import { AchievementMapper } from '@app/infrastructure/dtos';
import { DateTime } from 'luxon';

export class AchievementRepositoryImpl implements AchievementRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getAchievements(
    filterOptions?: AchievementFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Achievement[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/achievements', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[team_id]': filterOptions?.teamId,
          'filters[competition_id]': filterOptions?.competitionId,
          'filters[competition_team_type_id]': filterOptions?.competitionTeamTypeId,
          'filters[competition_scale_id]': filterOptions?.competitionScaleId,
          'filters[competition_time_range_id]': filterOptions?.competitionTimeRangeId,
          'filters[competition_output_id]': filterOptions?.competitionOutputId,
          'filters[competition_rank_id]': filterOptions?.competitionRankId,
          'filters[competition_branch]': filterOptions?.competitionBranch,
          'filters[competition_start_date][operator]': filterOptions?.competitionStartDateOperator,
          'filters[competition_start_date][value]': filterOptions?.competitionStartDate
            ? DateTime.fromJSDate(filterOptions.competitionStartDate).toISODate()
            : undefined,
          'filters[competition_end_date][operator]': filterOptions?.competitionEndDateOperator,
          'filters[competition_end_date][value]': filterOptions?.competitionEndDate
            ? DateTime.fromJSDate(filterOptions.competitionEndDate).toISODate()
            : undefined,
          'filters[description]': filterOptions?.description,
          'filters[status]': filterOptions?.status,
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(AchievementMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getAchievement(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Achievement, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/achievements/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(AchievementMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createAchievement(
    achievement: Omit<
      Achievement,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'team'
      | 'competition'
      | 'competitionTeamType'
      | 'competitionScale'
      | 'competitionTimeRange'
      | 'competitionOutput'
      | 'competitionRank'
    >,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Achievement, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/achievements',
        AchievementMapper.fromDomaintoDto(achievement),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(AchievementMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateAchievement(
    id: string,
    achievement: Partial<
      Omit<
        Achievement,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'team'
        | 'competition'
        | 'competitionTeamType'
        | 'competitionScale'
        | 'competitionTimeRange'
        | 'competitionOutput'
        | 'competitionRank'
      >
    >,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Achievement, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/achievements/${id}`,
        AchievementMapper.fromDomaintoDto(achievement),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(AchievementMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteAchievement(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Achievement, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/achievements/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(AchievementMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
