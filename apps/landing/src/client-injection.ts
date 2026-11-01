import 'reflect-metadata';
import { Container } from 'inversify';
import {
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@infiniteuny/infinity-infrastructure/datasources/client';
import { SYMBOLS } from '@config';

export const clientContainer = new Container();

clientContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);
