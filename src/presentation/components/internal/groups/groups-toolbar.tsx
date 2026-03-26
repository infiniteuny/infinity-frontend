import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function GroupsToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add group"
        LinkComponent={Link}
        href="/groups/new"
        startIcon={<AddRounded />}
      >
        Add
      </Button>
    </Box>
  );
}
