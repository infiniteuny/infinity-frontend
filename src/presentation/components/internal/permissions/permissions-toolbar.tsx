import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function PermissionsToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add permission"
        LinkComponent={Link}
        href="/permissions/new"
        startIcon={<AddRounded />}
      >
        Add permission
      </Button>
    </Box>
  );
}
