'use server';

import type { UserRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { User } from '@app/domain/entities';

export async function getUser(
  id: string,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
): Promise<Either<User, Error>> {
  const userRepository = serverContainer.get<UserRepository>(SYMBOLS.UserRepository);

  return await userRepository.getUser(id, abortSignal, authenticate);
}
