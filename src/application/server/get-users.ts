'use server';

import type { UserRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { PaginationOptions, User, UserFilterOptions } from '@app/domain/entities';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export async function getUsers(
  filterOptions?: UserFilterOptions,
  paginationOptions?: PaginationOptions,
  authenticate?: boolean,
): Promise<Either<[User[], PaginationOptions], Error>> {
  const userRepository = serverContainer.get<UserRepository>(SYMBOLS.UserRepository);

  return await userRepository.getUsers(filterOptions, paginationOptions, authenticate);
}
