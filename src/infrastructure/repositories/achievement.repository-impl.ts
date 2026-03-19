import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Achievement, AchievementFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { AchievementRepository } from '@app/domain/repositories';
import { AchievementMapper } from '@app/infrastructure/dtos';

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
          'filters[competition_scale_id]': filterOptions?.competitionScaleId,
          'filters[competition_time_range_id]': filterOptions?.competitionTimeRangeId,
          'filters[competition_output_id]': filterOptions?.competitionOutputId,
          'filters[competition_rank_id]': filterOptions?.competitionRankId,
          'filters[competition_branch]': filterOptions?.competitionBranch,
          'filters[competition_start_date]':
            filterOptions?.competitionStartDate != null
              ? (filterOptions.competitionStartDateOperator ?? '') +
                filterOptions.competitionStartDate.toISOString()
              : undefined,
          'filters[competition_end_date]':
            filterOptions?.competitionEndDate != null
              ? (filterOptions.competitionEndDateOperator ?? '') +
                filterOptions.competitionEndDate.toISOString()
              : undefined,
          'filters[description]': filterOptions?.description,
          'filters[status]': filterOptions?.status,
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

      const achievementsResponse = response.data.data.achievements.map(
        AchievementMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([achievementsResponse, paginationOptionsResponse]);
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

      const achievementResponse = AchievementMapper.fromDtoToDomain(response.data.data.achievement);

      return right(achievementResponse);
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

      const achievementResponse = AchievementMapper.fromDtoToDomain(response.data.data.achievement);

      return right(achievementResponse);
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

      const achievementResponse = AchievementMapper.fromDtoToDomain(response.data.data.achievement);

      return right(achievementResponse);
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

      const achievementResponse = AchievementMapper.fromDtoToDomain(response.data.data.achievement);

      return right(achievementResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
