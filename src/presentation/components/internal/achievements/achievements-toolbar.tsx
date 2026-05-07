'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';

export function AchievementsToolbar() {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <>
      {['create-achievement', 'create-own-achievement'].some((p) => userPermissions.has(p)) ? (
        <Box className="ml-auto">
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add achievement"
            LinkComponent={Link}
            href="/achievements/new"
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        </Box>
      ) : null}
    </>
  );
}
