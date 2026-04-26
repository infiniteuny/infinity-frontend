'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

type Props = {
  competitionId: string;
};

export function CompetitionInstancesToolbar({ competitionId }: Props) {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add competition instance"
        LinkComponent={Link}
        href={`/competitions/${competitionId}/instances/new`}
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
