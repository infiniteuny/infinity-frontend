'use server';

import { Session } from '@app/domain/entities';
import { AuthRepository } from '@app/domain/repositories';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export async function getSession(): Promise<Session | null> {
  const authRepository = serverContainer.get<AuthRepository>(SYMBOLS.AuthRepository);

  return await authRepository.getSession();
}
