import type { InfinityApiDataSource } from '../datasources/server';
import { AchievementLeaderboardMapper } from '../dtos';
import {
  AchievementLeaderboard,
  AchievementLeaderboardFilterOptions,
  AchievementLeaderboardIncludeOptions,
  AchievementLeaderboardRepository,
  AchievementLeaderboardSortOptions,
  PaginationOptions,
  SYMBOLS,
} from '@infiniteuny/infinity-domain';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@infiniteuny/infinity-utils';
import { inject, injectable } from 'inversify';

@injectable()
export class AchievementLeaderboardRepositoryImpl implements AchievementLeaderboardRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getAchievementLeaderboardYears(
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[number[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/leaderboards/achievements', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
        },
      });

      const yearsResponse: number[] = response.data.data.achievement_leaderboard_years;

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([yearsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getAchievementLeaderboards(
    year: number,
    includeOptions?: AchievementLeaderboardIncludeOptions,
    filterOptions?: AchievementLeaderboardFilterOptions,
    sortOptions?: AchievementLeaderboardSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[AchievementLeaderboard[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/leaderboards/achievements/${year}`, {
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
          'filters[user_id]': filterOptions?.userId,
          'filters[total_points]':
            filterOptions?.totalPoints != null
              ? (filterOptions.totalPointsOperator ?? '') + String(filterOptions.totalPoints)
              : undefined,
          'filters[created_at]':
            filterOptions?.createdAt != null
              ? (filterOptions.createdAtOperator ?? '') + filterOptions.createdAt.toISOString()
              : undefined,
          'filters[updated_at]':
            filterOptions?.updatedAt != null
              ? (filterOptions.updatedAtOperator ?? '') + filterOptions.updatedAt.toISOString()
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

      const leaderboardsResponse = response.data.data.achievement_leaderboards.map(
        AchievementLeaderboardMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([leaderboardsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
