import { GetSession, Logout } from '@app/application';
import { match } from 'effect/Either';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export default async function proxy(req: NextRequest): Promise<Response | undefined> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const sessionResult = await getSession.execute(req);
  const session = match(sessionResult, {
    onLeft: () => null,
    onRight: (data) => data,
  });
  const isSessionExpired = session ? session.expiresAt < new Date() : true;

  if ((!session || isSessionExpired) && req.nextUrl.pathname !== '/login') {
    // Workaround for the fact that account cookie not always invalidated
    // at the same time as session cookie.
    const logout = serverContainer.get<Logout>(SYMBOLS.Logout);
    await logout.execute(req);

    const callbackUrl = encodeURIComponent(req.nextUrl.toString());

    return NextResponse.redirect(new URL(`/login?callback_url=${callbackUrl}`, req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!auth|login|logout|_next/static|_next/image|favicon.ico).*)'],
};
