import { Container } from 'inversify';
import { InternalRepository } from '@app/domain/repositories';
import { InternalRepositoryImpl } from '@app/infrastructure/repositories';
import {
  SessionStorageDataSource,
  SessionStorageDataSourceImpl,
} from '@app/infrastructure/datasources/client';
import { SYMBOLS } from '@config';

export const clientContainer = new Container();

// Repositories
clientContainer.bind<InternalRepository>(SYMBOLS.InternalRepository).to(InternalRepositoryImpl);

// Data sources
clientContainer
  .bind<SessionStorageDataSource>(SYMBOLS.SessionStorageDataSource)
  .to(SessionStorageDataSourceImpl);
