'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';

export function CompetitionTimeRangesToolbar() {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <>
      {['create-competition-time-range'].some((p) => userPermissions.has(p)) ? (
        <Box className="ml-auto">
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add competition time range"
            LinkComponent={Link}
            href="/competition-time-ranges/new"
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        </Box>
      ) : null}
    </>
  );
}
