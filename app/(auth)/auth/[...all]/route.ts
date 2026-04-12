import { AuthController } from '@app/presentation/controllers';
import { NextRequest } from 'next/server';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export async function GET(request: NextRequest): Promise<Response> {
  const authController = serverContainer.get<AuthController>(SYMBOLS.AuthController);

  return await authController.get(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  const authController = serverContainer.get<AuthController>(SYMBOLS.AuthController);

  return await authController.post(request);
}
