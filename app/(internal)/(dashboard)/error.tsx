'use client';

import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function DashboardError({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box className="flex h-full min-h-[calc(100vh-8.625rem)] w-full flex-col items-center justify-center gap-4 p-8">
      <Typography variant="h5" className="font-medium">
        Something went wrong
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {error.message ?? 'An unexpected error occurred'}
      </Typography>
      <Button variant="filled" onClick={unstable_retry}>
        Try again
      </Button>
    </Box>
  );
}
