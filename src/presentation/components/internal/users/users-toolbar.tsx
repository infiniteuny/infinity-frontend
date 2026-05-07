'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';

export function UsersToolbar() {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add user"
        LinkComponent={Link}
        href="/users/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
