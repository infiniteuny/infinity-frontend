import 'reflect-metadata';
import type { AuthDataSource } from '@app/infrastructure/datasources/auth.data-source';
import { AuthController, AuthControllerImpl } from '@app/presentation/controllers';
import {
  AuthRepository,
  FacultyRepository,
  MajorRepository,
  UserRepository,
} from '@app/domain/repositories';
import {
  AuthRepositoryImpl,
  FacultyRepositoryImpl,
  MajorRepositoryImpl,
  UserRepositoryImpl,
} from '@app/infrastructure/repositories';
import { Container } from 'inversify';
import {
  createAuthDataSourceImpl,
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@app/infrastructure/datasources/server';
import { GetFaculties, GetMajors, GetSession, GetUser, GetUsers, Login } from '@app/application';
import { SYMBOLS } from '@config';

export const serverContainer = new Container();

// Use Cases
serverContainer.bind<Login>(SYMBOLS.Login).to(Login);
serverContainer.bind<GetSession>(SYMBOLS.GetSession).to(GetSession);
serverContainer.bind<GetFaculties>(SYMBOLS.GetFaculties).to(GetFaculties);
serverContainer.bind<GetMajors>(SYMBOLS.GetMajors).to(GetMajors);
serverContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);
serverContainer.bind<GetUser>(SYMBOLS.GetUser).to(GetUser);

// Controllers
serverContainer.bind<AuthController>(SYMBOLS.AuthController).to(AuthControllerImpl);

// Repositories
serverContainer.bind<AuthRepository>(SYMBOLS.AuthRepository).to(AuthRepositoryImpl);
serverContainer.bind<FacultyRepository>(SYMBOLS.FacultyRepository).to(FacultyRepositoryImpl);
serverContainer.bind<MajorRepository>(SYMBOLS.MajorRepository).to(MajorRepositoryImpl);
serverContainer.bind<UserRepository>(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Data sources
serverContainer.bind<AuthDataSource>(SYMBOLS.AuthDataSource).toDynamicValue(() => {
  const getUsers = serverContainer.get<GetUsers>(SYMBOLS.GetUsers);
  return createAuthDataSourceImpl(getUsers);
});

serverContainer
  .bind<() => Promise<string>>(SYMBOLS.AccessTokenDataSource)
  .toDynamicValue(() => async () => {
    const authDataSource = serverContainer.get<AuthDataSource>(SYMBOLS.AuthDataSource);
    const session = await authDataSource.auth();
    return session?.accessToken || '';
  });
serverContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);
