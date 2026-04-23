'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CompetitionTimeRangesToolbar() {
  return (
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
  );
}
