'use client';

import '@app/presentation/styles/globals.css';
import { Box, Button, InitColorSchemeScript, Typography } from '@mui/material';
import { APP, FONTS } from '@config';
import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function InternalGlobalError({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable} bg-(--m3-palette-surfaceContainer-main)`}
      suppressHydrationWarning
    >
      <body id="__next">
        <InitColorSchemeScript attribute="class" />
        <Box className="flex h-screen w-full flex-col items-center justify-center gap-4 p-8">
          <Typography variant="h4" className="font-medium">
            Something went wrong
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {error.message ?? 'An unexpected error occurred'}
          </Typography>
          <Button variant="filled" onClick={unstable_retry}>
            Try again
          </Button>
        </Box>
      </body>
    </html>
  );
}
