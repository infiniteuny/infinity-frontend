'use server';

import { AUTH } from '@config/auth';

export async function login(callbackUrl?: string): Promise<void> {
  const redirectUrl = callbackUrl
    ? new URL(callbackUrl).pathname + new URL(callbackUrl).searchParams.toString()
    : undefined;

  await AUTH.signIn('authentik', {
    redirectTo: redirectUrl,
  });
}
