import { Container } from 'inversify';
import { GetSidebarExtendedState, GetUsers, SetSidebarExtendedState } from '@app/application';
import {
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@app/infrastructure/datasources/server';
import { InternalRepository } from '@app/domain/repositories';
import { InternalRepositoryImpl, UserRepositoryImpl } from '@app/infrastructure/repositories';
import {
  SessionStorageDataSource,
  SessionStorageDataSourceImpl,
} from '@app/infrastructure/datasources/client';
import { SYMBOLS } from '@config';
import { getSession } from 'next-auth/react';

export const clientContainer = new Container();

// Use cases
clientContainer
  .bind<GetSidebarExtendedState>(SYMBOLS.GetSidebarExtendedState)
  .to(GetSidebarExtendedState);
clientContainer
  .bind<SetSidebarExtendedState>(SYMBOLS.SetSidebarExtendedState)
  .to(SetSidebarExtendedState);
clientContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);

// Repositories
clientContainer.bind<InternalRepository>(SYMBOLS.InternalRepository).to(InternalRepositoryImpl);
clientContainer.bind(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Data sources
clientContainer
  .bind<SessionStorageDataSource>(SYMBOLS.SessionStorageDataSource)
  .to(SessionStorageDataSourceImpl);
clientContainer.bind<() => Promise<string>>(SYMBOLS.AccessTokenDataSource).toDynamicValue(() => {
  return async () => (await getSession())?.accessToken || '';
});
clientContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);
