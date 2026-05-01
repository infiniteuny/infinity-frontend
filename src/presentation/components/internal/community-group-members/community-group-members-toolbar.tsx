'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

type Props = {
  communityGroupId: string;
};

export function CommunityGroupMembersToolbar({ communityGroupId }: Props) {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add community group member"
        LinkComponent={Link}
        href={`/community-groups/${communityGroupId}/members/new`}
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
