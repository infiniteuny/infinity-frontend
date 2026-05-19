import { Config, ConfigFilterOptions, PaginationOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface ConfigRepository {
  getConfigs(
    filterOptions?: ConfigFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Config[], PaginationOptions], Error>>;

  getConfig(id: string, abortSignal?: AbortSignal, token?: string): Promise<Either<Config, Error>>;

  createConfig(
    config: Omit<Config, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Config, Error>>;

  updateConfig(
    id: string,
    config: Partial<Omit<Config, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Config, Error>>;

  deleteConfig(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Config, Error>>;
}
