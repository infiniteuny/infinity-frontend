'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CompetitionOutputsToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add competition output"
        LinkComponent={Link}
        href="/competition-outputs/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
