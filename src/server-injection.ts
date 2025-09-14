import 'reflect-metadata';
import { AuthControllerImpl } from '@app/presentation/controllers';
import { Container } from 'inversify';
import { infinityApiDataSourceImpl } from '@app/infrastructure/datasources/server';
import { SYMBOLS } from '@config';
import { UserRepositoryImpl } from '@app/infrastructure/repositories';

export const serverContainer = new Container();

// Controllers
serverContainer.bind(SYMBOLS.AuthController).to(AuthControllerImpl);

// Repositories
serverContainer.bind(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Data sources
serverContainer.bind(SYMBOLS.InfinityApiDataSource).toConstantValue(infinityApiDataSourceImpl);
