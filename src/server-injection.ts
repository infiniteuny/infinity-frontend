import 'reflect-metadata';
import { AuthControllerImpl } from '@app/presentation/controllers';
import { Container } from 'inversify';
import { SYMBOLS } from '@config';

export const serverContainer = new Container();

// Controllers
serverContainer.bind(SYMBOLS.AuthController).to(AuthControllerImpl);
