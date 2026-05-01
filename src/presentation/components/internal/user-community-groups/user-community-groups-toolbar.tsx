'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

type Props = {
  userId: string;
};

export function UserCommunityGroupsToolbar({ userId }: Props) {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add user community group"
        LinkComponent={Link}
        href={`/users/${userId}/community-groups/new`}
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
