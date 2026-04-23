'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CompetitionTeamTypesToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add team type"
        LinkComponent={Link}
        href="/team-types/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
