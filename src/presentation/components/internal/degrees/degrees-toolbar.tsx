'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function DegreesToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add degree"
        LinkComponent={Link}
        href="/degrees/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
