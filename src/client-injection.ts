import { Container } from 'inversify';
import {
  FacultyRepository,
  InternalRepository,
  MajorRepository,
  UserRepository,
} from '@app/domain/repositories';
import {
  FacultyRepositoryImpl,
  InternalRepositoryImpl,
  MajorRepositoryImpl,
  UserRepositoryImpl,
} from '@app/infrastructure/repositories';
import {
  CreateUser,
  DeleteUser,
  GetFaculties,
  GetMajors,
  GetSidebarExtendedState,
  GetUsers,
  SetSidebarExtendedState,
  UpdateUser,
} from '@app/application';
import {
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@app/infrastructure/datasources/server';
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
clientContainer.bind<CreateUser>(SYMBOLS.CreateUser).to(CreateUser);
clientContainer.bind<DeleteUser>(SYMBOLS.DeleteUser).to(DeleteUser);
clientContainer.bind<GetFaculties>(SYMBOLS.GetFaculties).to(GetFaculties);
clientContainer.bind<GetMajors>(SYMBOLS.GetMajors).to(GetMajors);
clientContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);
clientContainer.bind<UpdateUser>(SYMBOLS.UpdateUser).to(UpdateUser);

// Repositories
clientContainer.bind<InternalRepository>(SYMBOLS.InternalRepository).to(InternalRepositoryImpl);
clientContainer.bind<FacultyRepository>(SYMBOLS.FacultyRepository).to(FacultyRepositoryImpl);
clientContainer.bind<MajorRepository>(SYMBOLS.MajorRepository).to(MajorRepositoryImpl);
clientContainer.bind<UserRepository>(SYMBOLS.UserRepository).to(UserRepositoryImpl);

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
