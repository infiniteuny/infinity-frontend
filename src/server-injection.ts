import 'reflect-metadata';
import { AuthControllerImpl } from '@app/presentation/controllers';
import {
  authDataSourceImpl,
  infinityApiDataSourceImpl,
} from '@app/infrastructure/datasources/server';
import { AuthRepositoryImpl, UserRepositoryImpl } from '@app/infrastructure/repositories';
import { Container } from 'inversify';
import { SYMBOLS } from '@config';

export const serverContainer = new Container();

// Controllers
serverContainer.bind(SYMBOLS.AuthController).to(AuthControllerImpl);

// Repositories
serverContainer.bind(SYMBOLS.AuthRepository).to(AuthRepositoryImpl);
serverContainer.bind(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Data sources
serverContainer.bind(SYMBOLS.AuthDataSource).toConstantValue(authDataSourceImpl);
serverContainer.bind(SYMBOLS.InfinityApiDataSource).toConstantValue(infinityApiDataSourceImpl);
