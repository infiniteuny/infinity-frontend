import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { Config, ConfigFilterOptions, PaginationOptions } from '@app/domain/entities';
import { ConfigMapper } from '@app/infrastructure/dtos';
import { ConfigRepository } from '@app/domain/repositories';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class ConfigRepositoryImpl implements ConfigRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getConfigs(
    filterOptions?: ConfigFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Config[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/configs', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[key]': filterOptions?.key,
          'filters[type]': filterOptions?.type,
          'filters[is_private]': filterOptions?.isPrivate,
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

      const configsResponse = response.data.data.configs.map(ConfigMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([configsResponse, paginationOptionsResponse]);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async getConfig(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Config, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/configs/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const configResponse = ConfigMapper.fromDtoToDomain(response.data.data.config);

      return right(configResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async createConfig(
    config: Omit<Config, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Config, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/configs',
        ConfigMapper.fromDomainToDto(config),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const configResponse = ConfigMapper.fromDtoToDomain(response.data.data.config);

      return right(configResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async updateConfig(
    id: string,
    config: Partial<Omit<Config, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Config, Error>> {
    try {
      const response = await this.infinityApiDataSource.patch(
        `/configs/${id}`,
        ConfigMapper.fromDomainToDto(config),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const configResponse = ConfigMapper.fromDtoToDomain(response.data.data.config);

      return right(configResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async deleteConfig(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Config, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/configs/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const configResponse = ConfigMapper.fromDtoToDomain(response.data.data.config);

      return right(configResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }
}
