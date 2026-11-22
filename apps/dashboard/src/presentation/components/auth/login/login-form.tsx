'use client';

import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { GetSession, Login } from '@infiniteuny/infinity-application';
import { InfiniteTextLogo } from '@infiniteuny/infinity-ui';
import { isRight, match } from 'effect/Either';
import { LoginRounded } from '@mui/icons-material';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { toast } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

let inFlightSilentSso: Promise<boolean> | null = null;

type Props = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl }: Props) {
  const login = useMemo(() => clientContainer.get<Login>(SYMBOLS.Login), []);
  const getSession = useMemo(() => clientContainer.get<GetSession>(SYMBOLS.GetSession), []);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const runSilentSso = async (): Promise<boolean> => {
      try {
        const loginResult = await login.execute(undefined, true);
        if (!isRight(loginResult)) {
          return false;
        }

        const sessionResult = await getSession.execute();
        return isRight(sessionResult);
      } catch {
        return false;
      }
    };

    if (!inFlightSilentSso) {
      inFlightSilentSso = runSilentSso().finally(() => {
        inFlightSilentSso = null;
      });
    }

    void inFlightSilentSso.then((isAuthenticated) => {
      if (cancelled) return;

      if (isAuthenticated) {
        router.replace(callbackUrl || '/');
        router.refresh();
      } else {
        setIsSubmitting(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [callbackUrl, getSession, login, router]);

  const handleLogin = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await login.execute(callbackUrl);
      match(result, {
        onLeft: (error) => {
          toast.error(error.message || 'Failed to sign in. Please try again.');
          setIsSubmitting(false);
        },
        onRight: () => {},
      });
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : 'Failed to sign in. Please try again.',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={[
        (theme) => ({
          background: theme.vars?.palette.surface.main,
          ...theme.applyStyles('dark', {
            background: theme.vars?.palette.surface.main,
          }),
        }),
      ]}
      className="mx-auto w-full max-w-md rounded-2xl p-0 sm:p-10"
    >
      <InfiniteTextLogo
        width={150}
        height={46}
        className="fill-infinite-light-green dark:fill-infinite-dark-green mx-auto mb-6 block"
      />
      <Typography component="h1" variant="h5" className="text-center font-medium">
        Login
      </Typography>
      <Typography component="p" color="text.secondary" className="my-2 text-center text-sm">
        to continue to the app
      </Typography>

      <Box component="form" noValidate className="mt-4">
        <Button
          variant="filled"
          fullWidth
          disabled={isSubmitting}
          className="mt-4"
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <LoginRounded fontSize="small" />
            )
          }
          onClick={handleLogin}
        >
          {isSubmitting ? 'Signing in...' : 'Login with INFINITE SSO'}
        </Button>
      </Box>
    </Paper>
  );
}
