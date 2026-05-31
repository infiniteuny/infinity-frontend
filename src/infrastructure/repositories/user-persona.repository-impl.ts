import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import { PaginationOptions, UserPersona, UserPersonaFilterOptions } from '@app/domain/entities';
import { UserPersonaMapper } from '@app/infrastructure/dtos';
import { UserPersonaRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

@injectable()
export class UserPersonaRepositoryImpl implements UserPersonaRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserPersonas(
    userId: string,
    filterOptions?: UserPersonaFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserPersona[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${userId}/personas`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[priority]': filterOptions?.priority,
          'filters[description]': filterOptions?.description,
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

      const userPersonasResponse = response.data.data.user_personas.map(
        UserPersonaMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([userPersonasResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getUserPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/user-personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPersonaResponse = UserPersonaMapper.fromDtoToDomain(
        response.data.data.user_persona,
      );

      return right(userPersonaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createUserPersona(
    userId: string,
    userPersona: { personaId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/users/${userId}/personas`,
        {
          persona_id: userPersona.personaId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userPersonaResponse = UserPersonaMapper.fromDtoToDomain(
        response.data.data.user_persona,
      );

      return right(userPersonaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteUserPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/user-personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPersonaResponse = UserPersonaMapper.fromDtoToDomain(
        response.data.data.user_persona,
      );

      return right(userPersonaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
