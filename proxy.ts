import { AuthDataSource } from '@app/infrastructure/datasources/server';
import { NextResponse } from 'next/server';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

const authDataSource = serverContainer.get<AuthDataSource>(SYMBOLS.AuthDataSource);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default authDataSource.auth((req: any) => {
  if ((!req.auth && req.nextUrl.pathname !== '/login') || req.auth?.error) {
    const callbackUrl = encodeURIComponent(req.nextUrl.toString());

    return NextResponse.redirect(new URL(`/login?callback_url=${callbackUrl}`, req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/((?!auth|login|logout|_next/static|_next/image|favicon.ico).*)'],
};
