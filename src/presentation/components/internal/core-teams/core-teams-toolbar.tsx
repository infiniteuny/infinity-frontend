'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CoreTeamsToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add core team"
        LinkComponent={Link}
        href="/core-teams/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
