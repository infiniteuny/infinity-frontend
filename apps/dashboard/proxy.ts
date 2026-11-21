import { GetSession, Logout } from '@infiniteuny/infinity-application';
import { match } from 'effect/Either';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sanitizeCallbackUrl } from '@infiniteuny/infinity-utils';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@infiniteuny/infinity-domain';

export default async function proxy(req: NextRequest): Promise<Response | undefined> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const sessionResult = await getSession.execute(req);
  const session = match(sessionResult, {
    onLeft: () => null,
    onRight: (data) => data,
  });

  if (!session && req.nextUrl.pathname !== '/login') {
    // Workaround for the fact that account cookie not always invalidated
    // at the same time as session cookie.
    const logout = serverContainer.get<Logout>(SYMBOLS.Logout);
    await logout.execute(req);

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const safePath = sanitizeCallbackUrl(req.nextUrl.pathname + req.nextUrl.search, origin);
    const callbackUrl = encodeURIComponent(safePath);
    const response = NextResponse.redirect(new URL(`/login?callback_url=${callbackUrl}`, origin));

    for (const cookie of req.cookies.getAll()) {
      if (cookie.name.startsWith('auth.') || cookie.name.startsWith('__Secure-auth.')) {
        response.cookies.delete(cookie.name);
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!auth(?:/|$)|login(?:/|$)|_next/static|_next/image|assets(?:/|$)|favicon\\.ico|_health(?:/|$)).*)',
  ],
};
