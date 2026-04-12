import type { AuthServerDataSource } from '@app/infrastructure/datasources/server';
import { inject, injectable } from 'inversify';
import { NextRequest } from 'next/server';
import { SYMBOLS } from '@config';
import { toNextJsHandler } from 'better-auth/next-js';

export interface AuthController {
  get(request: NextRequest): Promise<Response>;
  post(request: NextRequest): Promise<Response>;
}

@injectable()
export class AuthControllerImpl implements AuthController {
  private readonly authDataSource: AuthServerDataSource;

  public constructor(
    @inject(SYMBOLS.AuthDataSource)
    authDataSource: AuthServerDataSource,
  ) {
    this.authDataSource = authDataSource;
  }

  private get handlers() {
    return toNextJsHandler(this.authDataSource);
  }

  public async get(request: NextRequest): Promise<Response> {
    return await this.handlers.GET(request);
  }

  public async post(request: NextRequest): Promise<Response> {
    return await this.handlers.POST(request);
  }
}
