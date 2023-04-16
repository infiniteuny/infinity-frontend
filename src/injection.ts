import { Container } from 'inversify';
import { GetSidebarExtendedState, SetSidebarExtendedState } from '@/application/internal';
import { InternalRepository } from '@/domain/repositories';
import { InternalRepositoryImpl } from '@/infrastructure/repositories';
import {
  SessionStorageDataSource,
  SessionStorageDataSourceImpl,
} from '@/infrastructure/datasources';
import { Symbols } from '@/config';

export const container = new Container();

// Use cases
container
  .bind<GetSidebarExtendedState>(Symbols.GetSidebarExtendedState)
  .to(GetSidebarExtendedState);
container
  .bind<SetSidebarExtendedState>(Symbols.SetSidebarExtendedState)
  .to(SetSidebarExtendedState);

// Repositories
container.bind<InternalRepository>(Symbols.InternalRepository).to(InternalRepositoryImpl);

// Data sources
container
  .bind<SessionStorageDataSource>(Symbols.SessionStorageDataSource)
  .to(SessionStorageDataSourceImpl);
