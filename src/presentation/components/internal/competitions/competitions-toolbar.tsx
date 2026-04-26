'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CompetitionsToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add competition"
        LinkComponent={Link}
        href="/competitions/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
