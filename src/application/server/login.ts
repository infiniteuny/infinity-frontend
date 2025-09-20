'use server';

import { AuthRepository } from '@app/domain/repositories';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export async function login(callbackUrl?: string): Promise<void> {
  const authRepoAuthRepository = serverContainer.get<AuthRepository>(SYMBOLS.AuthRepository);

  const redirectUrl = callbackUrl
    ? new URL(callbackUrl).pathname + new URL(callbackUrl).searchParams.toString()
    : undefined;

  await authRepoAuthRepository.signIn(redirectUrl);
}
