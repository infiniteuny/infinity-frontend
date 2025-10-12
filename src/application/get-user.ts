'use server';

import type { UserRepository } from '@app/domain/repositories';
import type { Either as EitherType } from 'effect/Either';
import { Either } from 'effect/index';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';

export async function getUser(
  id: string,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
): Promise<EitherType<UserDto, Error>> {
  const userRepository = serverContainer.get<UserRepository>(SYMBOLS.UserRepository);

  const result = await userRepository.getUser(id, abortSignal, authenticate);

  return Either.mapBoth(result, {
    onRight: (user) => UserMapper.fromDomaintoDto(user) as UserDto,
    onLeft: (error) => error,
  });
}
