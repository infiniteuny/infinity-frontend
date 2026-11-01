import 'reflect-metadata';
import { Container } from 'inversify';
import {
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@infiniteuny/infinity-infrastructure/datasources/server';
import { SYMBOLS } from '@config';

export const serverContainer = new Container();

serverContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);
