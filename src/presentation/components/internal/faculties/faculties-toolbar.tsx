'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function FacultiesToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add faculty"
        LinkComponent={Link}
        href="/faculties/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
