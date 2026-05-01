'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

type Props = {
  coreTeamId: string;
};

export function CoreTeamMembersToolbar({ coreTeamId }: Props) {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add core team member"
        LinkComponent={Link}
        href={`/core-teams/${coreTeamId}/members/new`}
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
