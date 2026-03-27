'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function ProjectGalleriesToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add project gallery"
        LinkComponent={Link}
        href="/project-galleries/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
