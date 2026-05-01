import '@app/presentation/styles/globals.css';
import { APP, FONTS } from '@config';
import { GetSession } from '@app/application';
import { InitColorSchemeScript } from '@mui/material';
import { InternalFooter, InternalHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { MuiSetup, SkipToContentButton } from '@app/presentation/components/shared';
import { ReactNode } from 'react';
import { serverContainer } from '@app/server-injection';
import { SessionDto, SessionMapper } from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `Dashboard - ${APP.site.title}`,
    template: `%s - ${APP.site.title}`,
  },
  description: APP.site.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function InternalLayout({ children }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });

  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable} bg-(--m3-palette-surfaceContainer-main)`}
      suppressHydrationWarning
    >
      <body id="__next">
        <InitColorSchemeScript attribute="class" />
        <MuiSetup>
          <SkipToContentButton />
          <InternalHeader session={SessionMapper.fromDomainToDto(session) as SessionDto} />
          {children}
          <InternalFooter />
        </MuiSetup>
      </body>
    </html>
  );
}
