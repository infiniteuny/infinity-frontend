import type { AuthDataSource } from '@app/infrastructure/datasources/server';
import { inject, injectable } from 'inversify';
import { NextRequest } from 'next/server';
import { SYMBOLS } from '@config';

export interface AuthController {
  get(request: NextRequest): Promise<Response>;
  post(request: NextRequest): Promise<Response>;
}

@injectable()
export class AuthControllerImpl implements AuthController {
  private readonly authDataSource: AuthDataSource;

  public constructor(
    @inject(SYMBOLS.AuthDataSource)
    authDataSource: AuthDataSource,
  ) {
    this.authDataSource = authDataSource;
  }

  public async get(request: NextRequest): Promise<Response> {
    return await this.authDataSource.handlers.GET(request);
  }

  public async post(request: NextRequest): Promise<Response> {
    return await this.authDataSource.handlers.POST(request);
  }
}
