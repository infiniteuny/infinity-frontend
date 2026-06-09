'use client';

import '@app/presentation/styles/globals.css';
import { Box, Button, IconButton, InitColorSchemeScript, Paper, Typography } from '@mui/material';
import { CheckRounded, ContentCopyRounded } from '@mui/icons-material';
import { APP, FONTS } from '@config';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function AuthGlobalError({ error, unstable_retry }: Props) {
  const errorMessage = useMemo(() => error.message ?? 'An unexpected error occurred', [error]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleCopy = async () => {
    const errorText = errorMessage;
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error message: ', err);
    }
  };

  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable}`}
      suppressHydrationWarning
    >
      <body id="__next" className="bg-(--m3-palette-surfaceContainer-main)">
        <InitColorSchemeScript attribute="class" />
        <Box className="flex h-screen w-full flex-col items-center justify-center gap-6 p-8">
          <Typography variant="h4" className="font-medium">
            Something went wrong
          </Typography>

          <Paper variant="elevation" className="relative w-full max-w-2xl p-6 text-left">
            <IconButton
              onClick={handleCopy}
              size="small"
              className="absolute top-2 right-2"
              aria-label="Copy error message"
            >
              {copied ? (
                <CheckRounded fontSize="small" color="success" />
              ) : (
                <ContentCopyRounded fontSize="small" />
              )}
            </IconButton>

            <Typography
              variant="body2"
              color="textSecondary"
              className="pr-8 font-mono break-all whitespace-pre-wrap"
            >
              {errorMessage}
            </Typography>
          </Paper>

          <Button variant="filled" onClick={unstable_retry}>
            Try again
          </Button>
        </Box>
      </body>
    </html>
  );
}
