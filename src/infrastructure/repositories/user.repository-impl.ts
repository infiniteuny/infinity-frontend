import type { AuthDataSource, InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, right } from 'effect/Either';
import { inject } from 'inversify';
import { PaginationOptions, User, UserFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UserRepository } from '@app/domain/repositories';
import { UserMapper } from '../dtos/user.dto';

export class UserRepositoryImpl implements UserRepository {
  public constructor(
    @inject(SYMBOLS.AuthDataSource)
    private authDataSource: AuthDataSource,
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  private async getAccessToken(): Promise<string> {
    const session = await this.authDataSource.auth();

    return session?.accessToken ?? '';
  }

  public async getUsers(
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    authenticate = true,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    const response = await this.infinityApiDataSource.get('/users', {
      headers: {
        ...(authenticate ? { Authorization: `Bearer ${await this.getAccessToken()}` } : {}),
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

    const usersResponse = response.data.data.users.map(UserMapper.fromApiToDomain);

    const paginationOptionsResponse = new PaginationOptions(
      response.data.data.meta.per_page,
      response.data.data.meta.next_cursor,
      response.data.data.meta.prev_cursor,
    );

    return right([usersResponse, paginationOptionsResponse]);
  }
}
