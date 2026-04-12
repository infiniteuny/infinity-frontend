'use client';

import { Box, Button, Paper, Typography } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { Login } from '@app/application';
import { SYMBOLS } from '@config/symbols';

type Props = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl }: Props) {
  const login = clientContainer.get<Login>(SYMBOLS.Login);

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
      className="mx-auto max-w-sm rounded-xl p-0 sm:p-8"
    >
      <Typography component="h1" variant="h5" className="text-center font-medium">
        Login
      </Typography>
      <Typography component="p" className="my-2 text-center text-sm">
        to continue to the app
      </Typography>

      <Box component="form" noValidate className="mt-4">
        <Button
          variant="outlined"
          fullWidth
          className="mt-4"
          onClick={() => login.execute(callbackUrl)}
        >
          Login with INFINITE SSO
        </Button>
      </Box>
    </Paper>
  );
}
