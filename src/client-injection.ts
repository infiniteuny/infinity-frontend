import { Container } from 'inversify';
import { GetSidebarExtendedState, SetSidebarExtendedState } from '@app/application/internal';
import { InternalRepository } from '@app/domain/repositories';
import { InternalRepositoryImpl } from '@app/infrastructure/repositories';
import {
  SessionStorageDataSource,
  SessionStorageDataSourceImpl,
} from '@app/infrastructure/datasources';
import { SYMBOLS } from '@config';

export const clientContainer = new Container();

// Use cases
clientContainer
  .bind<GetSidebarExtendedState>(SYMBOLS.GetSidebarExtendedState)
  .to(GetSidebarExtendedState);
clientContainer
  .bind<SetSidebarExtendedState>(SYMBOLS.SetSidebarExtendedState)
  .to(SetSidebarExtendedState);

// Repositories
clientContainer.bind<InternalRepository>(SYMBOLS.InternalRepository).to(InternalRepositoryImpl);

// Data sources
clientContainer
  .bind<SessionStorageDataSource>(SYMBOLS.SessionStorageDataSource)
  .to(SessionStorageDataSourceImpl);
