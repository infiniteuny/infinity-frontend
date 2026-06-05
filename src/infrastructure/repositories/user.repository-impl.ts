import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  User,
  UserFilterOptions,
  UserIncludeOptions,
  UserSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UserMapper } from '@app/infrastructure/dtos';
import { UserRepository } from '@app/domain/repositories';

@injectable()
export class UserRepositoryImpl implements UserRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUsers(
    includeOptions?: UserIncludeOptions,
    filterOptions?: UserFilterOptions,
    sortOptions?: UserSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/users', {
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
          'filters[sso_id]': filterOptions?.ssoId,
          'filters[name]': filterOptions?.name,
          'filters[email_address]': filterOptions?.emailAddress,
          'filters[phone_number]': filterOptions?.phoneNumber,
          'filters[student_id]': filterOptions?.studentId,
          'filters[major_id]': filterOptions?.majorId,
          'filters[start_date]':
            filterOptions?.startDate !== undefined
              ? (filterOptions.startDateOperator ?? '') +
                (filterOptions.startDate?.toISOString() ?? '')
              : undefined,
          'filters[end_date]':
            filterOptions?.endDate !== undefined
              ? (filterOptions.endDateOperator ?? '') + (filterOptions.endDate?.toISOString() ?? '')
              : undefined,
          'filters[is_member]': filterOptions?.isMember,
          'filters[is_extraordinary]': filterOptions?.isExtraordinary,
          'filters[created_at]': filterOptions?.createdAt
            ? (filterOptions.createdAtOperator ?? '') +
              (filterOptions.createdAt?.toISOString() ?? '')
            : undefined,
          'filters[updated_at]': filterOptions?.updatedAt
            ? (filterOptions.updatedAtOperator ?? '') +
              (filterOptions.updatedAt?.toISOString() ?? '')
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

      const usersResponse = response.data.data.users.map(UserMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([usersResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getUser(
    id: string,
    includeOptions?: UserIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${id}`, {
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

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createUser(
    user: PartialBy<
      Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
      'startDate' | 'endDate'
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/users',
        UserMapper.fromDomainToDto(user),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateUser(
    id: string,
    user: Partial<Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.patch(
        `/users/${id}`,
        UserMapper.fromDomainToDto(user),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteUser(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/users/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async extendUserMembership(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(`/users/${id}/extend`, undefined, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userResponse = UserMapper.fromDtoToDomain(response.data.data.user);

      return right(userResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
