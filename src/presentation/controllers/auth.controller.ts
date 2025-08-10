import { AUTH } from '@config/auth';
import { injectable } from 'inversify';
import { NextRequest } from 'next/server';

export interface AuthController {
  get(request: NextRequest): Promise<Response>;
  post(request: NextRequest): Promise<Response>;
}

@injectable()
export class AuthControllerImpl implements AuthController {
  public async get(request: NextRequest): Promise<Response> {
    return await AUTH.handlers.GET(request);
  }

  public async post(request: NextRequest): Promise<Response> {
    return await AUTH.handlers.POST(request);
  }
}
