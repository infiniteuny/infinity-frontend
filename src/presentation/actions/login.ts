'use server';

import { Login } from '@app/application';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export async function login(callbackUrl?: string): Promise<void> {
  const login = serverContainer.get<Login>(SYMBOLS.Login);

  await login.execute(callbackUrl);
}
