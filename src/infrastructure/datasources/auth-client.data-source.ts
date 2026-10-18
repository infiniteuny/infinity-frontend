import type { authServerDataSourceImpl } from './server';
import { createAuthClient } from 'better-auth/react';
import { customSessionClient, inferAdditionalFields } from 'better-auth/client/plugins';

export type AuthClientDataSource = typeof authClientDataSourceImpl;

export const authClientDataSourceImpl = createAuthClient({
  basePath: '/auth',
  plugins: [
    inferAdditionalFields<ReturnType<typeof authServerDataSourceImpl>>(),
    customSessionClient<ReturnType<typeof authServerDataSourceImpl>>(),
  ],
});
