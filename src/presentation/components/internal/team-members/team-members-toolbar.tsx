'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

type Props = {
  teamId: string;
};

export function TeamMembersToolbar({ teamId }: Props) {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add team member"
        LinkComponent={Link}
        href={`/teams/${teamId}/members/new`}
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
