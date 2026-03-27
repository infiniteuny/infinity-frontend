'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function CommunityGroupAdminsToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add community group administrator"
        LinkComponent={Link}
        href="/community-group-admins/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
