import '@infiniteuny/infinity-ui/styles/globals.css';
import { APP, FONTS, SYMBOLS } from '@config';
import { Footer, Header } from '@app/presentation/components/shared';
import { GetSession } from '@infiniteuny/infinity-application';
import { InitColorSchemeScript } from '@mui/material';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { MuiSetup, SkipToContentButton } from '@infiniteuny/infinity-ui';
import { ReactNode } from 'react';
import { serverContainer } from '@app/server-injection';
import { SessionDto, SessionMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `${APP.site.title} - ${APP.site.tagline}`,
    template: `%s - ${APP.site.title}`,
  },
  description: APP.site.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: Props) {
  let session: SessionDto | undefined;

  try {
    const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
    const sessionResult = await getSession.execute();
    session = match(sessionResult, {
      onLeft: () => undefined,
      onRight: (data) => SessionMapper.fromDomainToDto(data) as SessionDto,
    });
  } catch {
    session = undefined;
  }

  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body id="__next" className="bg-(--m3-palette-surfaceContainer-main)">
        <InitColorSchemeScript attribute="class" />
        <MuiSetup>
          <SkipToContentButton />
          <Header session={session} />
          {children}
          <Footer />
        </MuiSetup>
      </body>
    </html>
  );
}
