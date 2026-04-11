import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  Achievement,
  AchievementFilterOptions,
  AchievementIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { AchievementMapper } from '@app/infrastructure/dtos';
import { AchievementRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class AchievementRepositoryImpl implements AchievementRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getAchievements(
    includeOptions?: AchievementIncludeOptions,
    filterOptions?: AchievementFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Achievement[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/achievements', {
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
    includeOptions?: AchievementIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Achievement, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/achievements/${id}`, {
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
    token?: string,
  ): Promise<Either<Achievement, Error>> {
    try {
      const achievementDto = AchievementMapper.fromDomaintoDto(achievement);

      const response = await this.infinityApiDataSource.postForm(
        '/achievements',
        {
          ...achievementDto,
          image: achievementDto.image instanceof File ? (achievementDto.image as File) : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<Achievement, Error>> {
    try {
      const achievementDto = AchievementMapper.fromDomaintoDto(achievement);

      const response = await this.infinityApiDataSource.putForm(
        `/achievements/${id}`,
        {
          ...achievementDto,
          image: achievementDto.image instanceof File ? (achievementDto.image as File) : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<Achievement, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/achievements/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const achievementResponse = AchievementMapper.fromDtoToDomain(response.data.data.achievement);

      return right(achievementResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
