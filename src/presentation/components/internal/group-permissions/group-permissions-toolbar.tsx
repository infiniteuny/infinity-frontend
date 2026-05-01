'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

type Props = {
  groupId: string;
};

export function GroupPermissionsToolbar({ groupId }: Props) {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add group permission"
        LinkComponent={Link}
        href={`/groups/${groupId}/permissions/new`}
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
