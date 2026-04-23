'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CompetitionScalesToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add competition scale"
        LinkComponent={Link}
        href="/competition-scales/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
