'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CompetitionOrganizerTypesToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add competition organizer type"
        LinkComponent={Link}
        href="/competition-organizer-types/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
