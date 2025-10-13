import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, User, UserFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UserRepository } from '@app/domain/repositories';
import { UserMapper } from '@app/infrastructure/dtos';

export class UserRepositoryImpl implements UserRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getUsers(
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/users', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          'filters[sso_id]': filterOptions?.ssoId,
          'filters[name]': filterOptions?.name,
          'filters[email_address]': filterOptions?.emailAddress,
          'filters[phone_number]': filterOptions?.phoneNumber,
          'filters[student_id]': filterOptions?.studentId,
          'filters[major_id]': filterOptions?.majorId,
          'filters[start_date]':
            filterOptions?.startDate != null
              ? (filterOptions.startDateOperator ?? '') + filterOptions.startDate.toISOString()
              : undefined,
          'filters[end_date]':
            filterOptions?.endDate != null
              ? (filterOptions.endDateOperator ?? '') + filterOptions?.endDate?.toISOString()
              : undefined,
          'filters[is_member]': filterOptions?.isMember,
          'filters[is_extraordinary]': filterOptions?.isExtraordinary,
          'filters[created_at]':
            filterOptions?.createdAt != null
              ? (filterOptions.createdAtOperator ?? '') + filterOptions.createdAt.toISOString()
              : undefined,
          'filters[updated_at]':
            filterOptions?.updatedAt != null
              ? (filterOptions.updatedAtOperator ?? '') + filterOptions?.updatedAt?.toISOString()
              : undefined,
          per_page: paginationOptions?.perPage,
          next_cursor: paginationOptions?.nextCursor,
          previous_cursor: paginationOptions?.previousCursor,
        },
      });

      const usersResponse = response.data.data.users.map(UserMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        response.data.data.meta.next_cursor,
        response.data.data.meta.prev_cursor,
      );

      return right([usersResponse, paginationOptionsResponse]);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async getUser(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async createUser(
    user: PartialBy<Omit<User, 'id' | 'createdAt' | 'updatedAt'>, 'startDate' | 'endDate'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/users',
        UserMapper.fromDomaintoDto(user),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async updateUser(
    id: string,
    user: Partial<User>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.patch(
        `/users/${id}`,
        UserMapper.fromDomaintoDto(user),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async deleteUser(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/users/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }
}
