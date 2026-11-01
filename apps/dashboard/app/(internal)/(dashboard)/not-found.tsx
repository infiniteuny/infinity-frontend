'use client';

import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DashboardNotFound() {
  const router = useRouter();

  return (
    <Box
      id="content"
      component="main"
      className="flex h-full min-h-[calc(100vh-8.625rem)] w-full flex-col items-center justify-center gap-4 p-8"
    >
      <Typography variant="h4" className="font-medium">
        404
      </Typography>
      <Typography variant="body1" color="textSecondary">
        The page you are looking for does not exist.
      </Typography>
      <Box>
        <Button variant="outlined" onClick={() => router.back()} className="mr-2">
          Back
        </Button>
        <Button variant="filled" component={Link} href="/">
          Go to Home
        </Button>
      </Box>
    </Box>
  );
}
